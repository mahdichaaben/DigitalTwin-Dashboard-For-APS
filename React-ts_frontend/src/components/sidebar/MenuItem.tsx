type MenuItemProps = {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  view: string;
  isOpen: boolean;
  isMobile: boolean;
  currentView: string;
  onViewChange: (view: string) => void;
};

const MenuItem = ({
  icon: Icon,
  label,
  view,
  isOpen,
  isMobile,
  currentView,
  onViewChange,
}: MenuItemProps) => (
  <button
    type="button"
    onClick={() => {
      onViewChange(view);
      if (isMobile) return;
    }}
    aria-current={currentView === view ? "page" : undefined}
    className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
      ${
        currentView === view
          ? "text-primary border border-primary bg-transparent font-semibold"
          : "text-text hover:bg-primary-light hover:text-primary-dark"
      }
      ${!isOpen && !isMobile ? "hidden" : ""}`}
  >
    {currentView === view && (
      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r" aria-hidden="true" />
    )}
    {Icon && (
      <Icon
        className={`h-5 w-5 flex-shrink-0 ${currentView === view ? "text-primary" : ""}`}
      />
    )}
    {(isOpen || isMobile) && <span className="truncate">{label}</span>}
  </button>
);

export default MenuItem;
