# SIH26239------AI-Scholarship-Portal
An AI-enabled scholarship and fellowship management portal for Scheduled Tribes (SIH 2026 - Problem Statement SIH26239). Features vernacular NLP, OCR verification, and ML-based fraud detection.
# 🎓 AI Scholarship Portal (SIH26239)

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-green)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-teal)

This repository contains the prototype solution for **Smart India Hackathon (SIH) 2026 Problem Statement SIH26239**: *AI-Enabled Scholarship and Fellowship Management System for Scheduled Tribes*, presented by the Ministry of Tribal Affairs.

## 📌 Problem Overview
Tribal students face friction when applying for national scholarships due to language barriers, digital illiteracy, and complex documentation. On the administrative side, processing is slowed by manual verification and duplicate/fraudulent applications. 

## 🚀 Key AI Features
This solution moves beyond a standard CRUD portal by implementing a dual-backend microservices architecture to handle heavy AI workflows:

*   **🗣️ Vernacular NLP Assistant:** A voice/text chatbot that guides students step-by-step in regional languages.
*   **📄 Automated OCR Verification:** Instantly extracts and cross-checks data from Aadhaar cards, mark sheets, and caste certificates.
*   **🎯 Smart Eligibility Engine:** Automatically maps student profiles to all qualifying schemes, eliminating manual search.
*   **🛡️ Fraud & Anomaly Detection:** ML models identify suspicious patterns (e.g., duplicate bank accounts, mismatched identity data) before funds are disbursed.

## 🏗️ Tech Stack
*   **AI Microservices:** FastAPI (Python) for ML models, OCR (Tesseract/OpenCV), and NLP.
*   **Core Backend:** Spring Boot (Java) for secure business logic, user authentication, and transactional data.
*   **Frontend:** React / Next.js (Tailwind CSS) optimized for low-bandwidth and offline-first capabilities.
*   **Database:** PostgreSQL (Relational data) + Vector Database (for semantic search/NLP).

## 📂 Project Structure
```text
SIH26239-AI-Scholarship-Portal/
├── ai-service/          # FastAPI application (Python)
│   ├── models/          # ML models for fraud detection & recommendation
│   ├── ocr/             # Document extraction logic
│   └── nlp/             # Vernacular chatbot routing
├── core-backend/        # Spring Boot application (Java)
│   ├── controllers/     # REST API endpoints
│   ├── services/        # Business logic & AI service orchestration
│   └── security/        # JWT Authentication & RBAC
├── frontend/            # Web interface (React/Next.js)
└── docs/                # Architecture diagrams and pitch materials
