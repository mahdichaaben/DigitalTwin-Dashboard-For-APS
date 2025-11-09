"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axiosConfig";
import ProductionOrder from "./ProductionOrder";
import StoreModules from "./StoreModules";
import AddWorkpiecesToStore from "./AddWorkpiecesToStore";
import RemoveWorkpiecesFromStore from "./RemoveWorkpiecesFromStore";

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

export default function Inventory() {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStore = async () => {
    try {
      setLoading(true);
      const res = await api.get<Store>("/api/Factory/store");
      setStore(res.data);
    } catch (err) {
      console.error("Failed to fetch store:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStore();
    const interval = setInterval(fetchStore, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!store) return <div className="p-4">Loading store state...</div>;

  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white space-y-6 border-green-100">
      
      {/* Responsive flex container for action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <AddWorkpiecesToStore />
        </div>
        <div className="flex-1">
          <RemoveWorkpiecesFromStore />
        </div>
        <div className="flex-1">
          <ProductionOrder />
        </div>
      </div>

      {/* Store Modules Section */}
      <StoreModules />

    </div>
  );
}
