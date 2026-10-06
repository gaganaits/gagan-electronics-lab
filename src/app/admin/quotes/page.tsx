"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, RefreshCw, FileText, ExternalLink, ArrowRight } from "lucide-react";
import { Quote, QuoteStatus } from "@/types";

const ALL_STATUSES: Array<{ label: string; value: string }> = [
  { label: "All Statuses", value: "ALL" },
  { label: "New", value: "NEW" },
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Quote Sent", value: "QUOTE_SENT" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Archived", value: "ARCHIVED" },
];

import { getClientDemoQuotes } from "@/lib/demo-data";

export default function AdminQuotesListPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const url =
        selectedStatus === "ALL"
          ? "/api/admin/quotes"
          : `/api/admin/quotes?status=${encodeURIComponent(selectedStatus)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setQuotes(data.quotes || []);
        return;
      }
    } catch (err) {
      // Fallback for static demo mode
    }

    // Static GitHub Pages demo fallback
    const all = getClientDemoQuotes();
    if (selectedStatus === "ALL") {
      setQuotes(all);
    } else {
      setQuotes(all.filter((q) => q.status === selectedStatus));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotes();
  }, [selectedStatus]);

  // Filter by search query
  const filteredQuotes = quotes.filter((q) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      q.publicReference.toLowerCase().includes(query) ||
      q.customerName.toLowerCase().includes(query) ||
      (q.companyName && q.companyName.toLowerCase().includes(query)) ||
      q.email.toLowerCase().includes(query) ||
      q.material.toLowerCase().includes(query) ||
      q.serviceType.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Quotation Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Review customer geometries, assign quotations, and track order manufacturing status.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchQuotes}
          disabled={loading}
          className="p-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors flex items-center gap-2 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-card-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search reference, customer, material..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-200 text-xs sm:text-sm bg-[#FAF8F3] focus:bg-white focus:border-stone-900"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-200 text-xs sm:text-sm bg-white font-medium text-stone-800"
          >
            {ALL_STATUSES.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white border border-stone-200 rounded-card-md shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-stone-500">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-stone-400" />
            <span>Loading quotation records...</span>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500 space-y-1">
            <p className="font-semibold text-stone-700 text-sm">No quotations found</p>
            <p>Try modifying your status filter or search keywords.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F3] border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Specs & Material</th>
                  <th className="py-3 px-4">Files / Links</th>
                  <th className="py-3 px-4">Price (₹)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      {q.publicReference}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900">{q.customerName}</div>
                      <div className="text-[11px] text-stone-500">{q.email}</div>
                      {q.companyName && (
                        <div className="text-[10px] text-stone-400">{q.companyName}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-stone-900 font-mono">{q.quantity}x</span>{" "}
                        <span className="font-medium text-stone-800">{q.material}</span>
                      </div>
                      <div className="text-[11px] text-stone-500">{q.color} · {q.quality.split("(")[0]}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {q.files.length > 0 ? (
                        <span className="text-stone-800 font-medium">
                          {q.files.length} attached
                        </span>
                      ) : q.googleDriveUrl ? (
                        <span className="text-blue-600 font-medium">Google Drive</span>
                      ) : (
                        <span className="text-stone-400">Notes only</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-stone-900">
                      {q.finalPrice ? (
                        <span className="text-emerald-700">₹{q.finalPrice}</span>
                      ) : q.estimatedPrice ? (
                        <span className="text-stone-600">~₹{q.estimatedPrice}</span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
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

                    <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                      {new Date(q.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/quotes/${q.id}`}
                        className="px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-white font-semibold transition-colors inline-block"
                      >
                        Inspect
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
