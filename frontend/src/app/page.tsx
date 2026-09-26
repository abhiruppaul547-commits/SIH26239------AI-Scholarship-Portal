"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ScanLine,
  Bot,
  Compass,
  CheckCircle2,
  Calendar,
  Building2,
  Award,
  Layers,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { scholarshipApi } from "@/lib/api";

export default function Home() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    scholarshipApi
      .getAll()
      .then((data) => {
        if (data && data.length > 0) {
          setSchemes(data);
        } else {
          setFallbackSchemes();
        }
      })
      .catch(() => {
        setFallbackSchemes();
      })
      .finally(() => setLoading(false));
  }, []);

  const setFallbackSchemes = () => {
    setSchemes([
      {
        id: 1,
        title: "National Fellowship and Scholarship for Higher Education of ST Students",
        category: "Higher Education",
        provider: "Ministry of Tribal Affairs",
        scholarshipAmount: 28000,
        maxIncomeLimit: 600000,
        deadline: "2026-11-30",
        description: "Full financial coverage including living allowance and tuition for ST candidates pursuing M.Phil, Ph.D, and Master's courses.",
      },
      {
        id: 2,
        title: "Post-Matric Scholarship for Scheduled Tribe (ST) Students",
        category: "Post-Matric",
        provider: "State Tribal Welfare Departments",
        scholarshipAmount: 15000,
        maxIncomeLimit: 250000,
        deadline: "2026-10-31",
        description: "Tuition allowance and monthly stipend for tribal students pursuing class 11, 12, ITI, Polytechnic, and Bachelor's degrees.",
      },
      {
        id: 3,
        title: "Top Class Education for Scheduled Tribe Students",
        category: "Top Class",
        provider: "Ministry of Tribal Affairs",
        scholarshipAmount: 85000,
        maxIncomeLimit: 600000,
        deadline: "2026-12-15",
        description: "Full fee coverage and laptop grant for ST scholars in premier institutes like IITs, IIMs, NITs, and AIIMS.",
      },
    ]);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent pt-12 pb-20 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-100/60 dark:bg-orange-950/60 dark:border-orange-800 px-3.5 py-1 text-xs font-semibold text-orange-900 dark:text-orange-300">
                <Sparkles className="h-3.5 w-3.5 text-orange-600" />
                Smart India Hackathon • Problem Statement SIH26239
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 dark:text-white leading-[1.15]">
                AI-Enabled Scholarship Portal for{" "}
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 bg-clip-text text-transparent">
                  Tribal Students
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
                Empowering India’s tribal youth with an accessible, barrier-free scholarship experience.
                Featuring automated <strong>Certificate OCR</strong> for instant auto-fill, an intelligent{" "}
                <strong>Eligibility Engine</strong>, and multi-lingual <strong>Vernacular AI Guidance</strong>.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/apply"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-600/25 hover:from-orange-500 hover:to-amber-500 active:scale-95 transition-all"
                >
                  <ScanLine className="h-4 w-4" />
                  Auto-Fill Application with OCR
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-6 py-3.5 text-sm font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 active:scale-95 transition-all"
                >
                  <Compass className="h-4 w-4 text-orange-600" />
                  Explore AI Recommendations
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200/80 dark:border-stone-800 text-xs">
                <div>
                  <div className="font-extrabold text-lg text-orange-600">100%</div>
                  <div className="text-stone-500 font-medium">Digital OCR Scrutiny</div>
                </div>
                <div>
                  <div className="font-extrabold text-lg text-orange-600">₹2.8 Lakh</div>
                  <div className="text-stone-500 font-medium">Max Annual Stipend</div>
                </div>
                <div>
                  <div className="font-extrabold text-lg text-orange-600">3 Languages</div>
                  <div className="text-stone-500 font-medium">Hindi • Santhali • English</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive AI Highlight Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-orange-200/70 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-radial from-orange-400/20 to-transparent rounded-full blur-2xl"></div>

                <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2 font-bold text-sm text-stone-900 dark:text-white">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    AI Multi-Service Workflow
                  </div>
                  <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    Live Verified
                  </span>
                </div>

                <div className="space-y-4 py-4 text-xs">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-orange-50/80 dark:bg-stone-800/60 border border-orange-200/50">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white font-bold">
                      1
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                        <ScanLine className="h-3.5 w-3.5 text-orange-600" /> Certificate OCR Extraction
                      </div>
                      <p className="text-stone-600 dark:text-stone-400 text-[11px] mt-0.5">
                        OpenCV filters + Tesseract detect name, caste (ST/Santhal), and income from document photos.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/80 dark:bg-stone-800/60 border border-amber-200/50">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white font-bold">
                      2
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                        <Compass className="h-3.5 w-3.5 text-amber-600" /> Smart Eligibility Scoring
                      </div>
                      <p className="text-stone-600 dark:text-stone-400 text-[11px] mt-0.5">
                        FastAPI evaluates applicant demographics against Ministry schemes with explainable match scores.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-stone-700 text-white font-bold">
                      3
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                        <Bot className="h-3.5 w-3.5 text-orange-600" /> Vernacular Guidance
                      </div>
                      <p className="text-stone-600 dark:text-stone-400 text-[11px] mt-0.5">
                        Instant responses in local dialects answering questions regarding documents and status tracking.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    Quick Student & Officer Demo Login <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
            Transforming Tribal Scholarship Governance
          </h2>
          <p className="text-sm text-stone-500 max-w-2xl mx-auto">
            Traditional portals face high rejection rates due to manual data errors and language barriers.
            Our prototype integrates three intelligent micro-engines to streamline the workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs hover:border-orange-300 transition-all space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-950/70 dark:text-orange-400">
              <ScanLine className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Automated Document OCR
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Upload your Caste Certificate or Income Slip. Our OpenCV preprocessing + Tesseract OCR pipeline extracts
              applicant name, tribe, certificate ID, and annual income to pre-fill the form automatically.
            </p>
            <div className="text-xs font-semibold text-orange-600 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Eliminates manual clerical errors
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs hover:border-orange-300 transition-all space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-400">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Smart Eligibility Engine
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Students do not need to guess which scheme applies to them. Our Python ML recommendation module matches
              income limits, GPA, academic course, and tribal reservation to compute personalized compatibility scores.
            </p>
            <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Explainable match percentages
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs hover:border-orange-300 transition-all space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-950/70 dark:text-orange-400">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Vernacular NLP Assistant
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              An interactive multilingual conversational agent answering queries in Hindi, Santhali, and English.
              Students can ask about required documents, last dates, and disbursement statuses anytime.
            </p>
            <div className="text-xs font-semibold text-orange-600 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> 24/7 Chatbot in bottom corner
            </div>
          </div>
        </div>
      </section>

      {/* Featured Schemes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">
              Official Ministry Tribal Scholarship Schemes
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Active schemes for Scheduled Tribe (ST) students across school, college, and postgraduate stages
            </p>
          </div>
          <Link
            href="/apply"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
          >
            Apply Now <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schemes.slice(0, 3).map((scheme) => (
            <div
              key={scheme.id}
              className="flex flex-col justify-between rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 px-2.5 py-0.5 text-[11px] font-bold">
                    {scheme.category || "Tribal Welfare"}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    Up to ₹{scheme.scholarshipAmount?.toLocaleString() || "50,000"} / yr
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 dark:text-white leading-snug">
                  {scheme.title}
                </h3>

                <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed">
                  {scheme.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-stone-400" />
                    {scheme.provider || "Ministry of Tribal Affairs"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-stone-400" />
                    {scheme.deadline || "Active"}
                  </span>
                </div>

                <Link
                  href={`/apply?schemeId=${scheme.id}`}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-orange-50 dark:bg-stone-800 text-orange-900 dark:text-orange-200 font-bold py-2 text-xs hover:bg-orange-100 transition-colors"
                >
                  Apply with Auto-Fill <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
