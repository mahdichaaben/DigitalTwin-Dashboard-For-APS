// src/lib/moduleUtils.ts
import { Zap, Truck, Box } from "lucide-react";

// Images
import aiqs_img from "@/assets/computer-vision.png";
import drill_img from "@/assets/drill_img.png";
import mill_img from "@/assets/mill_img.png";
import dps_img from "@/assets/dps.png";
import hbw_img from "@/assets/hbw.png";

/**
 * Pick an icon or image depending on module name/type
 */
export const getModuleIcon = (name?: string, moduleType?: string) => {
  const lowerName = (name || "").toLowerCase();
  const lowerType = (moduleType || "").toLowerCase();

  if (lowerName.includes("quality") || lowerName.includes("aiqs")) return aiqs_img;
  if (lowerName.includes("drilling") || lowerName.includes("drill")) return drill_img;
  if (lowerName.includes("mill")) return mill_img;
  if (lowerName.includes("dps")) return dps_img;

  if (lowerName.includes("warehouse") || lowerName.includes("hbw")) return hbw_img;
  if (lowerName.includes("storage") || lowerType === "storagemodule") return hbw_img;
  if (lowerName.includes("charging")) return Zap;
  if (lowerName.includes("delivery") || lowerName.includes("pickup")) return Truck;

  return Box;
};

/**
 * Return Tailwind classes for status/state badges
 */
export const getBadgeClasses = (value: string) => {
  switch (value.toUpperCase()) {
    case "FINISHED":
    case "COMPLETED":
      return "bg-green-100 text-green-700 border border-green-200";
    case "RUNNING":
    case "ACTIVE":
      return "bg-yellow-100 text-blue-700 border border-yellow-200";
    case "ERROR":
    case "FAILED":
      return "bg-red-100 text-red-700 border border-red-200";
    case "IDLE":
    case "WAITING":
      return "bg-gray-100 text-gray-700 border border-gray-200";
    case "DROPBUSY":
    case "BUSY":
      return "bg-purple-100 text-purple-700 border border-purple-200";
    case "OPERATIONAL":
      return "bg-green-50 text-green-700 border border-green-200";
    case "OFFLINE":
    case "INACTIVE":
      return "bg-gray-50 text-gray-600 border border-gray-200";
    case "MAINTENANCE":
      return "bg-orange-100 text-orange-700 border border-orange-200";
    default:
      return "bg-blue-100 text-blue-700 border border-blue-200";
  }
};
