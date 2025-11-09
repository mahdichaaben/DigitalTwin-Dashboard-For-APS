import { useState } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Card from "@/components/PannelCard/Card";
import DigitalTwin from "@/components/ui/DigitalTwin";
import StatusTimeline from "@/components/StatusTimeline";


import { Settings } from "lucide-react"
import ModuleStates from "@/components/ModuleStates";
import EfficiencyPanel from "@/components/StatusPannels/OEEPanel";
import OEEPanel from "@/components/StatusPannels/OEEPanel";
import RunningAnalysisPanel from "@/components/StatusPannels/RunningAnalysisPannel";
import LogPanel from "@/components/StatusPannels/LogPannel";


const ResponsiveGridLayout = WidthProvider(Responsive);

const FactoryDashboard: React.FC = () => {
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
      <div className=" mx-auto">
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
            <div key="a" >
              <Card title="DigitalTwin" locked={locked}>
                   <DigitalTwin/>
              </Card>
            </div>
          )}
          {visiblePanels.b && (
            <div key="b">
              <Card title="Running Analysis " locked={locked}>
                  <RunningAnalysisPanel/>
              </Card>
            </div>
          )}
          {visiblePanels.c && (
            <div key="c">
              <Card title="Modules states" locked={locked}>

                <ModuleStates/>

              </Card>
            </div>
          )}
          {visiblePanels.d && (
            <div key="d">
              <Card title="Performance" locked={locked}>

                <OEEPanel/>
   
              </Card>
            </div>
          )}
          {visiblePanels.e && (
            <div key="e">
              <Card title="status history" locked={locked}>

                <StatusTimeline/>

              </Card>
            </div>
          )}
          {visiblePanels.f && (
            <div key="f">
              <Card title="Alerts" locked={locked}>

                <LogPanel/>

              </Card>
            </div>
          )}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

export default FactoryDashboard;
