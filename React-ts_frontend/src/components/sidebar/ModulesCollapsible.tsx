import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/axiosConfig";
import MenuItem from "./MenuItem";
import MenuToggleItem from "./MenuToggleItem";
import MicrochipIcon from "@/assets/icons/micro-chip.png";

type ModuleDto = {
  serialNumber: string;
  name: string;
};

const ModulesCollapsible = ({ isOpen, isMobile, currentView, onViewChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [modules, setModules] = useState<ModuleDto[]>([]);

  const menuProps = { isOpen, isMobile, currentView, onViewChange };

  // Small wrapper component so we can pass an <img> as an Icon-compatible component
  const MicroIcon = ({ className = "" }: { className?: string }) => (
    <img src={MicrochipIcon} alt="Modules" className={className} />
  );

useEffect(() => {
  const fetchModules = async () => {
    try {
      const res = await api.get<ModuleDto[]>("api/Factory/modules");

      // Filter modules by serialNumber
      const filtered = res.data.filter(module =>
        ["DRILL001"].includes(module.serialNumber)
      );

      setModules(filtered);
    } catch (err) {
      console.error("Failed to fetch modules", err);
    }
  };

  fetchModules();
}, []);

  return (
    <div className="space-y-1">
      <MenuToggleItem
        label="Modules"
        to=""
        icon={MicroIcon}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      {!collapsed && (
        <div className="ml-4 space-y-1">
          {modules.map((mod) => (
            <Link
              key={mod.serialNumber}
              to={mod.serialNumber.toLowerCase()}
            >
              <MenuItem
                label={mod.name}
                view={mod.serialNumber.toLowerCase()}
                {...menuProps}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModulesCollapsible;
