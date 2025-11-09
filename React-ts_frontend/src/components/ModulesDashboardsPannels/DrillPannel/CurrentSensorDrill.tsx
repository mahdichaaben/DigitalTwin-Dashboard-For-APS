"use client";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import TimeRangePicker from "@/components/TimeRangePicker/TimeRangePicker";

// Interfaces
interface QuickRange {
  label: string;
  value: string;
  from: () => Date;
  to: () => Date;
}

interface TimeRange {
  type: "quick" | "absolute";
  quickRange: string;
  absoluteFrom: string;
  absoluteTo: string;
}

interface TimeRangeResult {
  from: number;
  to: number;
}

// Quick Ranges (same as TempSensorDrill)
const quickRanges: QuickRange[] = [
  { label: "Last 3 minutes", value: "3m", from: () => new Date(Date.now() - 3 * 60 * 1000), to: () => new Date() },
  { label: "Last 5 minutes", value: "5m", from: () => new Date(Date.now() - 5 * 60 * 1000), to: () => new Date() },
  { label: "Last 15 minutes", value: "15m", from: () => new Date(Date.now() - 15 * 60 * 1000), to: () => new Date() },
  { label: "Last 30 minutes", value: "30m", from: () => new Date(Date.now() - 30 * 60 * 1000), to: () => new Date() },
  { label: "Last 1 hour", value: "1h", from: () => new Date(Date.now() - 60 * 60 * 1000), to: () => new Date() },
  { label: "Last 3 hours", value: "3h", from: () => new Date(Date.now() - 3 * 60 * 60 * 1000), to: () => new Date() },
  { label: "Last 6 hours", value: "6h", from: () => new Date(Date.now() - 6 * 60 * 60 * 1000), to: () => new Date() },
  { label: "Last 12 hours", value: "12h", from: () => new Date(Date.now() - 12 * 60 * 60 * 1000), to: () => new Date() },
  { label: "Last 24 hours", value: "24h", from: () => new Date(Date.now() - 24 * 60 * 60 * 1000), to: () => new Date() },
  { label: "Last 7 days", value: "7d", from: () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), to: () => new Date() },
];

// Time Range Parsing (same as TempSensorDrill)
const getTimeRange = (timeRange: TimeRange): TimeRangeResult => {
  if (timeRange.type === "quick") {
    const range = quickRanges.find((r) => r.value === timeRange.quickRange);
    if (range) return { from: range.from().getTime(), to: range.to().getTime() };
  } else {
    const parseTime = (timeStr: string): Date => {
      if (timeStr === "now") return new Date();
      if (timeStr.startsWith("now-")) {
        const match = timeStr.substring(4).match(/^(\d+)([mhd])$/);
        if (match) {
          const value = parseInt(match[1]);
          const unit = match[2] as "m" | "h" | "d";
          const multipliers: { [key in "m" | "h" | "d"]: number } = { m: 60, h: 3600, d: 86400 };
          return new Date(Date.now() - value * multipliers[unit] * 1000);
        }
      }
      const parsed = new Date(timeStr);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    };
    return { from: parseTime(timeRange.absoluteFrom).getTime(), to: parseTime(timeRange.absoluteTo).getTime() };
  }
  return { from: Date.now() - 24 * 60 * 60 * 1000, to: Date.now() };
};

// Filters interface
interface Filters {
  selectedFilter: string;
}

export default function CurrentSensorDrill() {
  const [timeRange, setTimeRange] = useState<TimeRange>({
    type: "quick",
    quickRange: "15m", // same default as TempSensorDrill
    absoluteFrom: "now-15m",
    absoluteTo: "now",
  });

  const [filters] = useState<Filters>({ selectedFilter: "" });
  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  const range = getTimeRange(timeRange);

  const handleRefresh = () => setIframeKey(Date.now());

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center gap-3 p-1">
        <TimeRangePicker value={timeRange} onChange={setTimeRange} />
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 text-sm text-gray-700 hover:text-black transition"
          title="Refresh Panel"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <iframe
          src="http://localhost:3000/d-solo/76a7e6c9-d7c5-4f28-ad45-caccb7d2499c/dashbord-dt?orgId=1&from=1759586348255&to=1759586708255&timezone=utc&var-sensor_id=dps_light1&var-controller_ref=DPS001&var-Filters=&refresh=auto&theme=light&panelId=23&__feature.dashboardSceneSolo=true"
className="w-full h-full border-0"
          title="Current Sensor Drill Panel"
        />
      </div>
    </div>
  );
}
