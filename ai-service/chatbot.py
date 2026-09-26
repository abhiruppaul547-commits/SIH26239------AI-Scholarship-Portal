import re
from typing import List, Optional
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/ai", tags=["Vernacular Chatbot Assistant"])

class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en" # 'en', 'hi', 'santhali'
    context: Optional[str] = None

class ChatResponse(BaseModel):
    success: bool
    reply: str
    language: str
    intent: str
    suggestions: List[str]

# Intent dictionary with multi-lingual patterns (English, Hindi transliteration/Devanagari, Santhali/Tribal)
INTENTS = [
    {
        "intent": "GREETING",
        "patterns": [
            r"\b(hello|hi|hey|johar|namaste|pranam|namaskar|hul)\b",
            r"(नमस्ते|प्रणाम|जोहार|जय जोहार)"
        ],
        "replies": {
            "en": "Johar! Welcome to the AI Scholarship Portal for Tribal Students (SIH26239). How may I assist you with your scholarship application today?",
            "hi": "जोहार! जनजातीय छात्र छात्रवृत्ति पोर्टल (SIH26239) में आपका स्वागत है। मैं आपकी छात्रवृत्ति आवेदन में कैसे मदद कर सकता हूँ?",
            "santhali": "Johar! Aam do noa Tribal Scholarship Portal re sagun daram. Scholarship baabotte chet badae sanamedma?"
        },
        "suggestions": [
            "What documents do I need?",
            "What is the income limit for ST scholarship?",
            "How does Auto-Fill OCR work?",
            "How do I check my application status?"
        ]
    },
    {
        "intent": "DOCUMENTS_REQUIRED",
        "patterns": [
            r"(document|documents|certificate|certificates|proof|kagaz|dastavez)",
            r"(दस्तावेज|कागजात|प्रमाण पत्र|सर्टिफिकेट)"
        ],
        "replies": {
            "en": "To apply for Tribal (ST) Scholarships, you need:\n1. Valid ST Caste Certificate\n2. Family Income Certificate (issued by Tehsildar / SDO)\n3. Previous academic marksheet\n4. Aadhaar Card\n5. Bank Passbook copy (linked with Aadhaar)\nTip: You can use our 'Auto-Fill from Document' button to scan and fill your form automatically!",
            "hi": "एसटी छात्रवृत्ति के लिए आवश्यक दस्तावेज:\n1. वैध जाति प्रमाण पत्र (ST Caste Certificate)\n2. आय प्रमाण पत्र (तहसीलदार / SDO द्वारा जारी)\n3. पिछली कक्षा की मार्कशीट\n4. आधार कार्ड\n5. बैंक पासबुक (आधार से लिंक)\nसुझाव: आप 'Auto-Fill from Document' बटन का उपयोग करके सीधे स्कैन कर सकते हैं!",
            "santhali": "Dastavez khoroch ko:\n1. ST Caste Certificate\n2. Income Certificate\n3. Marksheet\n4. Aadhaar Card\n5. Bank Passbook"
        },
        "suggestions": [
            "How does Auto-Fill OCR work?",
            "What is the maximum income limit?",
            "Check eligible schemes"
        ]
    },
    {
        "intent": "INCOME_LIMIT",
        "patterns": [
            r"(income\s*limit|income\s*criteria|max\s*income|ceiling|kamai|aay\s*sima)",
            r"(आय सीमा|पारिवारिक आय|कितनी आय)"
        ],
        "replies": {
            "en": "Income limits for major Tribal Scholarship schemes:\n• Post-Matric ST Scholarship: Up to ₹2,50,000 per annum\n• National Fellowship & Higher Education: Up to ₹6,000,000 per annum\n• Top Class Education (IITs/NITs/IIMs): Up to ₹6,000,000 per annum\n• Pre-Matric ST: Up to ₹2,00,000 per annum.",
            "hi": "जनजातीय छात्रवृत्ति की आय सीमाएं:\n• पोस्ट-मैट्रिक छात्रवृत्ति: ₹2,50,000 प्रति वर्ष तक\n• उच्च शिक्षा फेलोशिप: ₹6,00,000 प्रति वर्ष तक\n• टॉप क्लास (IIT/NIT): ₹6,00,000 प्रति वर्ष तक\n• प्री-मैट्रिक छात्रवृत्ति: ₹2,00,000 प्रति वर्ष तक।",
            "santhali": "Income seema do Post-Matric re ₹2,50,000 dharib ar Higher Education re ₹6,00,000 dharib menaka."
        },
        "suggestions": [
            "Recommend schemes for me",
            "What documents are needed?"
        ]
    },
    {
        "intent": "OCR_AUTOFIL",
        "patterns": [
            r"(ocr|auto[\-\s]?fill|scan|extract|upload\s*document|image)",
            r"(ऑटो फिल|स्कैन|अपलोड|दस्तावेज स्कैन)"
        ],
        "replies": {
            "en": "Our AI system uses OpenCV and Tesseract OCR to read your Caste and Income certificates directly. Simply click 'Auto-Fill from Document' on the Apply page, choose your certificate image/PDF, and your Name, Tribe, Category, Certificate Number, and Income will be filled instantly!",
            "hi": "हमारा AI सिस्टम आपके जाति और आय प्रमाण पत्र को सीधे स्कैन करता है। 'Apply' पेज पर 'Auto-Fill from Document' पर क्लिक करें, फोटो चुनें और आपका नाम, जनजाति, प्रमाण पत्र संख्या और आय स्वतः भर जाएगी!",
            "santhali": "Noa portal re photo upload lekhan gie AI apeyaq Caste ar Income certificate khon sab jotaye ol goda!"
        },
        "suggestions": [
            "Go to Apply Page",
            "What documents are supported?"
        ]
    },
    {
        "intent": "STATUS_TRACKING",
        "patterns": [
            r"(status|track|check\s*application|kahan\s*tak|progress)",
            r"(स्थिति|आवेदन की स्थिति|ट्रैक|स्टेटस)"
        ],
        "replies": {
            "en": "You can track your application status anytime under your 'Student Dashboard'. The portal features real-time stages: Submitted → Automated OCR Verification → Under Review → Approved for Disbursement.",
            "hi": "आप अपने 'Student Dashboard' पर जाकर आवेदन की स्थिति देख सकते हैं: सबमिट → AI सत्यापन → समीक्षाधीन → स्वीकृत।",
            "santhali": "Ape Dashboard re chaalao kate application status guriya baate baḍae daṛeyaa."
        },
        "suggestions": [
            "View Dashboard",
            "Contact Admin"
        ]
    },
    {
        "intent": "DEADLINE",
        "patterns": [
            r"(deadline|last\s*date|antim\s*tithi|when\s*to\s*apply|closing)",
            r"(अंतिम तारीख|अंतिम तिथि|कब तक)"
        ],
        "replies": {
            "en": "Current academic year applications are active! Deadlines generally fall between 30 to 90 days from notification. Check individual scheme cards on the Scholarships page for exact countdown dates.",
            "hi": "वर्तमान सत्र के आवेदन खुले हैं! सामान्यतः अंतिम तिथि 30 से 90 दिनों की होती है। प्रत्येक योजना कार्ड पर अंतिम तिथि देखें।",
            "santhali": "Scholarship card re deadline ol menaka, aam 30 khon 90 din bhitor re apply me."
        },
        "suggestions": [
            "View all scholarships",
            "What documents do I need?"
        ]
    }
]

def detect_language(text: str, fallback_lang: str = "en") -> str:
    """Detect if input text contains Devanagari characters or Hindi/Santhali keywords."""
    if re.search(r"[\u0900-\u097F]", text):
        return "hi"
    lower = text.lower()
    if any(w in lower for w in ["kaise", "kya", "dastavez", "kitna", "chahiye", "paisa", "aay"]):
        return "hi"
    if any(w in lower for w in ["johar", "chet", "menaka", "santhal", "badae"]):
        return "santhali"
    return fallback_lang if fallback_lang in ["hi", "santhali"] else "en"

@router.post("/chat", response_model=ChatResponse)
async def chat_vernacular(req: ChatRequest):
    """
    Intelligent vernacular assistant responding to student queries about
    scholarships, document criteria, OCR auto-fill, and application status.
    """
    lang = detect_language(req.message, req.language or "en")
    user_msg = req.message.lower().strip()

    for item in INTENTS:
        for pattern in item["patterns"]:
            if re.search(pattern, user_msg, re.IGNORECASE):
                reply_text = item["replies"].get(lang, item["replies"]["en"])
                return ChatResponse(
                    success=True,
                    reply=reply_text,
                    language=lang,
                    intent=item["intent"],
                    suggestions=item["suggestions"]
                )

    # General Fallback
    fallback_replies = {
        "en": "Johar! I can guide you on Tribal Scholarship schemes, required documents (Caste/Income certificates), income limits, and how our OCR Auto-Fill works. Feel free to ask!",
        "hi": "जोहार! मैं आपको जनजातीय छात्रवृत्ति योजनाओं, आवश्यक प्रमाण पत्रों, आय सीमा, और AI दस्तावेज़ सत्यापन के बारे में जानकारी दे सकता हूँ।",
        "santhali": "Johar! In do tribal scholarship, certificate verification ar online apply baabotte goro aama."
    }
    return ChatResponse(
        success=True,
        reply=fallback_replies.get(lang, fallback_replies["en"]),
        language=lang,
        intent="GENERAL_HELP",
        suggestions=[
            "What documents do I need?",
            "What is the income limit for ST scholarship?",
            "How does Auto-Fill OCR work?"
        ]
    )
