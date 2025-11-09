"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axiosConfig";
import { RefreshCw } from "lucide-react";

interface Slot {
  id: number;
  slotName: string;
  workpieceId: string | null;
  workpieceState: string | null;
  workpieceTypeName: string | null;
}

interface StorageModule {
  serialNumber: string;
  name: string;
  slots: Slot[];
}

interface Store {
  serialNumber: string;
  name: string;
  storageModules: StorageModule[];
}

export default function StoreModules() {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStore = async () => {
    try {
      setLoading(true);
      const res = await api.get<Store>("/api/Factory/store");
      setStore(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch store:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (typeName: string | null) => {
    if (!typeName) return "#9CA3AF"; // gray if no type
    switch (typeName.toUpperCase()) {
      case "RED":
        return "#EF4444";
      case "BLUE":
        return "#3B82F6";
      case "WHITE":
        return "#c6cbd4";
      case "GREEN":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  useEffect(() => {
    fetchStore();
    const interval = setInterval(fetchStore, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!store) return <div className="p-4">Loading store state...</div>;

  return (
    <div className="space-y-4 p-4 w-full h-full rounded bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* <button
            onClick={fetchStore}
            disabled={loading}
            className="flex items-center gap-1 text-sm text-gray-700 hover:text-black transition"
            title="Refresh Panel"
          >
            <RefreshCw className="w-4 h-4" />
          </button> */}
          {/* <div className="text-xs text-gray-500">
            {lastUpdated
              ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
              : ""}
          </div> */}
        </div>
      </div>

      {/* Modules */}
      {store.storageModules.map((module) => (
        <div key={module.serialNumber} className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">
              {module.name}{" "}
              <span className="text-xs text-gray-500">
                ({module.serialNumber})
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Slots: {module.slots.length}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {module.slots.map((slot) => (
              <div
                key={`${slot.id}-${Math.random().toString(36).substr(2, 9)}`} // random unique key
                className="p-3 border rounded text-center flex items-center justify-center gap-2 relative group"
              >
                <div className="flex flex-col items-center">
                  <div className="font-bold">{slot.slotName}</div>
                  {slot.workpieceId ? (
                    <div className="flex items-center gap-2 mt-1 relative">
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: getTypeColor(slot.workpieceTypeName),
                        }}
                      ></span>
                      {/* Hover reveal */}
                      <span className="absolute -bottom-6 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                        {slot.workpieceId}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-1 text-gray-500">Empty</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
