"use client";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import api from "@/lib/axiosConfig";
import { getModuleIcon, getBadgeClasses } from "@/lib/utils/moduleUtils";

interface Module {
  serialNumber: string;
  name: string;
  moduleType: string;
  currentStatus?: string | null;
  currentCommand?: string | null;
  currentWorkpieceIds?: string[];
  state?: string | null;
}

interface ModuleLog {
  id: string;
  moduleSerialNumber: string;
  commandName: string;
  status: string;
  timestamp: string;
  wpId?: string;
  moduleState?: string;
  moduleName?: string;
}

export default function ModuleDetailCard({ serialNumber }: { serialNumber: string }) {
  const [module, setModule] = useState<Module | null>(null);
  const [lastLog, setLastLog] = useState<ModuleLog | null>(null);

  // Fetch module info
  useEffect(() => {
    async function fetchModule() {
      try {
        const { data } = await api.get<{ modules: Module[] }>("/api/Factory");
        const found = data.modules.find((m) => m.serialNumber === serialNumber);
        setModule(found || null);
      } catch (err) {
        console.error("Failed to fetch module", err);
      }
    }
    fetchModule();
  }, [serialNumber]);

  // Fetch last operation
  useEffect(() => {
    async function fetchLastLog() {
      try {
        const { data } = await api.get<ModuleLog[]>("/api/Log/modules", {
          params: { moduleSerial: serialNumber, take: 1 },
        });
        if (data.length > 0) setLastLog(data[0]);
      } catch (err) {
        console.error("Failed to fetch last log", err);
      }
    }
    fetchLastLog();
    const interval = setInterval(fetchLastLog, 10000);
    return () => clearInterval(interval);
  }, [serialNumber]);

  // SignalR updates
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5114/factoryhub")
      .withAutomaticReconnect([0, 2000, 5000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("ModuleLogAdded", (log: ModuleLog) => {
      if (log.moduleSerialNumber === serialNumber) {
        setLastLog(log);
        // Update module state info if present in log
        setModule((prev) =>
          prev
            ? {
                ...prev,
                name: log.moduleName ?? prev.name,
                state: log.moduleState ?? prev.state,
                currentStatus: log.status ?? prev.currentStatus,
                currentCommand: log.commandName ?? prev.currentCommand,
                currentWorkpieceIds: log.wpId ? [log.wpId] : prev.currentWorkpieceIds ?? [],
              }
            : prev
        );
      }
    });

    connection.start()
      .then(() => connection.invoke("JoinModuleGroup", serialNumber))
      .catch(console.error);

      return () => {
    connection.stop().catch((err) => console.error("SignalR stop failed", err));
  };


  }, [serialNumber]);

  if (!module) {
    return (
      <div className="flex items-center justify-center h-60 text-gray-500 bg-white rounded-lg border">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm">Loading module...</p>
        </div>
      </div>
    );
  }

  const IconOrImg = getModuleIcon(module.name, module.moduleType);

  return (
    <div className="shadow-md p-6 h-full w-full bg-white rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        {typeof IconOrImg === "string" ? (
          <img src={IconOrImg} alt={module.name} className="w-14 h-14 object-contain" />
        ) : (
          <IconOrImg className="w-12 h-12 text-gray-700" />
        )}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{module.name}</h2>
          <p className="text-sm text-gray-500 font-mono">{module.serialNumber}</p>
          <p className="text-xs text-gray-400">Type: {module.moduleType}</p>
        </div>
      </div>

      {/* Current state/status/command */}
      <div className="mb-4 grid w-full gap-2">
        <div className="px-3 py-2 bg-blue-50 rounded text-sm font-medium text-blue-700 shadow-sm">
          State: {module.state || "Unknown"}
        </div>

      </div>

      {/* Last operation */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Last Operation</h3>
        {lastLog ? (
          <div className="flex items-center justify-between px-3 py-2 rounded shadow-sm bg-gray-50">
            <div className="flex flex-col">
              <span className="font-mono text-gray-700">{lastLog.commandName}</span>
              {lastLog.wpId && <span className="text-xs text-gray-500">Workpiece: {lastLog.wpId}</span>}
            </div>
            <span className={`px-2 py-0.5 rounded-full ${getBadgeClasses(lastLog.status)}`}>
              {lastLog.status}
            </span>
            <span className="text-[10px] text-gray-400">
              {new Date(lastLog.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ) : (
          <p className="text-xs text-gray-400">No recent operation executed.</p>
        )}
      </div>
    </div>
  );
}
