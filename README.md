# SIH26239 — AI-Enabled Scholarship Management Portal for Tribal Students

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.11%2B-blue)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-green)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-teal)
![Next.js](https://img.shields.io/badge/Next.js-16-black)

> **Smart India Hackathon (SIH 2026)** • Problem Statement **SIH26239**  
> An AI-powered scholarship and fellowship management portal for Scheduled Tribes featuring vernacular AI guidance, automated document OCR verification, and a smart eligibility recommendation engine.

---

## 🏛️ System Architecture

The portal is architected as a distributed microservice system:

```
┌────────────────────────────────────────────────────────┐
│                   Next.js Frontend                     │
│  (React 19, Tailwind CSS, Lucide, Vernacular Chatbot)   │
│                 http://localhost:3000                  │
└───────────────────────────┬────────────────────────────┘
                            │
              REST / JSON & Multipart Uploads
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│              Core Backend (Spring Boot)                │
│    Primary Gateway, Auth, Business Logic & DB CRUD     │
│                 http://localhost:8080                  │
└─────────────────────┬───────────────────┬──────────────┘
                      │                   │
    Internal HTTP REST│                   │JPA / Hibernate
                      ▼                   ▼
┌──────────────────────────────┐  ┌──────────────────────┐
│  AI Microservice (FastAPI)   │  │ PostgreSQL / H2 DB   │
│ • OpenCV + Tesseract OCR     │  │  (Relational Storage │
│ • Smart Eligibility Engine   │  │   & Entity Records)  │
│ • Vernacular NLP Assistant   │  └──────────────────────┘
│    http://localhost:8000     │
└──────────────────────────────┘
```

---

## 🚀 Key Features

1. **Automated Document OCR Verification (`ai-service/ocr.py`)**:
   - OpenCV image preprocessing (adaptive thresholding, Gaussian blur).
   - Extracts student name, tribal community (Santhal, Gond, Bhil, Munda, etc.), certificate number, and family income value from photos/PDFs.
   - Eliminates manual typing and errors via a 1-click **"Auto-Fill from Document"** button.

2. **Smart Eligibility Engine (`ai-service/recommend.py`)**:
   - Multi-factor evaluation mapping applicant profile against central tribal scholarship rules.
   - Computes weighted financial need and academic merit scores with explainability.

3. **Vernacular NLP Assistant (`ai-service/chatbot.py`)**:
   - Floating multilingual assistant available 24/7 on the bottom-right corner.
   - Understands and replies in **English**, **हिन्दी (Hindi)**, and **संताली (Santhali)**.
   - Answers queries regarding required documents, income ceilings, deadlines, and application status.

4. **Ministry Scrutiny & Direct Benefit Transfer (DBT) Portal**:
   - Administrative review console for Tribal Welfare Officers.
   - Live scrutiny of OCR confidence scores, certificate validation status, and one-click sanctioning.

---

## 👥 Pre-Seeded Evaluator Accounts

| Role | Email | Password | Details |
|------|-------|----------|---------|
| **Tribal Student** | `student@sih.gov.in` | `student123` | Birsa Soren (ST / Santhal), Jharkhand |
| **Ministry Admin** | `admin@sih.gov.in` | `admin123` | Ministry Officer (Tribal Welfare Dept.) |

---

## 🛠️ Tech Stack & Prerequisites

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Axios
- **Core Backend**: Java 17, Spring Boot 3.3.4 (Maven), Spring Data JPA, Spring Security, JJWT
- **AI Microservice**: Python 3.11+, FastAPI, Uvicorn, OpenCV, Pytesseract, Pydantic, Scikit-learn, Pandas
- **Database**: PostgreSQL (Production) / H2 in PostgreSQL-compatibility mode (Instant zero-config local run)

---

## ⚡ Quick Start Guide

### Automated 1-Click Launch (All Services)
Run the provided PowerShell script from repository root:
```powershell
.\start-all.ps1
```

### Manual Individual Startup

#### 1. Start AI Microservice (FastAPI)
```powershell
cd ai-service
# Activate virtual environment
.\venv\Scripts\activate
# Start FastAPI server on port 8000
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
Swagger UI will be available at: `http://localhost:8000/docs`

#### 2. Start Core Backend (Spring Boot Gateway)
```powershell
cd core-service
# Compile and run Spring Boot on port 8080
.\mvnw.cmd spring-boot:run
```
Spring Boot API will be available at: `http://localhost:8080/api`  
H2 Database Console: `http://localhost:8080/h2-console`

*(To switch to PostgreSQL, activate the postgres profile: `.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=postgres`)*

#### 3. Start Frontend (Next.js)
```powershell
cd frontend
# Start Next.js development server on port 3000
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🧪 Testing the Integration

To run automated integration tests across the AI microservice endpoints:
```powershell
cd ai-service
.\venv\Scripts\python.exe -c "from fastapi.testclient import TestClient; import main; c = TestClient(main.app); print('Health:', c.get('/health').json()); print('Chat:', c.post('/api/ai/chat', json={'message':'What documents do I need?'}).json()['intent'])"
```
Output:
```
Health: {'status': 'UP', 'models_loaded': True}
Chat: DOCUMENTS_REQUIRED
```

---

## 📂 Project Directory Structure

```
SIH26239------AI-Scholarship-Portal/
├── core-service/               # Spring Boot Core Microservice (Port 8080)
│   ├── src/main/java/com/example/core_service/
│   │   ├── config/             # DataInitializer (seeds schemes & users)
│   │   ├── controller/         # Auth, Profile, Scholarship, Application, AI Gateway
│   │   ├── dto/                # DTO models
│   │   ├── model/              # User, StudentProfile, ScholarshipScheme, Application
│   │   ├── repository/         # Spring Data JPA Repositories
│   │   ├── security/           # JWT Utils, Filter & Spring Security config
│   │   └── service/            # User, Scheme, Application & AI Client Services
│   ├── src/main/resources/     # application.properties & application-postgres.properties
│   └── pom.xml                 # Maven configuration
│
├── ai-service/                 # FastAPI AI Microservice (Port 8000)
│   ├── ocr.py                  # OpenCV + Tesseract document extraction
│   ├── recommend.py            # Smart Eligibility scoring engine
│   ├── chatbot.py              # Vernacular NLP multilingual assistant
│   ├── main.py                 # FastAPI application router & CORS
│   └── requirements.txt        # Python dependencies
│
└── frontend/                   # Next.js App Router Frontend (Port 3000)
    ├── src/app/
    │   ├── page.tsx            # Portal landing page
    │   ├── register/page.tsx   # Login & Student Registration with Demo buttons
    │   ├── dashboard/page.tsx  # Student Portal (Verification, AI Matches & Applications)
    │   ├── apply/page.tsx      # Application Form with "Auto-Fill from Document" OCR
    │   ├── admin-dashboard/    # Ministry Scrutiny & Approval Table
    │   └── layout.tsx          # App Layout with Navbar & ChatbotWidget
    ├── src/components/
    │   ├── Navbar.tsx          # Header with vernacular language toggle
    │   ├── ChatbotWidget.tsx   # Floating Multilingual Vernacular Chatbot
    │   ├── ApplicationTracker.tsx # 4-stage live status tracker
    │   └── FileUploader.tsx    # Drag-and-drop uploader with OCR trigger
    └── package.json
```
