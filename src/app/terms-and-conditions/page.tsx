import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Gagan Electronics Lab",
  description:
    "Terms and conditions for 3D printing manufacturing, quotation validity, CAD file ownership, and tolerances at Gagan Electronics Lab.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="pt-32 sm:pt-40 pb-24 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="mb-10 space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
          Legal Agreement
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Last revised: October 2026
        </p>
      </div>

      <div className="bg-white border border-stone-200/90 rounded-card-xl p-8 sm:p-12 shadow-soft space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            1. Scope of Services
          </h2>
          <p>
            Gagan Electronics Lab provides custom on-demand additive manufacturing (3D printing), rapid prototyping, and hardware finishing services. By submitting a quotation request, uploading CAD files, or confirming a production order, you agree to these Terms and Conditions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            2. Customer-Supplied Files & Intellectual Property
          </h2>
          <p>
            You retain 100% full ownership, copyright, and patent rights to all CAD models, 3D files (.STL, .OBJ, .STEP), drawings (.PDF), and specifications submitted to Gagan Electronics Lab.
          </p>
          <p>
            You warrant that you hold all necessary legal rights, licenses, or authorizations to reproduce the designs submitted to us. Gagan Electronics Lab shall not use your files for any purpose other than preparing quotations, communicating technical feedback, and executing your manufacturing order.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            3. Prohibited Content
          </h2>
          <p>
            Gagan Electronics Lab strictly refuses to manufacture functional components intended for firearms, lethal weaponry, explosive devices, illegal surveillance hardware, or items infringing on registered trademarks. We reserve the right to decline any quote request that violates applicable laws in India or international jurisdictions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            4. Quotations & Pricing Estimates
          </h2>
          <p>
            Initial price indicators displayed on the website or generated automatically are indicative estimates based on preliminary geometry. Official binding quotations are provided following manual engineering review by lab staff. Quotations remain valid for thirty (30) calendar days from the date of issue unless specified otherwise.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            5. Manufacturing Tolerances & Material Behavior
          </h2>
          <p>
            Additive manufacturing parts are subject to inherent thermal expansion, polymer shrinkage, and layer adhesion characteristics:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>FDM Thermoplastics (PLA+, PETG, ABS, TPU):</strong> Standard dimensional tolerance is ±0.15 mm or ±0.2% of part dimensions, whichever is greater.</li>
            <li><strong>MSLA Photopolymer Resin:</strong> Dimensional tolerance is ±0.08 mm on parts under 100 mm.</li>
            <li><strong>Carbon-Fiber Nylon (PA12-CF):</strong> Highly rigid with minimal thermal shrinkage, tolerance ±0.12 mm.</li>
          </ul>
          <p>
            Critical tolerance interfaces requiring post-machining or threaded brass inserts must be explicitly marked in submitted technical drawings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            6. Quality Inspection & Acceptance
          </h2>
          <p>
            Customers must inspect delivered components within seven (7) days of delivery receipt. If a part deviates substantially from confirmed CAD geometry or exhibits manufacturing defects outside stated tolerances, please submit photographic evidence to <code>quotes@gaganelectronicslab.com</code> for review and replacement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            7. Limitation of Liability
          </h2>
          <p>
            Custom prototype components are provided for evaluation, engineering fit-checks, or custom machinery integration. Gagan Electronics Lab is not liable for indirect, incidental, or consequential damages resulting from improper mechanical application or misuse of printed parts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            8. Contact & Legal Notices
          </h2>
          <p>
            For questions regarding these terms, contact us at <code>quotes@gaganelectronicslab.com</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
