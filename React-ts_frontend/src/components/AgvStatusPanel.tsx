import {
  CheckCircle,
  Activity,
  Loader2,
  AlertTriangle,
  MapPin,
  ArrowRight,
} from "lucide-react";

type AgvState = "IDLE" | "MOVING" | "LOADING" | "ERROR";

interface AgvStatus {
  agvId: string;
  fromStation: string;
  toStation: string;
  state: AgvState;
  progressPercent: number; // 0 to 100 for movement progress
  lastUpdated: string; // ISO timestamp
}

interface AgvStatusPanelProps {
  status: AgvStatus;
}

const getAgvStateIcon = (state: AgvState) => {
  switch (state) {
    case "IDLE":
      return <CheckCircle className="text-green-500" size={20}  />;
    case "MOVING":
      return <Activity className="text-blue-500 animate-spin" size={20}  />;
    case "LOADING":
      return <Loader2 className="text-yellow-500 animate-spin" size={20}  />;
    case "ERROR":
      return <AlertTriangle className="text-red-600" size={20}  />;
    default:
      return null;
  }
};

const AgvStatusPanel: React.FC<AgvStatusPanelProps> = ({ status }) => {
  const { agvId, fromStation, toStation, state, progressPercent, lastUpdated } = status;

  return (
    <div className="p-4 bg-white rounded shadow-sm border border-gray-200 max-w-sm w-full">
      <div className="flex items-center space-x-3 mb-3">
        {getAgvStateIcon(state)}
        <h2 className="font-semibold text-lg">{agvId}</h2>
      </div>

      <div className="flex items-center text-sm text-gray-600 space-x-2 mb-2">
        <MapPin size={16} />
        <span>
          <strong>{fromStation}</strong> <ArrowRight size={16} className="inline" />{" "}
          <strong>{toStation}</strong>
        </span>
      </div>

      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ease-in-out ${
              state === "ERROR"
                ? "bg-red-500"
                : state === "MOVING"
                ? "bg-blue-500"
                : state === "LOADING"
                ? "bg-yellow-400"
                : "bg-green-500"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1 text-right">
          Progress: {progressPercent}%
        </div>
      </div>

      <div className="text-xs text-gray-500 text-right italic" title={new Date(lastUpdated).toLocaleString()}>
        Updated: {new Date(lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default AgvStatusPanel;
