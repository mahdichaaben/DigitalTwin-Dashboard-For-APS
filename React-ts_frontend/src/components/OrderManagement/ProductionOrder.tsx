import { useEffect, useState } from "react";
import api from "@/lib/axiosConfig";
import { Plus, X, RefreshCw, Search } from "lucide-react";

import OpenModalButton from "@/components/ui/OpenModalButton";

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

interface ProductionOrderResponse {
  id: string;
  status: string;
  requestedBy: string;
  createdAt: string;
  orderType: string;
}

export default function ProductionOrder() {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedWorkpieces, setSelectedWorkpieces] = useState<string[]>([]);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderResponse, setOrderResponse] = useState<ProductionOrderResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
  }, []);

  const storedWorkpieces = store
    ? store.storageModules.flatMap((module) =>
        module.slots.filter((slot) => slot.workpieceId)
      )
    : [];

  const filteredWorkpieces = storedWorkpieces.filter(
    (slot) =>
      slot.workpieceId!.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slot.workpieceTypeName!.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectWorkpiece = (id: string) => {
    setSelectedWorkpieces((prev) =>
      prev.includes(id) ? prev.filter((wpId) => wpId !== id) : [...prev, id]
    );
  };

  const handleCreateProductionOrder = async () => {
    if (!selectedWorkpieces.length) return;

    try {
      setCreatingOrder(true);
      const res = await api.post<ProductionOrderResponse>("/api/Order/production", {
        factoryId: "FACTORY001",
        requestedBy: "mahdi",
        workpieceIds: selectedWorkpieces,
      });
      setOrderResponse(res.data);
      setSelectedWorkpieces([]);
      fetchStore();
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create production order:", err);
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading || !store) return <div className="p-4">Loading store data...</div>;

  return (
    <>


<OpenModalButton
  label="Select workpieces For Production Order"
  icon={<Plus className="w-5 h-5" />}
  className="w-full bg-white text-green-600 border-2 border-green-600 hover:bg-gradient-to-r hover:from-green-600 hover:to-green-700 hover:text-white py-3 font-medium transition-all duration-200"
  onClick={() => setShowModal(true)}
/>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Select Workpieces</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search + Refresh */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by ID or Type..."
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <button
                onClick={fetchStore}
                className="flex items-center gap-1 px-3 py-2 border rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>

            {/* Workpieces List */}
            <div className="overflow-y-auto flex-1 border rounded-md p-2 bg-gray-50">
              {filteredWorkpieces.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No workpieces available.</div>
              ) : (
                <ul className="space-y-2">
                  {filteredWorkpieces.map((slot) => (
                    <li
                      key={slot.slotName}
                      onClick={() => handleSelectWorkpiece(slot.workpieceId!)}
                      className={`flex justify-between items-center p-2 border rounded cursor-pointer transition ${
                        selectedWorkpieces.includes(slot.workpieceId!)
                          ? "bg-green-100"
                          : "bg-white"
                      }`}
                    >
                      <div>
                        <div className="font-medium text-sm">{slot.workpieceId}</div>
                        <div className="text-xs text-gray-600">{slot.workpieceTypeName}</div>
                        <div className="text-xs text-gray-500">{slot.workpieceState}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedWorkpieces.includes(slot.workpieceId!)}
                        readOnly
                        className="w-4 h-4"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t">
              <span className="text-sm text-gray-700">
                Selected: {selectedWorkpieces.join(", ") || "None"}
              </span>
              <button
                onClick={handleCreateProductionOrder}
                disabled={creatingOrder || !selectedWorkpieces.length}
                className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700"
              >
                {creatingOrder ? "Creating..." : "Create Production Order"}
              </button>
            </div>

            {orderResponse && (
              <div className="p-2 mt-2 bg-green-100 text-green-800 rounded text-sm">
                Order created! ID: {orderResponse.id}, Status: {orderResponse.status}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
