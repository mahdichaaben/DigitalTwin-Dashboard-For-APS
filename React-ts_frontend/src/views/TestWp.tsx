"use client";

import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import axios from "axios";

interface Workpiece {
  id: string;
  state: string;
  typeName: string;
  addedBy: string;
}

interface WorkpieceUpdate {
  id: string; // This is the workpiece ID
  typeName: string;
  state: string;
  moduleSerial?: string;
  orderId?: string;
  timestamp: string;
}

export default function WorkpieceDashboard() {
  const [workpieces, setWorkpieces] = useState<Workpiece[]>([]);
  const [updates, setUpdates] = useState<Record<string, WorkpieceUpdate>>({});
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5114/factoryhub")
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (!connection) return;

    const fetchWorkpieces = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Workpiece[]>("http://localhost:5114/api/Workpiece/all");
        setWorkpieces(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching workpieces:", err);
        setError("Failed to fetch workpieces");
      } finally {
        setLoading(false);
      }
    };

    const setupSignalR = async () => {
      try {
        await connection.start();
        console.log("[WorkpieceDashboard] SignalR connected");

        connection.on("WorkpieceUpdated", (payload: WorkpieceUpdate) => {
          console.log("Workpiece update received:", payload);
          setUpdates(prev => ({
            ...prev,
            [payload.id]: payload // Use 'id' as the key, not 'workpieceId'
          }));
        });

        await fetchWorkpieces();
      } catch (err) {
        console.error("SignalR connection error:", err);
        setError("Failed to connect to real-time server");
      }
    };

    setupSignalR();

    return () => {
      connection.off("WorkpieceUpdated");
    };
  }, [connection]);

  useEffect(() => {
    if (!connection || workpieces.length === 0) return;

    const subscribeToWorkpieces = async () => {
      try {
        await Promise.all(
          workpieces.map(wp => 
            connection.invoke("JoinWorkpieceGroup", wp.id)
          )
        );
        console.log(`[WorkpieceDashboard] Subscribed to ${workpieces.length} workpieces`);
      } catch (err) {
        console.error("Error subscribing to workpieces:", err);
      }
    };

    subscribeToWorkpieces();
  }, [connection, workpieces]);

  const getStateColor = (state: string) => {
    const stateUpper = state?.toUpperCase();
    
    if (stateUpper.includes("FINISHED")) return "bg-green-100 text-green-800 border-green-300";
    if (stateUpper.includes("RUNNING")) return "bg-blue-100 text-blue-800 border-blue-300";
    if (stateUpper.includes("ERROR") || stateUpper.includes("FAILED")) return "bg-red-100 text-red-800 border-red-300 animate-pulse";
    if (stateUpper === "FREE") return "bg-gray-100 text-gray-800 border-gray-300";
    if (stateUpper.includes("PICK") || stateUpper.includes("DROP")) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (stateUpper.includes("MOVE")) return "bg-purple-100 text-purple-800 border-purple-300";
    if (stateUpper.includes("DRILL") || stateUpper.includes("MILL")) return "bg-orange-100 text-orange-800 border-orange-300";
    
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getStateIcon = (state: string) => {
    const stateUpper = state?.toUpperCase();
    
    if (stateUpper.includes("FINISHED")) return "✅";
    if (stateUpper.includes("RUNNING")) return "⚙️";
    if (stateUpper.includes("ERROR")) return "❌";
    if (stateUpper === "FREE") return "🟢";
    if (stateUpper.includes("PICK")) return "🔼";
    if (stateUpper.includes("DROP")) return "🔽";
    if (stateUpper.includes("MOVE")) return "🚗";
    if (stateUpper.includes("DRILL")) return "🔄";
    if (stateUpper.includes("MILL")) return "⚒️";
    
    return "🔵";
  };

  const getStateCategory = (state: string) => {
    const stateUpper = state?.toUpperCase();
    
    if (stateUpper.includes("PICK")) return "PICK OPERATION";
    if (stateUpper.includes("DROP")) return "DROP OPERATION";
    if (stateUpper.includes("MOVE")) return "TRANSPORT";
    if (stateUpper.includes("DRILL")) return "DRILLING";
    if (stateUpper.includes("MILL")) return "MILLING";
    if (stateUpper === "FREE") return "AVAILABLE";
    
    return "OPERATION";
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading workpieces...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <p className="text-red-600 font-semibold">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Workpiece Dashboard</h1>
        <p className="text-gray-600">
          Real-time updates for {workpieces.length} workpieces
          {connection?.state === signalR.HubConnectionState.Connected && (
            <span className="ml-2 text-green-500">● Connected</span>
          )}
          {connection?.state !== signalR.HubConnectionState.Connected && (
            <span className="ml-2 text-yellow-500">● Connecting...</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {workpieces.map(wp => {
          const update = updates[wp.id]; // Look up by wp.id (which matches payload.id)
          const currentState = update?.state || wp.state;
          const lastUpdate = update?.timestamp;

          return (
            <div
              key={wp.id}
              className={`p-4 border-2 rounded-lg shadow-sm transition-all duration-300 ${getStateColor(currentState)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{getStateIcon(currentState)}</span>
                <span className="text-xs text-gray-500">
                  {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : ''}
                </span>
              </div>

              <div className="mb-2">
                <div className="font-mono text-sm text-gray-500">ID:</div>
                <div className="font-bold text-lg truncate" title={wp.id}>{wp.id}</div>
              </div>

              <div className="mb-2">
                <div className="font-mono text-sm text-gray-500">Type:</div>
                <div className="font-semibold">{wp.typeName}</div>
              </div>

              <div className="mb-3">
                <div className="font-mono text-sm text-gray-500">Status:</div>
                <div className="font-semibold uppercase text-sm">{currentState}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {getStateCategory(currentState)}
                </div>
              </div>

              {(update?.moduleSerial || update?.orderId) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs space-y-1">
                    {update.moduleSerial && (
                      <div>
                        <span className="font-medium">Module:</span> {update.moduleSerial}
                      </div>
                    )}
                    {update.orderId && (
                      <div>
                        <span className="font-medium">Order:</span> {update.orderId.substring(0, 8)}...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {update && (
                <div className="mt-2 text-xs text-gray-400">
                  Updated: {new Date(update.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Debug info */}
      <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
        <div className="text-gray-600">
          <strong>Connection:</strong> {connection?.state} | 
          <strong> Updates received:</strong> {Object.keys(updates).length} | 
          <strong> Last update:</strong> {Object.keys(updates).length > 0 ? 
            new Date(updates[Object.keys(updates)[0]].timestamp).toLocaleTimeString() : 'None'}
        </div>
        {Object.keys(updates).length > 0 && (
          <div className="mt-2 text-xs">
            <strong>Recent updates:</strong> {Object.keys(updates).join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}