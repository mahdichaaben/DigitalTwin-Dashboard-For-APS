import { Factory, X ,Waypoints} from "lucide-react";
import SidebarSection from "./SidebarSection";

const MobileSidebar = ({ onClose, currentView, onViewChange }) => (
  <div className="fixed inset-0 z-50 md:hidden">
    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
    <div className="fixed inset-y-0 left-0 w-64 bg-surface border-r border-surface-border">
      <div className="flex items-center justify-between px-4 py-5 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <Waypoints className="h-7 w-7 text-primary-dark" />
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-primary-light transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <SidebarSection
        isOpen={true}
        isMobile={true}
        currentView={currentView}
        onViewChange={onViewChange}
      />
    </div>
  </div>
);

export default MobileSidebar;
