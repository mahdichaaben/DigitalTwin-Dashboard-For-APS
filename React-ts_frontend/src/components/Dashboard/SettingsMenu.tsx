import { Settings } from "lucide-react";

type SettingsMenuProps = {
  refKey: string; // 👈 dashboard reference key
  locked: boolean;
  menuOpen: boolean;
  toggleMenu: () => void;
  togglePanel: (key: string) => void;
  resetLayout: () => void;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
  visiblePanels: Record<string, boolean>;
  setAsDefault: () => void; // 👈 save current layout as default
};

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  refKey,
  locked,
  menuOpen,
  toggleMenu,
  togglePanel,
  resetLayout,
  setLocked,
  visiblePanels,
  setAsDefault,
}) => {
  return (
    <div className="relative inline-block text-left">
      {/* Trigger button */}
      <button onClick={toggleMenu} className="gap-2">
        <Settings className="w-4 h-4" />
      </button>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-2 px-3 text-sm text-gray-700 space-y-2">
            <div className="text-xs text-gray-500 font-semibold">
              ⚙️ Dashboard: {refKey.toUpperCase()}
            </div>

            {/* Reset Layout */}
            <button
              onClick={() => {
                resetLayout();
                toggleMenu();
              }}
              className="w-full text-left hover:text-blue-600"
            >
              🔄 Reset Layout
            </button>

            {/* Save as Default */}
            <button
              onClick={() => {
                setAsDefault();
                toggleMenu();
              }}
              className="w-full text-left hover:text-green-600"
            >
              ⭐ Save as Default
            </button>

            {/* Lock/Unlock */}
            <button
              onClick={() => {
                setLocked((l) => !l);
                toggleMenu();
              }}
              className="w-full text-left hover:text-blue-600"
            >
              {locked ? "🔓 Unlock Panels" : "🔒 Lock Panels"}
            </button>

            {/* Toggle Panels */}
            <div className="border-t pt-2 text-sm font-medium text-gray-600">
              👁 View Panels
              <div className="space-y-1 pt-1">
                {["a", "b", "c", "d", "e", "f"].map((key) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={visiblePanels[key]}
                      onChange={() => togglePanel(key)}
                    />
                    Panel {key.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
