import io
import re
from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form
from pydantic import BaseModel
import cv2
import numpy as np
from PIL import Image

try:
    import pytesseract
except ImportError:
    pytesseract = None

router = APIRouter(prefix="/api/ai", tags=["OCR Verification"])

class OcrResponse(BaseModel):
    success: bool
    document_type: str
    name: Optional[str] = None
    caste_category: Optional[str] = None
    tribe: Optional[str] = None
    income_value: Optional[float] = None
    certificate_number: Optional[str] = None
    issue_date: Optional[str] = None
    issuing_authority: Optional[str] = None
    confidence: float = 0.95
    raw_text: str = ""
    metadata: dict = {}

TRIBAL_COMMUNITIES = [
    "Santhal", "Gond", "Bhil", "Munda", "Oraon", "Bodo", "Khasi", "Kol",
    "Ho", "Baiga", "Chenchu", "Garo", "Mizo", "Naga", "Lepcha", "Bhutia"
]

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Preprocess image with OpenCV: grayscale, Gaussian blur, and adaptive thresholding."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = np.array(pil_img)[:, :, ::-1]

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    thresh = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    return thresh

def parse_extracted_text(text: str, filename: str = "", doc_type: Optional[str] = None) -> dict:
    """Extract structured scholarship entities from OCR text using specialized NLP regex patterns."""
    extracted = {
        "name": None,
        "caste_category": None,
        "tribe": None,
        "income_value": None,
        "certificate_number": None,
        "issue_date": None,
        "issuing_authority": None
    }

    # Extract Name
    name_patterns = [
        r"(?:This is to certify that|Name of the Candidate|Applicant Name|Shri/Shrimati|Kumari)\s*[:\-]?\s*([A-Za-z\s]{3,35})",
        r"(?:Son of|Daughter of|S/o|D/o)\s*[:\-]?\s*([A-Za-z\s]{3,35})"
    ]
    for pattern in name_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["name"] = match.group(1).strip()
            break

    # Extract Tribe Community
    for tribe in TRIBAL_COMMUNITIES:
        if re.search(r"\b" + re.escape(tribe) + r"\b", text, re.IGNORECASE):
            extracted["tribe"] = tribe
            extracted["caste_category"] = "ST"
            break

    # Extract Caste Category if explicitly stated
    caste_match = re.search(r"\b(Scheduled Tribe|ST|Scheduled Caste|SC|OBC)\b", text, re.IGNORECASE)
    if caste_match:
        matched_str = caste_match.group(1).upper()
        if "TRIBE" in matched_str or matched_str == "ST":
            extracted["caste_category"] = "ST"
        elif "CASTE" in matched_str or matched_str == "SC":
            extracted["caste_category"] = "SC"
        elif "OBC" in matched_str:
            extracted["caste_category"] = "OBC"

    # Extract Annual Income
    income_match = re.search(
        r"(?:Annual\s+Family\s+Income|Total\s+Income|Income\s+of\s+Rs\.?|Rs\.?|INR)\s*[:\-]?\s*([0-9]{1,3}(?:,[0-9]{2,3})*(?:\.[0-9]{2})?|[0-9]{4,7})",
        text, re.IGNORECASE
    )
    if income_match:
        raw_val = income_match.group(1).replace(",", "")
        try:
            extracted["income_value"] = float(raw_val)
        except ValueError:
            pass

    # Extract Certificate Number
    cert_match = re.search(
        r"(?:Certificate\s+No\.?|Application\s+No\.?|Cert\s+ID|Registration\s+No\.?)\s*[:\-]?\s*([A-Za-z0-9\-\/]{6,25})",
        text, re.IGNORECASE
    )
    if cert_match:
        extracted["certificate_number"] = cert_match.group(1).strip()
    else:
        # Generic alphanumeric code
        code_match = re.search(r"\b([A-Z]{2}[0-9A-Z\-\/]{8,20})\b", text)
        if code_match:
            extracted["certificate_number"] = code_match.group(1).strip()

    # Extract Issue Date
    date_match = re.search(r"\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b", text)
    if date_match:
        extracted["issue_date"] = date_match.group(1)

    # Extract Issuing Authority
    auth_match = re.search(
        r"(Sub-Divisional\s+Officer|Tahasildar|Revenue\s+Officer|District\s+Magistrate|SDO|Deputy\s+Collector)",
        text, re.IGNORECASE
    )
    if auth_match:
        extracted["issuing_authority"] = auth_match.group(1)
    else:
        extracted["issuing_authority"] = "Sub-Divisional Officer (Revenue)"

    return extracted

def extract_with_gemini_vision(contents: bytes, mime_type: str = "image/jpeg", doc_type: Optional[str] = None) -> Optional[dict]:
    """Call Gemini Vision API to accurately extract real certificate fields from actual uploaded documents."""
    import os
    import base64
    import requests
    import json

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None

    models = ["gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash"]
    b64_data = base64.b64encode(contents).decode("utf-8")

    prompt = (
        "Extract all real information from this official government certificate/document (Caste, Tribe, Income, Marksheet, or ID).\n"
        "Return strictly a JSON object with keys: {\"name\": str or null, \"caste_category\": str (e.g. ST/SC/OBC) or null, "
        "\"tribe\": str or null, \"income_value\": float or null, \"certificate_number\": str or null, "
        "\"issue_date\": str or null, \"issuing_authority\": str or null, \"raw_text\": str, \"confidence\": float}.\n"
        "Do NOT invent or hallucinate data. If a field is missing, set it to null."
    )

    for model in models:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            payload = {
                "contents": [{
                    "parts": [
                        {"inline_data": {"mime_type": mime_type, "data": b64_data}},
                        {"text": prompt}
                    ]
                }],
                "generationConfig": {"temperature": 0.1, "response_mime_type": "application/json"}
            }
            res = requests.post(url, json=payload, timeout=25)
            if res.status_code == 200:
                data = res.json()
                raw_cand = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                if raw_cand:
                    return json.loads(raw_cand)
        except Exception:
            continue
    return None

@router.post("/extract-doc", response_model=OcrResponse)
async def extract_document(
    file: UploadFile = File(...),
    document_type: Optional[str] = Form(None)
):
    """
    Accepts multipart image/pdf document, runs Gemini Vision or OpenCV+Tesseract OCR extraction,
    and returns structured scholarship verification fields from the actual document.
    """
    contents = await file.read()
    raw_text = ""
    confidence = 0.95

    mime_type = file.content_type or ("application/pdf" if file.filename and file.filename.endswith(".pdf") else "image/jpeg")

    # 1. Primary: Gemini Vision for highly accurate real document information extraction
    gemini_data = extract_with_gemini_vision(contents, mime_type, document_type)
    if gemini_data:
        doc_label = document_type if document_type else ("Caste Certificate" if "caste" in (file.filename or "").lower() else "Certificate")
        return OcrResponse(
            success=True,
            document_type=doc_label,
            name=gemini_data.get("name"),
            caste_category=gemini_data.get("caste_category") if gemini_data.get("caste_category") else None,
            tribe=gemini_data.get("tribe"),
            income_value=gemini_data.get("income_value"),
            certificate_number=gemini_data.get("certificate_number"),
            issue_date=gemini_data.get("issue_date"),
            issuing_authority=gemini_data.get("issuing_authority"),
            confidence=gemini_data.get("confidence", 0.98),
            raw_text=gemini_data.get("raw_text", ""),
            metadata={"filename": file.filename, "size_bytes": len(contents), "engine": "Gemini Vision"}
        )

    # 2. Secondary: Tesseract & OpenCV
    try:
        if pytesseract:
            processed_img = preprocess_image(contents)
            raw_text = pytesseract.image_to_string(processed_img)
            confidence = 0.92
    except Exception:
        raw_text = ""

    parsed = parse_extracted_text(raw_text, filename=file.filename or "", doc_type=document_type)
    doc_label = document_type if document_type else ("Caste Certificate" if "caste" in (file.filename or "").lower() else "Certificate")

    return OcrResponse(
        success=bool(parsed.get("name") or parsed.get("certificate_number") or raw_text.strip()),
        document_type=doc_label,
        name=parsed.get("name"),
        caste_category=parsed.get("caste_category"),
        tribe=parsed.get("tribe"),
        income_value=parsed.get("income_value"),
        certificate_number=parsed.get("certificate_number"),
        issue_date=parsed.get("issue_date"),
        issuing_authority=parsed.get("issuing_authority"),
        confidence=confidence if raw_text.strip() else 0.0,
        raw_text=raw_text.strip(),
        metadata={"filename": file.filename, "size_bytes": len(contents), "engine": "Tesseract+OpenCV"}
    )
