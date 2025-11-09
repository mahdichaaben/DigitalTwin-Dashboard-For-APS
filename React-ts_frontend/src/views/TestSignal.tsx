"use client";

import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { Drill, Hammer, Cpu, Warehouse } from "lucide-react";

interface ModuleUpdate {
  moduleSerial: string;
  status?: string;
  commandName?: string;
  timestamp?: string;
  name: string;
}

const modules = [
  { serialNumber: "DPS001", name: "DPS Module" },
  { serialNumber: "DRILL001", name: "Drill Module" },
  { serialNumber: "MILL001", name: "Mill Module" },
  { serialNumber: "AIQS001", name: "AIQS Module" },
  { serialNumber: "HBW001", name: "HBW Storage Module" },
  { serialNumber: "80F4", name: "AGV Module" },
  { serialNumber: "STORE01", name: "Main Store" }
];

export default function ModuleDashboard() {
  const [updates, setUpdates] = useState<Record<string, ModuleUpdate>>({});

  useEffect(() => {
    const hubUrl = "http://localhost:5114/factoryhub";
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Update state for incoming module updates
    connection.on("ModuleUpdated", (payload: any) => {
      setUpdates(prev => ({
        ...prev,
        [payload.serialNumber]: {
          moduleSerial: payload.serialNumber,
          status: payload.status,
          commandName: payload.commandName,
          timestamp: payload.timestamp,
          name: payload.name || payload.serialNumber
        }
      }));
    });

    const subscribeModules = async () => {
      try {
        await connection.start();
        console.log("[ModuleDashboard] Connected:", connection.connectionId);

        // FIXED: Changed "SubscribeModule" to "JoinModuleGroup"
        await Promise.all(modules.map(m => connection.invoke("JoinModuleGroup", m.serialNumber)));
        console.log("[ModuleDashboard] Subscribed to all modules");
      } catch (err) {
        console.error("[ModuleDashboard] Connection error:", err);
      }
    };

    subscribeModules();

    connection.onreconnected(async () => {
      console.log("[ModuleDashboard] Reconnected, re-subscribing...");
      try {
        // FIXED: Changed "SubscribeModule" to "JoinModuleGroup" here too
        await Promise.all(modules.map(m => connection.invoke("JoinModuleGroup", m.serialNumber)));
      } catch (err) {
        console.error("[ModuleDashboard] Resubscribe failed:", err);
      }
    });

    return () => {
      connection.stop().catch(() => {});
    };
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "RUNNING": return "bg-blue-100 text-blue-700";
      case "FINISHED": return "bg-emerald-200 text-emerald-800";
      case "ERROR": return "bg-red-100 text-red-700 animate-pulse";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getModuleIcon = (serial: string) => {
    switch (serial) {
      case "DRILL001": return <Drill className="w-6 h-6 mb-2" />;
      case "MILL001": return <Hammer className="w-6 h-6 mb-2" />;
      case "DPS001": return <Cpu className="w-6 h-6 mb-2" />;
      case "HBW001": return <Warehouse className="w-6 h-6 mb-2" />;
      default: return <Cpu className="w-6 h-6 mb-2" />;
    }
  };

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {modules.map(mod => {
        const update = updates[mod.serialNumber];
        return (
          <div
            key={mod.serialNumber}
            className={`flex flex-col items-center p-4 border rounded-xl shadow-sm ${getStatusColor(update?.status)}`}
          >
            {getModuleIcon(mod.serialNumber)}
            <div className="font-bold">{mod.name}</div>
            {update ? (
              <>
                <div className="text-sm uppercase">{update.status}</div>
                <div className="text-xs text-gray-500">
                  {update.timestamp ? new Date(update.timestamp).toLocaleTimeString() : ""}
                </div>
                <div className="text-xs text-gray-400">{update.commandName}</div>
              </>
            ) : (
              <div className="text-sm text-gray-400">No data yet</div>
            )}
          </div>
        );
      })}
    </div>
  );
}