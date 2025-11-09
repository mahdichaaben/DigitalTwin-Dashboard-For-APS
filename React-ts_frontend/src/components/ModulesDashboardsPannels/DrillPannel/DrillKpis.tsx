"use client";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, TrendingUp } from "lucide-react";
import api from "@/lib/axiosConfig";

interface DrillLog {
  id: number;
  moduleSerialNumber: string;
  moduleName: string;
  moduleState: string | null;
  commandName: string; // PICK, DRILL, DROP
  wpId: string | null;
  status: string; // RUNNING, FINISHED, FAILED
  timestamp: string;
}

export default function DrillKpi() {
  const [logs, setLogs] = useState<DrillLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get<DrillLog[]>("/api/Log/modules", {
          params: { moduleSerial: "DRILL001" },
        });
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading Drill KPIs...</div>;

  // --- KPI Calculations ---
  const dropLogs = logs.filter((l) => l.commandName === "DROP" && l.status === "FINISHED");
  const totalWorkpieces = dropLogs.length;

  // Calculate cycle times per workpiece
  const wpCycleTimes: number[] = [];
  const logsByWp: Record<string, DrillLog[]> = {};
  logs.forEach((log) => {
    if (!log.wpId) return;
    if (!logsByWp[log.wpId]) logsByWp[log.wpId] = [];
    logsByWp[log.wpId].push(log);
  });

  Object.values(logsByWp).forEach((wpLogs) => {
    const pickTime = wpLogs.find((l) => l.commandName === "PICK" && l.status === "FINISHED")?.timestamp;
    const dropTime = wpLogs.find((l) => l.commandName === "DROP" && l.status === "FINISHED")?.timestamp;
    if (pickTime && dropTime) {
      wpCycleTimes.push(new Date(dropTime).getTime() - new Date(pickTime).getTime());
    }
  });

  const avgCycleTimeSec =
    wpCycleTimes.length > 0
      ? Math.round(wpCycleTimes.reduce((a, b) => a + b, 0) / wpCycleTimes.length / 1000)
      : 0;

  // Recent Failures in the last 10 minutes
  const recentFailures = logs.filter(
    (l) =>
      l.status === "FAILED" &&
      new Date(l.timestamp) > new Date(Date.now() - 10 * 60 * 1000)
  ).length;

  const kpiItems = [
    {
      label: "Workpieces Processed",
      value: totalWorkpieces,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      label: "Avg Cycle Time",
      value: `${avgCycleTimeSec}s`,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      label: "Recent Failures",
      value: recentFailures,
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];

  return (
    <div className="w-full h-full p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {kpiItems.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.label}
            className={`${kpi.bgColor} ${kpi.borderColor} border p-5 w-full h-full flex flex-col justify-between shadow-sm hover:shadow-md transition`}
          >
            <div className="flex items-center justify-between">
              <Icon className={`w-7 h-7 ${kpi.color}`} />
              <span className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</span>
            </div>
            <div className="text-sm text-gray-700 font-medium text-center">{kpi.label}</div>
          </div>
        );
      })}
    </div>
  );
}
