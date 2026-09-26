"use client";

import { CheckCircle2, Clock, FileCheck, XCircle, AlertCircle } from "lucide-react";

interface ApplicationTrackerProps {
  status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "VERIFIED" | "APPROVED" | "REJECTED";
  ocrVerified?: boolean;
  remarks?: string;
  appliedDate?: string;
}

export default function ApplicationTracker({
  status,
  ocrVerified = true,
  remarks,
  appliedDate,
}: ApplicationTrackerProps) {
  const steps = [
    {
      id: "SUBMITTED",
      label: "Application Submitted",
      description: appliedDate ? `Logged on ${new Date(appliedDate).toLocaleDateString()}` : "Form received in portal",
    },
    {
      id: "VERIFIED",
      label: "AI OCR Verification",
      description: ocrVerified ? "Caste & Income Certificates Verified" : "Awaiting OCR scan",
    },
    {
      id: "UNDER_REVIEW",
      label: "Institutional Scrutiny",
      description: "Tribal Welfare Officer review",
    },
    {
      id: "APPROVED",
      label: "Approval & DBT Sanction",
      description: "Direct Benefit Transfer to bank",
    },
  ];

  const getStepStatus = (stepId: string) => {
    if (status === "REJECTED") {
      if (stepId === "APPROVED") return "rejected";
    }

    const order = ["SUBMITTED", "VERIFIED", "UNDER_REVIEW", "APPROVED"];
    const currentIndex = order.indexOf(status === "REJECTED" ? "UNDER_REVIEW" : status);
    const stepIndex = order.indexOf(stepId);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  return (
    <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-stone-800 pb-4 mb-5">
        <div>
          <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-orange-600" />
            Live Application Status Tracker
          </h4>
          <p className="text-xs text-stone-500 mt-0.5">Automated end-to-end pipeline tracking</p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            status === "APPROVED"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              : status === "REJECTED"
              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
              : status === "VERIFIED"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
          }`}
        >
          {status === "APPROVED" && <CheckCircle2 className="h-3.5 w-3.5" />}
          {status === "REJECTED" && <XCircle className="h-3.5 w-3.5" />}
          {(status === "SUBMITTED" || status === "UNDER_REVIEW") && <Clock className="h-3.5 w-3.5 animate-spin" />}
          {status}
        </span>
      </div>

      {/* Steps visual */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const stepStatus = getStepStatus(step.id);
          return (
            <div key={step.id} className="flex md:flex-col items-start gap-3 relative">
              {/* Connector line on Desktop */}
              {idx < steps.length - 1 && (
                <div
                  className={`hidden md:block absolute top-4 left-8 right-0 h-0.5 -z-0 ${
                    stepStatus === "completed" ? "bg-orange-500" : "bg-stone-200 dark:bg-stone-800"
                  }`}
                />
              )}

              {/* Step indicator node */}
              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  stepStatus === "completed"
                    ? "bg-orange-600 text-white shadow-md shadow-orange-500/20"
                    : stepStatus === "current"
                    ? "bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950"
                    : stepStatus === "rejected"
                    ? "bg-rose-600 text-white"
                    : "bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-300 dark:border-stone-700"
                }`}
              >
                {stepStatus === "completed" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : stepStatus === "rejected" ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  idx + 1
                )}
              </div>

              {/* Step details */}
              <div className="pt-0.5">
                <div
                  className={`text-xs font-bold ${
                    stepStatus === "current" || stepStatus === "completed"
                      ? "text-stone-900 dark:text-white"
                      : "text-stone-400"
                  }`}
                >
                  {step.label}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {remarks && (
        <div className="mt-4 p-3 rounded-xl bg-orange-50 dark:bg-stone-800/60 border border-orange-200/60 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-stone-900 dark:text-white">Officer Remarks: </span>
            {remarks}
          </div>
        </div>
      )}
    </div>
  );
}
