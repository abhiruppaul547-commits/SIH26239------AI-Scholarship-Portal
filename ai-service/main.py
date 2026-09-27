from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ocr import router as ocr_router
from recommend import router as recommend_router
from chatbot import router as chatbot_router

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
