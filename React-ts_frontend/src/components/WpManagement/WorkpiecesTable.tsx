import { useEffect, useState } from "react";
import api from "@/lib/axiosConfig";
import { Package,RefreshCw, Zap, CheckCircle, Clock, Plus, Search, X } from "lucide-react";

interface Workpiece {
  id: string;
  typeName: string;
  state: string;
  addedBy?: string;
  createdAt: string;
}

interface WorkpieceLog {
  id: number;
  workpieceId: string;
  workpieceType: string;
  state: string;
  moduleSerial: string;
  timestamp: string;
}

interface WorkpieceType {
  id: string;
  name: string;
}

export default function WorkpiecesTable() {
  const [workpieces, setWorkpieces] = useState<Workpiece[]>([]);
  const [filteredWorkpieces, setFilteredWorkpieces] = useState<Workpiece[]>([]);
  const [logs, setLogs] = useState<Record<string, WorkpieceLog[]>>({});
  const [types, setTypes] = useState<WorkpieceType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedWP, setSelectedWP] = useState<Workpiece | null>(null);
  const [loading, setLoading] = useState(false);

  // Creation modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWP, setNewWP] = useState({ id: "", typeId: "", addedBy: "" });
  const [saving, setSaving] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const pageSize = 10;

  // Fetch workpieces, types and logs
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: wpData } = await api.get<Workpiece[]>("/api/Workpiece/all");
      setWorkpieces(wpData);
      setFilteredWorkpieces(wpData);

      const { data: typeData } = await api.get<WorkpieceType[]>("/api/Workpiece/types");
      setTypes(typeData);

      const logsMap: Record<string, WorkpieceLog[]> = {};
      for (const wp of wpData) {
        const res = await api.get<WorkpieceLog[]>("/api/Log/workpieces", { params: { workpieceId: wp.id } });
        logsMap[wp.id] = res.data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }
      setLogs(logsMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

  }, []);

  // Search & filter
  useEffect(() => {
    let filtered = workpieces;

    if (searchTerm) {
      filtered = filtered.filter(wp =>
        wp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wp.typeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wp.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(wp => wp.typeName === typeFilter);
    }

    setFilteredWorkpieces(filtered);
    setCurrentPage(1); // reset page when filters change
  }, [searchTerm, typeFilter, workpieces]);

  // Pagination
  const totalPages = Math.ceil(filteredWorkpieces.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedWorkpieces = filteredWorkpieces.slice(startIndex, startIndex + pageSize);

  // State helpers
  const getStateBadgeColor = (state: string) => {
    if (state.includes("FREE")) return "bg-green-100 text-green-800 border border-green-200";
    if (state.includes("STORED")) return "bg-purple-100 text-purple-800 border border-purple-200";
    if (state.includes("RUNNING")) return "bg-blue-100 text-blue-800 border border-blue-200";
    if (state.includes("FINISHED")) return "bg-green-200 text-green-900 border border-green-300";
    return "bg-gray-100 text-gray-800 border border-gray-200";
  };
  
  const getStateIcon = (state: string) => {
    if (state.includes("FREE")) return <Package className="w-4 h-4 text-green-500" />;
    if (state.includes("STORED")) return <Package className="w-4 h-4 text-purple-500" />;
    if (state.includes("RUNNING")) return <Zap className="w-4 h-4 text-blue-500" />;
    if (state.includes("FINISHED")) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <Clock className="w-4 h-4 text-gray-400" />;
  };
  
  const typeColors: Record<string, string> = {
    RED: "bg-red-500",
    BLUE: "bg-blue-500",
    GREEN: "bg-green-500",
    WHITE: "bg-gray-400",
  };

  // Handle creation
  const handleCreate = async () => {
    if (!newWP.id || !newWP.typeId) return;
    setSaving(true);
    try {
      await api.post("/api/Workpiece", newWP);
      setShowAddModal(false);
      setNewWP({ id: "", typeId: "", addedBy: "" });
      fetchData(); // refresh table
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Analytics calculations
  const analytics = {
    status: {
      total: workpieces.length,
      free: workpieces.filter(w => w.state?.includes('FREE')).length,
      stored: workpieces.filter(w => w.state?.includes('STORED')).length,
      running: workpieces.filter(w => w.state?.includes('RUNNING')).length,
      finished: workpieces.filter(w => w.state?.includes('FINISHED')).length,
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Analytics Section */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {/* Status Distribution */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{analytics.status.total}</div>
              <div className="text-xs text-gray-500">Total Workpieces</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-green-600">{analytics.status.free}</div>
                <div className="text-xs text-gray-500">Free</div>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-purple-600">{analytics.status.stored}</div>
                <div className="text-xs text-gray-500">Stored</div>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-blue-600">{analytics.status.running}</div>
                <div className="text-xs text-gray-500">Running</div>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-green-700">{analytics.status.finished}</div>
                <div className="text-xs text-gray-500">Finished</div>
              </div>
              <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header with Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
        <div className="relative flex-1 min-w-0 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, Type, State..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full h-8 pl-9 pr-2 text-[12px] border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-colors"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="h-8 px-2 text-[12px] border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent min-w-0"
        >
          <option value="">All Types</option>
          {types.map(t => (
            <option key={t.id} value={t.name}>{t.name}</option>
          ))}
        </select>
        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 focus:outline-none transition-colors"
          title="Refresh workpieces"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-blue-400' : 'text-blue-600'}`} />
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Workpiece
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Workpiece ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Current State
              </th>
              
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading workpieces...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedWorkpieces.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  {filteredWorkpieces.length === 0 && workpieces.length > 0 
                    ? "No workpieces match your search criteria." 
                    : "No workpieces found."}
                </td>
              </tr>
            ) : (
              paginatedWorkpieces.map(wp => {
                const wpLogs = logs[wp.id] || [];
                return (
                  <tr key={wp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm">
                      <div className="font-mono font-medium text-gray-900 truncate max-w-[200px]" title={wp.id}>
                        {wp.id}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${typeColors[wp.typeName] || 'bg-gray-400'}`}></span>
                        <span className="text-gray-900 font-medium">{wp.typeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0">
                          {getStateIcon(wp.state)}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStateBadgeColor(wp.state)}`}>
                          {wp.state}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <button 
                        onClick={() => setSelectedWP(wp)} 
                        className="text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
                      >
                        View Logs ({wpLogs.length})
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredWorkpieces.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={page}
                  className={`px-3 py-2 text-sm border rounded-md ${
                    page === currentPage 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button
            className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Add Workpiece Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add New Workpiece</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workpiece ID *
                </label>
                <input
                  type="text"
                  value={newWP.id}
                  onChange={e => setNewWP(prev => ({ ...prev, id: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter unique workpiece ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={newWP.typeId}
                  onChange={e => setNewWP(prev => ({ ...prev, typeId: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select Type</option>
                  {types.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Added By
                </label>
                <input
                  type="text"
                  value={newWP.addedBy}
                  onChange={e => setNewWP(prev => ({ ...prev, addedBy: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Optional: Your name"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button 
                onClick={() => setShowAddModal(false)} 
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !newWP.id.trim() || !newWP.typeId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                {saving ? "Creating..." : "Create Workpiece"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Modal */}
      {selectedWP && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b px-6 py-4 flex-shrink-0">
              <h2 className="text-lg font-semibold">
                Logs for Workpiece <span className="font-mono text-blue-600">{selectedWP.id}</span>
              </h2>
              <button 
                onClick={() => setSelectedWP(null)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {(logs[selectedWP.id] || []).length > 0 ? (
                <div className="space-y-3">
                  {(logs[selectedWP.id] || []).map(log => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getStateIcon(log.state)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-sm font-semibold truncate">{log.workpieceId}</span>
                          <span className="text-xs text-gray-500">Type: {log.workpieceType}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStateBadgeColor(log.state)}`}>
                          {log.state}
                        </span>
                        <div className="text-sm text-gray-600 min-w-0">
                          <span className="font-medium">Module:</span> 
                          <span className="truncate ml-1">{log.moduleSerial}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 text-right flex-shrink-0 ml-4">
                        <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                        <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-lg">No logs available</p>
                  <p className="text-sm">This workpiece doesn't have any log entries yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}