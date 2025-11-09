import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";

interface SidebarToggleButtonProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const SidebarToggleButton = ({
  onToggleSidebar,
  isSidebarOpen,
}: SidebarToggleButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
        aria-label="Toggle sidebar"
      >
        {/* Transition between left and right chevrons smoothly */}
        <div className="transition-transform duration-300 ease-in-out">
          {isSidebarOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </div>
      </button>


    </div>
  );
};

export default SidebarToggleButton;
