export function ProcessSection() {
  const steps = [
    {
      num: "01",
      title: "Share your design",
      description: "Upload your STL model, PDF drawing, or paste a Google Drive folder link with your CAD files.",
    },
    {
      num: "02",
      title: "Specify requirements",
      description: "Select material (PLA+, PETG, ABS, Resin, PA-CF), layer height, infill percentage, and required delivery date.",
    },
    {
      num: "03",
      title: "Engineering review",
      description: "Our lab team inspects wall thickness, overhang angles, print orientation, and tolerance fits.",
    },
    {
      num: "04",
      title: "Receive your quotation",
      description: "Get a clear itemized quotation with material cost, machine hours, and shipping schedule.",
    },
    {
      num: "05",
      title: "Print & quality check",
      description: "We fabricate your components, perform post-processing and dimensional inspection, and dispatch safely.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white/60 border-y border-stone-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2 block">
            How it works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 leading-tight">
            From digital CAD to physical part in five steps.
          </h2>
          <p className="mt-3 text-base text-stone-600">
            A transparent manufacturing process with direct engineering communication.
          </p>
        </div>

        {/* Process steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 sm:gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="relative flex flex-col space-y-3 group"
            >
              {/* Step number badge */}
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-stone-300 group-hover:text-coral-400 transition-colors">
                  {step.num}
                </span>
                {idx < steps.length - 1 && (
                  <span className="hidden md:block w-8 h-[1px] bg-stone-200 self-center" />
                )}
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-stone-900 leading-snug">
                {step.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
