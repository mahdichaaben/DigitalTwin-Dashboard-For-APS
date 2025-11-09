import BreadcrumbNav from "@/components/Dashboard/BreadcrumbNav";
import SettingsMenu from "@/components/Dashboard/SettingsMenu";
import DashboardGrid from "@/components/Dashboard/DashboardGrid";

import useDashboardLayout from "@/hooks/useDashboardLayout";

import InfoPanelDrill from "@/components/ModulesDashboardsPannels/DrillPannel/InfoPannelDrill";
import TempSensorDrill from "@/components/ModulesDashboardsPannels/DrillPannel/TempSensorDrill";
import VibSensorDrill from "@/components/ModulesDashboardsPannels/DrillPannel/VibSensorDrill";

import CurrentSensorDrill from "@/components/ModulesDashboardsPannels/DrillPannel/CurrentSensorDrill";
import PressureSensorDrill from "@/components/ModulesDashboardsPannels/DrillPannel/PressureSensorDrill";
import KpiRealTime from "@/components/ModulesDashboardsPannels/DrillPannel/KpiRealTime";
import AlertDrill from "@/components/ModulesDashboardsPannels/DrillPannel/AlertDrill";
const DrillDash: React.FC = () => {
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
  } = useDashboardLayout("drill001");

  // Map visiblePanels + components into a reusable panels array
  const panelsConfig = [
   { key: "a", title: "Module info ", component: InfoPanelDrill, visible: visiblePanels.b },
    { key: "b", title: "Drill Pressure Sensor", component: PressureSensorDrill, visible: visiblePanels.c },
    { key: "c", title: "Drill Temp Sensor", component: TempSensorDrill, visible: visiblePanels.d },
    { key: "d", title: "Drill Vibration Sensor", component: VibSensorDrill, visible: visiblePanels.e },
    { key: "f", title: "Drill Current Sensor", component: CurrentSensorDrill, visible: visiblePanels.e },
    { key: "h",  component: KpiRealTime, visible: visiblePanels.e },

    { key: "ll",  component: AlertDrill, visible: visiblePanels.e },


  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4">
      <div className="mx-auto">

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

export default DrillDash;
