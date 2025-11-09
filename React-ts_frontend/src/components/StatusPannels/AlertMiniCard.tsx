"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axiosConfig";
import { Bell, AlertTriangle, RefreshCw, Cpu, Box } from "lucide-react";

type AlertStatus = "firing" | "resolved" | string;

interface AlertItem {
  alertId: string;
  digitalModuleId: string;
  alertType: string;
  sensorId: string;
  startedAt: string;
  endedAt: string | null;
  status: AlertStatus;
  summary: string;
}

function parseDateSafe(value: string | null | undefined): Date | null {
  if (!value) return null;
  if (value === "-infinity") return null;
  const normalized = value.includes(" ") && !value.includes("T") ? value.replace(" ", "T") : value;
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? null : d;
}

function timeAgo(date: Date | null): string {
  if (!date) return "—";
  const diff = Math.max(0, Date.now() - date.getTime());
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function AlertMiniCard() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Minimal fetch; using filter endpoint without params to align with table behavior
      const { data } = await api.get<AlertItem[]>("/api/Alert/filter");
      const sorted = [...data].sort((a, b) => {
        const da = parseDateSafe(a.startedAt)?.getTime() ?? 0;
        const db = parseDateSafe(b.startedAt)?.getTime() ?? 0;
        return db - da;
      });
      setAlerts(sorted);
    } catch (e: any) {
      setError(e?.message || "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts(); // no auto-polling; manual refresh only
  }, []);

  const firingCount = alerts.filter(a => a.status?.toLowerCase() === "firing").length;

  return (
    <div className="h-full w-full flex flex-col bg-white border rounded-md">
      {/* Header */}
      <div className="px-3 py-2 border-b flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Bell className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium truncate">Alerts</span>
          <span className="text-xs text-gray-500">({alerts.length})</span>
          {firingCount > 0 && (
            <span className="ml-1 inline-flex items-center gap-1 text-[10px] text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
              <AlertTriangle className="w-3 h-3" />{firingCount}
            </span>
          )}
        </div>
        <button
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
          onClick={fetchAlerts}
          disabled={loading}
          title="Refresh"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          {loading ? "" : "Refresh"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded p-2">{error}</div>
        )}
        {loading && !error ? (
          <div className="text-center text-gray-500 text-sm py-8">Loading…</div>
        ) : alerts.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">No alerts</div>
        ) : (
          alerts.slice(0, 10).map((a) => {
            const isFiring = a.status?.toLowerCase() === "firing";
            const started = parseDateSafe(a.startedAt);
            const ended = parseDateSafe(a.endedAt || undefined);
            return (
              <div key={a.alertId} className="p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isFiring ? "bg-red-500" : "bg-green-500"}`} />
                  <span className="text-xs font-mono text-gray-800 truncate" title={`Module ${a.digitalModuleId}`}>{a.digitalModuleId}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700" title="Alert type">{a.alertType}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-600">
                  <span className="inline-flex items-center gap-1"><Cpu className="w-3 h-3 text-gray-400" />{a.sensorId}</span>
                  <span>•</span>
                  <span title={started ? started.toLocaleString() : a.startedAt}>start {timeAgo(started)}</span>
                  {ended && (
                    <>
                      <span>•</span>
                      <span title={ended.toLocaleString()}>end {timeAgo(ended)}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
