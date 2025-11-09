import { ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface MenuToggleItemProps {
  label: string;
  to: string;
  icon: any;
  collapsed: boolean;
  onToggle: () => void;
}

const MenuToggleItem = ({ label, to, icon: Icon, collapsed, onToggle }: MenuToggleItemProps) => {
  return (
    <div
      className="group flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-text bg-transparent hover:bg-primary-light transition-colors select-none"
    >
      {/* Left section: Icon + Label */}
      <div className="flex items-center gap-2 flex-1">
        <Icon className="h-5 w-5 text-current" />
        <Link
          to={to}
          className="truncate focus:outline-none"
        >
          {label}
        </Link>
      </div>

      {/* Right section: Toggle Button */}
      <button
        onClick={onToggle}
        aria-label={collapsed ? "Expand" : "Collapse"}
        aria-expanded={!collapsed}
        className="ml-2 p-1 rounded hover:bg-primary-light focus:outline-none"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-current" />
        ) : (
          <ChevronDown className="h-4 w-4 text-current" />
        )}
      </button>
    </div>
  );
};

export default MenuToggleItem;
