import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="pt-40 pb-24 max-w-lg mx-auto px-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-xl font-bold font-mono text-stone-800">
        404
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
          Page not found.
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          The requested engineering resource or link does not exist or may have been relocated.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to home</span>
        </Link>
      </div>
    </div>
  );
}
