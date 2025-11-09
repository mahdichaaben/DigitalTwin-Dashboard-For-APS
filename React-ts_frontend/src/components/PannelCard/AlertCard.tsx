"use client";
import { useEffect, useMemo, useState } from "react";
import { Bell, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/axiosConfig";

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
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const AlertCard: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const fetchAlerts = async () => {
    try {
      setError(null);
      setRefreshing(true);
      const { data } = await api.get<AlertItem[]>("/api/Alert");
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlerts(); // no auto-polling; manual refresh if needed
  }, []);

  const firingCount = useMemo(
    () => alerts.filter((a) => a.status?.toLowerCase() === "firing").length,
    [alerts]
  );
  const totalCount = alerts.length;

  // Pagination logic
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const pagedAlerts = alerts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <Bell className="w-4 h-4 text-green-600" />
          <h3 className="text-sm font-semibold text-slate-900">Alerts</h3>
          <span className="text-xs text-slate-500">{totalCount} total</span>
          <span className="text-xs text-red-600 font-medium">{firingCount} firing</span>
        </div>
        <button
          type="button"
          onClick={() => { fetchAlerts(); setPage(1); }}
          disabled={refreshing}
          className="ml-2 p-1 rounded-full bg-white border border-gray-200 shadow hover:bg-gray-100 focus:outline-none"
          title="Refresh alerts"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin text-blue-400" : "text-blue-600"}`} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 divide-y divide-slate-100 overflow-auto">
        {loading ? (
          <div className="px-4 py-6 text-sm text-slate-500">Loading…</div>
        ) : error ? (
          <div className="px-4 py-6 text-sm text-red-600 bg-red-50">{error}</div>
        ) : totalCount === 0 ? (
          <div className="px-4 py-6 text-sm text-slate-500">No alerts.</div>
        ) : (
          pagedAlerts.map((a) => {
            const started = parseDateSafe(a.startedAt);
            const isFiring = a.status?.toLowerCase() === "firing";
            return (
              <div key={a.alertId} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  {/* Status dot */}
                  <div className="mt-1">
                    <div className={`w-2 h-2 rounded-full ${isFiring ? "bg-red-500" : "bg-green-500"}`} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${isFiring ? "text-red-600" : "text-green-600"}`}>
                        {isFiring ? "Firing" : "Resolved"}
                      </span>
                      <span className="text-xs text-slate-500">{timeAgo(started)}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                        <AlertCircle className="w-3 h-3" />
                        {a.digitalModuleId}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-mono">
                        {a.sensorId}
                      </span>
                      <span className="text-slate-600">{a.alertType}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination controls */}
      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-2 py-2 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            className="p-1 rounded hover:bg-slate-200 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-slate-700">Page {page} of {pageCount}</span>
          <button
            type="button"
            className="p-1 rounded hover:bg-slate-200 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertCard;

