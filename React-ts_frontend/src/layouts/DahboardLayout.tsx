import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/sidebar/Header";
import MobileSidebar from "@/components/sidebar/MobileSidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";           // ✅ Add this
import AlertNotifier from "@/components/Alerts/AlertNotifier"; // ✅ Add this
const DashboardLayout = ({ currentView, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleSidebar = () => {
    if (isMobile) setMobileMenuOpen(!mobileMenuOpen);
    else setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* 🔔 Global Toaster + Real-time Alert Listener */}
      <AlertNotifier /> 

      <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isOpen} />

      <div className="flex h-[90vh] bg-white">
        {!isMobile && isOpen && (
          <Sidebar
            isOpen={isOpen}
            isMobile={isMobile}
            currentView={currentView}
            onViewChange={onViewChange}
          />
        )}

        {isMobile && mobileMenuOpen && (
          <MobileSidebar
            onClose={() => setMobileMenuOpen(false)}
            currentView={currentView}
            onViewChange={onViewChange}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto bg-gray-50 text-gray-900">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
