import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ChatbotWidget from "@/components/ChatbotWidget";
import { LanguageProvider } from "@/lib/i18n";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIH26239 - AI-Enabled Scholarship Management Portal for Tribal Students",
  description: "An AI-powered scholarship portal featuring vernacular AI guidance, automated document OCR verification, and a smart recommendation engine for tribal students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 py-6 text-center text-xs text-stone-500">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p>
                  Smart India Hackathon (SIH26239) • Ministry of Tribal Affairs AI Scholarship Prototype
                </p>
                <div className="flex items-center gap-4 text-[11px] font-medium text-stone-600 dark:text-stone-400">
                  <span>Next.js Frontend</span>
                  <span>•</span>
                  <span>Spring Boot Gateway</span>
                  <span>•</span>
                  <span>FastAPI OCR & NLP</span>
                </div>
              </div>
            </footer>
            <ChatbotWidget />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
