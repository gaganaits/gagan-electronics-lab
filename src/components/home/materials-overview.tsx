import Link from "next/link";
import { materialsList } from "@/data/materials";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function MaterialsOverview() {
  return (
    <section className="py-20 sm:py-24 bg-[#FAF8F3] border-y border-stone-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2 block">
              Material Selection
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 leading-tight">
              Engineering materials for real-world stress.
            </h2>
            <p className="mt-3 text-base text-stone-600">
              We stock verified filaments and resins suited for mechanical impact, high heat deflection, chemical contact, and precision fitment.
            </p>
          </div>

          <Link
            href="/capabilities"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-900 hover:text-stone-700 self-start md:self-auto"
          >
            <span>Complete material property matrix</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Materials cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materialsList.map((mat) => (
            <div
              key={mat.id}
              className="bg-white border border-stone-200/80 rounded-card-md p-6 shadow-soft flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sage-100 text-stone-800">
                    {mat.category}
                  </span>
                  <span className="text-xs font-mono text-stone-500">
                    HDT: {mat.heatDeflectionTemp}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900">
                  {mat.name}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {mat.description}
                </p>

                {/* Key properties */}
                <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Tensile Strength:</span>
                    <span className="font-semibold text-stone-800">{mat.tensileStrength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Impact Resistance:</span>
                    <span className="font-medium text-stone-800">{mat.impactResistance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Flexibility:</span>
                    <span className="font-medium text-stone-800">{mat.flexibility}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                  Ideal applications
                </span>
                <p className="text-xs text-stone-700 leading-snug">
                  {mat.bestFor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
