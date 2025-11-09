import { LogOut, Accessibility as AccessibilityIcon } from "lucide-react";
import SidebarSection from "./SidebarSection";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "@/api/authService";
const Sidebar = ({ isOpen, isMobile, currentView, onViewChange }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;
    try {
      await logoutUser();
    } catch (e) {
      // ignore api failure; tokens removed in finally
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col w-64 border-r border-surface-border transition-all duration-300 ease-in-out">
      <SidebarSection
        isOpen={isOpen}
        isMobile={isMobile}
        currentView={currentView}
        onViewChange={onViewChange}
      />
      <div className="border-t border-surface-border p-3 space-y-2">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left hover:bg-slate-100 text-slate-700"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>

        {/* <Link to="accessibility">
          <SidebarSection.MenuItem icon={AccessibilityIcon} label="Accessibility" view="accessibility" {...{ isOpen, isMobile, currentView, onViewChange }} />
        </Link> */}
      </div>
    </div>
  );
};

export default Sidebar;
