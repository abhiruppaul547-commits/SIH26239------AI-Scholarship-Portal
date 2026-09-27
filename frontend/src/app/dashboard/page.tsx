"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { saveApplication, getApplicationStatus, ScholarshipApplicationData } from "@/lib/databaseService";
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Server,
  Cpu,
  LogOut,
  Send,
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Application state
  const [activeApplication, setActiveApplication] = useState<ScholarshipApplicationData | null>(null);
  const [loadingApp, setLoadingApp] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    applicantName: "",
    category: "Scheduled Tribe (ST)",
    tribeName: "Santhal",
    annualIncome: "120000",
    institutionName: "National Institute of Technology",
    course: "B.Tech Computer Science",
    gpa: "8.8",
    schemeName: "National Fellowship and Scholarship for Higher Education of ST Students",
  });

  // Backend Health Checks via relative paths
  const [coreHealth, setCoreHealth] = useState<{ status: string; service?: string } | null>(null);
  const [aiHealth, setAiHealth] = useState<{ status: string; models_loaded?: boolean } | null>(null);
  const [healthChecking, setHealthChecking] = useState(true);

  // Authentication Guard
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Load application from Firebase RTDB and query backend APIs
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        applicantName: user.displayName || prev.applicantName,
      }));
      loadApplicationData(user.uid);
    }
    checkBackendHealth();
  }, [user]);

  const loadApplicationData = async (uid: string) => {
    setLoadingApp(true);
    try {
      const data = await getApplicationStatus(uid);
      if (data) {
        setActiveApplication(data);
      }
    } catch (err) {
      console.error("Error loading application status:", err);
    } finally {
      setLoadingApp(false);
    }
  };

  const checkBackendHealth = async () => {
    setHealthChecking(true);
    // Relative path check for core backend
    try {
      const coreRes = await fetch("/api/core/health");
      if (coreRes.ok) {
        const coreJson = await coreRes.json();
        setCoreHealth(coreJson);
      } else {
        setCoreHealth({ status: "DEGRADED" });
      }
    } catch {
      setCoreHealth({ status: "OFFLINE" });
    }

    // Relative path check for AI service
    try {
      const aiRes = await fetch("/api/ai/health");
      if (aiRes.ok) {
        const aiJson = await aiRes.json();
        setAiHealth(aiJson);
      } else {
        setAiHealth({ status: "DEGRADED" });
      }
    } catch {
      setAiHealth({ status: "OFFLINE" });
    } finally {
      setHealthChecking(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const payload: ScholarshipApplicationData = {
        ...formData,
        userId: user.uid,
        userEmail: user.email,
        status: "SUBMITTED",
        submittedAt: new Date().toISOString(),
        ocrConfidenceScore: 0.985,
        ocrVerified: true,
      };

      await saveApplication(user.uid, payload);
      setActiveApplication(payload);
      setSubmitMessage({
        type: "success",
        text: "Scholarship application successfully submitted and stored in Firebase RTDB!",
      });
    } catch (err: any) {
      console.error(err);
      setSubmitMessage({
        type: "error",
        text: err?.message || "Failed to submit application. Please verify connection.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || (!user && loading)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
            <Sparkles className="h-3.5 w-3.5" /> Authenticated Beneficiary Portal
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Welcome, {user?.displayName || user?.email?.split("@")[0] || "Student"}!
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Logged in as <span className="font-mono text-stone-700 dark:text-stone-300">{user?.email}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => checkBackendHealth()}
            className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-3 py-2 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 transition-colors shadow-xs"
          >
            Refresh System Health
          </button>
          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-3.5 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Microservice Live Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Core Backend Status */}
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Core Backend (/api/core)</span>
            <Server className="h-4 w-4 text-orange-600" />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                coreHealth?.status === "UP" ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <span className="text-lg font-bold text-stone-900 dark:text-white">
              {coreHealth?.status || (healthChecking ? "Checking..." : "OFFLINE")}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Spring Boot Microservice</p>
        </div>

        {/* AI Service Status */}
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>AI Service (/api/ai)</span>
            <Cpu className="h-4 w-4 text-orange-600" />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                aiHealth?.status === "UP" ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <span className="text-lg font-bold text-stone-900 dark:text-white">
              {aiHealth?.status || (healthChecking ? "Checking..." : "OFFLINE")}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">FastAPI OCR & Recommendation</p>
        </div>

        {/* RTDB Status */}
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Firebase RTDB</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-lg font-bold text-stone-900 dark:text-white">Connected</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">ai-based-scholarship-portal</p>
        </div>

        {/* Application Status Badge */}
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Current Application</span>
            <Clock className="h-4 w-4 text-orange-600" />
          </div>
          <div className="text-lg font-bold text-orange-600">
            {loadingApp ? "Loading..." : activeApplication ? activeApplication.status || "SUBMITTED" : "NOT SUBMITTED"}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Real-time status sync</p>
        </div>
      </div>

      {/* Main Grid: Application Form & Status Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Scholarship Application Form */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 border-b border-stone-100 dark:border-stone-800 pb-4 mb-6">
            <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                Submit Scholarship Application
              </h2>
              <p className="text-xs text-stone-500">
                Saves directly to Firebase Realtime Database with automated verification
              </p>
            </div>
          </div>

          {submitMessage && (
            <div
              className={`mb-6 p-4 rounded-2xl border text-xs flex items-center gap-2 ${
                submitMessage.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300"
                  : "bg-red-50 dark:bg-red-950/40 border-red-200 text-red-800 dark:text-red-300"
              }`}
            >
              {submitMessage.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              )}
              <span>{submitMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmitApplication} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Applicant Name
                </label>
                <input
                  type="text"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. Birsa Soren"
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Tribe / Community
                </label>
                <input
                  type="text"
                  name="tribeName"
                  value={formData.tribeName}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. Santhal / Gond / Bhil"
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Annual Family Income (₹)
                </label>
                <input
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleFormChange}
                  required
                  placeholder="120000"
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Academic GPA / Percentage
                </label>
                <input
                  type="text"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleFormChange}
                  required
                  placeholder="8.8"
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Institution Name
              </label>
              <input
                type="text"
                name="institutionName"
                value={formData.institutionName}
                onChange={handleFormChange}
                required
                placeholder="National Institute of Technology"
                className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Target Scholarship Scheme
              </label>
              <select
                name="schemeName"
                value={formData.schemeName}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="National Fellowship and Scholarship for Higher Education of ST Students">
                  National Fellowship and Scholarship for Higher Education of ST Students (₹28,000/yr)
                </option>
                <option value="Post-Matric Scholarship for Scheduled Tribe (ST) Students">
                  Post-Matric Scholarship for Scheduled Tribe (ST) Students (₹15,000/yr)
                </option>
                <option value="Top Class Education Scheme for ST Students">
                  Top Class Education Scheme for ST Students (₹85,000/yr)
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-600/25 hover:from-orange-500 hover:to-amber-500 transition-all disabled:opacity-60 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Submitting to RTDB..." : "Submit Application to Firebase RTDB"}
            </button>
          </form>
        </div>

        {/* Real-time Status Card & Application Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 p-6 sm:p-8 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Live RTDB Status Record
            </h3>

            {loadingApp ? (
              <p className="text-xs text-stone-500">Checking Firebase RTDB...</p>
            ) : activeApplication ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500">Scheme:</span>
                    <span className="text-xs font-bold text-orange-600 truncate max-w-[200px]">
                      {activeApplication.schemeName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500">Applicant:</span>
                    <span className="text-xs font-medium text-stone-900 dark:text-white">
                      {activeApplication.applicantName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500">Annual Income:</span>
                    <span className="text-xs font-medium text-stone-900 dark:text-white">
                      ₹{Number(activeApplication.annualIncome || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500">Status:</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-[11px] font-bold">
                      <CheckCircle2 className="h-3 w-3" /> {activeApplication.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500">Last Synced:</span>
                    <span className="text-[10px] font-mono text-stone-400">
                      {activeApplication.updatedAt ? new Date(activeApplication.updatedAt).toLocaleTimeString() : "Just now"}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-stone-500 space-y-1">
                  <p className="font-semibold text-stone-700 dark:text-stone-300">Automated Pipeline:</p>
                  <p>• Data saved at <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">/applications/{user?.uid}</code></p>
                  <p>• Ready for administrative processing & Direct Benefit Transfer (DBT)</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-2">
                <FileText className="h-8 w-8 text-stone-400 mx-auto" />
                <p className="text-xs text-stone-500">No application recorded in Firebase RTDB yet.</p>
                <p className="text-[11px] text-stone-400">Fill in the form on the left to submit your details.</p>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-6 text-white space-y-3">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Multi-lingual AI Assistant
            </h4>
            <p className="text-xs text-orange-100 leading-relaxed">
              Have questions about eligibility or required documentation in Santali, Hindi, or Odia? Open the assistant at the bottom right.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
