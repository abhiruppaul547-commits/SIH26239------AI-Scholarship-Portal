"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { aiApi, authApi } from "@/lib/api";
import { useLanguage, SUPPORTED_LANGUAGES, Language } from "@/lib/i18n";
import { useAuth } from "@/context/AuthContext";
import { getCleanFirstName } from "@/lib/nameUtils";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

const NATIVE_SUGGESTIONS: Record<Language, string[]> = {
  en: [
    "What scholarships are there for ST students at NITs?",
    "What is the income limit for ST Post-Matric?",
    "How does the AI Auto-Fill OCR work?",
    "What documents do I need to upload?",
  ],
  hi: [
    "NIT/IIT में ST छात्रों के लिए कौन सी छात्रवृत्ति है?",
    "पोस्ट-मैट्रिक छात्रवृत्ति की आय सीमा क्या है?",
    "AI दस्तावेज़ Auto-Fill कैसे काम करता है?",
    "आवेदन के लिए कौन से दस्तावेज़ अपलोड करने होंगे?",
  ],
  sat: [
    "NIT/IIT ᱨᱮ ST ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱞᱟᱹᱜᱤᱫ ᱪᱮᱫ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱢᱮᱱᱟᱜ-ᱟ?",
    "Post-Matric ᱞᱟᱹᱜᱤᱫ ᱥᱮᱨᱢᱟ ᱟᱭ ᱛᱤᱱᱟᱹᱜ ᱞᱟᱹᱠᱛᱤ?",
    "AI Auto-Fill OCR ᱪᱮᱫ ᱞᱮᱠᱟ ᱠᱟᱹᱢᱤᱭᱟ?",
    "ᱪᱮᱫ ᱠᱟᱜᱚᱡᱽ ᱠᱚ ᱞᱟᱫᱮ ᱦᱩᱭᱩᱜ-ᱟ?",
  ],
  bn: [
    "NIT/IIT-তে ST শিক্ষার্থীদের জন্য কোন স্কলারশিপ রয়েছে?",
    "পোস্ট-ম্যাট্রিক বৃত্তির পারিবারিক আয়ের সর্বোচ্চ সীমা কত?",
    "AI অটো-ফিল OCR কীভাবে কাজ করে?",
    "কি কি নথিপত্র আপলোড করতে হবে?",
  ],
  as: [
    "NIT/IIT-ত ST শিক্ষাৰ্থীৰ বাবে কি কি বৃত্তি আছে?",
    "প'ষ্ট-মেট্ৰিক বৃত্তিৰ বাবে সৰ্বাধিক বাৰ্ষিক আয় কিমান?",
    "AI অটো-ফিল OCR কেনেকৈ কাম কৰে?",
    "কি কি নথিপত্ৰ আপল'ড কৰিব লাগিব?",
  ],
};

const getWelcomeMessage = (lang: Language, name?: string | null): string => {
  const greetingName = name ? `, ${name}` : "";
  const map: Record<Language, string> = {
    en: `Hello${greetingName}! 🙏 I am your production-grade AI Scholarship Advisor powered by Gemini. Ask me anything about schemes, income criteria, documents, DBT transfers, or AI auto-filling!`,
    hi: `नमस्ते${greetingName}! 🙏 मैं आपका Gemini-संचालित AI छात्रवृत्ति सलाहकार हूँ। योजनाओं, आय सीमा, दस्तावेज़ों, या AI ऑटो-फिल के बारे में कुछ भी पूछें!`,
    sat: `ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ${greetingName}! 🙏 ᱤᱧ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ Gemini ᱫᱟᱨᱟᱭ ᱛᱮ ᱪᱟᱞᱟᱣᱚᱜ ᱠᱟᱱ AI ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱜᱚᱲᱚᱭᱤᱡ। ᱥᱠᱚᱞᱟᱨᱥᱤᱯ, ᱟᱭ ᱥᱤᱢᱟᱹ ᱟᱨ OCR ᱵᱟᱵᱚᱛ ᱠᱩᱞᱤᱭᱤᱧ ᱢᱮ!`,
    bn: `নমস্কার${greetingName}! 🙏 আমি আপনার Gemini-চালিত অফিসিয়াল AI বৃত্তি উপদেষ্টা। স্কলারশিপ স্কিম, আয়ের সীমা, প্রয়োজনীয় নথিপত্র ও AI ভেরিফিকেশন নিয়ে যেকোনো প্রশ্ন করুন!`,
    as: `নমস্কাৰ${greetingName}! 🙏 মই Gemini-চালিত জনজাতীয় শিক্ষাৰ্থীৰ AI বৃত্তি পৰামৰ্শদাতা। আঁচনি, আয়ৰ যোগ্যতা, নথিপত্ৰ বা AI অটো-ফিল সম্পৰ্কে আপুনি সোধিব পাৰে!`,
  };
  return map[lang] || map.en;
};

// Map portal language codes to speech synthesis BCP-47 codes
const SPEECH_LANG_CODES: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  bn: "bn-IN",
  as: "as-IN",
  sat: "hi-IN", // Fallback for Santhali speech recognition
};

function formatBotMessage(text: string) {
  // Simple markdown renderer for bold, lists, and linebreaks
  const lines = text.split("\n");
  return lines.map((line, lIdx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={lIdx} className="h-2" />;
    }

    // Check if line is a header (### Header)
    if (trimmed.startsWith("### ")) {
      return (
        <h4 key={lIdx} className="font-bold text-amber-900 dark:text-amber-300 text-xs sm:text-sm mt-2 mb-1">
          {trimmed.replace(/^###\s+/, "")}
        </h4>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h3 key={lIdx} className="font-bold text-amber-900 dark:text-amber-200 text-sm mt-2 mb-1">
          {trimmed.replace(/^##\s+/, "")}
        </h3>
      );
    }

    // Check if line is a bullet item (* or -)
    const isBullet = /^[*-]\s+/.test(trimmed);
    const isNumbered = /^\d+\.\s+/.test(trimmed);
    const content = trimmed.replace(/^[*-]\s+/, "").replace(/^\d+\.\s+/, "");

    // Parse **bold** parts
    const parts = content.split(/(\*\*.*?\*\*)/g);
    const parsedContent = parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pIdx} className="font-semibold text-stone-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    if (isBullet) {
      return (
        <div key={lIdx} className="flex items-start gap-1.5 ml-1 my-0.5">
          <span className="text-orange-600 dark:text-orange-400 text-xs leading-5">•</span>
          <span className="flex-1">{parsedContent}</span>
        </div>
      );
    }

    if (isNumbered) {
      const match = trimmed.match(/^(\d+)\.\s+/);
      const num = match ? match[1] : "•";
      return (
        <div key={lIdx} className="flex items-start gap-1.5 ml-1 my-0.5">
          <span className="font-semibold text-orange-600 dark:text-orange-400 text-xs leading-5">{num}.</span>
          <span className="flex-1">{parsedContent}</span>
        </div>
      );
    }

    return (
      <p key={lIdx} className="my-1">
        {parsedContent}
      </p>
    );
  });
}

function stripMarkdown(text: string): string {
  return text
    .replace(/[*#_~`>]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const { language, setLanguage, t } = useLanguage();
  const { user: firebaseUser } = useAuth();
  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    setLocalUser(authApi.getCurrentUser());
  }, []);

  const cleanName = getCleanFirstName(firebaseUser || localUser);
  const activeUserName = cleanName && cleanName !== "Student" ? cleanName : null;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: getWelcomeMessage(language, activeUserName),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [suggestions, setSuggestions] = useState<string[]>(
    NATIVE_SUGGESTIONS[language] || NATIVE_SUGGESTIONS.en
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Preload speech synthesis voices for regional Indic accent fallback
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Sync welcome message and suggestions when language or user changes
  useEffect(() => {
    setSuggestions(NATIVE_SUGGESTIONS[language] || NATIVE_SUGGESTIONS.en);
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "welcome") {
        return [
          {
            id: "welcome",
            sender: "bot",
            text: getWelcomeMessage(language, activeUserName),
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ];
      }
      return prev;
    });
  }, [language, activeUserName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Clean up audio and speech synthesis when component unmounts or closes
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    // Stop speaking any previous message
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsLoading(true);

    try {
      const data = await aiApi.chat(query, language, activeUserName || undefined);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.reply || getWelcomeMessage(language, activeUserName),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }
    } catch {
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: getWelcomeMessage(language, activeUserName) || "Hello! Please check scholarship guidelines or contact the district nodal officer.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Browser SpeechSynthesis with authentic Indic regional voice selection
  const playWithBrowserSpeech = useCallback(
    (cleanText: string, lang: Language, msgId: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setSpeakingMessageId(null);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const targetLang = SPEECH_LANG_CODES[lang] || "en-IN";
      utterance.lang = targetLang;
      utterance.rate = 0.92; // Natural conversational cadence
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const prefix = targetLang.split("-")[0];

      // Prioritize natural neural/online Indic regional voices (Google, Microsoft Natural)
      let bestVoice = voices.find(
        (v) =>
          (v.lang.toLowerCase().startsWith(prefix) || v.lang.toLowerCase() === targetLang.toLowerCase()) &&
          /natural|online|google/i.test(v.name)
      );

      // Fallback to any voice matching target language
      if (!bestVoice) {
        bestVoice = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
      }

      // For Assamese ('as') or Santhali ('sat'), use Eastern Indic voice (bn-IN or hi-IN)
      if (!bestVoice && (prefix === "as" || prefix === "sat")) {
        bestVoice =
          voices.find(
            (v) => (v.lang.startsWith("bn") || v.lang.startsWith("hi")) && /natural|online|google/i.test(v.name)
          ) || voices.find((v) => v.lang.startsWith("bn") || v.lang.startsWith("hi"));
      }

      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      utterance.onend = () => {
        setSpeakingMessageId((current) => (current === msgId ? null : current));
      };

      utterance.onerror = () => {
        setSpeakingMessageId((current) => (current === msgId ? null : current));
      };

      window.speechSynthesis.speak(utterance);
    },
    []
  );

  // Text-To-Speech (TTS) Handler with Natural Regional Accent Support
  const toggleSpeech = useCallback(
    async (msgId: string, rawText: string) => {
      // 1. If currently speaking this message, toggle off
      if (speakingMessageId === msgId) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current = null;
        }
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
        setSpeakingMessageId(null);
        return;
      }

      // 2. Stop any existing audio before starting new playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      setSpeakingMessageId(msgId);
      const cleanText = stripMarkdown(rawText);

      // 3. Primary: High-fidelity server-side natural regional voice streaming
      try {
        const audioUrl = await aiApi.generateSpeechAudio(cleanText, language);
        if (audioUrl) {
          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          audio.onended = () => {
            setSpeakingMessageId((current) => (current === msgId ? null : current));
            URL.revokeObjectURL(audioUrl);
          };
          audio.onerror = () => {
            URL.revokeObjectURL(audioUrl);
            playWithBrowserSpeech(cleanText, language, msgId);
          };
          await audio.play();
          return;
        }
      } catch (err) {
        console.warn("Server TTS audio error, falling back to browser speech:", err);
      }

      // 4. Fallback: Intelligent browser speech synthesis with authentic regional accent
      playWithBrowserSpeech(cleanText, language, msgId);
    },
    [speakingMessageId, language, playWithBrowserSpeech]
  );

  // Speech-To-Text (STT) Handler
  const toggleVoiceInput = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech-to-text recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = SPEECH_LANG_CODES[language] || "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage((prev) => (prev ? prev + " " + transcript : transcript));
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Speech recognition could not start:", err);
      setIsListening(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white shadow-xl shadow-orange-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Open AI Assistant"
        >
          <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
          </div>
          <Bot className="h-7 w-7 transition-transform group-hover:rotate-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="flex flex-col h-[560px] w-[370px] sm:w-[440px] rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-orange-600 to-amber-700 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs">
                <Sparkles className="h-5 w-5 text-amber-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold leading-tight">{t("chatTitle")}</h3>
                  <span className="text-[10px] uppercase tracking-wider bg-orange-800/80 px-1.5 py-0.5 rounded text-amber-200 font-semibold">
                    Gemini 3.8
                  </span>
                </div>
                <p className="text-[11px] text-orange-100 flex items-center gap-1 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  {t("chatActive")} • {t("chatSttTtsReady")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector Dropdown inside Chatbot */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-white/20 text-white text-xs rounded-md px-2 py-1 outline-hidden border border-white/30 cursor-pointer font-medium"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="text-black">
                    {l.nativeName}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/70 dark:bg-stone-950/50 text-xs sm:text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white mt-0.5 shadow-xs">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-br-xs whitespace-pre-line"
                      : "bg-white dark:bg-stone-800/90 text-stone-800 dark:text-stone-100 border border-stone-200/90 dark:border-stone-700/80 rounded-bl-xs"
                  }`}
                >
                  {m.sender === "user" ? (
                    <p>{m.text}</p>
                  ) : (
                    <div>{formatBotMessage(m.text)}</div>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100 dark:border-stone-700/40 text-[10px]">
                    {m.sender === "bot" ? (
                      <button
                        onClick={() => toggleSpeech(m.id, m.text)}
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                          speakingMessageId === m.id
                            ? "bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-semibold"
                            : "text-stone-400 hover:text-orange-600 dark:hover:text-orange-400"
                        }`}
                        title={speakingMessageId === m.id ? "Stop voice playback" : "Read message aloud (TTS)"}
                      >
                        {speakingMessageId === m.id ? (
                          <>
                            <VolumeX className="h-3.5 w-3.5 text-orange-600 animate-pulse" />
                            <span>{t("chatBtnSpeaking")}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3.5 w-3.5" />
                            <span>{t("chatBtnListen")}</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div />
                    )}

                    <span
                      className={m.sender === "user" ? "text-orange-200 ml-auto" : "text-stone-400"}
                    >
                      {m.timestamp}
                    </span>
                  </div>
                </div>

                {m.sender === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-200 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs py-1.5 px-1 animate-pulse">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950/80">
                  <Bot className="h-3.5 w-3.5 animate-bounce" />
                </div>
                <span className="italic font-medium">{t("chatThinkingStatus")}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="p-2 border-t border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900">
            <div className="flex items-center gap-1 mb-1.5 px-1 text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              <HelpCircle className="h-3 w-3 text-orange-500" /> {t("suggestedQueries")}
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s)}
                  className="shrink-0 rounded-full border border-orange-200 dark:border-stone-700 bg-orange-50/80 dark:bg-stone-800/80 px-2.5 py-1 text-orange-950 dark:text-orange-200 hover:bg-orange-100 dark:hover:bg-stone-800 transition-colors cursor-pointer text-left font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box with Voice Mic button (STT) */}
          <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
            {isListening && (
              <div className="flex items-center gap-2 mb-2 px-2 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-xs animate-pulse">
                <span className="h-2 w-2 rounded-full bg-red-600 inline-block animate-ping"></span>
                <span>{t("chatListeningStatus")} ({language.toUpperCase()})</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isListening ? "..." : t("chatPlaceholder")}
                className="flex-1 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />

              {/* Speech-to-Text Microphone Button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all cursor-pointer ${
                  isListening
                    ? "bg-red-600 text-white animate-pulse shadow-md shadow-red-500/30"
                    : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-stone-700"
                }`}
                title={isListening ? "Stop listening" : t("chatMicTitle")}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white disabled:opacity-40 hover:bg-orange-500 active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
