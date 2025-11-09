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
const AiqsDash: React.FC = () => {
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
  } = useDashboardLayout("aiqs001");

  // Map visiblePanels + components into a reusable panels array
  const panelsConfig = [

  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4">
      <div className="mx-auto">
        <div className="flex items-center justify-between">
          <BreadcrumbNav factory="FACTORY001" />
          <SettingsMenu
             refKey="aiqs001"
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

export default AiqsDash;
