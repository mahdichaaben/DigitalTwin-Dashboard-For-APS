import BreadcrumbNav from "@/components/Dashboard/BreadcrumbNav";
import SettingsMenu from "@/components/Dashboard/SettingsMenu";
import DashboardGrid from "@/components/Dashboard/DashboardGrid";

import RunningAnalysisPanel from "@/components/StatusPannels/RunningAnalysisPannel";
import StatusTimeline from "@/components/StatusTimeline";
import LogPanel from "@/components/StatusPannels/LogPannel";

import useDashboardLayout from "@/hooks/useDashboardLayout";
import ModulesStateTable from "@/components/StatusPannels/ModulesStatesCards";
import AgvStateCard from "@/components/StatusPannels/AgvStateCard";
import StoreModules from "@/components/OrderManagement/StoreModules";
const DpsDash: React.FC = () => {
  const {
    currentLayouts,
    visiblePanels,
    locked,
    menuOpen,
    toggleMenu,
    togglePanel,
    resetLayout,
    setLocked,
    onLayoutChange,
    setAsDefault, 
  } = useDashboardLayout("dps001");

  // Map visiblePanels + components into a reusable panels array
  const panelsConfig = [
   // { key: "a", title: "DigitalTwin", component: DigitalTwin, visible: visiblePanels.a },
    { key: "b", title: "Running Analysis", component: RunningAnalysisPanel, visible: visiblePanels.b },
    { key: "c", title: "Modules states", component:ModulesStateTable , visible: visiblePanels.c },
//    { key: "d", title: "Workpieces", component: OEEPanel, visible: visiblePanels.d },
    { key: "e", title: "Status history", component: StatusTimeline, visible: visiblePanels.e },
    { key: "f", title: "Module Logs", component: LogPanel, visible: visiblePanels.f },
  // { key: "t", title: "OrderKpi", component: OrderKPIs, visible: visiblePanels.d },
{ key: "g", title: "Agv Info", component: AgvStateCard, visible: visiblePanels.d },
    { key: "h", title: "Storage", component: StoreModules, visible: visiblePanels.d },

      //  { key: "k", title: "Workpieces", component: WorkpieceKPIs, visible: visiblePanels.d },
       // { key: "kk", title: "factory kpis", component: FactoryKPIDashboard, visible: visiblePanels.d },

  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4">
      <div className="mx-auto">
        <div className="flex items-center justify-between">
          <BreadcrumbNav factory="FACTORY001" />
          <SettingsMenu
             refKey="dps001"
            locked={locked}
            menuOpen={menuOpen}
            toggleMenu={toggleMenu}
            togglePanel={togglePanel}
            resetLayout={resetLayout}
            setLocked={setLocked}
            visiblePanels={visiblePanels}
             setAsDefault={setAsDefault}
          />
        </div>
        <DashboardGrid
          panels={panelsConfig}           // <-- pass panels array
          currentLayouts={currentLayouts}
          locked={locked}
          onLayoutChange={onLayoutChange}
        />
      </div>
    </div>
  );
};

export default DpsDash;
