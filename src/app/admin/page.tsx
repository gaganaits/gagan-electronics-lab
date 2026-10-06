"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Quote } from "@/types";
import { getClientDemoQuotes } from "@/lib/demo-data";

export default function AdminDashboardPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/admin/quotes");
        if (res.ok) {
          const data = await res.json();
          if (data.quotes && data.quotes.length > 0) {
            setQuotes(data.quotes);
            return;
          }
        }
      } catch {
        // Fallback for static demo mode
      }

      setQuotes(getClientDemoQuotes());
    };

    fetchDashboardData().finally(() => setLoading(false));
  }, []);

  const newCount = quotes.filter((q) => q.status === "NEW").length;
  const reviewCount = quotes.filter((q) => q.status === "UNDER_REVIEW").length;
  const sentCount = quotes.filter((q) => q.status === "QUOTE_SENT").length;
  const completedCount = quotes.filter((q) => q.status === "COMPLETED").length;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Operations & Quotation Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Real-time queue of customer quotation submissions and machine allocations.
          </p>
        </div>

        <Link
          href="/admin/quotes"
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors self-start sm:self-auto"
        >
          View all quotes ({quotes.length})
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-stone-200 rounded-card-sm p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">New Requests</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
            {newCount}
          </div>
          <span className="text-[11px] text-stone-500 block">Pending initial review</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-card-sm p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Under Review</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
            {reviewCount}
          </div>
          <span className="text-[11px] text-stone-500 block">Geometry / CAD inspection</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-card-sm p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Quotes Sent</span>
            <FileSpreadsheet className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
            {sentCount}
          </div>
          <span className="text-[11px] text-stone-500 block">Awaiting customer approval</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-card-sm p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
            {completedCount}
          </div>
          <span className="text-[11px] text-stone-500 block">Printed and delivered</span>
        </div>
      </div>

      {/* Recent Quotes Section */}
      <div className="bg-white border border-stone-200 rounded-card-md shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900">
            Recent Quotation Requests
          </h2>
          <Link
            href="/admin/quotes"
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1"
          >
            <span>See all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {quotes.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500">
            {loading ? "Loading quotation records..." : "No quotation requests submitted yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F3] border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Hardware / Service</th>
                  <th className="py-3 px-4">Material & Qty</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Files</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {quotes.slice(0, 8).map((q) => (
                  <tr key={q.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      {q.publicReference}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900">{q.customerName}</div>
                      {q.companyName && (
                        <div className="text-[11px] text-stone-500">{q.companyName}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-stone-700">
                      {q.serviceType}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-900">{q.quantity}x</span>{" "}
                      <span className="text-stone-600">{q.material}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          q.status === "NEW"
                            ? "bg-amber-100 text-amber-800"
                            : q.status === "UNDER_REVIEW"
                            ? "bg-blue-100 text-blue-800"
                            : q.status === "QUOTE_SENT"
                            ? "bg-purple-100 text-purple-800"
                            : q.status === "ACCEPTED" || q.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {q.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 font-mono">
                      {q.files.length > 0 ? `${q.files.length} file(s)` : q.googleDriveUrl ? "Drive link" : "Text spec"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/quotes/${q.id}`}
                        className="px-3 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold transition-colors"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
