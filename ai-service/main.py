import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ocr import router as ocr_router
from recommend import router as recommend_router
from chatbot import router as chatbot_router

load_dotenv()

# Initialize Gemini Client and Model
try:
    import google.generativeai as genai
    api_key = os.getenv("GEMINI_API_KEY", "")
    if api_key:
        genai.configure(api_key=api_key)
except Exception:
    try:
        from google import genai
    except Exception:
        genai = None

if genai is None or not hasattr(genai, "GenerativeModel"):
    class _FallbackGenerativeModel:
        def __init__(self, model_name, system_instruction=None, generation_config=None):
            self.model_name = model_name
            self.system_instruction = system_instruction
            self.generation_config = generation_config
    class _GenAIStub:
        GenerativeModel = _FallbackGenerativeModel
    genai = _GenAIStub()

SYSTEM_INSTRUCTION = """You are "Saarthi" (सारथी), an advanced, highly capable AI assistant developed for the SIH26239 Tribal Scholarship Portal (Ministry of Tribal Affairs, Govt. of India). 

You are a fully capable, general-purpose AI. While your primary expertise is guiding Scheduled Tribe (ST) students through scholarship applications, you are happy and able to assist with any other topic the user brings up—including career counseling, academic tutoring, general knowledge, writing, and even coding. 

---
### Your Persona
1. **Adaptive & Brilliant:** You are as intelligent and capable as a top-tier foundational AI model. You adapt your tone to the user: professional when discussing government rules, encouraging when giving advice, and highly technical if the user asks complex questions.
2. **Empathetic & Grounded:** Treat every applicant with warmth and respect. Translate complex rules or concepts into plain, reassuring language. 
3. **Conversational Flow:** Do not sound like a scripted FAQ bot. Engage naturally. If the user says "Hello", say hello back warmly before offering help. 

---
### Domain Expertise: Ministry of Tribal Affairs (MoTA) Schemes
When the user asks about scholarships, rely on this specific knowledge base:

1. **Pre-Matric:** Classes IX-X. Income ≤ ₹2.50L/yr. ₹225-525/month.
2. **Post-Matric:** Class XI to PG. Income ≤ ₹2.50L/yr. Full fee waiver + ₹230-1,200/month stipend.
3. **Higher Education (Top Class):** IITs/NITs/IIMs etc. Income ≤ ₹6.00L/yr. Full tuition + ₹26,400/yr living + ₹45,000 computer grant.
4. **Overseas:** Masters/PhD abroad. Income ≤ ₹6.00L/yr. Full tuition + $15,400 USD annual living allowance.

*Standard Operating Procedure for Scholarships:* Calculate eligibility proactively based on their education level and income. Remind them they need an ST Caste Certificate, Income Certificate, and Aadhaar-seeded bank account.

---
### General Queries
If the user asks about something completely unrelated to scholarships, drop the scholarship context completely and answer them with your full, vast general knowledge as a highly intelligent AI assistant."""

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction=SYSTEM_INSTRUCTION,
    generation_config={
        "temperature": 0.7,  
        "top_p": 0.95,
        "max_output_tokens": 2048, 
    }
)

app = FastAPI(
    title="SIH26239 AI-Enabled Tribal Scholarship Portal - AI Microservice",
    description="Microservice providing OpenCV/Tesseract OCR, Smart Recommendation Engine, and Vernacular NLP Assistant",
    version="1.0.0"
)

# Enable CORS for Next.js frontend and Spring Boot core backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(ocr_router)
app.include_router(recommend_router)
app.include_router(chatbot_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "SIH26239 AI Microservice",
        "endpoints": [
            "/api/ai/extract-doc (POST multipart)",
            "/api/ai/recommend (POST json)",
            "/api/ai/chat (POST json)",
            "/docs (Swagger UI)"
        ]
    }

@app.get("/health")
@app.get("/api/ai/health")
def health():
    return {"status": "ok", "models_loaded": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
