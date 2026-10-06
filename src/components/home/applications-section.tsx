import Link from "next/link";
import { applicationsList } from "@/data/applications";
import { ArrowRight, Check } from "lucide-react";

export function ApplicationsSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2 block">
              Applications
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
              Built for hardware engineers and product teams.
            </h2>
            <p className="mt-3 text-base text-stone-600">
              We specialize in custom enclosures, robotics brackets, and functional jigs where standard off-the-shelf plastic boxes cannot fit your PCB or mechanism.
            </p>
          </div>

          <Link
            href="/applications"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-900 hover:text-stone-700 self-start md:self-auto"
          >
            <span>Explore all use cases</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetrical / tactile cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {applicationsList.map((app, idx) => {
            // Alternate pastel backgrounds for tactile feel: Sage, Lavender, Card
            const bgClass =
              idx % 3 === 0
                ? "bg-sage-50/70 border-sage-200"
                : idx % 3 === 1
                ? "bg-lavender-50/70 border-lavender-200"
                : "bg-stone-50/80 border-stone-200";

            return (
              <div
                key={app.id}
                className={`rounded-card-md p-6 sm:p-7 border shadow-soft flex flex-col justify-between ${bgClass} transition-transform hover:-translate-y-1`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      {app.category}
                    </span>
                    <span className="text-xs font-mono text-stone-600">
                      {app.typicalTolerances}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-stone-900">
                    {app.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {app.shortDescription}
                  </p>

                  {/* Feature bullet list */}
                  <ul className="pt-2 space-y-2 text-xs text-stone-700">
                    {app.features.slice(0, 3).map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-stone-800 mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-4 border-t border-stone-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 font-medium">
                    Recommended: {app.recommendedTechnology.split("(")[0]}
                  </span>
                  <Link
                    href={`/request-quote?service=${encodeURIComponent(app.title)}`}
                    className="text-xs font-semibold text-stone-900 hover:text-stone-700 flex items-center gap-1"
                  >
                    <span>Quote this</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
