// components/panels/AgvFleet.tsx
import { ModuleLog } from "@/types"; // Adjust path based on your actual file

interface Props {
  agvFleet: ModuleLog[];
  getStatusColor: (state: string) => string;
}

export default function AgvFleet({ agvFleet, getStatusColor }: Props) {
  return (
    <div className="space-y-3 p-4">
      {agvFleet.map((module) => (
        <div key={module.ref_module} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div>
            <div className="font-mono font-semibold text-slate-800">{module.ref_module}</div>
            <div className="text-xs text-slate-500">Automated Guided Vehicle</div>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(module.module_state)}`}>
              <div className={`w-2 h-2 rounded-full mr-1 ${
                module.module_state.toUpperCase() === "IDLE" ? "bg-green-500" :
                module.module_state.toUpperCase() === "BUSY" ? "bg-yellow-500 animate-pulse" :
                module.module_state.toUpperCase() === "RUNNING" ? "bg-blue-500" :
                "bg-gray-500"
              }`}></div>
              {module.module_state}
            </span>
            <div className="text-xs text-slate-400 mt-1">{new Date(module.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
