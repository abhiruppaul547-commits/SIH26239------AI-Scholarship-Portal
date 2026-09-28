"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Activity,
  PlusCircle,
  Database,
  Loader2,
} from "lucide-react";
import { authApi, applicationApi, scholarshipApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { getUserApplications, saveApplication } from "@/lib/databaseService";
import ApplicationTracker from "@/components/ApplicationTracker";
import { useLanguage, translateScheme, translateStatus } from "@/lib/i18n";

export default function StudentDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();

  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [firebaseApps, setFirebaseApps] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [backendHealth, setBackendHealth] = useState<{ status: string; url: string; checked: boolean }>({
    status: "checking",
    url: "",
    checked: false,
  });
  const [isSubmittingQuickApp, setIsSubmittingQuickApp] = useState(false);

  // Authentication protection: redirect if unauthenticated
  useEffect(() => {
    if (!authLoading) {
      const localUser = authApi.getCurrentUser();
      if (!user && !localUser) {
        router.push("/login");
      }
    }
  }, [user, authLoading, router]);

  // Load dashboard data and backend health
  useEffect(() => {
    checkBackendHealth();
    loadDashboardData();
  }, [user]);

  const checkBackendHealth = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://election-lushness-pointed.ngrok-free.dev";
    try {
      const res = await fetch(`${backendUrl}/api/core/health`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setBackendHealth({ status: data.status || "ok", url: backendUrl, checked: true });
      } else {
        setBackendHealth({ status: "unavailable", url: backendUrl, checked: true });
      }
    } catch (e) {
      setBackendHealth({ status: "offline", url: backendUrl, checked: true });
    }
  };

  const loadDashboardData = async () => {
    try {
      const localUser = authApi.getCurrentUser();
      const realName =
        user?.displayName && user.displayName.trim() && user.displayName !== "Birsa Soren"
          ? user.displayName
          : localUser?.fullName && localUser.fullName.trim() && localUser.fullName !== "Birsa Soren"
          ? localUser.fullName
          : user?.email
          ? user.email.split("@")[0]
          : localUser?.email
          ? localUser.email.split("@")[0]
          : "Student";

      const realEmail = user?.email || localUser?.email || "student@sih.gov.in";

      const prof = await authApi
        .getProfile()
        .then((p) => ({
          ...p,
          fullName: p.fullName && p.fullName !== "Birsa Soren" ? p.fullName : realName,
          email: p.email || realEmail,
        }))
        .catch(() => ({
          fullName: realName,
          email: realEmail,
          category: localUser?.category || "ST",
          tribeName: localUser?.tribeName || "Santhal",
          annualFamilyIncome: localUser?.annualFamilyIncome || 120000,
          institutionName: localUser?.institutionName || "NIT Jamshedpur",
          course: localUser?.course || "B.Tech Computer Science",
          isCasteVerified: true,
          isIncomeVerified: true,
        }));
      setProfile(prof);

      // Load traditional core applications
      const apps = await applicationApi.getMyApplications().catch(() => [
        {
          id: 1,
          applicationNumber: "SIH-849120-ST01",
          scholarshipTitle: "National Fellowship and Scholarship for Higher Education of ST Students",
          scholarshipAmount: 28000,
          status: "VERIFIED",
          appliedAt: new Date().toISOString(),
          ocrConfidenceScore: 0.965,
          ocrVerified: true,
          remarks: "Initial automated OCR cross-checked with State Tribal Database. Santhal ST verified.",
        },
      ]);
      setApplications(apps);

      // Load Firebase Realtime Database applications if user is logged in
      const effectiveUid = user?.uid || localUser?.id || "demo-student-uid";
      try {
        const rtdbApps = await getUserApplications(effectiveUid);
        setFirebaseApps(rtdbApps);
      } catch (err) {
        console.warn("Could not fetch RTDB applications:", err);
      }

      // Load Recommendations
      const recData = await scholarshipApi.getRecommended().catch(() => ({
        recommendations: [
          {
            schemeId: 1,
            title: "National Fellowship and Scholarship for Higher Education of ST Students",
            matchScore: 98.5,
            matchReason: "Matches ST category requirement & family income (₹1.2L) well below ₹6.0L ceiling",
            scholarshipAmount: 28000,
            category: "Higher Education",
          },
          {
            schemeId: 2,
            title: "Post-Matric Scholarship for Scheduled Tribe (ST) Students",
            matchScore: 93.0,
            matchReason: "Fully eligible for post-secondary maintenance stipend and complete fee waiver",
            scholarshipAmount: 15000,
            category: "Post-Matric",
          },
          {
            schemeId: 3,
            title: "Top Class Education Scheme for ST Students",
            matchScore: 89.0,
            matchReason: "Applicable for premier engineering and technology institutes",
            scholarshipAmount: 85000,
            category: "Top Class",
          },
        ],
      }));

      if (recData && recData.recommendations) {
        setRecommendations(recData.recommendations);
      }
    } catch {}
  };

  const handleQuickFirebaseApply = async (scheme: any) => {
    const effectiveUid = user?.uid || authApi.getCurrentUser()?.id || "demo-student-uid";
    setIsSubmittingQuickApp(true);
    try {
      await saveApplication(effectiveUid, {
        scholarshipId: scheme.schemeId || 1,
        scholarshipTitle: scheme.title || "National Fellowship for ST Students",
        scholarshipAmount: scheme.scholarshipAmount || 28000,
        studentName: profile?.fullName || user?.displayName || user?.email?.split("@")[0] || "Student",
        email: user?.email || "student@sih.gov.in",
        category: profile?.category || "ST",
        annualIncome: profile?.annualFamilyIncome || 120000,
        status: "SUBMITTED_TO_FIREBASE",
      });
      // Refresh RTDB applications
      const updated = await getUserApplications(effectiveUid);
      setFirebaseApps(updated);
    } catch (err: any) {
      alert("Failed to save application to Firebase: " + err.message);
    } finally {
      setIsSubmittingQuickApp(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        <p className="text-xs text-stone-500 font-medium">Loading beneficiary portal...</p>
      </div>
    );
  }

  const allAppsCount = applications.length + firebaseApps.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-600 dark:text-orange-400">
            <Sparkles className="h-3.5 w-3.5" /> Direct Beneficiary Dashboard
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            {t("dashboardGreeting")}, {profile?.fullName || user?.displayName || user?.email?.split("@")[0] || "Student"}!
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {t("dashboardSub")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Ngrok Backend Health Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs shadow-2xs">
            <Activity className="h-3.5 w-3.5 text-stone-400" />
            <span className="text-[11px] font-semibold text-stone-500">Core Gateway:</span>
            {backendHealth.status === "ok" ? (
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Connected
              </span>
            ) : backendHealth.status === "checking" ? (
              <span className="text-stone-400 text-[11px]">Pinging...</span>
            ) : (
              <span className="inline-flex items-center gap-1 font-bold text-amber-600 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Offline / Standby
              </span>
            )}
          </div>

          <Link
            href="/apply"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-600/25 hover:from-orange-500 hover:to-amber-500 transition-all"
          >
            <FileText className="h-4 w-4" /> {t("applyNewScheme")}
          </Link>
        </div>
      </div>

      {/* Profile & Verification Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Verification 1 */}
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>{t("casteVerif")}</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-lg font-black text-stone-900 dark:text-white">
            {profile?.category || "ST"} • {profile?.tribeName || "Santhal"}
          </div>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-[11px] font-bold">
            <CheckCircle2 className="h-3 w-3" /> {t("ocrSuccessBadge")}
          </div>
        </div>

        {/* Verification 2 */}
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>{t("incomeCeiling")}</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-lg font-black text-stone-900 dark:text-white">
            ₹{profile?.annualFamilyIncome ? Number(profile.annualFamilyIncome).toLocaleString() : "1,20,000"} {t("perYear")}
          </div>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-[11px] font-bold">
            <CheckCircle2 className="h-3 w-3" /> {t("withinLimits")}
          </div>
        </div>

        {/* Institute */}
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>{t("institutionName").replace("*", "")}</span>
            <GraduationCap className="h-4 w-4 text-orange-600" />
          </div>
          <div className="text-sm font-bold text-stone-900 dark:text-white truncate">
            {profile?.institutionName || "NIT Jamshedpur"}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 truncate">
            {profile?.course || "B.Tech Computer Science"}
          </div>
        </div>

        {/* Total Active Applications */}
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>{t("activeApps")}</span>
            <Clock className="h-4 w-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-orange-600">
            {allAppsCount}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {firebaseApps.length} in Firebase RTDB
          </div>
        </div>
      </div>

      {/* Smart Recommendations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-600" />
              {t("recommendationsTitle")}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {t("recommendationsSub")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rawRec, idx) => {
            const rec = translateScheme(rawRec, language);
            return (
              <div
                key={idx}
                className="rounded-3xl border border-orange-200/80 dark:border-stone-800 bg-gradient-to-b from-orange-50/40 via-white to-white dark:from-stone-900 dark:to-stone-900 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-orange-400 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 text-xs font-bold">
                      <Sparkles className="h-3 w-3" /> {rec.matchScore}% {t("matchLabel")}
                    </span>
                    <span className="text-xs font-bold text-orange-600">
                      ₹{rec.scholarshipAmount?.toLocaleString()} {t("perYear")}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 dark:text-white leading-snug">
                    {rec.title}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {rec.matchReason}
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href={`/apply?schemeId=${rec.schemeId}`}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 text-white font-bold py-2 text-xs hover:bg-orange-500 transition-colors shadow-xs"
                  >
                    {t("navApply")} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleQuickFirebaseApply(rec)}
                    disabled={isSubmittingQuickApp}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-stone-700 dark:text-stone-200 font-semibold py-1.5 text-[11px] hover:bg-stone-100 transition-colors disabled:opacity-50"
                  >
                    <Database className="h-3 w-3 text-amber-500" />
                    <span>Save to Firebase RTDB</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Firebase RTDB Applications Section */}
      {firebaseApps.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-amber-500" />
                Firebase Realtime Database Submissions
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Cloud synced records persisted at path <code className="font-mono bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded text-[11px]">applications/{user?.uid || "user"}/*</code>
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-xs font-bold">
              {firebaseApps.length} Synced
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {firebaseApps.map((fApp) => (
              <div
                key={fApp.id}
                className="p-5 rounded-2xl border border-amber-200/80 dark:border-stone-800 bg-amber-50/20 dark:bg-stone-900/60 shadow-xs flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                    <span>ID: {fApp.id}</span>
                    <span className="font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      {fApp.status || "SAVED"}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-white mt-1">
                    {fApp.scholarshipTitle || "ST Scholarship Application"}
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-stone-600 dark:text-stone-400">
                    <span>Beneficiary: <strong className="text-stone-800 dark:text-stone-200">{fApp.studentName}</strong></span>
                    <span>•</span>
                    <span>Category: <strong>{fApp.category || "ST"}</strong></span>
                    <span>•</span>
                    <span>Amount: <strong>₹{Number(fApp.scholarshipAmount || 28000).toLocaleString()}</strong></span>
                  </div>
                </div>
                <div className="text-[10px] text-stone-400 border-t border-stone-200/60 dark:border-stone-800/80 pt-2 flex items-center justify-between">
                  <span>Synced via Firebase SDK</span>
                  <span>{fApp.submittedAt ? new Date(fApp.submittedAt).toLocaleTimeString() : "Live"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Central Portal Applications Section with Status Tracker */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-600" />
            {t("myAppsTitle")}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {t("myAppsSub")}
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 p-12 text-center space-y-3">
            <FileText className="h-10 w-10 text-stone-400 mx-auto" />
            <h3 className="font-bold text-stone-800 dark:text-stone-200 text-sm">No applications submitted yet</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Use our auto-fill feature to submit your ST scholarship application in less than 2 minutes.
            </p>
            <Link
              href="/apply"
              className="inline-block rounded-xl bg-orange-600 text-white text-xs font-bold px-4 py-2 hover:bg-orange-500"
            >
              {t("navApply")}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((rawApp) => {
              const app = translateScheme(rawApp, language);
              return (
                <div
                  key={app.id}
                  className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
                    <div>
                      <div className="text-[11px] font-mono text-stone-400 uppercase">
                        {t("appId")}: {app.applicationNumber}
                      </div>
                      <h3 className="text-base font-bold text-stone-900 dark:text-white mt-0.5">
                        {app.scholarshipTitle || app.title}
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-stone-900 dark:text-white">
                        {t("sanctionVal")}: ₹{app.scholarshipAmount?.toLocaleString() || "28,000"}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {t("ocrConfidence")}: {((app.ocrConfidenceScore || 0.95) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <ApplicationTracker
                    status={app.status || "VERIFIED"}
                    ocrVerified={app.ocrVerified ?? true}
                    remarks={app.remarks}
                    appliedDate={app.appliedAt}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
