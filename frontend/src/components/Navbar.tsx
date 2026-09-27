"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GraduationCap, User, LogOut, Shield, Sparkles, Globe, FileText, LayoutDashboard, ChevronDown } from "lucide-react";
import { authApi } from "@/lib/api";
import { useLanguage, SUPPORTED_LANGUAGES, Language } from "@/lib/i18n";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { language, setLanguage, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { user: firebaseUser, logout: firebaseLogout } = useAuth();

  useEffect(() => {
    const user = authApi.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogout = async () => {
    try {
      await firebaseLogout();
    } catch {}
    authApi.logout();
    setCurrentUser(null);
    window.location.href = "/";
  };

  const activeUser = firebaseUser
    ? {
        fullName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Student",
        email: firebaseUser.email,
        role: "STUDENT",
      }
    : currentUser;

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-200/40 bg-white/90 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/90 shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Emblem */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-600 to-amber-700 text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-900 via-orange-800 to-amber-700 dark:from-amber-200 dark:to-orange-400 bg-clip-text text-transparent">
                SIH26239
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 dark:bg-orange-950/80 px-2 py-0.5 text-[11px] font-semibold text-orange-800 dark:text-orange-300">
                <Sparkles className="h-3 w-3" /> {t("aiPortal")}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium tracking-tight">
              {t("brandSub")}
            </p>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-300">
          <Link href="/" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            {t("navHome")}
          </Link>
          <Link href="/apply" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5">
            <FileText className="h-4 w-4" /> {t("navApply")}
          </Link>
          <Link href="/dashboard" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5">
            <LayoutDashboard className="h-4 w-4" /> {t("navDashboard")}
          </Link>
          <Link href="/admin-dashboard" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5">
            <Shield className="h-4 w-4" /> {t("navAdmin")}
          </Link>
        </nav>

        {/* Actions & Profile */}
        <div className="flex items-center gap-3">
          {/* Vernacular Language Dropdown Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-3 py-1.5 text-xs font-bold text-stone-700 dark:text-stone-200 hover:bg-stone-100 transition-colors shadow-2xs"
            >
              <Globe className="h-3.5 w-3.5 text-orange-600" />
              <span>{currentLangObj.nativeName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-1.5 shadow-xl z-50 animate-in fade-in duration-150">
                <div className="px-2 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Select Language / ভাষা
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`flex items-center justify-between w-full rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all ${
                      language === lang.code
                        ? "bg-orange-600 text-white shadow-xs"
                        : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] opacity-70 uppercase">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {activeUser ? (
            <div className="flex items-center gap-2">
              <Link
                href={activeUser.role === "ADMIN" ? "/admin-dashboard" : "/dashboard"}
                className="flex items-center gap-2 rounded-xl bg-orange-50 dark:bg-stone-900 border border-orange-200/60 dark:border-stone-800 px-3 py-1.5 text-xs font-semibold text-orange-950 dark:text-orange-200 hover:bg-orange-100 transition-colors"
              >
                <User className="h-4 w-4 text-orange-600" />
                <div className="text-left hidden sm:block">
                  <div className="truncate max-w-[120px] font-bold">{activeUser.fullName}</div>
                  <div className="text-[10px] text-stone-500 uppercase">{activeUser.role}</div>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl border border-stone-300 dark:border-stone-700 px-3.5 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
              >
                {t("navSignIn")}
              </Link>
              <Link
                href="/login"
                className="rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-orange-500 hover:to-amber-500 transition-all"
              >
                {t("navRegister")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
