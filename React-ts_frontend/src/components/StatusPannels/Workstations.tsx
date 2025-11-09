interface ModuleLog {
  ref_module: string;
  timestamp: string;
  module_state: "IDLE" | "BUSY" | "RUNNING" | "ERROR" | string;
  type: string;
}

interface Props {
  workstations: ModuleLog[];
}

const getStatusColor = (state: string) => {
  switch (state.toUpperCase()) {
    case "IDLE":
      return "bg-green-100 text-green-800 border-green-200";
    case "BUSY":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "RUNNING":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "ERROR":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function WorkstationsPanel({ workstations }: Props) {
  return (
    <div className="space-y-3 p-4">
      {workstations.map((module) => (
        <div
          key={module.ref_module}
          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
        >
          <div>
            <div className="font-mono font-semibold text-slate-800">
              {module.ref_module}
            </div>
            <div className="text-xs text-slate-500">Workstation</div>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                module.module_state
              )}`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-1 ${
                  module.module_state.toUpperCase() === "IDLE"
                    ? "bg-green-500"
                    : module.module_state.toUpperCase() === "BUSY"
                    ? "bg-yellow-500 animate-pulse"
                    : module.module_state.toUpperCase() === "RUNNING"
                    ? "bg-blue-500"
                    : module.module_state.toUpperCase() === "ERROR"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              ></div>
              {module.module_state}
            </span>
            <div className="text-xs text-slate-400 mt-1">
              {new Date(module.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
