"use client";

import { useState, useEffect } from "react";
import { Save, Calculator, RefreshCw, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { PricingConfig } from "@/types";

export default function AdminPricingPage() {
  const [pricingList, setPricingList] = useState<PricingConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Live Calculator Simulator State
  const [simMaterial, setSimMaterial] = useState("price-pla");
  const [simWeightGrams, setSimWeightGrams] = useState(80);
  const [simPrintHours, setSimPrintHours] = useState(3.5);
  const [simPostProcessing, setSimPostProcessing] = useState(true);

  const fetchPricing = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pricing");
      const data = await res.json();
      if (res.ok) {
        setPricingList(data.pricing || []);
        if (data.pricing?.length > 0) {
          setSimMaterial(data.pricing[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load pricing configs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const handleUpdateItem = async (item: PricingConfig) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update pricing");
      }

      setSuccessMsg(`Pricing for ${item.material} updated successfully.`);
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchPricing();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update pricing item");
    }
  };

  // Calculation Simulator
  const activeSimConfig = pricingList.find((p) => p.id === simMaterial);

  const calculateEstimate = () => {
    if (!activeSimConfig) return { baseCost: 0, margin: 0, total: 0 };

    const materialCost = (simWeightGrams / 1000) * activeSimConfig.materialRatePerKg;
    const machineCost = simPrintHours * activeSimConfig.machineRatePerHour;
    const electricityCost = simPrintHours * activeSimConfig.electricityRatePerHour;
    const labourCost = (simPrintHours > 5 ? 1.5 : 1) * (activeSimConfig.labourRatePerHour / 2);
    const postProcessCost = simPostProcessing ? activeSimConfig.postProcessingRate : 0;

    const baseCost = materialCost + machineCost + electricityCost + labourCost + postProcessCost;
    const withMargin = baseCost * (1 + activeSimConfig.marginPercent / 100);
    const total = Math.max(withMargin, activeSimConfig.minimumCharge);

    return {
      materialCost: Math.round(materialCost),
      machineCost: Math.round(machineCost),
      electricityCost: Math.round(electricityCost),
      labourCost: Math.round(labourCost),
      postProcessCost: Math.round(postProcessCost),
      baseCost: Math.round(baseCost),
      margin: Math.round(withMargin - baseCost),
      total: Math.round(total),
    };
  };

  const simResult = calculateEstimate();

  return (
    <div className="space-y-10 pb-16">
      {/* Title */}
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Cost Estimation & Pricing Configuration
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Configure material rates, machine rates per hour, labor fees, and test quotes with the live additive pricing simulator.
        </p>
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

      {/* Simulator Section */}
      <div className="bg-white border border-stone-200 rounded-card-md p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <Calculator className="w-5 h-5 text-stone-800" />
          <h2 className="text-base font-bold text-stone-900">
            Interactive Cost Estimation Simulator (Pre-Quote Tester)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Select Material
            </label>
            <select
              value={simMaterial}
              onChange={(e) => setSimMaterial(e.target.value)}
              className="w-full px-3 py-2 rounded-card-sm border border-stone-200 bg-[#FAF8F3]"
            >
              {pricingList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.material} (₹{p.materialRatePerKg}/kg)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Part Weight (Grams)
            </label>
            <input
              type="number"
              min="1"
              value={simWeightGrams}
              onChange={(e) => setSimWeightGrams(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 rounded-card-sm border border-stone-200 bg-[#FAF8F3] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Estimated Slicing Time (Hours)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={simPrintHours}
              onChange={(e) => setSimPrintHours(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
              className="w-full px-3 py-2 rounded-card-sm border border-stone-200 bg-[#FAF8F3] font-mono"
            />
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="bg-[#FAF8F3] border border-stone-200 rounded-card-sm p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-600 border-b border-stone-200/70 pb-2">
            <span>Material Consumption ({simWeightGrams}g):</span>
            <span className="font-mono font-medium">₹{simResult.materialCost}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-stone-600 border-b border-stone-200/70 pb-2">
            <span>Machine Depreciation & Wear ({simPrintHours} hrs):</span>
            <span className="font-mono font-medium">₹{simResult.machineCost}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-stone-600 border-b border-stone-200/70 pb-2">
            <span>Electricity & Chamber Heating:</span>
            <span className="font-mono font-medium">₹{simResult.electricityCost}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-stone-600 border-b border-stone-200/70 pb-2">
            <span>Technician Setup & Slicing QC:</span>
            <span className="font-mono font-medium">₹{simResult.labourCost}</span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-stone-500 block">
                Calculated Indicative Quote
              </span>
              <span className="text-[11px] text-stone-400">
                Inclusive of {activeSimConfig?.marginPercent}% margin
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-800">
              ₹{simResult.total}
            </div>
          </div>
        </div>
      </div>

      {/* Materials Configuration Table */}
      <div className="bg-white border border-stone-200 rounded-card-md shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900">
            Material & Machine Rate Configuration Table
          </h2>
          <button
            type="button"
            onClick={fetchPricing}
            className="p-1.5 rounded hover:bg-stone-100 text-stone-500"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF8F3] border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Material</th>
                <th className="py-3 px-3">Rate (₹ / kg)</th>
                <th className="py-3 px-3">Machine (₹ / hr)</th>
                <th className="py-3 px-3">Labour (₹ / hr)</th>
                <th className="py-3 px-3">Min Charge (₹)</th>
                <th className="py-3 px-3">Margin (%)</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {pricingList.map((item) => (
                <PricingRow key={item.id} item={item} onSave={handleUpdateItem} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PricingRow({
  item,
  onSave,
}: {
  item: PricingConfig;
  onSave: (updated: PricingConfig) => void;
}) {
  const [materialRate, setMaterialRate] = useState(item.materialRatePerKg);
  const [machineRate, setMachineRate] = useState(item.machineRatePerHour);
  const [labourRate, setLabourRate] = useState(item.labourRatePerHour);
  const [minCharge, setMinCharge] = useState(item.minimumCharge);
  const [margin, setMargin] = useState(item.marginPercent);

  const handleSaveRow = () => {
    onSave({
      ...item,
      materialRatePerKg: Number(materialRate),
      machineRatePerHour: Number(machineRate),
      labourRatePerHour: Number(labourRate),
      minimumCharge: Number(minCharge),
      marginPercent: Number(margin),
    });
  };

  return (
    <tr className="hover:bg-stone-50/70 transition-colors">
      <td className="py-3 px-4 font-bold text-stone-900">{item.material}</td>

      <td className="py-3 px-3">
        <input
          type="number"
          value={materialRate}
          onChange={(e) => setMaterialRate(parseFloat(e.target.value) || 0)}
          className="w-24 px-2 py-1 rounded border border-stone-200 bg-[#FAF8F3] font-mono text-xs"
        />
      </td>

      <td className="py-3 px-3">
        <input
          type="number"
          value={machineRate}
          onChange={(e) => setMachineRate(parseFloat(e.target.value) || 0)}
          className="w-20 px-2 py-1 rounded border border-stone-200 bg-[#FAF8F3] font-mono text-xs"
        />
      </td>

      <td className="py-3 px-3">
        <input
          type="number"
          value={labourRate}
          onChange={(e) => setLabourRate(parseFloat(e.target.value) || 0)}
          className="w-20 px-2 py-1 rounded border border-stone-200 bg-[#FAF8F3] font-mono text-xs"
        />
      </td>

      <td className="py-3 px-3">
        <input
          type="number"
          value={minCharge}
          onChange={(e) => setMinCharge(parseFloat(e.target.value) || 0)}
          className="w-20 px-2 py-1 rounded border border-stone-200 bg-[#FAF8F3] font-mono text-xs"
        />
      </td>

      <td className="py-3 px-3">
        <input
          type="number"
          value={margin}
          onChange={(e) => setMargin(parseFloat(e.target.value) || 0)}
          className="w-16 px-2 py-1 rounded border border-stone-200 bg-[#FAF8F3] font-mono text-xs"
        />
      </td>

      <td className="py-3 px-4 text-right">
        <button
          type="button"
          onClick={handleSaveRow}
          className="px-3 py-1 rounded bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-colors"
        >
          Save
        </button>
      </td>
    </tr>
  );
}
