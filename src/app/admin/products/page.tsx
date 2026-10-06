"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { Cpu, RefreshCw, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !currentActive }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update product");
      }

      setSuccessMsg("Product visibility updated.");
      setTimeout(() => setSuccessMsg(""), 2500);
      fetchProducts();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update product state");
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            3D Printing Hardware & Service Catalog
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Manage public visibility, operational capacity, and machine profiles.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchProducts}
          className="p-2 rounded border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-card-sm text-xs font-medium text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-card-sm text-xs font-medium text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className={`bg-white border rounded-card-md p-6 shadow-sm space-y-4 transition-all ${
              p.active ? "border-stone-200" : "border-stone-200/60 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-800">
                {p.category}
              </span>

              <button
                type="button"
                onClick={() => handleToggleActive(p.id, p.active)}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  p.active
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                }`}
              >
                {p.active ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Active in Public Catalog</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hidden (Offline)</span>
                  </>
                )}
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-900">{p.name}</h3>
              <p className="text-xs text-stone-500 font-mono mt-0.5">{p.technology}</p>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                {p.shortDescription}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-stone-400 block text-[11px]">Build Volume</span>
                <span className="font-semibold text-stone-800 font-mono text-[11px]">
                  {p.buildVolume}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">Resolution</span>
                <span className="font-semibold text-stone-800 text-[11px]">
                  {p.layerResolution}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">Max Speed</span>
                <span className="font-semibold text-stone-800 text-[11px]">
                  {p.printSpeed}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
