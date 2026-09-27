"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, UserRole } from "@/context/AuthContext";
import {
  GraduationCap,
  Shield,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  User,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

export default function LoginPage() {
  const { loginWithEmail, sendPasswordReset } = useAuth();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<UserRole>("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSending, setResetSending] = useState(false);
  const [resetStatus, setResetStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await loginWithEmail(email, password, selectedRole);
      if (res.role === "ADMIN") {
        router.push("/admin-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      setErrorMsg(
        err?.message?.replace("Firebase: ", "") ||
          "Invalid email or password. Please verify your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;

    setResetSending(true);
    setResetStatus(null);

    try {
      await sendPasswordReset(resetEmail);
      setResetStatus({
        type: "success",
        message:
          "Recovery email sent successfully! Please check your inbox (and spam folder) to reset your password.",
      });
    } catch (err: any) {
      console.error("Password reset error:", err);
      setResetStatus({
        type: "error",
        message:
          err?.message?.replace("Firebase: ", "") ||
          "Could not send recovery email. Please check your email address.",
      });
    } finally {
      setResetSending(false);
    }
  };

  const fillDemoStudent = async () => {
    setSelectedRole("STUDENT");
    setEmail("student@sih.gov.in");
    setPassword("student123");
    setErrorMsg(null);
    setSubmitting(true);
    try {
      await loginWithEmail("student@sih.gov.in", "student123", "STUDENT");
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(
        err?.message?.replace("Firebase: ", "") || "Failed to sign in as student."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoOfficer = async () => {
    setSelectedRole("ADMIN");
    setEmail("admin@sih.gov.in");
    setPassword("admin123");
    setErrorMsg(null);
    setSubmitting(true);
    try {
      await loginWithEmail("admin@sih.gov.in", "admin123", "ADMIN");
      router.push("/admin-dashboard");
    } catch (err: any) {
      setErrorMsg(
        err?.message?.replace("Firebase: ", "") || "Failed to sign in as officer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-stone-900 p-8 sm:p-10 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl shadow-stone-200/50 dark:shadow-none">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 mb-1">
            {selectedRole === "ADMIN" ? (
              <Shield className="h-6 w-6" />
            ) : (
              <GraduationCap className="h-6 w-6" />
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Portal Authentication
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Sign in with email and password to access scholarship services
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex rounded-2xl bg-stone-100 dark:bg-stone-800 p-1 border border-stone-200/60 dark:border-stone-700/60">
          <button
            type="button"
            onClick={() => setSelectedRole("STUDENT")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
              selectedRole === "STUDENT"
                ? "bg-white dark:bg-stone-900 text-orange-600 shadow-xs"
                : "text-stone-500 hover:text-stone-900 dark:hover:text-white"
            }`}
          >
            <User className="h-4 w-4" />
            Tribal Student
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("ADMIN")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
              selectedRole === "ADMIN"
                ? "bg-white dark:bg-stone-900 text-orange-600 shadow-xs"
                : "text-stone-500 hover:text-stone-900 dark:hover:text-white"
            }`}
          >
            <Shield className="h-4 w-4" />
            Ministry Officer
          </button>
        </div>

        {/* 1-Click Demo Evaluation Credentials */}
        <div className="rounded-2xl border border-orange-200/80 dark:border-stone-800 bg-orange-50/60 dark:bg-stone-800/40 p-3.5 space-y-2 text-xs">
          <div className="font-bold text-orange-900 dark:text-orange-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
            <ShieldCheck className="h-3.5 w-3.5" /> 1-Click Demo Credentials
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoStudent}
              disabled={submitting}
              className="text-left p-2 rounded-xl bg-white dark:bg-stone-900 border border-orange-200/60 dark:border-stone-700 hover:border-orange-400 dark:hover:border-orange-500 transition-colors shadow-2xs"
            >
              <div className="font-bold text-stone-900 dark:text-white text-[11px]">
                Tribal Student
              </div>
              <div className="text-[10px] text-stone-500 truncate">
                student@sih.gov.in
              </div>
            </button>
            <button
              type="button"
              onClick={fillDemoOfficer}
              disabled={submitting}
              className="text-left p-2 rounded-xl bg-white dark:bg-stone-900 border border-orange-200/60 dark:border-stone-700 hover:border-orange-400 dark:hover:border-orange-500 transition-colors shadow-2xs"
            >
              <div className="font-bold text-stone-900 dark:text-white text-[11px]">
                Ministry Officer
              </div>
              <div className="text-[10px] text-stone-500 truncate">
                admin@sih.gov.in
              </div>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 p-3 text-xs text-red-600 dark:text-red-400">
            {errorMsg}
          </div>
        )}

        {/* Email & Password Sign In Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  selectedRole === "ADMIN" ? "admin@sih.gov.in" : "student@sih.gov.in"
                }
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setResetStatus(null);
                  setShowForgotModal(true);
                }}
                className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-600/25 hover:from-orange-500 hover:to-amber-500 transition-all disabled:opacity-60 cursor-pointer"
          >
            {submitting
              ? "Signing in..."
              : `Sign in as ${
                  selectedRole === "ADMIN" ? "Ministry Officer" : "Tribal Student"
                }`}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-center space-y-2 text-xs text-stone-500">
          <p>
            Need a student account?{" "}
            <Link
              href="/register?tab=register"
              className="font-bold text-orange-600 hover:text-orange-500"
            >
              Create account
            </Link>
          </p>
          <p className="text-[11px]">
            Protected by Firebase Authentication & Realtime Database
          </p>
        </div>
      </div>

      {/* Forgot Password / Password Recovery Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-2xl relative space-y-6">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600">
                <KeyRound className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                  Reset Password
                </h3>
                <p className="text-xs text-stone-500">
                  Send a secure password recovery link via Firebase
                </p>
              </div>
            </div>

            {resetStatus && (
              <div
                className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                  resetStatus.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300"
                    : "bg-red-50 dark:bg-red-950/40 border-red-200 text-red-800 dark:text-red-300"
                }`}
              >
                {resetStatus.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                )}
                <div className="flex-1 leading-relaxed">{resetStatus.message}</div>
              </div>
            )}

            <form onSubmit={handlePasswordRecovery} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="student@sih.gov.in or admin@sih.gov.in"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetSending}
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
                >
                  {resetSending ? "Sending link..." : "Send Recovery Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
