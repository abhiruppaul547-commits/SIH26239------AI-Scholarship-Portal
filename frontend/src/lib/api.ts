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
    // 1. Try Next.js serverless route (/api/ai/chat) which runs directly on Vercel with Gemini
    try {
      const res = await axios.post("/api/ai/chat", { message, language }, { timeout: 15000 });
      if (res.data && res.data.reply) {
        return res.data;
      }
    } catch {}

    // 2. Try Spring Boot Gateway via Ngrok tunnel
    try {
      const res = await api.post("/ai/chat", { message, language }, { timeout: 10000 });
      if (res.data && res.data.reply) {
        return res.data;
      }
    } catch {}

    // 3. Fallback direct to local FastAPI microservice if running on localhost
    try {
      const res = await axios.post("http://localhost:8000/api/ai/chat", { message, language }, { timeout: 5000 });
      if (res.data && res.data.reply) {
        return res.data;
      }
    } catch {}

    const fallbackMap: Record<string, { reply: string; suggestions: string[] }> = {
      bn: {
        reply: "জোহার ও নমস্কার! 🙏 জনজাতি বিষয়ক মন্ত্রকের AI বৃত্তি উপদেষ্টা হিসেবে আমি আপনাকে পোস্ট-ম্যাট্রিক, ন্যাশনাল ফেলোশিপ এবং শীর্ষ প্রতিষ্ঠানের যেকোনো স্কলারশিপ সংক্রান্ত সম্পূর্ণ সাহায্য করতে প্রস্তুত।",
        suggestions: ["কি কি নথিপত্র লাগবে?", "ST বৃত্তির আয় সীমা কত?", "Auto-Fill কীভাবে কাজ করে?"],
      },
      hi: {
        reply: "जोहार! 🙏 जनजातीय कार्य मंत्रालय के AI छात्रवृत्ति सलाहकार के रूप में मैं आपको पोस्ट-मैट्रिक, नेशनल फेलोशिप और टॉप क्लास शिक्षा से जुड़ी हर जानकारी देने के लिए तैयार हूँ।",
        suggestions: ["कौन से दस्तावेज़ चाहिए?", "ST छात्रवृत्ति की आय सीमा?", "Auto-Fill कैसे काम करता है?"],
      },
      as: {
        reply: "জোহাৰ! 🙏 জনজাতীয় পৰিক্ৰমা মন্ত্ৰালয়ৰ AI বৃত্তি পৰামৰ্শদাতা হিচাপে মই আপোনাক সকলো জনজাতীয় বৃত্তি আঁচনি সম্পৰ্কে সহায় কৰিবলৈ সাজু।",
        suggestions: ["কি কি নথিপত্ৰ লাগিব?", "ST বাৰ্ষিক আয়ৰ সীমা কিমান?", "Auto-Fill কেনেকৈ কাম কৰে?"],
      },
      sat: {
        reply: "ᱡᱚᱦᱟᱨ! 🙏 ᱤᱧ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ AI ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱜᱚᱲᱚᱭᱤᱡ ᱠᱟᱱᱟᱹᱧ। ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱵᱟᱵᱚᱛ ᱡᱚᱛᱚ ᱠᱟᱛᱷᱟ ᱤᱧ ᱵᱟᱰᱟᱭ ᱚᱪᱚ ᱫᱟᱲᱮᱭᱟᱢᱟ।",
        suggestions: ["ᱪᱮᱫ ᱠᱟᱜᱚᱡᱽ ᱞᱟᱜᱟᱜ-ᱟ?", "ST ᱞᱟᱹᱜᱤᱫ ᱥᱮᱨᱢᱟ ᱟᱭ?", "Auto-Fill OCR ᱪᱮᱫ ᱞᱮᱠᱟ ᱠᱟᱹᱢᱤᱭᱟ?"],
      },
      en: {
        reply: "Johar! 🙏 As your official AI Scholarship Advisor, I am here to guide you with any question regarding ST scholarships, income eligibility (Post-Matric limit ₹2.5L, Top Class ₹6L), required certificates, or DBT transfers.",
        suggestions: ["What documents do I need?", "Income limits for ST?", "How does OCR work?"],
      },
    };

    return fallbackMap[language] || fallbackMap.en;
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
