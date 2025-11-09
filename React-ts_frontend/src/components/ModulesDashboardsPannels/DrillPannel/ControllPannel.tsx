"use client";
import { useState } from "react";
import { Activity, Thermometer, Zap, Fan, BarChart2 } from "lucide-react";

// --- Types ---
interface Thresholds {
  min: number;
  warning: number;
  max: number;
}

interface SensorState {
  value?: number;
  thresholds: Thresholds;
  alertActive: boolean;
  icon: React.ReactNode;
  showHistory: boolean;
}

interface DrillModuleState {
  on: boolean;
  thresholds: Thresholds;
  alertActive: boolean;
  speed?: number; // example extra param
}

// --- Component ---
export default function ControlPanel() {
  const [sensors, setSensors] = useState<Record<string, SensorState>>({
    vibration: { value: 35, alertActive: true, thresholds: { min: 0, warning: 25, max: 50 }, icon: <Activity size={20} />, showHistory: false },
    temperature: { value: 60, alertActive: true, thresholds: { min: 20, warning: 50, max: 80 }, icon: <Thermometer size={20} />, showHistory: false },
    current: { value: 8, alertActive: true, thresholds: { min: 0, warning: 5, max: 10 }, icon: <Zap size={20} />, showHistory: false },
  });

  const [drills, setDrills] = useState<Record<string, DrillModuleState>>({
    DRILL001: { on: false, thresholds: { min: 0, warning: 50, max: 100 }, alertActive: true, speed: 50 },
    DRILL002: { on: true, thresholds: { min: 10, warning: 55, max: 90 }, alertActive: false, speed: 70 },
  });

  const [editingSensor, setEditingSensor] = useState<string | null>(null);
  const [editingDrill, setEditingDrill] = useState<string | null>(null);

  // --- Sensor Handlers ---
  const toggleHistory = (key: string) => {
    setSensors(prev => ({ ...prev, [key]: { ...prev[key], showHistory: !prev[key].showHistory } }));
  };
  const saveSensor = (key: string) => setEditingSensor(null);

  // --- Drill Handlers ---
  const toggleDrillOn = (key: string) => {
    setDrills(prev => ({ ...prev, [key]: { ...prev[key], on: !prev[key].on } }));
  };
  const saveDrill = (key: string) => setEditingDrill(null);

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 border-l border-gray-200 w-96">
      {/* Sensors */}
      <h3 className="text-gray-700 font-semibold text-sm">Sensors</h3>
      {Object.entries(sensors).map(([key, sensor]) => (
        <div key={key} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {sensor.icon}
              <div>
                <h4 className="text-gray-700 font-medium capitalize">{key}</h4>
                {sensor.value !== undefined && <p className="text-gray-500 text-sm">Value: {sensor.value}</p>}
              </div>
            </div>
            <button className="px-2 py-1 text-xs rounded bg-blue-500 text-white" onClick={() => setEditingSensor(key)}>
              Param
            </button>
          </div>

          {sensor.showHistory && (
            <div className="mt-2 p-2 bg-gray-100 rounded border border-gray-300 flex items-center gap-2">
              <BarChart2 size={16} />
              <span className="text-gray-600 text-xs">Historical data panel</span>
            </div>
          )}
        </div>
      ))}

      {/* Drills */}
      <h3 className="text-gray-700 font-semibold text-sm mt-4">Drill Modules</h3>
      {Object.entries(drills).map(([key, drill]) => (
        <div key={key} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
          <span className="font-medium">{key}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleDrillOn(key)}
              className={`px-2 py-1 rounded text-white ${drill.on ? "bg-green-500" : "bg-red-500"}`}
            >
              {drill.on ? "ON" : "OFF"}
            </button>
            <button className="px-2 py-1 text-xs rounded bg-blue-500 text-white" onClick={() => setEditingDrill(key)}>
              Param
            </button>
          </div>
        </div>
      ))}

      {/* Sensor Modal */}
      {editingSensor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg w-80 flex flex-col gap-3">
            <h3 className="text-gray-700 font-semibold text-sm capitalize">{editingSensor} Parameters</h3>
            <div className="flex items-center gap-2">
              <label className="text-gray-500 text-sm">Alert:</label>
              <input
                type="checkbox"
                checked={sensors[editingSensor].alertActive}
                onChange={e =>
                  setSensors(prev => ({ ...prev, [editingSensor]: { ...prev[editingSensor], alertActive: e.target.checked } }))
                }
              />
            </div>

            {(["min", "warning", "max"] as const).map(t => (
              <div key={t}>
                <label className="text-gray-500 text-xs">{t} threshold: {sensors[editingSensor].thresholds[t]}</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sensors[editingSensor].thresholds[t]}
                  onChange={e =>
                    setSensors(prev => ({
                      ...prev,
                      [editingSensor]: {
                        ...prev[editingSensor],
                        thresholds: { ...prev[editingSensor].thresholds, [t]: parseInt(e.target.value) },
                      },
                    }))
                  }
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}

            <button onClick={() => toggleHistory(editingSensor)} className="mt-2 px-2 py-1 text-xs rounded bg-gray-200 text-gray-700">
              {sensors[editingSensor].showHistory ? "Hide History" : "Show History"}
            </button>

            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setEditingSensor(null)} className="px-3 py-1 bg-gray-300 rounded text-gray-700 text-sm">Cancel</button>
              <button onClick={() => saveSensor(editingSensor)} className="px-3 py-1 bg-blue-500 rounded text-white text-sm">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Drill Modal */}
      {editingDrill && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg w-80 flex flex-col gap-3">
            <h3 className="text-gray-700 font-semibold text-sm capitalize">{editingDrill} Parameters</h3>
            <div className="flex items-center gap-2">
              <label className="text-gray-500 text-sm">Alert:</label>
              <input
                type="checkbox"
                checked={drills[editingDrill].alertActive}
                onChange={e =>
                  setDrills(prev => ({ ...prev, [editingDrill]: { ...prev[editingDrill], alertActive: e.target.checked } }))
                }
              />
            </div>

            {(["min", "warning", "max"] as const).map(t => (
              <div key={t}>
                <label className="text-gray-500 text-xs">{t} threshold: {drills[editingDrill].thresholds[t]}</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={drills[editingDrill].thresholds[t]}
                  onChange={e =>
                    setDrills(prev => ({
                      ...prev,
                      [editingDrill]: { ...prev[editingDrill], thresholds: { ...prev[editingDrill].thresholds, [t]: parseInt(e.target.value) } },
                    }))
                  }
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}

            {drills[editingDrill].speed !== undefined && (
              <div>
                <label className="text-gray-500 text-xs">Speed: {drills[editingDrill].speed}%</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={drills[editingDrill].speed}
                  onChange={e =>
                    setDrills(prev => ({
                      ...prev,
                      [editingDrill]: { ...prev[editingDrill], speed: parseInt(e.target.value) },
                    }))
                  }
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setEditingDrill(null)} className="px-3 py-1 bg-gray-300 rounded text-gray-700 text-sm">Cancel</button>
              <button onClick={() => saveDrill(editingDrill)} className="px-3 py-1 bg-blue-500 rounded text-white text-sm">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
