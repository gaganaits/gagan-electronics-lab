import Link from "next/link";
import { materialsList } from "@/data/materials";
import { Check, ArrowRight, Layers, ShieldCheck, Wrench, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Printing Capabilities & Materials Guide | Gagan Electronics Lab",
  description:
    "Explore our complete 3D printing capabilities, technical material comparison matrix (PLA+, PETG, ABS, Resin, PA-CF), post-processing, and design tolerances.",
};

export default function CapabilitiesPage() {
  return (
    <div className="pt-32 sm:pt-40 pb-24 max-w-6xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-24">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2 block">
          Engineering Capabilities
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Capabilities, materials and tolerances.
        </h1>
        <p className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed">
          Additive manufacturing requires picking the exact resin, thermoplastic, or composite tailored to your environmental conditions and mechanical loads.
        </p>
      </div>

      {/* Technology Breakdown */}
      <section className="space-y-8">
        <div className="max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Core 3D Printing Technologies
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            We operate three distinct additive modalities in our lab.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white border border-stone-200/90 rounded-card-md p-6 sm:p-7 shadow-soft space-y-4">
            <div className="w-10 h-10 rounded-full bg-sage-100 text-stone-900 flex items-center justify-center font-bold text-sm">
              FDM
            </div>
            <h3 className="text-xl font-bold text-stone-900">
              Fused Deposition Modeling
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Extrudes melted engineering filaments through heated nozzles layer by layer. Excellent for structural prototypes, functional enclosures, and cost-effective batch production.
            </p>
            <ul className="text-xs space-y-2 text-stone-700 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-stone-900 shrink-0" />
                <span>Build volume: Up to 300 × 300 × 400 mm</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-stone-900 shrink-0" />
                <span>Tolerances: ±0.15 mm</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-stone-900 shrink-0" />
                <span>Materials: PLA+, PETG, ABS, TPU</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-stone-200/90 rounded-card-md p-6 sm:p-7 shadow-soft space-y-4">
            <div className="w-10 h-10 rounded-full bg-lavender-100 text-stone-900 flex items-center justify-center font-bold text-sm">
              SLA
            </div>
            <h3 className="text-xl font-bold text-stone-900">
              MSLA / Stereolithography
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Photopolymer liquid resin cured by a high-resolution 12K monochrome UV LCD matrix. Imperceptible layer ridges, ultra-smooth tactile surface, and isotropic strength across all axes.
            </p>
            <ul className="text-xs space-y-2 text-stone-700 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-stone-900 shrink-0" />
                <span>Build volume: 218 × 123 × 250 mm</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-stone-900 shrink-0" />
                <span>Resolution: 20 – 50 microns</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-stone-900 shrink-0" />
                <span>Materials: Standard & Tough Engineering Resin</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-stone-200/90 rounded-card-md p-6 sm:p-7 shadow-soft space-y-4">
            <div className="w-10 h-10 rounded-full bg-coral-100 text-stone-900 flex items-center justify-center font-bold text-sm">
              CF
            </div>
            <h3 className="text-xl font-bold text-stone-900">
              Carbon-Fiber Reinforced
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Industrial composite printing using chopped micro-carbon fibers inside polyamide nylon matrices. Provides aluminum-rivaling stiffness and extreme resistance to mechanical deformation.
            </p>
            <ul className="text-xs space-y-2 text-stone-700 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-stone-900 shrink-0" />
                <span>Tensile Modulus: Up to 8,900 MPa</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-stone-900 shrink-0" />
                <span>Heat Deflection: 190°C</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-stone-900 shrink-0" />
                <span>Materials: PA12-CF, PET-CF</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Material Comparison Matrix Table */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Material Property Matrix
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Compare mechanical properties, heat resistance, and ideal engineering applications.
          </p>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-card-md shadow-soft overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-[#FAF8F3] border-b border-stone-200 text-stone-600 uppercase text-[11px] tracking-wider font-semibold">
                <th className="py-4 px-6">Material</th>
                <th className="py-4 px-4">Tensile Strength</th>
                <th className="py-4 px-4">Heat Deflection (HDT)</th>
                <th className="py-4 px-4">Flexibility</th>
                <th className="py-4 px-6">Best Suited For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {materialsList.map((m) => (
                <tr key={m.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-4 px-6 font-bold text-stone-900">
                    <div>{m.name}</div>
                    <span className="text-[11px] font-normal text-stone-500">{m.category}</span>
                  </td>
                  <td className="py-4 px-4 font-mono font-medium text-stone-800">
                    {m.tensileStrength}
                  </td>
                  <td className="py-4 px-4 font-mono text-stone-800">
                    {m.heatDeflectionTemp}
                  </td>
                  <td className="py-4 px-4 text-stone-700">
                    {m.flexibility}
                  </td>
                  <td className="py-4 px-6 text-stone-600 text-xs leading-relaxed max-w-xs">
                    {m.bestFor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Post-Processing Capabilities */}
      <section className="bg-sage-50/80 border border-sage-200 rounded-card-xl p-8 sm:p-12 space-y-6">
        <div className="max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1 block">
            Assembly & Finishing
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Hardware Integration & Post-Processing
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            We don't just hand you raw prints. We prepare your parts for real-world mechanical service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-card-md border border-stone-200/80 space-y-2">
            <h3 className="font-bold text-stone-900 text-base">
              Threaded Brass Heat-Set Inserts
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Thermal installation of M2, M2.5, M3, M4, M5, and M6 brass threaded inserts. Enables repeated assembly and disassembly without thread degradation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-card-md border border-stone-200/80 space-y-2">
            <h3 className="font-bold text-stone-900 text-base">
              Resin Wash & UV Post-Cure
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Two-stage ultrasonic solvent washing in 99.8% isopropyl alcohol followed by calibrated 405nm UV chamber turntable curing for maximum tensile strength.
            </p>
          </div>

          <div className="bg-white p-6 rounded-card-md border border-stone-200/80 space-y-2">
            <h3 className="font-bold text-stone-900 text-base">
              Surface Smoothing & Bead Blasting
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Fine-grit mechanical sanding, chemical vapor smoothing for ABS, and media bead blasting for uniform matte surface finish ready for inspection or paint.
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Link
            href="/request-quote"
            className="px-6 py-3 rounded-full text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center gap-2"
          >
            <span>Request a quote with custom finishing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
