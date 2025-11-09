import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Clock,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface TimeRange {
  type: "quick" | "absolute";
  quickRange: string;
  absoluteFrom: string;
  absoluteTo: string;
  quickAnchor?: string;
}

interface TimeRangePickerProps {
  value: TimeRange;
  onChange: (newValue: TimeRange) => void;
}

const quickRanges = [
  { label: "3m", value: "3m", ms: 3 * 60 * 1000 },
  { label: "5m", value: "5m", ms: 5 * 60 * 1000 },
  { label: "15m", value: "15m", ms: 15 * 60 * 1000 },
  { label: "30m", value: "30m", ms: 30 * 60 * 1000 },
  { label: "1h", value: "1h", ms: 60 * 60 * 1000 },
  { label: "3h", value: "3h", ms: 3 * 60 * 60 * 1000 },
  { label: "6h", value: "6h", ms: 6 * 60 * 60 * 1000 },
  { label: "12h", value: "12h", ms: 12 * 60 * 60 * 1000 },
  { label: "24h", value: "24h", ms: 24 * 60 * 60 * 1000 },
  { label: "7d", value: "7d", ms: 7 * 24 * 60 * 60 * 1000 }, 
]

const formatSmartLabel = (from: Date, to: Date): string => {
  const sameDay = from.toDateString() === to.toDateString();
  const fmtDate = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const fmtTime = (d: Date) =>
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  if (sameDay) return `${fmtDate(from)} ${fmtTime(from)} - ${fmtTime(to)}`;
  return `${fmtDate(from)} ${fmtTime(from)} → ${fmtDate(to)} ${fmtTime(to)}`;
};

export default function TimeRangePicker({ value, onChange }: TimeRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"quick" | "absolute">(value.type);
  const ref = useRef<HTMLDivElement>(null);
  const [absFrom, setAbsFrom] = useState(value.absoluteFrom);
  const [absTo, setAbsTo] = useState(value.absoluteTo);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const getQuickRange = () => quickRanges.find((r) => r.value === value.quickRange);

  const shiftRange = (direction: "back" | "forward") => {
    if (value.type === "quick") {
      const range = getQuickRange();
      if (!range) return;
      const anchor = value.quickAnchor ? new Date(value.quickAnchor) : new Date();
      const shift = direction === "back" ? -range.ms : range.ms;
      const newAnchor = new Date(anchor.getTime() + shift);
      onChange({ ...value, quickAnchor: newAnchor.toISOString() });
    } else {
      const from = new Date(value.absoluteFrom);
      const to = new Date(value.absoluteTo);
      const diff = to.getTime() - from.getTime();
      const shift = direction === "back" ? -diff : diff;
      onChange({
        ...value,
        absoluteFrom: new Date(from.getTime() + shift).toISOString().slice(0, 16),
        absoluteTo: new Date(to.getTime() + shift).toISOString().slice(0, 16),
      });
    }
  };

  const getLabel = () => {
    if (value.type === "quick") {
      const range = getQuickRange();
      const anchor = value.quickAnchor ? new Date(value.quickAnchor) : new Date();
      const from = new Date(anchor.getTime() - (range?.ms || 0));
      return formatSmartLabel(from, anchor);
    } else {
      const from = new Date(value.absoluteFrom);
      const to = new Date(value.absoluteTo);
      return formatSmartLabel(from, to);
    }
  };

  const applyAbsolute = () => {
    if (!absFrom || !absTo) return;
    onChange({
      type: "absolute",
      quickRange: value.quickRange,
      absoluteFrom: absFrom,
      absoluteTo: absTo,
    });
    setOpen(false);
  };

  return (
    <div className="relative text-xs" ref={ref}>
      <div className="flex gap-1 items-center">
        <button onClick={() => shiftRange("back")} className="px-1 py-1 border rounded hover:bg-gray-100">
          <ArrowLeft size={14} />
        </button>

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 px-2 py-1 border rounded hover:bg-gray-100"
        >
          <Clock size={14} />
          <span>{getLabel()}</span>
          <ChevronDown size={12} />
        </button>

        <button onClick={() => shiftRange("forward")} className="px-1 py-1 border rounded hover:bg-gray-100">
          <ArrowRight size={14} />
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-10 w-56 bg-white border shadow rounded p-2">
          {/* Tabs */}
          <div className="flex mb-2">
            <button
              onClick={() => setTab("quick")}
              className={`flex-1 text-center px-2 py-1 rounded-l ${
                tab === "quick" ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
            >
              Quick
            </button>
            <button
              onClick={() => setTab("absolute")}
              className={`flex-1 text-center px-2 py-1 rounded-r ${
                tab === "absolute" ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
            >
              Absolute
            </button>
          </div>

          {tab === "quick" ? (
            <div className="space-y-1">
              {quickRanges.map((r) => (
                <button
                  key={r.value}
                  onClick={() => {
                    onChange({
                      type: "quick",
                      quickRange: r.value,
                      absoluteFrom: "",
                      absoluteTo: "",
                      quickAnchor: new Date().toISOString(),
                    });
                    setOpen(false);
                  }}
                  className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
                    value.quickRange === r.value && value.type === "quick" ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  Last {r.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <label className="block text-[10px] font-medium mb-1">From:</label>
                <input
                  type="datetime-local"
                  value={absFrom}
                  onChange={(e) => setAbsFrom(e.target.value)}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium mb-1">To:</label>
                <input
                  type="datetime-local"
                  value={absTo}
                  onChange={(e) => setAbsTo(e.target.value)}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </div>
              <button
                onClick={applyAbsolute}
                className="w-full mt-1 px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
