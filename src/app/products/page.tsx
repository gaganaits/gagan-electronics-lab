import Link from "next/link";
import { getAllProducts } from "@/data/products";
import { ArrowRight, Maximize2, Layers, Gauge, Shield, Cpu } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Printers & Fabrication Hardware | Gagan Electronics Lab",
  description:
    "Explore our in-house fleet of industrial FDM, high-resolution MSLA Resin, and Carbon-Fiber composite 3D printers. Detailed build volumes, layer resolutions, and technical specifications.",
};

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <div className="pt-32 sm:pt-40 pb-24 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2 block">
          Equipment & Services
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          In-house 3D printing equipment.
        </h1>
        <p className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed">
          From large-format functional enclosures to sub-millimeter resin snap-fits and stiff carbon-fiber nylon brackets. Every machine in our fleet is calibrated and maintained for dimensional accuracy.
        </p>
      </div>

      {/* Product List */}
      <div className="space-y-8 sm:space-y-12">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-stone-200/90 rounded-card-lg p-6 sm:p-10 shadow-soft hover:shadow-soft-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Visual Column */}
            <div className="lg:col-span-5 bg-gradient-to-br from-stone-100 to-stone-50 rounded-card-md p-8 border border-stone-200/70 flex flex-col justify-between min-h-[260px] relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-stone-900 border border-stone-200 shadow-sm">
                  {product.category}
                </span>
                <span className="text-xs font-mono text-stone-500">
                  {product.buildVolume !== "N/A" ? product.buildVolume : "Custom Sizing"}
                </span>
              </div>

              {/* Graphic icon representation */}
              <div className="my-8 flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-white border border-stone-200 flex items-center justify-center shadow-soft text-stone-800 group-hover:scale-105 transition-transform">
                  <Cpu className="w-10 h-10 text-stone-700" />
                </div>
              </div>

              <div className="text-xs text-stone-500 font-medium">
                {product.technology}
              </div>
            </div>

            {/* Description & Specifications Column */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
                  {product.name}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-stone-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Key specs highlight */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100 text-xs">
                <div>
                  <span className="text-stone-400 block mb-1">Build Volume</span>
                  <span className="font-semibold text-stone-800 font-mono text-xs sm:text-sm">
                    {product.buildVolume}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-1">Layer Resolution</span>
                  <span className="font-semibold text-stone-800 text-xs sm:text-sm">
                    {product.layerResolution}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-1">Max Speed</span>
                  <span className="font-semibold text-stone-800 text-xs sm:text-sm">
                    {product.printSpeed}
                  </span>
                </div>
              </div>

              {/* Materials */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                  Supported Materials
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.supportedMaterials.map((m) => (
                    <span
                      key={m}
                      className="px-2.5 py-1 rounded-full text-xs bg-stone-50 border border-stone-200 text-stone-700"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-3">
                <Link
                  href={`/products/${product.slug}`}
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors flex items-center gap-1.5"
                >
                  <span>Full technical specifications</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={`/request-quote?product=${encodeURIComponent(product.id)}`}
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors"
                >
                  Request quote with this machine
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
