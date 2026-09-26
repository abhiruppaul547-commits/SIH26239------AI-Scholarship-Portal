"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, HelpCircle } from "lucide-react";
import { aiApi } from "@/lib/api";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi" | "santhali">("en");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Johar! 🙏 I am your AI Scholarship Assistant for tribal students. How can I assist you with schemes, documents, or OCR verification today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [suggestions, setSuggestions] = useState<string[]>([
    "What documents do I need to apply?",
    "What is the income limit for ST scholarship?",
    "How does the Auto-Fill OCR work?",
    "How do I track my application?",
  ]);

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
        text: data.reply || "Johar! Your query has been recorded. Please check scholarship guidelines or contact district nodal officer.",
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
        text: "Johar! For tribal scholarship applications, you primarily need your ST Caste Certificate, Family Income Certificate, and latest Marksheet. You can use our Auto-Fill button on the Apply page!",
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
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white shadow-xl shadow-orange-600/30 hover:scale-105 active:scale-95 transition-all"
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
                <h3 className="text-sm font-bold leading-tight">Vernacular AI Assistant</h3>
                <p className="text-[11px] text-orange-100 flex items-center gap-1 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block"></span>
                  Active • SIH26239 NLP Engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-white/20 text-white text-xs rounded-md px-2 py-1 outline-hidden border border-white/30 cursor-pointer font-medium"
              >
                <option value="en" className="text-black">English</option>
                <option value="hi" className="text-black">हिन्दी (Hindi)</option>
                <option value="santhali" className="text-black">संताली (Santhali)</option>
              </select>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
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
              <HelpCircle className="h-3 w-3 text-orange-500" /> Suggested Queries:
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s)}
                  className="shrink-0 rounded-full border border-orange-200 dark:border-stone-700 bg-orange-50 dark:bg-stone-800/70 px-2.5 py-1 text-orange-950 dark:text-orange-200 hover:bg-orange-100 dark:hover:bg-stone-800 transition-colors"
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
                placeholder={
                  language === "hi"
                    ? "अपना प्रश्न यहाँ लिखें..."
                    : language === "santhali"
                    ? "Apeyaq katha ol me..."
                    : "Ask anything in English or Hindi..."
                }
                className="flex-1 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white disabled:opacity-40 hover:bg-orange-500 active:scale-95 transition-all"
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
