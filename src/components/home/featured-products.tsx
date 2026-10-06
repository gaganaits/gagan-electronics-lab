import Link from "next/link";
import { getAllProducts } from "@/data/products";
import { ArrowRight, Layers, Gauge, Maximize2, Sparkles } from "lucide-react";

export function FeaturedProducts() {
  const products = getAllProducts();

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2 block">
              Production Equipment
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
              What we can help you print.
            </h2>
            <p className="mt-3 text-base text-stone-600">
              Our in-house fabrication fleet covers rapid FDM prototyping, high-definition resin MSLA, and continuous carbon-fiber reinforcement.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900 hover:text-stone-700 group self-start md:self-auto"
          >
            <span>View all machines & services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-stone-200/80 rounded-card-md p-6 sm:p-7 shadow-soft hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Category & Tech tag */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-800">
                    {product.category}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    {product.technology.split("(")[0]}
                  </span>
                </div>

                {/* Title & Short description */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 group-hover:text-stone-800 transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Key Technical Specifications Table */}
                <div className="pt-3 pb-1 border-t border-stone-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-stone-600">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <Maximize2 className="w-3.5 h-3.5" />
                      Build volume
                    </span>
                    <span className="font-semibold text-stone-800 text-right font-mono">
                      {product.buildVolume}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-stone-600">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <Layers className="w-3.5 h-3.5" />
                      Resolution
                    </span>
                    <span className="font-medium text-stone-800 text-right">
                      {product.layerResolution}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-stone-600">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <Gauge className="w-3.5 h-3.5" />
                      Print speed
                    </span>
                    <span className="font-medium text-stone-800 text-right">
                      {product.printSpeed}
                    </span>
                  </div>
                </div>

                {/* Material tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {product.supportedMaterials.slice(0, 4).map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded text-[11px] bg-stone-50 border border-stone-200 text-stone-600"
                    >
                      {m}
                    </span>
                  ))}
                  {product.supportedMaterials.length > 4 && (
                    <span className="px-1.5 py-0.5 text-[11px] text-stone-400">
                      +{product.supportedMaterials.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                <Link
                  href={`/products/${product.slug}`}
                  className="text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center gap-1"
                >
                  <span>Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href={`/request-quote?product=${encodeURIComponent(product.id)}`}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors"
                >
                  Request quote
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
