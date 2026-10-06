"use client";

import { useState, useEffect } from "react";
import { AuditLog } from "@/types";
import { Shield, RefreshCw } from "lucide-react";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/audit-logs");
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Security & Operational Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Immutable log of staff actions, file accesses, price modifications, and status changes.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLogs}
          className="p-2 rounded border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-stone-200 rounded-card-md shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-stone-500">
            Loading audit records...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">
            No audit records logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F3] border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource Target</th>
                  <th className="py-3 px-4">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 text-stone-500 text-[11px] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("en-IN")}
                    </td>

                    <td className="py-3 px-4 font-sans font-medium text-stone-900">
                      {log.adminEmail}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 text-[11px] font-semibold font-sans">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-stone-700">
                      <span className="text-stone-400 font-sans text-[11px]">{log.resourceType}: </span>
                      <span className="font-bold">{log.resourceId}</span>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-stone-500 max-w-xs truncate">
                      {log.metadata ? JSON.stringify(log.metadata) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
