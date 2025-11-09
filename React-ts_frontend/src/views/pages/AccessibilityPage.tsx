import { useEffect, useState } from "react";

export default function AccessibilityPage() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    // load saved prefs
    try {
      setReduceMotion(localStorage.getItem("a11y.reduceMotion") === "1");
      setHighContrast(localStorage.getItem("a11y.highContrast") === "1");
      setLargeText(localStorage.getItem("a11y.largeText") === "1");
    } catch {
      // ignore read errors (private mode, etc.)
    }
  }, []);

  useEffect(() => {
    // persist and (optionally) set document classes if you plan to style them globally
    try {
      localStorage.setItem("a11y.reduceMotion", reduceMotion ? "1" : "0");
      localStorage.setItem("a11y.highContrast", highContrast ? "1" : "0");
      localStorage.setItem("a11y.largeText", largeText ? "1" : "0");
    } catch {
      // ignore write errors
    }

    const root = document.documentElement;
    root.classList.toggle("a11y-reduce-motion", reduceMotion);
    root.classList.toggle("a11y-high-contrast", highContrast);
    root.classList.toggle("a11y-large-text", largeText);
  }, [reduceMotion, highContrast, largeText]);

  return (
    <div className="p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Accessibility</h2>
        <p className="text-xs text-gray-500">Adjust visuals to suit your preferences. Clean, minimal, and app-consistent.</p>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Reduce motion</h3>
          <p className="text-xs text-gray-600 mb-3">Minimize animations and transitions.</p>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-blue-600"
              checked={reduceMotion}
              onChange={(e) => setReduceMotion(e.target.checked)}
            />
            Enable reduced motion
          </label>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">High contrast</h3>
          <p className="text-xs text-gray-600 mb-3">Increase contrast for better readability.</p>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-blue-600"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
            />
            Enable high contrast
          </label>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Larger text</h3>
          <p className="text-xs text-gray-600 mb-3">Use a slightly larger base font size.</p>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-blue-600"
              checked={largeText}
              onChange={(e) => setLargeText(e.target.checked)}
            />
            Enable larger text
          </label>
        </section>
      </div>

      <div className="mt-6 text-xs text-gray-500">
        Tip: You can wire these classes (a11y-reduce-motion, a11y-high-contrast, a11y-large-text) in your global CSS/Tailwind to change animations, color tokens, and font sizing.
      </div>
    </div>
  );
}
