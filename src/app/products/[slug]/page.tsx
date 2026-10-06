import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getAllProducts } from "@/data/products";
import { ArrowLeft, ArrowRight, CheckCircle2, Cpu, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) {
    return { title: "Product Not Found | Gagan Electronics Lab" };
  }

  return {
    title: `${product.name} | Gagan Electronics Lab 3D Printing`,
    description: product.shortDescription,
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="pt-32 sm:pt-40 pb-24 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Breadcrumb / Back link */}
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all printers</span>
        </Link>
      </div>

      {/* Main product visual & summary */}
      <div className="bg-white border border-stone-200/90 rounded-card-xl p-8 sm:p-12 shadow-soft space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-stone-100 pb-8">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-900 border border-stone-200">
                {product.category}
              </span>
              <span className="text-xs font-mono text-stone-500">
                {product.technology}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
              {product.name}
            </h1>

            <p className="text-base text-stone-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <Link
            href={`/request-quote?product=${encodeURIComponent(product.id)}`}
            className="px-6 py-3.5 rounded-full text-sm font-semibold bg-coral-300 hover:bg-coral-400 text-stone-900 shadow-coral transition-colors flex items-center gap-2 shrink-0"
          >
            <span>Request a quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Detailed Engineering Specifications Table */}
        <div>
          <h2 className="text-xl font-bold text-stone-900 mb-4">
            Technical Specifications
          </h2>

          <div className="bg-[#FAF8F3] border border-stone-200 rounded-card-md overflow-hidden">
            <dl className="divide-y divide-stone-200/70 text-xs sm:text-sm">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div
                  key={key}
                  className="px-6 py-3.5 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-white transition-colors"
                >
                  <dt className="font-semibold text-stone-700">{key}</dt>
                  <dd className="mt-1 font-mono text-stone-900 sm:col-span-2 sm:mt-0 font-medium">
                    {val}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Supported Materials */}
        <div>
          <h2 className="text-xl font-bold text-stone-900 mb-3">
            Supported Filaments & Materials
          </h2>
          <div className="flex flex-wrap gap-2">
            {product.supportedMaterials.map((mat) => (
              <span
                key={mat}
                className="px-3 py-1.5 rounded-full text-xs sm:text-sm bg-sage-50 border border-sage-200 text-stone-800 font-medium"
              >
                {mat}
              </span>
            ))}
          </div>
        </div>

        {/* Real Applications */}
        <div>
          <h2 className="text-xl font-bold text-stone-900 mb-3">
            Verified Applications
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-stone-700">
            {product.applications.map((app, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{app}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom CTA Card */}
        <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-50 p-6 rounded-card-md border border-stone-200">
          <div>
            <h3 className="font-bold text-stone-900 text-base">
              Ready to manufacture with this machine?
            </h3>
            <p className="text-xs text-stone-600">
              Upload your CAD models for a free engineering review and quote.
            </p>
          </div>

          <Link
            href={`/request-quote?product=${encodeURIComponent(product.id)}`}
            className="px-6 py-3 rounded-full text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors w-full sm:w-auto text-center"
          >
            Request quote with this machine
          </Link>
        </div>
      </div>
    </div>
  );
}
