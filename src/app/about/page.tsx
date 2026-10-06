import Link from "next/link";
import { ArrowRight, ShieldCheck, Microscope, Cpu, Layers } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Gagan Electronics Lab | Additive Hardware Engineering",
  description:
    "Learn about Gagan Electronics Lab. Combining electronics hardware design, embedded systems, and precision 3D printing fabrication in-house.",
};

export default function AboutPage() {
  return (
    <div className="pt-32 sm:pt-40 pb-24 max-w-5xl mx-auto px-4 sm:px-6 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
          About the Studio
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Where electronics design meets precision fabrication.
        </h1>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          Gagan Electronics Lab was founded out of a direct engineering necessity: building functional electronic prototypes requires enclosures and physical components that match exact PCB dimensions and thermal constraints.
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="bg-white border border-stone-200/90 rounded-card-xl p-8 sm:p-12 shadow-soft space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="font-handwriting text-3xl text-stone-700 select-none">
              our laboratory philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Printers are tools for functional engineering, not just decorative plastic.
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Many 3D printing providers focus merely on cosmetic appearance. Because our background is rooted in electronics, robotics, and hardware prototyping, we approach every print through the lens of mechanical tolerances, thermal dissipation, and electrical insulation.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              When you send us a model, we verify whether your screw holes have sufficient wall thickness to prevent layer splitting, whether snap-fit joints have proper clearance, and whether critical board mounting bosses align accurately.
            </p>
          </div>

          <div className="bg-[#FAF8F3] border border-stone-200 rounded-card-md p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-stone-900">
              Our Fabrication Standards
            </h3>
            <ul className="space-y-4 text-xs sm:text-sm text-stone-700">
              <li className="flex items-start gap-3">
                <Microscope className="w-5 h-5 text-stone-900 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 block">Active Material Dehydration</strong>
                  <span>Filaments are dried in heated chambers prior to printing to prevent moisture bubbling and brittle layer adhesion.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Cpu className="w-5 h-5 text-stone-900 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 block">Digital Caliper QC</strong>
                  <span>Every batch undergoes manual dimensional inspection against specified CAD dimensions before shipping.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 block">Proprietary CAD Protection</strong>
                  <span>Your intellectual property and 3D models remain strictly confidential on private storage servers.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Facilities & Location */}
      <div className="bg-sage-50/70 border border-sage-200 rounded-card-xl p-8 sm:p-12 space-y-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Our Studio & Workshop
          </h2>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            Based in India, our lab operates continuous FDM, MSLA Resin, and composite hardware. We serve engineering teams, hardware developers, researchers, and hobbyists across the country with insured courier delivery.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center gap-4">
          <Link
            href="/request-quote"
            className="px-6 py-3 rounded-full text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center gap-2"
          >
            <span>Start a project quotation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/contact"
            className="px-6 py-3 rounded-full text-sm font-medium bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 transition-colors"
          >
            <span>Contact the lab</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
