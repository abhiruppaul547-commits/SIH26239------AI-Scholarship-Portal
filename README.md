# SIH26239 — AI-Enabled Scholarship Management Portal for Tribal Students

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_RTDB-FFA000?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=for-the-badge&logo=spring-boot)](https://spring.io/projects/spring-boot)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Ngrok](https://img.shields.io/badge/Ngrok-Tunneled-1F1E38?style=for-the-badge&logo=ngrok)](https://ngrok.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> **Smart India Hackathon (SIH 2026)** • Problem Statement **SIH26239**  
> An AI-powered scholarship and fellowship management portal for Scheduled Tribes featuring vernacular AI guidance, automated document OCR verification, smart eligibility recommendation engine, and cloud real-time tracking.

---

## 🏛️ System Architecture

The portal employs a hybrid modern architecture: the Next.js frontend is deployed on **Vercel** with **Firebase** for cloud authentication and Realtime Database, while local **Spring Boot** and **FastAPI** microservices communicate securely across the web via **Ngrok**.

```mermaid
flowchart TD
    subgraph Cloud["Cloud Infrastructure (Vercel & Firebase)"]
        Vercel["Next.js 16 Frontend<br/>(Deployed on Vercel)"]
        Firebase["Firebase Cloud Platform<br/>• Firebase Authentication (Google OAuth & Email)<br/>• Realtime Database (applications/{userId})"]
    end

    subgraph Tunnel["Ngrok Edge Gateway"]
        Ngrok["Ngrok Public Tunnel<br/>https://election-lushness-pointed.ngrok-free.dev<br/>(Header: ngrok-skip-browser-warning: true)"]
    end

    subgraph LocalBackends["Local Machine Microservices"]
        SpringBoot["Core Backend (Spring Boot 3.3.4)<br/>• Port 8080<br/>• Schemes, Scrutiny, Auth & AI Gateway"]
        FastAPI["AI Microservice (FastAPI)<br/>• Port 8000<br/>• OpenCV / Tesseract OCR & Vernacular NLP Assistant"]
        H2DB[("Embedded Database<br/>H2 / PostgreSQL (Relational)")]
    end

    Vercel -- "Auth & Realtime Sync" --> Firebase
    Vercel -- "REST API (CORS enabled)" --> Ngrok
    Ngrok -- "Reverse Proxy" --> SpringBoot
    SpringBoot -- "Internal HTTP Proxy" --> FastAPI
    SpringBoot -- "JPA Persistence" --> H2DB
```

---

## 🚀 Key Features

1. **Firebase Authentication & Cloud Realtime Sync**:
   - Google OAuth 2.0 & Email/Password authentication via Firebase Auth singleton SDK.
   - Applications instantly persisted to Firebase Realtime Database (`applications/{userId}/{applicationId}`).
   - Instant live updates across devices without manual refresh.

2. **Automated Document OCR Verification (`ai-service/ocr.py`)**:
   - OpenCV image preprocessing (adaptive thresholding, noise removal, Gaussian blur).
   - Tesseract OCR extracts student name, tribal community (Santhal, Gond, Bhil, Munda, etc.), certificate number, and annual family income.
   - One-click **"Auto-Fill from Document"** button eliminates manual data entry.

3. **Smart Eligibility & Scoring Engine (`ai-service/recommend.py`)**:
   - Multi-factor evaluation mapping applicant profile against central tribal scholarship schemes.
   - Computes financial need and academic merit scores with full criteria explainability.

4. **Vernacular NLP Voice/Chat Assistant (`ai-service/chatbot.py`)**:
   - Floating assistant supporting multiple vernacular languages: **English**, **हिन्दी (Hindi)**, and **संताली (Santhali)**.
   - Answers queries regarding documents required, income ceilings, deadlines, and application status.

5. **Ministry Scrutiny & Direct Benefit Transfer (DBT)**:
   - Administrative review console for Tribal Welfare Officers.
   - Live scrutiny of OCR confidence scores, certificate validation status, and one-click sanctioning.

---

## 🛠️ Tech Stack & Microservices

| Component | Technology | Role | Port / Host |
|-----------|------------|------|-------------|
| **Frontend** | Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS | Beneficiary UI, Admin Portal, Language Switcher | Vercel / `localhost:3000` |
| **Cloud DB & Auth** | Firebase (Auth & Realtime Database) | Identity Management & Cloud Application Sync | Cloud (`ai-based-scholarship-portal`) |
| **Gateway Tunnel** | Ngrok Edge Tunnel | Exposes local backend to public Vercel frontend | `election-lushness-pointed.ngrok-free.dev` |
| **Core Backend** | Java 17, Spring Boot 3.3.4, Spring Security, JPA | Business Logic, CORS, Schemes & Scrutiny API | `localhost:8080` |
| **AI Microservice** | Python 3.11+, FastAPI, Uvicorn, OpenCV, Tesseract | OCR Processing, Eligibility Scoring, Vernacular NLP | `localhost:8000` |

---

## 🧪 Testing the Live Site

> **IMPORTANT**: Evaluators and users cannot simply sign in immediately. You must **create an account first**. Registering an account provisions your user record directly inside the Firebase Authentication and Realtime Database services.

### 📋 Steps for Testing the Portal:
- **Step 1:** Visit the live Vercel deployment URL.
- **Step 2:** Navigate to the **Sign Up / Create Account** tab.
- **Step 3:** Register a new account using your original, valid email ID (this ensures Firebase Auth provisions your user record correctly).
- **Step 4:** Once successfully registered, navigate back to the **Login** screen and sign in with your new credentials to access the ST Scholarship Dashboard.

---

## ⚡ Quick Start & Local Execution Guide

### Prerequisites
- **Node.js**: v18.17+ or v20+
- **Java JDK**: Version 17+ (e.g., Eclipse Adoptium Temurin 17)
- **Python**: Version 3.10+
- **Ngrok**: Installed and authenticated

---

### Step 1: Start the AI Microservice (FastAPI)
```powershell
cd ai-service
# Activate virtual environment
.\venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# Start FastAPI server on port 8000
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
- Swagger UI Documentation: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/ai/health`

---

### Step 2: Start the Core Backend (Spring Boot)
```powershell
cd core-backend
# Set JAVA_HOME if not configured globally
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot"
# Run Spring Boot
.\mvnw.cmd spring-boot:run
```
- Health check: `http://localhost:8080/api/core/health`
- H2 Database Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:scholarshipdb`)

---

### Step 3: Tunnel Spring Boot with Ngrok
Tunnel port 8080 using your configured custom domain:
```powershell
ngrok http 8080 --domain=election-lushness-pointed.ngrok-free.dev
```

---

### Step 4: Run the Next.js Frontend
```powershell
cd frontend
# Install dependencies
npm install
# Start development server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🌐 Environment Variables Configuration

### `frontend/.env.local`
```ini
# Backend API & Ngrok Tunnel
NEXT_PUBLIC_BACKEND_URL=https://election-lushness-pointed.ngrok-free.dev
NEXT_PUBLIC_API_URL=https://election-lushness-pointed.ngrok-free.dev/api
NEXT_PUBLIC_AI_URL=http://localhost:8000/api/ai

# Firebase Cloud Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCEFieEA9T8Ijg-U_mxdvchu4xnsrCHWOk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ai-based-scholarship-portal.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ai-based-scholarship-portal
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://ai-based-scholarship-portal-default-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ai-based-scholarship-portal.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=335723314161
NEXT_PUBLIC_FIREBASE_APP_ID=1:335723314161:web:5a8b2cd44dcfbef4e8e250
```

> **Note on Ngrok Free Tier**: When communicating from the client to the Ngrok URL, ensure the request header `"ngrok-skip-browser-warning": "true"` is included (already configured in `src/lib/api.ts` and `src/app/dashboard/page.tsx`).

---

## 📡 API Endpoints Summary

### Spring Boot Core Backend (`:8080` / Ngrok)
- `GET /api/core/health` — Microservice health status (`{"status": "ok"}`)
- `POST /api/auth/login` — Student / Admin JWT authentication
- `POST /api/auth/register` — Student profile registration
- `GET /api/scholarships` — List available ST scholarship schemes
- `GET /api/scholarships/recommended` — Top recommended schemes for current student
- `POST /api/applications` — Submit scholarship application
- `GET /api/applications/my-applications` — Fetch logged-in student's applications
- `GET /api/admin/applications` — Ministry scrutiny application review list

### FastAPI AI Microservice (`:8000`)
- `GET /api/ai/health` — AI service status (`{"status": "ok", "models_loaded": true}`)
- `POST /api/ai/extract-doc` — OCR extraction from income/caste certificate images
- `POST /api/ai/recommend` — Weighted scholarship eligibility scoring
- `POST /api/ai/chat` — Vernacular NLP conversational assistant
- `POST /api/ai/tts` — Regional voice audio synthesis

---

## 👥 Evaluator Credentials

| Role | Email | Password | Access Details |
|------|-------|----------|----------------|
| **Tribal Beneficiary** | `student@sih.gov.in` | `student123` | Direct Beneficiary Portal & Live Tracker |
| **Ministry Admin** | `admin@sih.gov.in` | `admin123` | Administrative Scrutiny & DBT Verification |

---

## 📄 License
This prototype is developed for the **Smart India Hackathon (SIH 2026)** under the Ministry of Tribal Affairs problem statement **SIH26239**.
All rights reserved © 2026.
