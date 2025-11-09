"use client";
import { useEffect, useState, useMemo } from "react";
import api from "@/lib/axiosConfig";
import { Package, Zap, CheckCircle, Clock, ShoppingCart, TrendingUp, AlertCircle, RefreshCw, Search, Filter, X } from "lucide-react";

interface Order {
  id: string;
  status: string;
  requestedBy: string;
  createdAt: string;
  orderType: string;
}

interface LogEntry {
  id: number;
  workpieceId: string;
  workpieceType: string;
  state: string;
  moduleSerial: string;
  orderId: string;
  timestamp: string;
}

interface OrderStats {
  total: number;
  pending: number;
  inProgress: number;
  finished: number;
  failed: number;
  todayCount: number;
  avgCompletionTime: number;
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [logs, setLogs] = useState<Record<string, LogEntry[]>>({});
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  
  const getStateBadgeColor = (state: string) => {
    if (state.includes("FREE")) return "bg-green-100 text-green-800 border border-green-200";
    if (state.includes("STORED")) return "bg-purple-100 text-purple-800 border border-purple-200";
    if (state.includes("RUNNING")) return "bg-blue-100 text-blue-800 border border-blue-200";
    if (state.includes("FINISHED")) return "bg-green-200 text-green-900 border border-green-300";
    return "bg-gray-100 text-gray-800 border border-gray-200";
  };

  
const getStateIcon = (state: string) => {
  if (state.includes("FREE"))
    return <Package className="w-4 h-4 text-green-500" />;
  if (state.includes("STORED"))
    return <Package className="w-4 h-4 text-purple-500" />;
  if (state.includes("RUNNING"))
    return <Zap className="w-4 h-4 text-blue-500" />;
  if (state.includes("FINISHED"))
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  return <Clock className="w-4 h-4 text-gray-400" />;
};

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Order[]>("/api/Order");
      setOrders(data);

      const logsPromises = data.map(async (order) => {
        try {
          const res = await api.get<LogEntry[]>("/api/Log/workpieces", {
            params: { orderId: order.id },
          });
          return { orderId: order.id, logs: res.data };
        } catch (error) {
          console.error(`Failed to fetch logs for order ${order.id}:`, error);
          return { orderId: order.id, logs: [] };
        }
      });

      const logsResults = await Promise.all(logsPromises);
      const logsMap = logsResults.reduce((acc, { orderId, logs }) => {
        acc[orderId] = logs;
        return acc;
      }, {} as Record<string, LogEntry[]>);
      
      setLogs(logsMap);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // const interval = setInterval(fetchOrders, 3000); // Reduced frequency to 30 seconds
    // return () => clearInterval(interval);
  }, []);

  // Calculate comprehensive statistics
  const stats = useMemo<OrderStats>(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(order => 
      new Date(order.createdAt).toISOString().split('T')[0] === today
    );

    // Calculate average completion time for finished orders
    const finishedOrders = orders.filter(o => o.status === 'FINISHED');
    const avgCompletionTime = finishedOrders.length > 0 
      ? finishedOrders.reduce((acc, order) => {
          const created = new Date(order.createdAt);
          const now = new Date();
          return acc + (now.getTime() - created.getTime());
        }, 0) / finishedOrders.length / (1000 * 60 * 60) // Convert to hours
      : 0;

    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      inProgress: orders.filter(o => o.status === 'IN_PROGRESS').length,
      finished: orders.filter(o => o.status === 'FINISHED').length,
      failed: orders.filter(o => o.status === 'FAILED').length,
      todayCount: todayOrders.length,
      avgCompletionTime: Math.round(avgCompletionTime * 10) / 10
    };
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    const matchStatus =
      statusFilter === "ALL" ||
      order.status === statusFilter ||
      (statusFilter === "EMPTY" && !order.status);
    const matchType = typeFilter === "ALL" || order.orderType === typeFilter;
    const matchSearch = searchTerm === "" || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

  // Helpers for style
  const typeColors: Record<string, string> = {
    BLUE: "bg-blue-500",
    RED: "bg-red-500",
    WHITE: "bg-gray-400",
    PRODUCTION: "bg-green-500",
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    IN_PROGRESS: "bg-blue-100 text-blue-700 border border-blue-300",
    FINISHED: "bg-green-100 text-green-700 border border-green-300",
    FAILED: "bg-red-100 text-red-700 border border-red-300",
    FREE: "bg-green-100 text-green-700 border border-green-300",
    EMPTY: "bg-gray-100 text-gray-500 border border-gray-300",
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor, description, suffix = '' }: {
    title: string;
    value: number;
    icon: any;
    color: string;
    bgColor: string;
    description: string;
    suffix?: string;
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {loading ? (
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              `${value.toLocaleString()}${suffix}`
            )}
          </p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Analytics Dashboard */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={stats.total}
          icon={ShoppingCart}
          color="text-blue-600"
          bgColor="bg-blue-100"
          description="All time orders"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pending}
          icon={Clock}
          color="text-yellow-600"
          bgColor="bg-yellow-100"
          description="Awaiting processing"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={TrendingUp}
          color="text-orange-600"
          bgColor="bg-orange-100"
          description="Currently processing"
        />
        <StatCard
          title="Today's Orders"
          value={stats.todayCount}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-100"
          description="Orders created today"
        />
      </div> */}

      {/* Enhanced Filters */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-8 pl-9 pr-2 text-[12px] border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full h-8 border border-gray-200 rounded-md px-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent bg-white transition-colors"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">🟡 Pending</option>
              <option value="IN_PROGRESS">🔵 In Progress</option>
              <option value="FINISHED">🟢 Finished</option>
              <option value="FAILED">🔴 Failed</option>
              <option value="EMPTY">⚪ Empty</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
            <select
              className="w-full h-8 border border-gray-200 rounded-md px-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent bg-white transition-colors"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Types</option>
              <option value="PRODUCTION">🏭 Production</option>
              <option value="ADD TO STORE">📦 Add to Store</option>
              <option value="RETRIEVE FROM STORE">📤 Retrieve from Store</option>
            </select>
          </div>
          <div className="flex items-end justify-end">
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 focus:outline-none transition-colors"
              title="Refresh orders"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-blue-400' : 'text-blue-600'}`} />
            </button>
          </div>
        </div>
        
        {/* Active Filters Display */}
        {(searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL') && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
            <span className="text-xs font-medium text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-blue-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('ALL')} className="ml-1 hover:text-green-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {typeFilter !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Type: {typeFilter}
                <button onClick={() => setTypeFilter('ALL')} className="ml-1 hover:text-purple-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
                setTypeFilter("ALL");
              }}
              className="text-xs text-gray-500 hover:text-gray-700 underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">{filteredOrders.length}</span> orders found
          </p>
          {filteredOrders.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full">
                <Clock className="w-3 h-3" />
                {filteredOrders.filter(o => o.status === 'PENDING').length} pending
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                <TrendingUp className="w-3 h-3" />
                {filteredOrders.filter(o => o.status === 'IN_PROGRESS').length} in progress
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full">
                <CheckCircle className="w-3 h-3" />
                {filteredOrders.filter(o => o.status === 'FINISHED').length} completed
              </span>
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500">
          Showing {Math.min((currentPage - 1) * pageSize + 1, filteredOrders.length)} - {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length}
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Requested By</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-500">Loading orders...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="text-gray-500 font-medium">No orders found</div>
                    <div className="text-sm text-gray-400">Try adjusting your filters or create a new order</div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => {
                const orderLogs = logs[order.id] || [];
                const colorClass = typeColors[order.orderType] || "bg-gray-400";
                const statusClass = statusColors[order.status] || "bg-gray-100 text-gray-600";
                const createdDate = new Date(order.createdAt);
                const isRecent = Date.now() - createdDate.getTime() < 24 * 60 * 60 * 1000; // Last 24 hours

                return (
                  <tr key={order.id} className={`hover:bg-gray-50 transition-colors ${isRecent ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="font-mono text-sm text-gray-900 truncate max-w-[200px]" title={order.id}>
                          {order.id}
                        </div>
                        {isRecent && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.requestedBy}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${colorClass}`}></span>
                        <span className="text-sm font-medium text-gray-900">{order.orderType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${statusClass}`}>
                        {order.status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                        {order.status === 'IN_PROGRESS' && <TrendingUp className="w-3 h-3 mr-1" />}
                        {order.status === 'FINISHED' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {order.status === 'FAILED' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {order.status || "Empty"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div>{createdDate.toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{createdDate.toLocaleTimeString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Package className="w-3 h-3" />
                        View Logs ({orderLogs.length})
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between mt-6 px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, filteredOrders.length)}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * pageSize, filteredOrders.length)}</span> of{' '}
              <span className="font-medium">{filteredOrders.length}</span> results
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Log Modal */}
{/* Log Modal */}
{selectedOrder && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center border-b px-4 py-2">
        <h2 className="text-lg font-semibold">Order {selectedOrder.id} Details</h2>
        <button
          onClick={() => setSelectedOrder(null)}
          className="text-gray-600 hover:text-black"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Logs section */}
        <div>
          <h3 className="font-semibold mb-2">Logs</h3>
          <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto border rounded-md bg-gray-50 p-2">
            {(logs[selectedOrder.id] || []).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-2 border-b rounded-md bg-white"
              >
                <div className="flex items-center space-x-3">
                  {getStateIcon(log.state)}
                  <div className="flex flex-col">
                    <span className="font-mono font-semibold">{log.workpieceId}</span>
                    <span className="text-sm text-gray-500">{log.workpieceType}</span>
                  </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStateBadgeColor(
                        log.state
                      )}`}
                    >
                      {log.state}
                    </span>
                  <span className="text-gray-500 text-sm">Module: {log.moduleSerial}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
            {logs[selectedOrder.id]?.length === 0 && (
              <div className="text-gray-500 italic text-sm px-3 py-4">
                No logs available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
}
