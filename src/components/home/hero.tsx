import Link from "next/link";
import { ArrowRight, Layers, ShieldCheck, Cpu } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {/* Handwritten accent callout */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-100 border border-stone-200/80 text-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Direct Workshop Fabrication
            </span>
            <span className="font-handwriting text-2xl text-stone-600 -rotate-3 select-none hidden sm:inline-block">
              precision engineered in-house
            </span>
          </div>

          {/* Primary headline in Sentence Case */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 leading-[1.08]">
            3D printing for prototypes, parts and electronics.
          </h1>

          {/* Concrete, clear supporting description */}
          <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
            Upload your STL, PDF, or CAD drawings and tell us what you need. We review your requirements, select the optimal additive manufacturing process, and deliver functional components built to tight engineering tolerances.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto pt-2">
            <Link
              href="/request-quote"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-semibold bg-coral-300 hover:bg-coral-400 text-stone-900 shadow-coral hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span>Request a quote</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/products"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-semibold bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Explore our printers</span>
            </Link>
          </div>

          {/* Key capability trust badges */}
          <div className="pt-6 sm:pt-10 grid grid-cols-3 gap-4 sm:gap-8 border-t border-stone-200/70 w-full max-w-xl text-left">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                Technologies
              </span>
              <span className="text-sm font-medium text-stone-800">
                FDM · MSLA Resin · PA-CF
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                Build Volume
              </span>
              <span className="text-sm font-medium text-stone-800">
                Up to 300 × 300 × 400 mm
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                Resolution
              </span>
              <span className="text-sm font-medium text-stone-800">
                Down to 20 microns
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
