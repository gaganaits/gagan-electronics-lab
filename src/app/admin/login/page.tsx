"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      try {
        const res = await fetch("/api/admin/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
          router.push("/admin");
          router.refresh();
          return;
        }
      } catch (fetchErr) {
        // Static GitHub Pages fallback
      }

      // Demo login support for GitHub Pages reviewer demo
      if (
        (email.toLowerCase() === "admin@gaganelectronicslab.com" || email.toLowerCase() === "gaganaits@gmail.com") &&
        (password === "GaganLab2026!" || password === "admin123")
      ) {
        if (typeof window !== "undefined") {
          localStorage.setItem("gel_admin_demo_session", "true");
        }
        router.push("/admin");
        return;
      }

      throw new Error("Invalid credentials. Try admin@gaganelectronicslab.com / GaganLab2026!");
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative z-20">
      <div className="w-full max-w-md bg-white border border-stone-200/90 rounded-card-xl p-8 sm:p-10 shadow-soft-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto text-lg font-bold shadow-sm">
            <span className="text-coral-300">G</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Staff Portal Login
          </h1>
          <p className="text-xs text-stone-500">
            Gagan Electronics Lab Administration & Quotations
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-card-sm bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gaganelectronicslab.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-card-sm border border-stone-200 text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-card-sm border border-stone-200 text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full text-xs sm:text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign in to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <Link href="/" className="hover:text-stone-900 transition-colors">
            ← Return to main site
          </Link>
          <span className="flex items-center gap-1 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Secure Session
          </span>
        </div>
      </div>
    </div>
  );
}
