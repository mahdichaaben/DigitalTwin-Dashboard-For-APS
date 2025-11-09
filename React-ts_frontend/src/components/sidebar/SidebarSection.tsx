import {
  Home,
  Gauge,
  BarChart4,
  ArrowRightLeft,
  Drill,
  Activity,
  Warehouse,
  Eye,
  Truck,
  Package,
  Layers,
  Settings,
  AlertTriangleIcon,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";
import MenuItem from "./MenuItem";
import ControlPanelPng from "@/assets/icons/control-panel.png";

import ModulesCollapsible from "./ModulesCollapsible";

const SidebarSection = ({ isOpen, isMobile, currentView, onViewChange }) => (
  <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
    <div className="space-y-2">
      <Link to="">
        <MenuItem
          icon={Home}
          label="Factory Overview"
          view="factory"
          {...{ isOpen, isMobile, currentView, onViewChange }}
        />
      </Link>
    </div>

    <div className="space-y-2">
      <Link to="monitoring">
        <MenuItem
          icon={Gauge}
          label="Monitoring"
          view="Monitoring"
          {...{ isOpen, isMobile, currentView, onViewChange }}
        />
      </Link>
    </div>

    {(isOpen || isMobile) && (
      <>
        {(isOpen || isMobile) && (
          <ModulesCollapsible
            isOpen={isOpen}
            isMobile={isMobile}
            currentView={currentView}
            onViewChange={onViewChange}
          />
        )}

        <div className="space-y-1">
          <Link to="Management">
            {" "}
            <MenuItem
              icon={({ className = "" }) => (
                <img src={ControlPanelPng} alt="Management" className={`h-5 w-5 flex-shrink-0 object-contain ${className}`} />
              )}
              label="Management"
              view="Management"
              {...{ isOpen, isMobile, currentView, onViewChange }}
            />
          </Link>

          <Link to="alerts">
            <MenuItem
              icon={Bell}
              label="Alerts"
              view="alerts"
              {...{ isOpen, isMobile, currentView, onViewChange }}
            />
          </Link>


                <Link to="settings">
            <SidebarSection.MenuItem icon={Settings} label="Settings" view="settings" {...{ isOpen, isMobile, currentView, onViewChange }} />

</Link>


        </div>
      </>
    )}
  </div>
);

SidebarSection.MenuItem = MenuItem;
export default SidebarSection;
