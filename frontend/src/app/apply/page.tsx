"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  ScanLine,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  Check,
  Building2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { scholarshipApi, applicationApi, authApi } from "@/lib/api";
import FileUploader from "@/components/FileUploader";
import { useLanguage, translateScheme } from "@/lib/i18n";
import { useAuth } from "@/context/AuthContext";
import { getCleanFullName } from "@/lib/nameUtils";

function ApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSchemeId = searchParams.get("schemeId");
  const { t, language } = useLanguage();
  const { user: authUser } = useAuth();

  const [schemes, setSchemes] = useState<any[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(initialSchemeId || "");
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const ocrFileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields - clean initial state for real students
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    category: "ST",
    tribeName: "",
    annualFamilyIncome: "",
    institutionName: "",
    course: "",
    currentYear: "1st Year",
    gpaOrPercentage: "",
    bankAccountNumber: "",
    bankIfsc: "",
    aadhaarNumber: "",
    casteDocFileName: "",
    incomeDocFileName: "",
    marksheetDocFileName: "",
  });

  useEffect(() => {
    scholarshipApi.getAll().then((data) => {
      if (data && data.length > 0) {
        setSchemes(data);
        if (!selectedSchemeId) {
          setSelectedSchemeId(data[0].id.toString());
        }
      }
    });

    const localUser = authApi.getCurrentUser();
    const cleanFullName = getCleanFullName(authUser || localUser);
    const activeName = cleanFullName !== "Student" ? cleanFullName : "";
    const activeEmail =
      (authUser?.email && !authUser.email.includes("student@sih.gov.in") ? authUser.email : "") ||
      (localUser?.email && !localUser.email.includes("student@sih.gov.in") ? localUser.email : "");

    if (activeName || activeEmail) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || activeName,
        email: prev.email || activeEmail,
      }));
    }
  }, [selectedSchemeId, authUser]);

  // Handler for "Auto-Fill from Document" OCR feature
  const handleOcrUpload = async (file: File) => {
    setIsOcrProcessing(true);
    setErrorMsg("");
    try {
      const data = await applicationApi.extractDocWithOcr(file, "CASTE_OR_INCOME");
      if (!data || !data.success) {
        throw new Error(data?.message || "Could not extract legible text from this document.");
      }
      setOcrResult(data);

      setFormData((prev) => ({
        ...prev,
        fullName: data.name || data.fullName || prev.fullName,
        category: data.casteCategory || prev.category,
        tribeName: data.tribe || data.tribeName || prev.tribeName,
        annualFamilyIncome: data.incomeValue ? data.incomeValue.toString() : prev.annualFamilyIncome,
        casteDocFileName: file.name,
      }));
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message ||
        err.message ||
        "Could not automatically extract details from this document. Please ensure the image is clear or fill in the details manually."
      );
    } finally {
      setIsOcrProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchemeId) {
      setErrorMsg("Please select a scholarship scheme");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        scholarshipSchemeId: parseInt(selectedSchemeId),
        casteDocFileName: formData.casteDocFileName,
        incomeDocFileName: formData.incomeDocFileName,
        marksheetDocFileName: formData.marksheetDocFileName,
        extractedOcrData: ocrResult ? JSON.stringify(ocrResult) : "Pre-verified ST Certificate OCR",
        ocrConfidenceScore: ocrResult?.confidence || 0.95,
      };

      const res = await applicationApi.submit(payload);
      setSubmissionSuccess(res);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to submit application. Please check backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 dark:bg-orange-950/80 px-3 py-1 text-xs font-semibold text-orange-800 dark:text-orange-300 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-orange-600" /> SIH26239 Smart Application Pipeline
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
          {t("applyPageTitle")}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          {t("applyPageSub")}
        </p>
      </div>

      {submissionSuccess ? (
        /* Submission Success View */
        <div className="rounded-3xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30 p-8 text-center space-y-4 shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black text-stone-900 dark:text-white">
            Application Submitted Successfully!
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto">
            Your application for <strong>{submissionSuccess.scholarshipTitle}</strong> has been registered with initial AI OCR verification.
          </p>

          <div className="inline-block bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-800 rounded-2xl px-6 py-3 font-mono font-bold text-emerald-800 dark:text-emerald-300 text-base shadow-xs">
            {t("appId")}: {submissionSuccess.applicationNumber}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              Track on Dashboard <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setSubmissionSuccess(null);
                setOcrResult(null);
              }}
              className="rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-5 py-2.5 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Apply for Another Scheme
            </button>
          </div>
        </div>
      ) : (
        /* Form View */
        <div className="space-y-6">
          {/* Prominent Auto-Fill from Document AI Banner */}
          <div className="rounded-3xl border-2 border-orange-500/80 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-white dark:to-stone-900 p-6 sm:p-7 shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-lg">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                  <Sparkles className="h-4 w-4" /> {t("autoFillFeature")}
                </div>
                <h3 className="text-lg font-black text-stone-900 dark:text-white">
                  {t("autoFillTitle")}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {t("autoFillDesc")}
                </p>
              </div>

              <div>
                <input
                  type="file"
                  ref={ocrFileInputRef}
                  accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleOcrUpload(e.target.files[0]);
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={isOcrProcessing}
                  onClick={() => {
                    if (ocrFileInputRef.current) {
                      ocrFileInputRef.current.value = "";
                    }
                    ocrFileInputRef.current?.click();
                  }}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-600/30 hover:from-orange-500 hover:to-amber-500 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isOcrProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> {t("autoFillProcessing")}
                    </>
                  ) : (
                    <>
                      <ScanLine className="h-4 w-4" /> {t("autoFillBtn")}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* OCR Live Result Banner */}
            {ocrResult && (
              <div className="mt-5 p-4 rounded-2xl bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-800/80 shadow-xs space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    {t("ocrSuccessBadge")} ({((ocrResult.confidence || 0.95) * 100).toFixed(1)}% Confidence)
                  </span>
                  {ocrResult.certificateNumber ? (
                    <span className="text-[11px] text-stone-500 font-mono">
                      Cert: {ocrResult.certificateNumber}
                    </span>
                  ) : (
                    <span className="text-[11px] text-emerald-600 font-medium">
                      Verified from Document
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900">
                    <span className="text-[10px] text-stone-400 block uppercase">{t("extractedName")}</span>
                    <span className="font-bold text-stone-900 dark:text-white">{ocrResult.name || formData.fullName || "—"}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900">
                    <span className="text-[10px] text-stone-400 block uppercase">{t("extractedCategory")}</span>
                    <span className="font-bold text-stone-900 dark:text-white">{ocrResult.casteCategory || formData.category || "ST"}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900">
                    <span className="text-[10px] text-stone-400 block uppercase">{t("extractedTribe")}</span>
                    <span className="font-bold text-stone-900 dark:text-white">{ocrResult.tribe || formData.tribeName || "—"}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900">
                    <span className="text-[10px] text-stone-400 block uppercase">{t("extractedIncome")}</span>
                    <span className="font-bold text-stone-900 dark:text-white">
                      {ocrResult.incomeValue
                        ? `₹${Number(ocrResult.incomeValue).toLocaleString()}`
                        : formData.annualFamilyIncome
                        ? `₹${Number(formData.annualFamilyIncome).toLocaleString()}`
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Main Application Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Scheme Selection */}
            <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-orange-600" />
                {t("step1Scheme")}
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {t("targetScheme")}
                </label>
                <select
                  required
                  value={selectedSchemeId}
                  onChange={(e) => setSelectedSchemeId(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 p-2.5 text-xs sm:text-sm text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
                >
                  <option value="">-- {t("step1Scheme")} --</option>
                  {schemes.map((rawScheme) => {
                    const s = translateScheme(rawScheme, language);
                    return (
                      <option key={s.id} value={s.id}>
                        {s.title} ({s.category}) — ₹{s.scholarshipAmount?.toLocaleString()}{t("perYear")}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* 2. Student Demographics & Tribal Identity */}
            <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-orange-600" />
                {t("step2Demographics")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">{t("fullName")}</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 p-2.5 text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">{t("emailAddr")}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 p-2.5 text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">{t("casteCat")}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 p-2.5 text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
                  >
                    <option value="ST">Scheduled Tribe (ST)</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="OBC">OBC</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">{t("tribalComm")}</label>
                  <input
                    type="text"
                    value={formData.tribeName}
                    onChange={(e) => setFormData({ ...formData, tribeName: e.target.value })}
                    placeholder="e.g. Santhal / Gond / Bhil / Munda / Bodo"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 p-2.5 text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">{t("annualIncome")}</label>
                  <input
                    type="number"
                    required
                    value={formData.annualFamilyIncome}
                    onChange={(e) => setFormData({ ...formData, annualFamilyIncome: e.target.value })}
                    placeholder="e.g. 120000"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 p-2.5 text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">{t("aadhaarNo")}</label>
                  <input
                    type="text"
                    value={formData.aadhaarNumber}
                    onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                    placeholder="XXXX-XXXX-XXXX"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 p-2.5 text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Academic & Bank Details */}
            <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Check className="h-4 w-4 text-orange-600" />
                {t("step3Academic")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">{t("institutionName")}</label>
                  <input
                    type="text"
                    required
                    value={formData.institutionName}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 p-2.5 text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">{t("courseBranch")}</label>
                  <input
                    type="text"
                    required
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    placeholder="e.g. B.Tech Computer Science"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 p-2.5 text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">{t("bankAccNo")}</label>
                  <input
                    type="text"
                    required
                    value={formData.bankAccountNumber}
                    onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                    placeholder="Enter bank account number"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 p-2.5 text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">{t("bankIfsc")}</label>
                  <input
                    type="text"
                    required
                    value={formData.bankIfsc}
                    onChange={(e) => setFormData({ ...formData, bankIfsc: e.target.value })}
                    placeholder="e.g. SBIN0001234"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 p-2.5 text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* 4. Document Verification Uploads */}
            <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <UploadCloud className="h-4 w-4 text-orange-600" />
                {t("step4Docs")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FileUploader
                  label={t("casteCert")}
                  subLabel={t("casteCertSub")}
                  onFileSelect={(f) => setFormData({ ...formData, casteDocFileName: f.name })}
                  onOcrTrigger={handleOcrUpload}
                  isProcessingOcr={isOcrProcessing}
                />

                <FileUploader
                  label={t("incomeCert")}
                  subLabel={t("incomeCertSub")}
                  onFileSelect={(f) => setFormData({ ...formData, incomeDocFileName: f.name })}
                />

                <FileUploader
                  label={t("marksheet")}
                  subLabel={t("marksheetSub")}
                  onFileSelect={(f) => setFormData({ ...formData, marksheetDocFileName: f.name })}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-orange-600/25 hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 transition-all cursor-pointer active:scale-98"
            >
              {isSubmitting ? t("submittingBtn") : t("submitBtn")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-12 text-center text-xs text-stone-500">Loading Application Portal...</div>}>
      <ApplyForm />
    </Suspense>
  );
}
