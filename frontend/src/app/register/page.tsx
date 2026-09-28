"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, Lock, Mail, User, Shield, Sparkles, AlertCircle } from "lucide-react";
import { authApi } from "@/lib/api";
import { useLanguage } from "@/lib/i18n";

function AuthForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";

  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regData, setRegData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    category: "ST",
    tribeName: "Santhal",
    annualFamilyIncome: "120000",
    role: "STUDENT",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await authApi.login({ email: loginEmail, password: loginPassword });
      if (res.role === "ADMIN") {
        router.push("/admin-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const payload = {
        ...regData,
        annualFamilyIncome: parseFloat(regData.annualFamilyIncome) || 100000,
      };
      await authApi.register(payload);
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Registration failed. Email might already exist.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/20">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
            {tab === "login" ? t("loginTitle") : t("registerTitle")}
          </h2>
          <p className="text-xs text-stone-500">
            {t("loginSub")}
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-xl">
          {/* Tabs */}
          <div className="flex rounded-xl bg-stone-100 dark:bg-stone-800 p-1 mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setTab("login");
                setErrorMsg("");
              }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                tab === "login"
                  ? "bg-white dark:bg-stone-700 text-orange-600 dark:text-orange-300 shadow-xs"
                  : "text-stone-600 dark:text-stone-400"
              }`}
            >
              {t("navSignIn")}
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("register");
                setErrorMsg("");
              }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                tab === "register"
                  ? "bg-white dark:bg-stone-700 text-orange-600 dark:text-orange-300 shadow-xs"
                  : "text-stone-600 dark:text-stone-400"
              }`}
            >
              {t("registerAsStudent")}
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {tab === "login" ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">
                  {t("emailAddr").replace("*", "").trim()}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@sih.gov.in"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 py-2.5 pl-10 pr-4 text-stone-900 dark:text-white placeholder-stone-400 outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">
                  {t("passwordLabel")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 py-2.5 pl-10 pr-4 text-stone-900 dark:text-white placeholder-stone-400 outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-600/20 hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 transition-all active:scale-98 cursor-pointer"
              >
                {loading ? t("signingInBtn") : t("signInBtn")}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">{t("fullName").replace("*", "").trim()}</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={regData.fullName}
                    onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                    placeholder="Birsa Soren"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 py-2 pl-10 pr-3 text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">{t("emailAddr").replace("*", "").trim()}</label>
                  <input
                    type="email"
                    required
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    placeholder="birsa@example.com"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 py-2 px-3 text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">{t("phoneLabel")}</label>
                  <input
                    type="tel"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 py-2 px-3 text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">{t("casteCat").replace("*", "").trim()}</label>
                  <select
                    value={regData.category}
                    onChange={(e) => setRegData({ ...regData, category: e.target.value })}
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 py-2 px-3 text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
                  >
                    <option value="ST">Scheduled Tribe (ST)</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="OBC">Other Backward Class (OBC)</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">{t("tribalComm").replace("*", "").trim()}</label>
                  <select
                    value={regData.tribeName}
                    onChange={(e) => setRegData({ ...regData, tribeName: e.target.value })}
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 py-2 px-3 text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
                  >
                    <option value="Santhal">Santhal</option>
                    <option value="Gond">Gond</option>
                    <option value="Bhil">Bhil</option>
                    <option value="Munda">Munda</option>
                    <option value="Oraon">Oraon</option>
                    <option value="Bodo">Bodo</option>
                    <option value="Khasi">Khasi</option>
                    <option value="Other">Other Tribal Group</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">{t("annualIncome").replace("*", "").trim()}</label>
                  <input
                    type="number"
                    value={regData.annualFamilyIncome}
                    onChange={(e) => setRegData({ ...regData, annualFamilyIncome: e.target.value })}
                    placeholder="120000"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 py-2 px-3 text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">{t("passwordLabel")}</label>
                  <input
                    type="password"
                    required
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 py-2 px-3 text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-600/20 hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 transition-all active:scale-98 mt-2 cursor-pointer"
              >
                {loading ? t("registeringBtn") : t("createAccountBtn")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center text-xs text-stone-500">Loading Access Portal...</div>}>
      <AuthForm />
    </Suspense>
  );
}
