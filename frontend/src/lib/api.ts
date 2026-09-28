import axios from "axios";
import { getSmartFallbackResponse } from "./aiFallback";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("sih_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth endpoints
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post("/auth/login", credentials);
    if (res.data.token && typeof window !== "undefined") {
      localStorage.setItem("sih_token", res.data.token);
      localStorage.setItem("sih_user", JSON.stringify(res.data));
    }
    return res.data;
  },
  register: async (data: any) => {
    const res = await api.post("/auth/register", data);
    if (res.data.token && typeof window !== "undefined") {
      localStorage.setItem("sih_token", res.data.token);
      localStorage.setItem("sih_user", JSON.stringify(res.data));
    }
    return res.data;
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("sih_token");
      localStorage.removeItem("sih_user");
    }
  },
  getCurrentUser: () => {
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("sih_user");
      return u ? JSON.parse(u) : null;
    }
    return null;
  },
  getProfile: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },
  updateProfile: async (data: any) => {
    const res = await api.put("/profile/me", data);
    return res.data;
  },
};

// Scholarship endpoints
export const scholarshipApi = {
  getAll: async () => {
    const res = await api.get("/scholarships");
    return res.data;
  },
  getById: async (id: number | string) => {
    const res = await api.get(`/scholarships/${id}`);
    return res.data;
  },
  getRecommended: async () => {
    const res = await api.get("/scholarships/recommended");
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post("/scholarships", data);
    return res.data;
  },
};

// Application & AI OCR Verification endpoints
export const applicationApi = {
  submit: async (data: any) => {
    const res = await api.post("/applications", data);
    return res.data;
  },
  getMyApplications: async () => {
    const res = await api.get("/applications/my");
    return res.data;
  },
  getAllApplications: async () => {
    const res = await api.get("/applications/all");
    return res.data;
  },
  getById: async (id: number | string) => {
    const res = await api.get(`/applications/${id}`);
    return res.data;
  },
  updateStatus: async (id: number | string, status: string, remarks?: string) => {
    const res = await api.patch(`/applications/${id}/status`, { status, remarks });
    return res.data;
  },
  extractDocWithOcr: async (file: File, documentType?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (documentType) {
      formData.append("document_type", documentType);
    }

    // 1. Try Next.js serverless route (/api/ai/extract-doc) which runs directly in production with Gemini Vision
    try {
      const res = await fetch("/api/ai/extract-doc", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          return data;
        }
      }
    } catch (e: any) {
      console.warn("Direct Next.js AI OCR failed, attempting backend tunnel...", e?.message);
    }

    // 2. Fallback to Spring Boot / FastAPI backend tunnel
    try {
      const res = await api.post("/applications/extract-doc", formData, {
        timeout: 30000,
      });
      return res.data;
    } catch (backendErr: any) {
      throw new Error(backendErr.response?.data?.message || "Document OCR extraction failed. Please ensure the document is clear.");
    }
  },
};

// AI Chatbot endpoint
export const aiApi = {
  chat: async (message: string, language: string = "en", userName?: string) => {
    // 1. Try Next.js serverless route (/api/ai/chat) which runs directly on Vercel with Gemini
    try {
      const res = await axios.post(
        "/api/ai/chat",
        { message, language, userName },
        { timeout: 45000 }
      );
      if (res.data && res.data.reply) {
        return res.data;
      }
    } catch {}

    // 2. Try Spring Boot Gateway via Ngrok tunnel
    try {
      const res = await api.post("/ai/chat", { message, language, userName }, { timeout: 10000 });
      if (res.data && res.data.reply) {
        return res.data;
      }
    } catch {}

    // 3. Fallback direct to local FastAPI microservice if running on localhost
    try {
      const res = await axios.post("http://localhost:8000/api/ai/chat", { message, language, userName }, { timeout: 5000 });
      if (res.data && res.data.reply) {
        return res.data;
      }
    } catch {}

    // 4. Intelligent topic-aware fallback
    return getSmartFallbackResponse(message, language, userName);
  },

  generateSpeechAudio: async (text: string, language: string = "en"): Promise<string | null> => {
    // 1. Try Next.js serverless route (/api/ai/tts) - fastest, native gTTS audio with regional accent
    try {
      const response = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });
      if (response.ok && response.status === 200) {
        const blob = await response.blob();
        if (blob && blob.size > 100) {
          return URL.createObjectURL(blob);
        }
      }
    } catch {}

    // 2. Try local/tunnel Spring Boot Gateway
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://election-lushness-pointed.ngrok-free.dev/api";
    try {
      const response = await fetch(`${backendUrl}/ai/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ text, language }),
      });
      if (response.ok && response.status === 200) {
        const blob = await response.blob();
        if (blob && blob.size > 100) {
          return URL.createObjectURL(blob);
        }
      }
    } catch {}

    // 3. Try direct local FastAPI microservice
    try {
      const response = await fetch("http://localhost:8000/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });
      if (response.ok && response.status === 200) {
        const blob = await response.blob();
        if (blob && blob.size > 100) {
          return URL.createObjectURL(blob);
        }
      }
    } catch {}

    return null;
  },
};
