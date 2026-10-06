import Link from "next/link";
import { ArrowRight, UploadCloud, Shield } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-sage-100/90 border border-sage-200 rounded-card-xl p-8 sm:p-14 text-center shadow-soft relative overflow-hidden">
          {/* Subtle decorative circles */}
          <div className="ambient-glow-coral -bottom-24 -left-24 opacity-40" />

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <span className="font-handwriting text-3xl text-stone-700 select-none -rotate-2 inline-block">
              direct engineer review
            </span>

            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
              Have a part you need printed?
            </h2>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Upload your design files and tell us what you are building. We will review the geometry, verify layer orientations, and return an itemized quotation within 24 hours.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/request-quote"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-sm flex items-center justify-center gap-2 group"
              >
                <span>Request a quote</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/contact"
                className="w-full sm:w-auto px-6 py-4 rounded-full text-sm font-medium bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 transition-colors"
              >
                <span>Talk with an engineer</span>
              </Link>
            </div>

            <div className="pt-4 flex items-center justify-center gap-4 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-700" />
                <span>NDA & CAD confidentiality guaranteed</span>
              </span>
              <span>·</span>
              <span>No minimum order quantity</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
