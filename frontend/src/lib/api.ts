import axios from "axios";

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
    const res = await api.post("/applications/extract-doc", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
};

// AI Chatbot endpoint
export const aiApi = {
  chat: async (message: string, language: string = "en") => {
    try {
      const res = await api.post("/ai/chat", { message, language });
      return res.data;
    } catch {
      // Fallback direct to FastAPI microservice if spring gateway is not routing chat
      try {
        const res = await axios.post("http://localhost:8000/api/ai/chat", { message, language });
        return res.data;
      } catch {
        return {
          reply: "Johar! Welcome to the AI Scholarship Portal. Please feel free to ask about documents, eligibility criteria, or scholarship schemes.",
          suggestions: ["What documents do I need?", "Income limits for ST?", "How does OCR work?"],
        };
      }
    }
  },
  generateSpeechAudio: async (text: string, language: string = "en"): Promise<string | null> => {
    try {
      const response = await fetch("http://localhost:8000/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });
      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
      return null;
    } catch {
      return null;
    }
  },
};
