"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GraduationCap, User, LogOut, Shield, Sparkles, Globe, FileText, LayoutDashboard } from "lucide-react";
import { authApi } from "@/lib/api";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentLang, setCurrentLang] = useState("EN");

  useEffect(() => {
    const user = authApi.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    authApi.logout();
    setCurrentUser(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-200/40 bg-white/90 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/90 shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Emblem */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-900 via-orange-800 to-amber-700 dark:from-amber-200 dark:to-orange-400 bg-clip-text text-transparent">
                SIH26239
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 dark:bg-orange-950/80 px-2 py-0.5 text-[11px] font-semibold text-orange-800 dark:text-orange-300">
                <Sparkles className="h-3 w-3" /> AI Portal
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium tracking-tight">
              Tribal Scholarship Management System
            </p>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-300">
          <Link href="/" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            Home
          </Link>
          <Link href="/apply" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5">
            <FileText className="h-4 w-4" /> Apply Now
          </Link>
          <Link href="/dashboard" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5">
            <LayoutDashboard className="h-4 w-4" /> Student Portal
          </Link>
          <Link href="/admin-dashboard" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5">
            <Shield className="h-4 w-4" /> Ministry Scrutiny
          </Link>
        </nav>

        {/* Actions & Profile */}
        <div className="flex items-center gap-3">
          {/* Vernacular Language Selector */}
          <div className="flex items-center rounded-lg border border-stone-200 dark:border-stone-800 p-1 text-xs font-semibold bg-stone-50 dark:bg-stone-900">
            <Globe className="h-3.5 w-3.5 text-stone-500 ml-1.5 mr-1" />
            {(["EN", "हिन्दी", "संताली"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setCurrentLang(lang)}
                className={`px-2 py-1 rounded-md transition-all ${
                  currentLang === lang
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                href={currentUser.role === "ADMIN" ? "/admin-dashboard" : "/dashboard"}
                className="flex items-center gap-2 rounded-xl bg-orange-50 dark:bg-stone-900 border border-orange-200/60 dark:border-stone-800 px-3 py-1.5 text-xs font-semibold text-orange-950 dark:text-orange-200 hover:bg-orange-100 transition-colors"
              >
                <User className="h-4 w-4 text-orange-600" />
                <div className="text-left hidden sm:block">
                  <div className="truncate max-w-[120px] font-bold">{currentUser.fullName}</div>
                  <div className="text-[10px] text-stone-500 uppercase">{currentUser.role}</div>
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
                href="/register"
                className="rounded-xl border border-stone-300 dark:border-stone-700 px-3.5 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register?tab=register"
                className="rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-orange-500 hover:to-amber-500 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
