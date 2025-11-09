"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axiosConfig"; // adjust path if needed

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

export default function StoreStatePanel() {
  const [store, setStore] = useState<Store | null>(null);

  const fetchStore = async () => {
    try {
      const { data } = await api.get<Store>("/api/Factory/store");
      setStore(data);
    } catch (error) {
      console.error("Failed to fetch store", error);
    }
  };

  useEffect(() => {
    fetchStore();
    const interval = setInterval(fetchStore, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  if (!store) return <div>Loading store state...</div>;

  return (
    <div className="">
      {store.storageModules.map((module) => (
        <div key={module.serialNumber} className="mb-6">
          <h3 className="font-semibold mb-2">{module.name}</h3>
          <div className="grid grid-cols-3 gap-2">
            {module.slots.map((slot) => (
              <div
                key={slot.id}
                className={`relative p-3 border rounded text-center transition group cursor-pointer ${
                  slot.workpieceId ? "bg-green-200" : "bg-gray-100"
                }`}
              >
                {/* Slot name always visible */}
                <div className="font-bold text-sm">{slot.slotName}</div>

                {/* Tooltip appears on hover */}
                {slot.workpieceId && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1 text-xs rounded bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div>ID: {slot.workpieceId}</div>
                    <div>Type: {slot.workpieceTypeName}</div>
                  </div>
                )}
                {!slot.workpieceId && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1 text-xs rounded bg-gray-700 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Empty
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
