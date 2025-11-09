import { useState } from "react";
import { Layout } from "react-grid-layout";

// Hardcoded default layout for factory001
const factory001DefaultLayouts = {
  lg: [
    { w: 2, h: 4, x: 2, y: 2, i: "b", moved: false, static: false },
    { w: 4, h: 2, x: 1, y: 0, i: "c", moved: false, static: false },
    { w: 2, h: 4, x: 4, y: 2, i: "e", moved: false, static: false },
    { w: 6, h: 3, x: 0, y: 6, i: "f", moved: false, static: false },
    { w: 1, h: 2, x: 0, y: 0, i: "t", moved: false, static: false },
    { w: 1, h: 2, x: 5, y: 0, i: "g", moved: false, static: false },
    { w: 2, h: 4, x: 0, y: 2, i: "h", moved: false, static: false },
  ],
};

const getSavedLayouts = (ref: string) => {
  try {
    const saved = localStorage.getItem(`dashboard-layouts-${ref}`);
    return saved
      ? JSON.parse(saved)
      : getDefaultLayouts(ref);
  } catch {
    return getDefaultLayouts(ref);
  }
};

const getDefaultLayouts = (ref: string) => {
  try {
    const savedDefault = localStorage.getItem(`dashboard-default-layouts-${ref}`);
    if (savedDefault) return JSON.parse(savedDefault);

    // return hardcoded layout only for factory001
    if (ref === "factory001") return factory001DefaultLayouts;

    // fallback for other dashboards
    return {
      lg: [
        { i: "a", x: 0, y: 0, w: 2, h: 2 },
        { i: "b", x: 2, y: 0, w: 2, h: 2 },
        { i: "c", x: 4, y: 0, w: 2, h: 2 },
        { i: "d", x: 0, y: 2, w: 3, h: 2 },
        { i: "e", x: 3, y: 2, w: 3, h: 2 },
        { i: "f", x: 0, y: 4, w: 6, h: 1 },
      ],
    };
  } catch {
    return factory001DefaultLayouts;
  }
};

export default function useDashboardLayout(ref: string) {
  const [currentLayouts, setCurrentLayouts] = useState(() => getSavedLayouts(ref));
  const [locked, setLocked] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visiblePanels, setVisiblePanels] = useState<Record<string, boolean>>({
    a: true, b: true, c: true, d: true, e: true, f: true, g: true, h: true, t: true,
  });

  const onLayoutChange = (_: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    localStorage.setItem(`dashboard-layouts-${ref}`, JSON.stringify(allLayouts));
    setCurrentLayouts(allLayouts);
  };

  const togglePanel = (key: string) =>
    setVisiblePanels(prev => ({ ...prev, [key]: !prev[key] }));

  const resetLayout = () => {
    localStorage.removeItem(`dashboard-layouts-${ref}`);
    setCurrentLayouts(getDefaultLayouts(ref));
  };

  const setAsDefault = () => {
    localStorage.setItem(
      `dashboard-default-layouts-${ref}`,
      JSON.stringify(currentLayouts)
    );
  };

  const toggleMenu = () => setMenuOpen(m => !m);

  return {
    currentLayouts,
    visiblePanels,
    locked,
    menuOpen,
    toggleMenu,
    togglePanel,
    resetLayout,
    setLocked,
    onLayoutChange,
    setAsDefault,
  };
}
