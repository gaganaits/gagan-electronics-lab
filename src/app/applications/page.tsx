import Link from "next/link";
import { applicationsList } from "@/data/applications";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Printing Applications & Industries | Gagan Electronics Lab",
  description:
    "Explore how Gagan Electronics Lab manufactures custom electronic enclosures, robotic drone components, manufacturing assembly jigs, and functional prototypes.",
};

export default function ApplicationsPage() {
  return (
    <div className="pt-32 sm:pt-40 pb-24 max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2 block">
          Industries & Use Cases
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Purpose-built 3D printing applications.
        </h1>
        <p className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed">
          We bridge the gap between digital CAD design and functional physical hardware. Explore how our in-house capabilities serve hardware startups, robotics teams, and manufacturing shops.
        </p>
      </div>

      {/* Applications List */}
      <div className="space-y-10">
        {applicationsList.map((app, idx) => (
          <div
            key={app.id}
            id={app.id}
            className="bg-white border border-stone-200/90 rounded-card-lg p-8 sm:p-12 shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-900 border border-stone-200">
                  {app.category}
                </span>
                <span className="text-xs font-mono text-stone-500">
                  Tolerance: {app.typicalTolerances}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
                {app.title}
              </h2>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                {app.longDescription}
              </p>

              <div className="pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 mb-3">
                  Key Technical Features
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                  {app.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations Column */}
            <div className="lg:col-span-5 bg-[#FAF8F3] border border-stone-200 rounded-card-md p-6 sm:p-7 space-y-5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-1">
                  Recommended Process
                </span>
                <span className="font-bold text-stone-900 text-sm sm:text-base">
                  {app.recommendedTechnology}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                  Recommended Materials
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {app.recommendedMaterials.map((mat) => (
                    <span
                      key={mat}
                      className="px-2.5 py-1 rounded-full text-xs bg-white border border-stone-200 text-stone-800 font-medium"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <Link
                  href={`/request-quote?service=${encodeURIComponent(app.title)}`}
                  className="w-full py-3 rounded-full text-xs sm:text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Request quote for {app.title.split("&")[0].trim()}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
