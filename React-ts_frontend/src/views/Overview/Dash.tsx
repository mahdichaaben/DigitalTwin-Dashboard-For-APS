import { useState, useEffect } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Card from "@/components/PannelCard/Card";
import DigitalTwin from "@/components/ui/DigitalTwin";
import StatusTimeline from "@/components/StatusTimeline";

import { Settings, Activity, CheckCircle, AlertCircle, AlertTriangle, Truck } from "lucide-react";

const ResponsiveGridLayout = WidthProvider(Responsive);

const stateIcon = (state: string) => {
  const iconProps = { className: "w-5 h-5" };
  switch (state.toUpperCase()) {
    case "IDLE":
      return <span title="Idle"><CheckCircle className="text-green-500" {...iconProps} /></span>;
    case "BUSY":
    case "RUNNING":
    case "DROP":
    case "PICKBUSY":
    case "MILLBUSY":
    case "DRILLBUSY":
      return <span title="Active"><Activity className="text-blue-500" {...iconProps} /></span>;
    case "WAITING_AFTER_PICK":
    case "WAITING_AFTER_DRILL":
    case "WAITING_AFTER_MILL":
      return <span title="Waiting"><AlertCircle className="text-yellow-500" {...iconProps} /></span>;
    case "DROPBUSY":
      return <span title="Busy Drop"><AlertTriangle className="text-red-500" {...iconProps} /></span>;
    default:
      return <span title={state}><AlertCircle className="text-gray-400" {...iconProps} /></span>;
  }
};




// Static example data, last known states (from your sample data)
const modulesData = [
  { ref_module: "DPS001", module_state: "IDLE", command_name: "PICK", command_state: "FINISHED" },
  { ref_module: "AIQS001", module_state: "RUNNING", command_name: "DROP", command_state: "RUNNING" },
  { ref_module: "MILL001", module_state: "WAITING_AFTER_MILL", command_name: "MILL", command_state: "FINISHED" },
  { ref_module: "DRILL001", module_state: "DRILLBUSY", command_name: "DRILL", command_state: "RUNNING" },
  { ref_module: "HBW001", module_state: "IDLE", command_name: "PICK", command_state: "FINISHED" },
];

// Simulate AGV moving between stations (just cycling states)
const stations = ["Station A", "Station B", "Station C", "Station D"];

const Dash: React.FC = () => {
  const defaultLayouts = {
    lg: [
      { i: "a", x: 0, y: 0, w: 2, h: 2 },
      { i: "b", x: 2, y: 0, w: 2, h: 2 },
      { i: "c", x: 4, y: 0, w: 2, h: 2 },
      { i: "d", x: 0, y: 2, w: 3, h: 2 },
      { i: "e", x: 3, y: 2, w: 3, h: 2 },
      { i: "f", x: 0, y: 4, w: 6, h: 1 },
    ],
  };

  const getSavedLayouts = () => {
    try {
      const saved = localStorage.getItem("dashboard-layouts");
      return saved ? JSON.parse(saved) : defaultLayouts;
    } catch {
      return defaultLayouts;
    }
  };

  const [currentLayouts, setCurrentLayouts] = useState(getSavedLayouts());
  const [locked, setLocked] = useState(false);
  const [visiblePanels, setVisiblePanels] = useState<Record<string, boolean>>({
    a: true,
    b: true,
    c: true,
    d: true,
    e: true,
    f: true,
  });
  const [menuOpen, setMenuOpen] = useState(false);

  // For AGV simulated position
  const [agvPositionIndex, setAgvPositionIndex] = useState(0);

  // Move AGV every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAgvPositionIndex((pos) => (pos + 1) % stations.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onLayoutChange = (
    _: Layout[],
    allLayouts: { [key: string]: Layout[] }
  ) => {
    localStorage.setItem("dashboard-layouts", JSON.stringify(allLayouts));
    setCurrentLayouts(allLayouts);
  };

  const togglePanel = (key: string) => {
    setVisiblePanels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetLayout = () => {
    localStorage.removeItem("dashboard-layouts");
    setCurrentLayouts(defaultLayouts);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between ">
          <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
            <ol className="list-reset flex">
              <li>
                <a
                  href="#"
                  className="hover:underline text-blue-600 font-medium"
                >
                  FACTORY001
                </a>
              </li>
              <li>
                <span className="mx-2">{">"}</span>
              </li>
              <li className="text-gray-500">Monitor</li>
            </ol>
          </nav>
          {/* 🛠️ Param Dropdown */}
          <div className="relative inline-block text-left">
            <button onClick={() => setMenuOpen(!menuOpen)} className="gap-2">
              <Settings className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-2 px-3 text-sm text-gray-700 space-y-2">
                  <button
                    onClick={() => {
                      resetLayout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left hover:text-blue-600"
                  >
                    🔄 Reset Layout
                  </button>

                  <button
                    onClick={() => {
                      setLocked((l) => !l);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left hover:text-blue-600"
                  >
                    {locked ? "🔓 Unlock Panels" : "🔒 Lock Panels"}
                  </button>

                  <div className="border-t pt-2 text-sm font-medium text-gray-600">
                    👁 View Panels
                    <div className="space-y-1 pt-1">
                      {["a", "b", "c", "d", "e", "f"].map((key) => (
                        <label
                          key={key}
                          className="flex items-center gap-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={visiblePanels[key]}
                            onChange={() => togglePanel(key)}
                          />
                          Panel {key.toUpperCase()}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <ResponsiveGridLayout
          className="layout"
          layouts={currentLayouts}
          onLayoutChange={onLayoutChange}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 6, md: 4, sm: 3, xs: 2, xxs: 1 }}
          rowHeight={100}
          margin={[5, 5]}
          isDraggable={!locked}
          isResizable={!locked}
          resizeHandles={["se"]}
          compactType="vertical"
          preventCollision={false}
          useCSSTransforms
          autoSize
        >
          {visiblePanels.a && (
            <div key="a">
              <Card title="DigitalTwin" locked={locked}>
                <DigitalTwin />
              </Card>
            </div>
          )}

          {visiblePanels.b && (
            <div key="b">
              <Card title="Module States" locked={locked}>
                <ul className="space-y-2">
                  {modulesData.map(({ ref_module, module_state, command_name, command_state }) => (
                    <li key={ref_module} className="flex items-center gap-3">
                      {stateIcon(module_state)}
                      <div className="flex-1">
                        <div className="font-semibold">{ref_module}</div>
                        <div className="text-sm text-gray-600">
                          State: <span className="font-medium">{module_state}</span> | Cmd:{" "}
                          <span className="font-medium">{command_name}</span> ({command_state})
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}

          {visiblePanels.c && (
            <div key="c">
              <Card title="Performance" locked={locked}>
                <div className="text-4xl">⚡ 98% Uptime</div>
                <p className="text-sm text-gray-700 mt-1">
                  Last hour performance stable. No errors detected.
                </p>
              </Card>
            </div>
          )}

          {visiblePanels.d && (
            <div key="d">
              <Card title="AGV Status" locked={locked}>
                <div className="flex items-center space-x-3">
                  <Truck className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-semibold">AGV #1</p>
                    <p className="text-sm text-gray-700">
                      Moving to <span className="font-medium">{stations[agvPositionIndex]}</span>
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {visiblePanels.e && (
            <div key="e">
              <Card title="Status History" locked={locked}>
                <StatusTimeline />
              </Card>
            </div>
          )}

          {visiblePanels.f && (
            <div key="f">
              <Card title="Alerts" locked={locked}>
                <div className="text-sm text-gray-600">
                  Click and drag any panel to rearrange the dashboard.
                </div>
                <ul className="mt-2 space-y-1 text-xs text-red-600">
                  <li>⚠️ DPS001: Occasional network delay detected</li>
                  <li>⚠️ DRILL001: Maintenance required soon</li>
                </ul>
              </Card>
            </div>
          )}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

export default Dash;
