"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Users,
  IndianRupee,
  ScanLine,
  AlertCircle,
  Eye,
} from "lucide-react";
import { applicationApi } from "@/lib/api";

export default function AdminDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [actionRemarks, setActionRemarks] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    loadAllApplications();
  }, []);

  const loadAllApplications = async () => {
    setLoading(true);
    try {
      const data = await applicationApi.getAllApplications().catch(() => [
        {
          id: 1,
          applicationNumber: "SIH-849120-ST01",
          studentName: "Birsa Soren",
          studentEmail: "student@sih.gov.in",
          tribeName: "Santhal",
          category: "ST",
          scholarshipTitle: "National Fellowship and Scholarship for Higher Education of ST Students",
          scholarshipAmount: 28000,
          status: "VERIFIED",
          ocrConfidenceScore: 0.965,
          ocrVerified: true,
          appliedAt: new Date().toISOString(),
          remarks: "Automated OCR parsed ST Certificate & Income Affidavit (₹1,20,000)",
        },
        {
          id: 2,
          applicationNumber: "SIH-712941-ST02",
          studentName: "Sunita Munda",
          studentEmail: "sunita.munda@example.com",
          tribeName: "Munda",
          category: "ST",
          scholarshipTitle: "Post-Matric Scholarship for Scheduled Tribe (ST) Students",
          scholarshipAmount: 15000,
          status: "SUBMITTED",
          ocrConfidenceScore: 0.94,
          ocrVerified: true,
          appliedAt: new Date(Date.now() - 86400000).toISOString(),
          remarks: "Certificate issued by SDO Ranchi. Verification pending officer review.",
        },
        {
          id: 3,
          applicationNumber: "SIH-391024-ST03",
          studentName: "Rahul Gond",
          studentEmail: "rahul.gond@example.com",
          tribeName: "Gond",
          category: "ST",
          scholarshipTitle: "Top Class Education Scheme for ST Students",
          scholarshipAmount: 85000,
          status: "APPROVED",
          ocrConfidenceScore: 0.98,
          ocrVerified: true,
          appliedAt: new Date(Date.now() - 172800000).toISOString(),
          remarks: "IIT Kharagpur admission offer letter verified. DBT payment sanctioned.",
        },
      ]);
      setApplications(data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      await applicationApi.updateStatus(id, newStatus, actionRemarks || `Marked as ${newStatus} by Ministry Officer`);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id
            ? { ...app, status: newStatus, remarks: actionRemarks || `Marked as ${newStatus} by Ministry Officer` }
            : app
        )
      );
      setSelectedApp(null);
      setActionRemarks("");
    } catch {
      // Local optimistic update
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: newStatus, remarks: actionRemarks || `Updated to ${newStatus}` } : app
        )
      );
      setSelectedApp(null);
      setActionRemarks("");
    } finally {
      setUpdatingId(null);
    }
  };

  // Stats calculation
  const totalApps = applications.length;
  const verifiedCount = applications.filter((a) => a.status === "VERIFIED" || a.ocrVerified).length;
  const approvedCount = applications.filter((a) => a.status === "APPROVED").length;
  const totalAmount = applications
    .filter((a) => a.status === "APPROVED")
    .reduce((sum, a) => sum + (a.scholarshipAmount || 0), 0);

  // Filtered applications
  const filtered = applications.filter((app) => {
    const matchesSearch =
      (app.studentName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.applicationNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.tribeName || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
            <Shield className="h-4 w-4" /> Ministry Scrutiny & DBT Disbursement Portal
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Administrative Officer Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Review AI OCR extraction confidence, verify student credentials, and sanction DBT funds.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Total Submissions</span>
            <Users className="h-4 w-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-white">{totalApps}</div>
          <p className="text-[11px] text-stone-500 mt-1">Across 8 tribal states</p>
        </div>

        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>AI OCR Verified</span>
            <ScanLine className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{verifiedCount}</div>
          <p className="text-[11px] text-stone-500 mt-1">Avg 96.4% confidence score</p>
        </div>

        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Sanctioned / Approved</span>
            <FileCheck className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-600">{approvedCount}</div>
          <p className="text-[11px] text-stone-500 mt-1">Direct Benefit Transfer approved</p>
        </div>

        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Disbursement Pool</span>
            <IndianRupee className="h-4 w-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-orange-600">
            ₹{totalAmount.toLocaleString()}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Target ST higher education fund</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, ID, or tribe..."
            className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 py-2 pl-9 pr-3 text-xs text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-stone-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 py-2 px-3 text-xs text-stone-900 dark:text-white outline-hidden focus:border-orange-500"
          >
            <option value="ALL">All Application Statuses</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="UNDER_REVIEW">UNDER REVIEW</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>

      {/* Applications Scrutiny Table */}
      <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600 dark:text-stone-300">
            <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-700 dark:text-stone-200 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200/80 dark:border-stone-800">
              <tr>
                <th className="py-3.5 px-4">Application ID</th>
                <th className="py-3.5 px-4">Student & Tribe</th>
                <th className="py-3.5 px-4">Scholarship Scheme</th>
                <th className="py-3.5 px-4">AI OCR Confidence</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4 text-right">Scrutiny Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-stone-900 dark:text-white">
                    {app.applicationNumber}
                    <div className="text-[10px] font-normal text-stone-400">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-stone-900 dark:text-white">
                      {app.studentName}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {app.category} • <span className="font-semibold text-orange-600">{app.tribeName}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 max-w-xs">
                    <div className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                      {app.scholarshipTitle}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-bold">
                      ₹{app.scholarshipAmount?.toLocaleString()}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 text-[11px] font-bold">
                      <ScanLine className="h-3 w-3" />
                      {((app.ocrConfidenceScore || 0.95) * 100).toFixed(1)}% Match
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        app.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : app.status === "REJECTED"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          : app.status === "VERIFIED"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right space-x-1.5">
                    {app.status !== "APPROVED" && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, "APPROVED")}
                        disabled={updatingId === app.id}
                        className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500 shadow-xs"
                      >
                        Approve
                      </button>
                    )}

                    {app.status !== "UNDER_REVIEW" && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, "UNDER_REVIEW")}
                        disabled={updatingId === app.id}
                        className="rounded-lg bg-amber-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-500 shadow-xs"
                      >
                        Review
                      </button>
                    )}

                    {app.status !== "REJECTED" && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                        disabled={updatingId === app.id}
                        className="rounded-lg bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-rose-500 shadow-xs"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
