"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axiosConfig";
import { Plus, X, RefreshCw, Search } from "lucide-react";

import OpenModalButton from "@/components/ui/OpenModalButton";

interface Workpiece {
  id: string;
  state: string;
  typeName: string;
  addedBy: string;
}

interface AddWorkpiecesResponse {
  id: string;
  status: string;
  requestedBy: string;
  createdAt: string;
  orderType: string;
}

export default function AddWorkpiecesToStore() {
  const [workpieces, setWorkpieces] = useState<Workpiece[]>([]);
  const [filteredWorkpieces, setFilteredWorkpieces] = useState<Workpiece[]>([]);
  const [selectedWorkpieces, setSelectedWorkpieces] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [addResponse, setAddResponse] = useState<AddWorkpiecesResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchWorkpieces = async () => {
    try {
      const { data } = await api.get<Workpiece[]>("/api/Workpiece/all");
      const freeWPs = data.filter((wp) => wp.state === "FREE");
      setWorkpieces(freeWPs);
      setFilteredWorkpieces(freeWPs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkpieces();
  }, []);

  // Filter by search term
  useEffect(() => {
    const filtered = workpieces.filter(
      (wp) =>
        wp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wp.typeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWorkpieces(filtered);
  }, [searchTerm, workpieces]);

  const handleWorkpieceSelect = (id: string) => {
    setSelectedWorkpieces((prev) =>
      prev.includes(id) ? prev.filter((wpId) => wpId !== id) : [...prev, id]
    );
  };

  const handleAddWorkpieces = async () => {
    if (!selectedWorkpieces.length) return;
    try {
      setAdding(true);
      const res = await api.post<AddWorkpiecesResponse>("/api/Order/AddWorkpieces", {
        factoryId: "FACTORY001",
        requestedBy: "mahdi",
        workpieceIds: selectedWorkpieces,
      });
      setAddResponse(res.data);
      setSelectedWorkpieces([]);
      fetchWorkpieces();
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
<OpenModalButton
  label="Add Free Workpieces To Store"
  icon={<Plus className="w-5 h-5" />}
  className="w-full bg-white text-blue-600 border-2 border-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white py-3  font-medium transition-all duration-200"
  onClick={() => setShowModal(true)}
/>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add Workpieces to Store</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by ID or Type..."
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button
                onClick={fetchWorkpieces}
                className="flex items-center gap-1 px-3 py-2 border rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>

            {/* Workpieces List */}
            <div className="overflow-y-auto flex-1 border rounded-md p-2 bg-gray-50">
              {filteredWorkpieces.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No FREE workpieces found.</div>
              ) : (
                <ul className="space-y-2">
                  {filteredWorkpieces.map((wp) => (
                    <li
                      key={wp.id}
                      onClick={() => handleWorkpieceSelect(wp.id)}
                      className={`flex justify-between items-center p-2 border rounded cursor-pointer transition ${
                        selectedWorkpieces.includes(wp.id) ? "bg-blue-100" : "bg-white"
                      }`}
                    >
                      <div>
                        <div className="font-medium text-sm">{wp.id}</div>
                        <div className="text-xs text-gray-600">{wp.typeName}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedWorkpieces.includes(wp.id)}
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
                onClick={handleAddWorkpieces}
                disabled={adding || !selectedWorkpieces.length}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                {adding ? "Adding..." : "Add Selected Workpieces"}
              </button>
            </div>

            {addResponse && (
              <div className="p-2 mt-2 bg-green-100 text-green-800 rounded text-sm">
                Order created! ID: {addResponse.id}, Status: {addResponse.status}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
