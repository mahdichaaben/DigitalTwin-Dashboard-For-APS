"use client";
import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import {
  Warehouse,
  Database,
  Zap,
  Truck,
  Drill,
  Settings,
  Activity,
  Box,
} from "lucide-react";
import api from "@/lib/axiosConfig";

// Images
import aiqs_img from "@/assets/computer-vision.png";
import drill_img from "@/assets/drill_img.png";
import mill_img from "@/assets/mill_img.png";
import dps_img from "@/assets/dps.png";
import hbw_img from "@/assets/hbw.png";

interface Module {
  serialNumber: string;
  name: string;
  moduleType: string;
  state: string | null;
  status: string | null;
  currentCommand?: string | null;
}

interface ModuleLog {
  id: number;
  moduleSerialNumber: string;
  moduleName?: string | null;
  moduleState?: string | null;
  commandName?: string | null;
  wpId?: string | null;
  status?: string | null;
  timestamp: string;
}

const getModuleIcon = (name?: string, moduleType?: string) => {
  const lowerName = (name || "").toLowerCase();
  const lowerType = (moduleType || "").toLowerCase();

  if (lowerName.includes("quality") || lowerName.includes("aiqs")) return aiqs_img;
  if (lowerName.includes("drilling") || lowerName.includes("drill")) return drill_img;
  if (lowerName.includes("mill")) return mill_img;
  if (lowerName.includes("dps")) return dps_img;

  if (lowerName.includes("warehouse") || lowerName.includes("hbw")) return hbw_img;
  if (lowerName.includes("storage") || lowerType === "storagemodule") return hbw_img;
  if (lowerName.includes("charging")) return Zap;
  if (lowerName.includes("delivery") || lowerName.includes("pickup") || lowerName.includes("hbw"))
    return Truck;

  return Box;
};

const getBadgeClasses = (value: string) => {
  switch (value?.toUpperCase()) {
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

export default function ModulesStatesCards() {
  const [modules, setModules] = useState<Module[]>([]);
  const [logs, setLogs] = useState<ModuleLog[]>([]);
  const modulesRef = useRef<Module[]>([]);

  // Initial fetch
  useEffect(() => {
    async function fetchModules() {
      try {
        const { data } = await api.get<{ modules: Module[] }>("/api/Factory");
        const filteredModules = data.modules.filter(
          (mod) => mod.moduleType === "FixedModule" || mod.moduleType === "StorageModule"
        );
        setModules(filteredModules);
        modulesRef.current = filteredModules;
      } catch (error) {
        console.error("Failed to fetch modules", error);
      }
    }
    fetchModules();
    const interval = setInterval(fetchModules, 30000);
    return () => clearInterval(interval);
  }, []);

  // SignalR updates
  useEffect(() => {
    const hubUrl = "http://localhost:5114/factoryhub";
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("ModuleUpdated", (log: ModuleLog) => {
      // Update module state based on backend log
      setModules((prev) =>
        prev.map((m) =>
          m.serialNumber === log.moduleSerialNumber
            ? {
                ...m,
                name: log.moduleName || m.name,
                state: log.moduleState || m.state,
                status: log.status || m.status,
                currentCommand: log.commandName || m.currentCommand,
              }
            : m
        )
      );

      console.log("[ModuleUpdated]", log);
    });

    const subscribeModules = async () => {
      try {
        await connection.start();
        console.log("[ModulesStatesCards] Connected:", connection.connectionId);

        await Promise.all(
          modulesRef.current.map((m) => connection.invoke("JoinModuleGroup", m.serialNumber))
        );
      } catch (err) {
        console.error("[ModulesStatesCards] Connection error:", err);
      }
    };
    subscribeModules();

    connection.onreconnected(async () => {
      console.log("[ModulesStatesCards] Reconnected, resubscribing...");
      try {
        await Promise.all(
          modulesRef.current.map((m) => connection.invoke("JoinModuleGroup", m.serialNumber))
        );
      } catch (err) {
        console.error("[ModulesStatesCards] Resubscribe failed:", err);
      }
    });

    return () => {
      connection.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="w-full h-full bg-white">
      <div className="p-1 sm:p-2">
        {modules.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-500">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm">Loading modules...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 h-full">
            {modules.map((module) => {
              const IconOrImg = getModuleIcon(module.name, module.moduleType);
              const isRunning = module.status?.toUpperCase() === "RUNNING";

              return (
                <div
                  key={module.serialNumber}
                  className={`relative rounded-lg border p-3 transition-all duration-200 group cursor-pointer ${
                    isRunning
                      ? "bg-yellow-50 border-yellow-300 shadow-md"
                      : "bg-white border-gray-200 hover:shadow-md"
                  }`}
                >
                  {module.status && (
                    <div
                      className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                        isRunning ? "bg-blue-500" : "bg-gray-400"
                      }`}
                    ></div>
                  )}

                  <div className="flex justify-center mb-2">
                    {typeof IconOrImg === "string" ? (
                      <img
                        src={IconOrImg}
                        alt={module.name}
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <IconOrImg className="w-8 h-8 text-gray-700" />
                    )}
                  </div>

                  <div className="text-center">
                    <h4 className="font-medium text-xs text-gray-700 mb-1 truncate">
                      {module.name}
                    </h4>
                    <p className="text-xs text-gray-500 font-mono truncate mb-1">
                      {module.serialNumber}
                    </p>

                    <div className="flex flex-col gap-1 flex-wrap mt-1">
                      {module.state && (
                        <div
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${getBadgeClasses(
                            module.state
                          )}`}
                        >
                          {module.state}
                        </div>
                      )}
                      {module.status && (
                        <div
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${getBadgeClasses(
                            module.status
                          )}`}
                        >
                          {module.status}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
