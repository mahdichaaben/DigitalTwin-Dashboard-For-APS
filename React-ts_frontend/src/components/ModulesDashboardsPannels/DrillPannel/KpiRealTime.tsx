import { useEffect, useState } from "react";
import { Gauge, Zap, Activity, Thermometer, CheckCircle, AlertTriangle } from "lucide-react";
import api from "@/lib/axiosConfig";

// List of sensor IDs to track
const SENSOR_IDS = [
  "drill_temp1",
  "drill_pressure1",
  "drill_motor_current1",
  "drill_vibration1",
];

interface SensorMeta {
  sensorId: string;
  name: string;
  sensorType: string;
  description: string;
  unit: string;
  minValue: number;
  maxValue: number;
  lastUpdate: string;
  isActive: boolean;
}

interface LatestLog {
  sensorId: string;
  timestamp: string;
  valueRaw: string;
  valueNumeric?: number;
}

// Optional mapping from sensorType to icon
const SENSOR_ICONS: Record<string, any> = {
  pressure: Gauge,
  current: Zap,
  temperature: Thermometer,
  humidity: Activity,
  vibration: Activity,
};

export default function MultiSensorCards() {
  const [metaById, setMetaById] = useState<Record<string, SensorMeta>>({});
  const [valuesById, setValuesById] = useState<Record<string, number>>({});

  // Fetch metadata once for all sensors
  useEffect(() => {
    let mounted = true;

    const fetchMeta = async () => {
      const map: Record<string, SensorMeta> = {};
      for (const id of SENSOR_IDS) {
        try {
          console.debug(`[DEBUG] Fetching meta for sensor ${id} from backend...`);
          const { data, status } = await api.get<SensorMeta>(`/api/Sensors/${id}`);
          if (!mounted) return;
          console.debug(`[DEBUG] Received meta for ${id}:`, data, `Status: ${status}`);
          map[id] = data;
        } catch (err: any) {
          if (err.response) {
            console.error(`[ERROR] Backend responded with error for meta ${id}:`, err.response.status, err.response.data);
          } else if (err.request) {
            console.error(`[ERROR] No response from backend for meta ${id}. Request:`, err.request);
          } else {
            console.error(`[ERROR] Failed to setup request for meta ${id}:`, err.message);
          }
        }
      }
      setMetaById(map);
    };

    fetchMeta();
    return () => { mounted = false; };
  }, []);

  // Poll latest values every 20 seconds
  useEffect(() => {
    let mounted = true;

    const fetchLatest = async () => {
      const newValues: Record<string, number> = {};
      for (const id of SENSOR_IDS) {
        try {
          console.debug(`[DEBUG] Fetching latest value for sensor ${id} from backend...`);
          const { data, status } = await api.get<LatestLog>(`/api/SensorLog/${id}/latest`);
          if (!mounted) return;
          console.debug(`[DEBUG] Received latest for ${id}:`, data, `Status: ${status}`);
          const num = data.valueRaw ? parseFloat(data.valueRaw) : data.valueNumeric;
          if (Number.isFinite(num)) {
            newValues[id] = Number(num.toFixed(1));
          } else {
            console.warn(`[WARN] Value for sensor ${id} is not a valid number:`, data.valueRaw, data.valueNumeric);
          }
        } catch (err: any) {
          if (err.response) {
            console.error(`[ERROR] Backend responded with error for latest value ${id}:`, err.response.status, err.response.data);
          } else if (err.request) {
            console.error(`[ERROR] No response from backend for latest value ${id}. Request:`, err.request);
          } else {
            console.error(`[ERROR] Failed to setup request for latest value ${id}:`, err.message);
          }
        }
      }
      setValuesById(prev => ({ ...prev, ...newValues }));
    };

    fetchLatest();
    const interval = setInterval(fetchLatest, 20000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Determine status
  const getStatus = (value: number, meta?: SensorMeta) => {
  const min = meta?.minValue ?? 0;
  const max = meta?.maxValue ?? 100;
  const critical = max * 1.2;

  if (value >= critical) return { color: "bg-red-100 text-red-700 border border-red-400", icon: AlertTriangle, label: "High" };
  if (value > max) return { color: "bg-orange-100 text-orange-700 border border-orange-400", icon: AlertTriangle, label: "High" };
  if (value < min) return { color: "bg-blue-100 text-blue-700 border border-blue-400", icon: AlertTriangle, label: "Low" };
  return { color: "bg-green-100 text-green-700 border border-green-400", icon: CheckCircle, label: "Normal" };
  };

  return (
    <div className="w-full h-full p-2 grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
      {SENSOR_IDS.map(id => {
        const meta = metaById[id];
        const value = valuesById[id] ?? 0;
        const status = getStatus(value, meta);
        const Icon = meta ? SENSOR_ICONS[meta.sensorType] ?? Gauge : Gauge;
        const StatusIcon = status.icon;

        return (
          <div key={id} className="bg-white border border-gray-200 p-2 flex flex-col gap-1 min-h-[88px] rounded">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Icon className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-gray-700 text-sm">{meta?.name ?? id}</span>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
                <StatusIcon className="w-3 h-3" /> {status.label}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {value} <span className="text-sm font-normal text-gray-500">{meta?.unit ?? ""}</span>
              </span>
              <div className="flex flex-col items-end text-xs text-gray-400">
                <span>Min: {meta?.minValue ?? 0}</span>
                <span>Max: {meta?.maxValue ?? 100}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
