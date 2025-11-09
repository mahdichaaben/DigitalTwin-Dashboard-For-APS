"use client";
import { useEffect, useState, useRef } from "react";
import { Truck, Activity, Battery, Package } from "lucide-react";
import api from "@/lib/axiosConfig";
import * as signalR from "@microsoft/signalr";

interface AgvModule {
  serialNumber: string;
  name: string;
  moduleType: string;
  state: string | null;
  currentStatus: string | null;
  currentPosition: string | null;
  currentWorkpieceIds?: string[];
  chargeLevel?: number; // battery percentage (0–100)
}

export default function AgvStateCard() {
  const [agv, setAgv] = useState<AgvModule | null>(null);
  const agvRef = useRef<AgvModule | null>(null); // for SignalR subscription

  // Initial HTTP fetch
  useEffect(() => {
    async function fetchAgv() {
      try {
        const { data } = await api.get<{ modules: AgvModule[] }>("/api/Factory");
        const agvModule = data.modules.find((mod) => mod.moduleType === "TransportModule") || null;
        setAgv(agvModule);
        agvRef.current = agvModule;
      } catch (error) {
        console.error("Failed to fetch AGV module", error);
      }
    }

    fetchAgv();
    const interval = setInterval(fetchAgv, 5000); // fallback refresh
    return () => clearInterval(interval);
  }, []);

  // SignalR live updates
  useEffect(() => {
    const hubUrl = "http://localhost:5114/factoryhub"; // backend hub URL
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Update AGV state from SignalR
    connection.on("ModuleUpdated", (payload: Partial<AgvModule> & { serialNumber: string }) => {
      if (payload.serialNumber === agvRef.current?.serialNumber) {
        setAgv((prev) => (prev ? { ...prev, ...payload } : prev));
      }
    });

    const subscribeAgv = async () => {
      try {
        await connection.start();
        console.log("[AgvStateCard] Connected:", connection.connectionId);

        if (agvRef.current) {
          await connection.invoke("JoinModuleGroup", agvRef.current.serialNumber);
          console.log("[AgvStateCard] Subscribed to AGV module");
        }
      } catch (err) {
        console.error("[AgvStateCard] Connection error:", err);
      }
    };

    subscribeAgv();

    connection.onreconnected(async () => {
      console.log("[AgvStateCard] Reconnected, resubscribing...");
      if (agvRef.current) {
        try {
          await connection.invoke("JoinModuleGroup", agvRef.current.serialNumber);
        } catch (err) {
          console.error("[AgvStateCard] Resubscribe failed:", err);
        }
      }
    });

    return () => {
      connection.stop().catch(() => {});
    };
  }, []);

  if (!agv) return null;

  const getCardBgColor = (status: string | null, state: string | null) => {
    const normalized = status?.toUpperCase() || "";
    const normalizedState = state?.toUpperCase() || "";
    if (normalized === "RUNNING") return "bg-yellow-50 border-yellow-200";
    if (normalized === "ERROR") return "bg-red-50 border-red-200";
    if (normalized === "FINISHED" || normalizedState === "IDLE") return "bg-white border-gray-200";
    return "bg-white border-gray-200";
  };

  const getStatusChipColor = (status: string | null) => {
    switch (status?.toUpperCase()) {
      case "RUNNING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ERROR":
        return "bg-red-100 text-red-800 border-red-200";
      case "FINISHED":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStateColor = (state: string | null) => {
    switch (state?.toUpperCase()) {
      case "IDLE":
        return "text-blue-500";
      case "MOVING":
        return "text-green-500";
      case "CHARGING":
        return "text-yellow-500";
      case "ERROR":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getBatteryColor = (level?: number) => {
    if (level === undefined) return "text-gray-400";
    if (level > 60) return "text-green-500";
    if (level > 30) return "text-yellow-500";
    return "text-red-500";
  };

  const displayName = agv.name || "AGV Unit";
  const displaySerial = agv.serialNumber || "Unknown Serial";
  const displayState = agv.state || "Idle";
  const displayStatus = agv.currentStatus || "Idle";
  const displayCharge = agv.chargeLevel !== undefined ? `${agv.chargeLevel}%` : "70%";

  return (
    <div
      className={`w-full h-full rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border ${getCardBgColor(
        agv.currentStatus,
        agv.state
      )}`}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 rounded-md">
            <Truck className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-sm leading-tight">{displayName}</h3>
            <p className="text-xs text-gray-500">{displaySerial}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Battery className={`w-4 h-4 ${getBatteryColor(agv.chargeLevel)}`} />
          <span className="text-xs font-medium text-gray-900">{displayCharge}</span>
        </div>
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-600">Status</span>
          </div>
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusChipColor(
              agv.currentStatus
            )}`}
          >
            {displayStatus}
          </span>
        </div>

        <div className={`flex items-center justify-end ${getStateColor(agv.state)}`}>
          <span className="text-sm font-medium">{displayState}</span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-600">Loads</span>
          </div>
          <span className="text-xs font-medium text-gray-900">{agv.currentWorkpieceIds?.length || 0}</span>
        </div>
      </div>
    </div>
  );
}
