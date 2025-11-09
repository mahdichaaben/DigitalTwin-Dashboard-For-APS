"use client";
import { useState, useEffect, useCallback } from "react";
import { Cpu, Settings, Hammer, Drill, Warehouse, AlertCircle } from "lucide-react";

interface ModuleLog {
  ref_module: string;
  timestamp: string;
  module_state: "IDLE" | "BUSY" | "RUNNING" | "ERROR" | string;
}

const initialData: ModuleLog[] = [
  { ref_module: "DPS001", timestamp: "", module_state: "IDLE" },
  { ref_module: "AIQS001", timestamp: "", module_state: "BUSY" },
  { ref_module: "MILL001", timestamp: "", module_state: "IDLE" },
  { ref_module: "DRILL001", timestamp: "", module_state: "IDLE" },
  { ref_module: "HBW001", timestamp: "", module_state: "IDLE" },
];

const getIcon = (ref: string) => {
  if (ref.startsWith("DPS")) return <Cpu className="w-5 h-5" />;
  if (ref.startsWith("AIQS")) return <Settings className="w-5 h-5" />;
  if (ref.startsWith("MILL")) return <Hammer className="w-5 h-5" />;
  if (ref.startsWith("DRILL")) return <Drill className="w-5 h-5" />;
  if (ref.startsWith("HBW")) return <Warehouse className="w-5 h-5" />;
  return <AlertCircle className="w-5 h-5" />;
};

const ModuleStates: React.FC = () => {
  const [logs, setLogs] = useState<ModuleLog[]>(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => {
        const i = Math.floor(Math.random() * prev.length);
        const states = ["IDLE", "BUSY", "RUNNING", "ERROR"];
        const newState = states[Math.floor(Math.random() * states.length)];
        return prev.map((log, idx) =>
          idx === i ? { ...log, module_state: newState } : log
        );
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const getStateColor = useCallback((state: string) => {
    switch (state.toUpperCase()) {
      case "IDLE":
        return "bg-emerald-100 text-emerald-700";
      case "BUSY":
        return "bg-amber-100 text-amber-700";
      case "RUNNING":
        return "bg-blue-100 text-blue-700";
      case "ERROR":
        return "bg-red-100 text-red-700 animate-pulse";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }, []);

  return (
    <div className="p-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {logs.map(({ ref_module, module_state }) => (
          <div
            key={ref_module}
            className={`flex flex-col items-center justify-center rounded-xl p-4 border shadow-sm transform transition-transform hover:scale-105 ${getStateColor(module_state)}`}
          >
            <div className="mb-2">{getIcon(ref_module)}</div>
            <div className="text-sm font-bold tracking-wide">{ref_module}</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wide">
              {module_state}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleStates;
