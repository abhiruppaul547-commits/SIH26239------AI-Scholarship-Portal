"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles, HelpCircle } from "lucide-react";
import { aiApi } from "@/lib/api";
import { useLanguage, SUPPORTED_LANGUAGES, Language } from "@/lib/i18n";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

const NATIVE_SUGGESTIONS: Record<Language, string[]> = {
  en: [
    "What documents do I need to apply?",
    "What is the income limit for ST scholarship?",
    "How does the Auto-Fill OCR work?",
    "How do I track my application?",
  ],
  hi: [
    "आवेदन के लिए कौन से दस्तावेज़ चाहिए?",
    "ST छात्रवृत्ति के लिए आय सीमा क्या है?",
    "दस्तावेज़ से Auto-Fill कैसे काम करता है?",
    "आवेदन की स्थिति कैसे जांचें?",
  ],
  sat: [
    "ᱪᱮᱫ ᱠᱟᱜᱚᱡᱽ ᱠᱚ ᱞᱟᱜᱟᱜ-ᱟ?",
    "ST ᱞᱟᱹᱜᱤᱫ ᱥᱮᱨᱢᱟ ᱟᱭ ᱛᱤᱱᱟᱹᱜ ᱞᱟᱹᱠᱛᱤ?",
    "Auto-Fill OCR ᱪᱮᱫ ᱞᱮᱠᱟ ᱠᱟᱹᱢᱤᱭᱟ?",
    "ᱤᱧᱟᱜ ᱫᱚᱨᱠᱷᱟᱥᱛ ᱦᱟᱞᱚᱛ ᱪᱮᱠ ᱢᱮ",
  ],
  bn: [
    "আবেদন করতে কি কি কাগজপত্র লাগবে?",
    "ST বৃত্তির পারিবারিক আয়ের সর্বোচ্চ সীমা কত?",
    "ডকুমেন্ট থেকে Auto-Fill কীভাবে কাজ করে?",
    "আবেদনের স্ট্যাটাস কীভাবে চেক করব?",
  ],
  as: [
    "আবেদন কৰিবলৈ কি কি নথিপত্ৰ লাগিব?",
    "ST বৃত্তিৰ বাবে সৰ্বাধিক আয়ৰ সীমা কিমান?",
    "নথিপত্ৰৰ পৰা Auto-Fill কেনেকৈ হয়?",
    "আবেদনৰ স্থিতি কেনেকৈ পৰীক্ষা কৰিম?",
  ],
};

const WELCOME_MESSAGES: Record<Language, string> = {
  en: "Johar! 🙏 I am your AI Scholarship Assistant for tribal students. How can I assist you with schemes, documents, or OCR verification today?",
  hi: "जोहार! 🙏 मैं जनजातीय छात्रों के लिए आपका AI छात्रवृत्ति सहायक हूँ। योजनाओं, प्रमाणपत्रों या AI सत्यापन में मैं आपकी क्या मदद करूँ?",
  sat: "ᱡᱚᱦᱟᱨ! 🙏 ᱤᱧ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ AI ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱜᱚᱲᱚᱭᱤᱡ। ᱪᱮᱫ ᱜᱚᱲᱚ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?",
  bn: "জোহার! 🙏 আমি উপজাতি শিক্ষার্থীদের জন্য আপনার AI বৃত্তি সহায়ক। স্কলারশিপ, নথিপত্র বা অটো-ফিল সংক্রান্ত কী জানতে চান?",
  as: "জোহাৰ! 🙏 মই জনজাতীয় শিক্ষাৰ্থীসকলৰ বাবে AI বৃত্তি সহায়ক। আঁচনি বা নথিপত্ৰ পৰীক্ষাৰ ক্ষেত্ৰত কি সহায় কৰিব পাৰোঁ?",
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [suggestions, setSuggestions] = useState<string[]>(NATIVE_SUGGESTIONS[language] || NATIVE_SUGGESTIONS.en);

  // Sync welcome message and suggestions when language changes
  useEffect(() => {
    setSuggestions(NATIVE_SUGGESTIONS[language] || NATIVE_SUGGESTIONS.en);
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "welcome") {
        return [
          {
            id: "welcome",
            sender: "bot",
            text: WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ];
      }
      return prev;
    });
  }, [language]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

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
      const data = await aiApi.chat(query, language);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.reply || WELCOME_MESSAGES[language],
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
        text: WELCOME_MESSAGES[language] || "Johar! Please check scholarship guidelines or contact district nodal officer.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
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
        <div className="flex flex-col h-[520px] w-[370px] sm:w-[420px] rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-orange-600 to-amber-700 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs">
                <Sparkles className="h-5 w-5 text-amber-200" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">{t("chatTitle")}</h3>
                <p className="text-[11px] text-orange-100 flex items-center gap-1 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block"></span>
                  {t("chatActive")}
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
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/60 dark:bg-stone-950/40 text-xs sm:text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-xs whitespace-pre-line leading-relaxed ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-br-xs"
                      : "bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-200/80 dark:border-stone-700/80 rounded-bl-xs"
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      m.sender === "user" ? "text-orange-200" : "text-stone-400"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
                {m.sender === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-200 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-stone-400 text-xs py-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950">
                  <Bot className="h-3.5 w-3.5 animate-pulse" />
                </div>
                <span className="italic">AI is thinking & analyzing guidelines...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="p-2 border-t border-stone-200/60 dark:border-stone-800 bg-white dark:bg-stone-900">
            <div className="flex items-center gap-1 mb-1.5 px-1 text-[11px] font-semibold text-stone-500">
              <HelpCircle className="h-3 w-3 text-orange-500" /> {t("suggestedQueries")}
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s)}
                  className="shrink-0 rounded-full border border-orange-200 dark:border-stone-700 bg-orange-50 dark:bg-stone-800/70 px-2.5 py-1 text-orange-950 dark:text-orange-200 hover:bg-orange-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
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
                placeholder={t("chatPlaceholder")}
                className="flex-1 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white disabled:opacity-40 hover:bg-orange-500 active:scale-95 transition-all cursor-pointer"
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
