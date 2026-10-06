import Link from "next/link";
import { Upload, FileCode2, FileText, ExternalLink, ArrowRight } from "lucide-react";

export function QuickQuoteBar() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-8 mb-16 sm:mb-24 relative z-20">
      <div className="bg-sage-50/90 border border-sage-200/90 rounded-card-lg p-6 sm:p-8 shadow-soft backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <h2 className="text-base sm:text-lg font-semibold text-stone-900">
                Have a 3D model or project ready?
              </h2>
            </div>
            <p className="text-sm text-stone-600">
              Submit your <span className="font-medium text-stone-800">.STL</span>, <span className="font-medium text-stone-800">.PDF</span> drawing, or paste a Google Drive folder link.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
            <Link
              href="/request-quote"
              className="px-6 py-3 rounded-full text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-sm flex items-center gap-2"
            >
              <Upload className="w-4 h-4 text-coral-300" />
              <span>Upload CAD & get quote</span>
            </Link>

            <Link
              href="/request-quote#google-drive"
              className="px-5 py-3 rounded-full text-sm font-medium bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 transition-colors flex items-center gap-1.5"
            >
              <span>Share Drive link</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </Link>
          </div>
        </div>

        {/* Accepted formats badge list */}
        <div className="mt-5 pt-4 border-t border-sage-200/70 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-3">
            <span className="font-medium text-stone-700">Accepted formats:</span>
            <span className="px-2 py-0.5 rounded bg-white border border-stone-200 font-mono text-[11px] text-stone-700">
              .STL (Binary/ASCII)
            </span>
            <span className="px-2 py-0.5 rounded bg-white border border-stone-200 font-mono text-[11px] text-stone-700">
              .PDF (Drawings)
            </span>
            <span className="px-2 py-0.5 rounded bg-white border border-stone-200 font-mono text-[11px] text-stone-700">
              .JPG / .PNG / .WEBP
            </span>
          </div>
          <div className="text-stone-400">
            Encrypted private storage · Verified NDA confidentiality
          </div>
        </div>
      </div>
    </section>
  );
}
