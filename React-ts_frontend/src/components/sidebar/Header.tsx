import { User, LogOut, Settings, BellRing } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import SidebarToggleButton from "./SidebarToggleButton";
import AppLogo from "@/assets/AppIcon/icon.png";
import UserMenu from "@/components/ui/UserMenu";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const USER_NAME = "Mahdi"; // used only for greeting fallback if needed

const Header = ({ onToggleSidebar, isSidebarOpen }: HeaderProps) => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const notificationsCount = 3;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowNotif(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <header className="bg-white border-b border-surface-border px-6 py-2 flex items-center justify-between shadow-sm sticky top-0 z-50">
      {/* Left side: Toggle + App Name */}
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <SidebarToggleButton
          onToggleSidebar={onToggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="flex items-center gap-3 text-lg font-semibold text-text hover:text-primary-dark transition-colors">
          <Link to="/">
            <img src={AppLogo} alt="APS Digital Twin" className="h-8 w-8 md:h-10 md:w-10 object-contain" />
          </Link>
          <Breadcrumbs />
        </div>
      </div>

      <div className="flex items-center gap-6">

        {/* User Dropdown */}
        <UserMenu buttonVariant="border" showGreeting={true} greetingPrefix="Hello," />
      </div>
    </header>
  );
};

export default Header;
