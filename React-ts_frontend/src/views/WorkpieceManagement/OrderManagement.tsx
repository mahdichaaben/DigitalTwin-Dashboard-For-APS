import { useEffect, useState } from "react";
import api from "@/lib/axiosConfig";

export type OrderDto = {
  id: string;
  workpieces: { id: string }[];
};

export type CreateStoreOrderRequest = {
  orderId: string;
  workpieceIds: string[];
};

export type CreateUnstoreOrderRequest = {
  orderId: string;
  workpieceIds: string[];
};

export type CreateProductionOrderRequest = {
  workpieceIds: string[];
};

export default function OrderManagement() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [workpieceIdsInput, setWorkpieceIdsInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get<OrderDto[]>("/api/Order");
      setOrders(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const addWorkpieces = async () => {
    if (!selectedOrderId || !workpieceIdsInput) return;
    const workpieceIds = workpieceIdsInput.split(",").map((id) => id.trim());
    const payload: CreateStoreOrderRequest = { orderId: selectedOrderId, workpieceIds };
    try {
      await api.post("/api/Order/AddWorkpieces", payload);
      fetchOrders();
      setWorkpieceIdsInput("");
    } catch (err: any) {
      setError(err.message || "Failed to add workpieces");
    }
  };

  const removeWorkpieces = async () => {
    if (!selectedOrderId || !workpieceIdsInput) return;
    const workpieceIds = workpieceIdsInput.split(",").map((id) => id.trim());
    const payload: CreateUnstoreOrderRequest = { orderId: selectedOrderId, workpieceIds };
    try {
      await api.post("/api/Order/RemoveWorkpieces", payload);
      fetchOrders();
      setWorkpieceIdsInput("");
    } catch (err: any) {
      setError(err.message || "Failed to remove workpieces");
    }
  };

  const createProductionOrder = async () => {
    if (!workpieceIdsInput) return;
    const workpieceIds = workpieceIdsInput.split(",").map((id) => id.trim());
    const payload: CreateProductionOrderRequest = { workpieceIds };
    try {
      await api.post("/api/Order/production", payload);
      fetchOrders();
      setWorkpieceIdsInput("");
    } catch (err: any) {
      setError(err.message || "Failed to create production order");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Order Management</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">All Orders</h3>
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Select</th>
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left"># Workpieces</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className={selectedOrderId === order.id ? "bg-blue-50" : ""}>
                  <td className="px-4 py-2">
                    <input
                      type="radio"
                      name="selectedOrder"
                      value={order.id}
                      checked={selectedOrderId === order.id}
                      onChange={() => setSelectedOrderId(order.id)}
                      className="h-4 w-4 text-blue-600"
                    />
                  </td>
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">{order.workpieces.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Manage Workpieces</h3>
        <p className="mb-2">Enter workpiece IDs comma separated:</p>
        <input
          type="text"
          value={workpieceIdsInput}
          onChange={(e) => setWorkpieceIdsInput(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={addWorkpieces}
            disabled={!selectedOrderId}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            Add Workpieces
          </button>
          <button
            onClick={removeWorkpieces}
            disabled={!selectedOrderId}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-300"
          >
            Remove Workpieces
          </button>
          <button
            onClick={createProductionOrder}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Create Production Order
          </button>
        </div>
      </div>
    </div>
  );
}
