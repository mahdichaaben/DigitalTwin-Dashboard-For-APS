export const parseRelativeTime = (timeStr: string): Date => {
  if (timeStr === "now") return new Date();
  if (timeStr.startsWith("now-")) {
    const [, valueStr, unit] = timeStr.match(/^now-(\d+)([mhd])$/) || [];
    const value = parseInt(valueStr || "0");
    const ms = unit === "m" ? value * 60_000 : unit === "h" ? value * 3600_000 : value * 86400_000;
    return new Date(Date.now() - ms);
  }
  const parsed = new Date(timeStr);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

export const getDateRange = (range: any) => {
  if (range.type === "quick") {
    const now = new Date();
    const map = {
      "5m": 5, "15m": 15, "30m": 30,
      "1h": 60, "3h": 180, "6h": 360,
      "12h": 720, "24h": 1440, "2d": 2880, "7d": 10080,
    };
    const minutes = map[range.quickRange] || 1440;
    return {
      from: new Date(now.getTime() - minutes * 60_000).toISOString(),
      to: now.toISOString(),
    };
  }

  return {
    from: parseRelativeTime(range.absoluteFrom).toISOString(),
    to: parseRelativeTime(range.absoluteTo).toISOString(),
  };
};
