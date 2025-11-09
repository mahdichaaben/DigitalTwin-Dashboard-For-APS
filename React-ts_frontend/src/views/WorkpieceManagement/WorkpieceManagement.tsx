import { useEffect, useState } from "react";
import { Users, Package, Zap, CheckCircle, Clock } from "lucide-react";
import api from "@/lib/axiosConfig";

type WorkpieceDto = {
  id: string;
  state: string;
  typeName: string;
  addedBy: string;
};

type WorkpieceTypeDto = {
  id: string;
  name: string;
  color: string;
  moduleNames: string[];
};

type ModuleDto = {
  serialNumber: string;
  name: string;
};

const getTypeColor = (color: string) => {
  switch (color.toUpperCase()) {
    case "RED": return "#EF4444";
    case "BLUE": return "#3B82F6";
    case "WHITE": return "#F3F4F6";
    case "GREEN": return "#10B981";
    default: return "#6B7280";
  }
};

const getStateBadgeColor = (state: string) => {
  if (state === "FREE") return "bg-green-100 text-green-800";
  if (state.includes("STORED")) return "bg-purple-100 text-purple-800";
  if (state.includes("RUNNING")) return "bg-blue-100 text-blue-800";
  if (state.includes("FINISHED")) return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
};

const getStateIcon = (state: string) => {
  if (state === "FREE") return <Package className="w-4 h-4 text-green-500" />;
  if (state.includes("STORED")) return <Package className="w-4 h-4 text-purple-500" />;
  if (state.includes("RUNNING")) return <Zap className="w-4 h-4 text-blue-500" />;
  if (state.includes("FINISHED")) return <CheckCircle className="w-4 h-4 text-green-500" />;
  return <Clock className="w-4 h-4 text-gray-400" />;
};

export default function WorkpieceManagement() {
  const [activeTab, setActiveTab] = useState<"workpieces" | "types" | "config">("workpieces");

  // Workpieces
  const [workpieces, setWorkpieces] = useState<WorkpieceDto[]>([]);
  const [loadingWp, setLoadingWp] = useState(false);

  // Types
  const [types, setTypes] = useState<WorkpieceTypeDto[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  // Modules
  const [modules, setModules] = useState<ModuleDto[]>([]);
  const [placedModules, setPlacedModules] = useState<ModuleDto[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // Fetch Workpieces
  useEffect(() => {
    if (activeTab === "workpieces") {
      setLoadingWp(true);
      api.get<WorkpieceDto[]>("api/Workpiece/all")
        .then(res => setWorkpieces(res.data))
        .catch(console.error)
        .finally(() => setLoadingWp(false));
    }
  }, [activeTab]);

  // Fetch Types
  useEffect(() => {
    if (activeTab === "types") {
      setLoadingTypes(true);
      api.get<WorkpieceTypeDto[]>("api/Workpiece/types")
        .then(res => setTypes(res.data))
        .catch(console.error)
        .finally(() => setLoadingTypes(false));
    }
  }, [activeTab]);

  // Fetch Modules
  useEffect(() => {
    if (activeTab === "config") {
      setLoadingModules(true);
      api.get<ModuleDto[]>("api/Factory/modules")
        .then(res => setModules(res.data))
        .catch(console.error)
        .finally(() => setLoadingModules(false));
    }
  }, [activeTab]);

  const uniqueStates = Array.from(new Set(workpieces.map(wp => wp.state)));
  const uniqueTypes = Array.from(new Set(workpieces.map(wp => wp.typeName)));

  const filteredWorkpieces = workpieces.filter(wp => {
    const matchesSearch = wp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = stateFilter === "All" || wp.state === stateFilter;
    const matchesType = typeFilter === "All" || wp.typeName === typeFilter;
    return matchesSearch && matchesState && matchesType;
  });

  // Drag & Drop Handlers
  const onDragStart = (e: React.DragEvent, module: ModuleDto) => {
    e.dataTransfer.setData("module", JSON.stringify(module));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const module: ModuleDto = JSON.parse(e.dataTransfer.getData("module"));
    if (!placedModules.find(m => m.serialNumber === module.serialNumber)) {
      setPlacedModules([...placedModules, module]);
    }
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("workpieces")}
          className={`pb-2 px-2 font-medium ${activeTab === "workpieces" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
        >
          Workpieces
        </button>
        <button
          onClick={() => setActiveTab("types")}
          className={`pb-2 px-2 font-medium ${activeTab === "types" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
        >
          Types
        </button>
        <button
          onClick={() => setActiveTab("config")}
          className={`pb-2 px-2 font-medium ${activeTab === "config" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
        >
          Configure
        </button>
      </div>

      {/* Content */}
      {activeTab === "workpieces" && (
        <>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search workpieces..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="All">All States</option>
              {uniqueStates.map(state => <option key={state} value={state}>{state}</option>)}
            </select>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="All">All Types</option>
              {uniqueTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          {loadingWp ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">State</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Added By</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkpieces.map(wp => (
                  <tr key={wp.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{wp.id}</td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: getTypeColor("GRAY")}}></div>
                      {wp.typeName}
                    </td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      {getStateIcon(wp.state)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStateBadgeColor(wp.state)}`}>{wp.state}</span>
                    </td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" /> {wp.addedBy || "System"}
                    </td>
                    <td className="py-3 px-4 text-blue-600 hover:text-blue-800 cursor-pointer">View Logs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {activeTab === "types" && (
        <>
          {loadingTypes ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {types.map(t => (
                <div key={t.id} className="p-4 border border-gray-200 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full" style={{backgroundColor: getTypeColor(t.color)}}></div>
                    <span className="font-medium">{t.name}</span>
                  </div>
                  <p className="text-sm text-gray-500">Modules: {t.moduleNames.join(", ") || "None"}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "config" && (
        <>
          {loadingModules ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="flex gap-8">
              {/* Available Modules */}
              <div className="flex-1 border p-4 rounded-lg">
                <h3 className="font-semibold mb-4">Available Modules</h3>
                {modules.map(m => (
                  <div
                    key={m.serialNumber}
                    draggable
                    onDragStart={e => onDragStart(e, m)}
                    className="p-2 border mb-2 rounded cursor-grab hover:bg-gray-100"
                  >
                    {m.name}
                  </div>
                ))}
              </div>

              {/* Place Modules Area */}
              <div
                className="flex-1 border p-4 rounded-lg min-h-[200px]"
                onDrop={onDrop}
                onDragOver={onDragOver}
              >
                <h3 className="font-semibold mb-4">Placed Modules (Drag here)</h3>
                {placedModules.length === 0 && <p className="text-gray-400">Drop modules here</p>}
                {placedModules.map(m => (
                  <div key={m.serialNumber} className="p-2 border mb-2 rounded bg-blue-50">
                    {m.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
