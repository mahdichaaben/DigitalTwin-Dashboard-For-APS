"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bell } from "lucide-react";

interface Sensor {
  sensorId: string;
  name: string;
}

interface AlertEntity {
  alertId: string;
  digitalModuleId: string;
  sensorId: string;
  alertType: string;
  description?: string;
  summary?: string;
  status: string;
  startedAt: string;
  endedAt?: string | null;
}

export default function AlertNotifier() {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const isConnectedRef = useRef(false);

  // --- Local storage helpers ---
  const STORAGE_KEY = "persistedAlerts";

  const readPersistedAlerts = useCallback((): AlertEntity[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AlertEntity[]) : [];
    } catch {
      return [];
    }
  }, []);

  const writePersistedAlerts = useCallback((alerts: AlertEntity[]) => {
    try {
      // keep only the most recent 50 to prevent unbounded growth
      const capped = alerts.slice(-50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
    } catch {
      // ignore storage errors
    }
  }, []);

  const upsertPersistedAlert = useCallback((alert: AlertEntity) => {
    const alerts = readPersistedAlerts();
    const idx = alerts.findIndex((a) => a.alertId === alert.alertId);
    if (idx >= 0) alerts[idx] = { ...alerts[idx], ...alert };
    else alerts.push(alert);
    writePersistedAlerts(alerts);
  }, [readPersistedAlerts, writePersistedAlerts]);

  const removePersistedAlert = useCallback((alertId: string) => {
    const alerts = readPersistedAlerts().filter((a) => a.alertId !== alertId);
    writePersistedAlerts(alerts);
  }, [readPersistedAlerts, writePersistedAlerts]);

  // --- Toast helper ---
  const showAlertToast = useCallback((alert: AlertEntity) => {
    const status = alert.status?.toLowerCase();
    const iconClass = status === "firing" ? "text-red-500" : status === "resolved" ? "text-green-500" : "text-blue-500";
    const commonOpts = {
      autoClose: false,
      closeOnClick: true,
      pauseOnHover: true,
      toastId: alert.alertId, // prevent duplicates
      onClose: () => removePersistedAlert(alert.alertId), // clear when user dismisses
      icon: <Bell className={`h-5 w-5 ${iconClass}`} />,
    } as const;

    const content = (
      <div className="flex flex-col">
        <div className="font-medium">
          {alert.alertType} • Sensor {alert.sensorId}
        </div>
        <div className="text-xs text-gray-600">
          Module {alert.digitalModuleId}
          {alert.summary ? ` — ${alert.summary}` : ""}
        </div>
      </div>
    );

    if (status === "firing") {
      toast.error(content, commonOpts);
    } else if (status === "resolved") {
      toast.success(content, commonOpts);
    } else {
      toast.info(content, commonOpts);
    }
  }, [removePersistedAlert]);

  useEffect(() => {
    const hubUrl = "http://localhost:5114/factoryhub";

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(conn);

    // Handle alerts
    conn.on("AlertUpdated", (alert: AlertEntity) => {
      console.log("[AlertNotifier] Alert received:", alert);
      // persist and pop
      upsertPersistedAlert(alert);
      showAlertToast(alert);
    });

    const startConnection = async () => {
      try {
        await conn.start();
        isConnectedRef.current = true;
        console.log("[AlertNotifier] Connected:", conn.connectionId);

        const res = await fetch("http://localhost:5114/api/Sensors");
        const sensors: Sensor[] = await res.json();

        await Promise.all(
          sensors.map(sensor => conn.invoke("JoinAlertGroup", sensor.sensorId))
        );

        console.log("[AlertNotifier] Subscribed to all sensors:", sensors.map(s => s.sensorId));
      } catch (err) {
        console.error("[AlertNotifier] Connection or subscription error:", err);
      }
    };

  startConnection();

  // Restore persisted alerts on mount
  const persisted = readPersistedAlerts();
  if (persisted.length) persisted.forEach(showAlertToast);

    conn.onreconnected(async () => {
      console.log("[AlertNotifier] Reconnected:", conn.connectionId);

      try {
        const res = await fetch("http://localhost:5114/api/Sensors");
        const sensors: Sensor[] = await res.json();

        await Promise.all(
          sensors.map(sensor => conn.invoke("JoinAlertGroup", sensor.sensorId))
        );
        console.log("[AlertNotifier] Resubscribed to all sensors after reconnect");
      } catch (err) {
        console.error("[AlertNotifier] Resubscription failed:", err);
      }
    });

    return () => {
      conn.stop().catch(() => {});
    };
  }, [showAlertToast, upsertPersistedAlert, readPersistedAlerts]);

  return <ToastContainer position="top-right" newestOnTop closeOnClick pauseOnHover />;
}
