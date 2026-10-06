"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Quote, QuoteStatus } from "@/types";

const STATUS_OPTIONS: Array<{ label: string; value: QuoteStatus }> = [
  { label: "New (Unreviewed)", value: "NEW" },
  { label: "Under Review (CAD Checking)", value: "UNDER_REVIEW" },
  { label: "Quote Sent (Awaiting Acceptance)", value: "QUOTE_SENT" },
  { label: "Accepted (Confirmed for Print)", value: "ACCEPTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Completed (Fabricated & Dispatched)", value: "COMPLETED" },
  { label: "Archived", value: "ARCHIVED" },
];

import { DEFAULT_DEMO_QUOTES } from "@/lib/demo-data";

export default function QuoteDetailClient({ initialId }: { initialId?: string }) {
  const params = useParams();
  const router = useRouter();
  const id = initialId || (params?.id as string);

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Editable fields
  const [status, setStatus] = useState<QuoteStatus>("NEW");
  const [estimatedPrice, setEstimatedPrice] = useState<string>("");
  const [finalPrice, setFinalPrice] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchQuote = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/quotes/${encodeURIComponent(id)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.quote) {
            setQuote(data.quote);
            setStatus(data.quote.status);
            setEstimatedPrice(data.quote.estimatedPrice?.toString() || "");
            setFinalPrice(data.quote.finalPrice?.toString() || "");
            setAdminNotes(data.quote.adminNotes || "");
            return;
          }
        }
      } catch {
        // Fallback to client demo data
      }

      // Check localStorage quotes or default demo quotes
      try {
        const localSaved = localStorage.getItem("gel_quotes");
        const list: Quote[] = localSaved ? JSON.parse(localSaved) : [];
        const allQuotes = [...list, ...DEFAULT_DEMO_QUOTES];
        const match = allQuotes.find(
          (q) => q.id === id || q.publicReference === id || id === "preview"
        );

        if (match) {
          setQuote(match);
          setStatus(match.status);
          setEstimatedPrice(match.estimatedPrice?.toString() || "");
          setFinalPrice(match.finalPrice?.toString() || "");
          setAdminNotes(match.adminNotes || "");
          return;
        }
      } catch (e) {
        // ignore
      }

      // If preview or fallback
      const fallback = DEFAULT_DEMO_QUOTES[0];
      setQuote(fallback);
      setStatus(fallback.status);
      setEstimatedPrice(fallback.estimatedPrice?.toString() || "");
      setFinalPrice(fallback.finalPrice?.toString() || "");
      setAdminNotes(fallback.adminNotes || "");
      setLoading(false);
    };

    fetchQuote().finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSaving(true);

    try {
      const payload: any = {
        status,
        adminNotes,
      };

      if (estimatedPrice.trim()) {
        payload.estimatedPrice = parseFloat(estimatedPrice);
      }
      if (finalPrice.trim()) {
        payload.finalPrice = parseFloat(finalPrice);
      }

      let serverSaved = false;
      try {
        const res = await fetch(`/api/admin/quotes/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          setQuote(data.quote);
          serverSaved = true;
        }
      } catch {
        // client demo fallback
      }

      if (!serverSaved && quote) {
        // Save to localStorage
        const updatedQuote: Quote = {
          ...quote,
          status,
          adminNotes,
          estimatedPrice: payload.estimatedPrice,
          finalPrice: payload.finalPrice,
          updatedAt: new Date().toISOString(),
        };
        setQuote(updatedQuote);

        try {
          const localSaved = localStorage.getItem("gel_quotes");
          const list: Quote[] = localSaved ? JSON.parse(localSaved) : [];
          const idx = list.findIndex((q) => q.id === quote.id || q.publicReference === quote.publicReference);
          if (idx >= 0) {
            list[idx] = updatedQuote;
          } else {
            list.unshift(updatedQuote);
          }
          localStorage.setItem("gel_quotes", JSON.stringify(list));
        } catch {
          // ignore
        }
      }

      setSuccessMsg("Quotation status and pricing updated successfully.");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update quotation");
    } finally {
      setIsSaving(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-stone-500">
        Loading quotation details...
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/quotes"
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to quotes</span>
        </Link>
        <div className="p-8 bg-red-50 border border-red-200 rounded-card-md text-red-700 text-sm">
          {errorMsg || "Quote record could not be loaded."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Back button */}
      <div>
        <Link
          href="/admin/quotes"
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all quotes</span>
        </Link>
      </div>

      {/* Header Info Banner */}
      <div className="bg-white border border-stone-200 rounded-card-md p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold font-mono text-stone-900">
              {quote.publicReference}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                quote.status === "NEW"
                  ? "bg-amber-100 text-amber-800"
                  : quote.status === "UNDER_REVIEW"
                  ? "bg-blue-100 text-blue-800"
                  : quote.status === "QUOTE_SENT"
                  ? "bg-purple-100 text-purple-800"
                  : quote.status === "ACCEPTED" || quote.status === "COMPLETED"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-stone-100 text-stone-700"
              }`}
            >
              {quote.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Submitted on {new Date(quote.createdAt).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-stone-500">Current Quote Price</div>
          <div className="text-xl font-bold font-mono text-stone-900">
            {quote.finalPrice ? (
              <span className="text-emerald-700">₹{quote.finalPrice}</span>
            ) : quote.estimatedPrice ? (
              <span className="text-stone-600">~₹{quote.estimatedPrice} (Est)</span>
            ) : (
              <span className="text-stone-400">Not quoted yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Success / Error Messages */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-card-sm text-xs font-medium text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-card-sm text-xs font-medium text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid: Details on Left, Pricing / Status on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customer & Specs & Files */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Card */}
          <div className="bg-white border border-stone-200 rounded-card-md p-6 shadow-sm space-y-4 text-xs sm:text-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2">
              Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-stone-500 text-xs block">Full Name</span>
                <span className="font-semibold text-stone-900">{quote.customerName}</span>
              </div>

              {quote.companyName && (
                <div>
                  <span className="text-stone-500 text-xs block">Company</span>
                  <span className="font-medium text-stone-800">{quote.companyName}</span>
                </div>
              )}

              <div>
                <span className="text-stone-500 text-xs block">Email Address</span>
                <a
                  href={`mailto:${quote.email}`}
                  className="font-mono text-stone-900 underline"
                >
                  {quote.email}
                </a>
              </div>

              <div>
                <span className="text-stone-500 text-xs block">Phone / WhatsApp</span>
                <a
                  href={`tel:${quote.phone}`}
                  className="font-mono text-stone-900 underline"
                >
                  {quote.phone}
                </a>
              </div>

              <div className="sm:col-span-2">
                <span className="text-stone-500 text-xs block">Delivery Location</span>
                <span className="text-stone-800">{quote.location}</span>
              </div>
            </div>
          </div>

          {/* Project Specs */}
          <div className="bg-white border border-stone-200 rounded-card-md p-6 shadow-sm space-y-4 text-xs sm:text-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2">
              Manufacturing Requirements
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-stone-500 text-xs block">Hardware Technology</span>
                <span className="font-bold text-stone-900">{quote.serviceType}</span>
              </div>

              <div>
                <span className="text-stone-500 text-xs block">Quantity</span>
                <span className="font-bold font-mono text-stone-900">{quote.quantity} units</span>
              </div>

              <div>
                <span className="text-stone-500 text-xs block">Material</span>
                <span className="font-semibold text-stone-900">{quote.material}</span>
              </div>

              <div>
                <span className="text-stone-500 text-xs block">Color</span>
                <span className="text-stone-800">{quote.color}</span>
              </div>

              <div>
                <span className="text-stone-500 text-xs block">Quality Grade</span>
                <span className="text-stone-800">{quote.quality}</span>
              </div>

              {quote.infill && (
                <div>
                  <span className="text-stone-500 text-xs block">Infill Density</span>
                  <span className="text-stone-800">{quote.infill}</span>
                </div>
              )}
            </div>

            {quote.requirements && (
              <div className="pt-3 border-t border-stone-100">
                <span className="text-stone-500 text-xs block mb-1">Customer Requirements & Notes</span>
                <p className="p-3 bg-[#FAF8F3] rounded border border-stone-200 text-xs text-stone-800 leading-relaxed font-mono whitespace-pre-wrap">
                  {quote.requirements}
                </p>
              </div>
            )}
          </div>

          {/* Attached Files & Drive Link */}
          <div className="bg-white border border-stone-200 rounded-card-md p-6 shadow-sm space-y-4 text-xs sm:text-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2">
              Attached Files & CAD Assets ({quote.files.length})
            </h2>

            {quote.files.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No direct files uploaded.</p>
            ) : (
              <div className="space-y-2">
                {quote.files.map((file: any) => (
                  <div
                    key={file.id}
                    className="p-3 rounded-card-sm border border-stone-200 bg-[#FAF8F3] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {file.extension === "stl" ? (
                        <FileCode2 className="w-5 h-5 text-stone-800 shrink-0" />
                      ) : file.extension === "pdf" ? (
                        <FileText className="w-5 h-5 text-stone-800 shrink-0" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-stone-800 shrink-0" />
                      )}

                      <div className="overflow-hidden">
                        <span className="font-semibold text-stone-900 block truncate max-w-xs sm:max-w-md">
                          {file.originalFilename}
                        </span>
                        <span className="text-[11px] text-stone-500 font-mono">
                          {formatFileSize(file.sizeBytes)} · .{file.extension.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <a
                      href={file.downloadUrl || `/api/admin/files/download?quoteId=${quote.id}&fileId=${file.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-md bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Google Drive Link */}
            {quote.googleDriveUrl && (
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-card-sm space-y-2">
                <span className="text-xs font-bold text-blue-900 block">
                  Customer Provided Google Drive Link
                </span>
                <p className="text-xs text-blue-800 font-mono break-all">
                  {quote.googleDriveUrl}
                </p>
                <a
                  href={quote.googleDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                >
                  <span>Open in Google Drive</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Status & Price Management Form */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleSave}
            className="bg-white border border-stone-200 rounded-card-md p-6 shadow-sm space-y-5 text-xs sm:text-sm"
          >
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2">
              Quotation & Order Controls
            </h2>

            {/* Status Transition */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Quotation Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as QuoteStatus)}
                className="w-full px-3.5 py-2.5 rounded-card-sm border border-stone-200 bg-[#FAF8F3] text-stone-900 font-medium text-xs sm:text-sm focus:border-stone-900"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Estimated Price */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Estimated Price (₹ INR)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 850.00"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                className="w-full px-3.5 py-2 rounded-card-sm border border-stone-200 bg-[#FAF8F3] text-stone-900 font-mono text-sm focus:border-stone-900"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Preliminary indicative estimate for the client.
              </span>
            </div>

            {/* Final Price */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Final Quoted Price (₹ INR)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 1050.00"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                className="w-full px-3.5 py-2 rounded-card-sm border border-stone-200 bg-[#FAF8F3] text-stone-900 font-mono text-sm font-semibold focus:border-stone-900"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Official binding quotation confirmed by engineering.
              </span>
            </div>

            {/* Internal Admin Notes */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Internal Engineering Notes (Staff Only)
              </label>
              <textarea
                rows={4}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Notes on layer orientation, infill slicing time, resin consumption, shipping tracking number..."
                className="w-full px-3.5 py-2 rounded-card-sm border border-stone-200 bg-[#FAF8F3] text-stone-900 text-xs leading-relaxed focus:border-stone-900"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 rounded-full text-xs sm:text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isSaving ? (
                <span>Saving changes...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Quotation Updates</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
