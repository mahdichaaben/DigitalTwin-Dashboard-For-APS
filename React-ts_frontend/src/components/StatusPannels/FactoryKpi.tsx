"use client";
import { useEffect, useState } from "react";
import { 
  Activity, 
  Zap, 
  AlertTriangle, 
  Target,
  Clock,
  TrendingUp
} from "lucide-react";
import api from "@/lib/axiosConfig";

interface Module {
  serialNumber: string;
  name: string;
  moduleType: string;
  state: string | null;
  currentStatus: string | null;
}

export default function FactoryKPIDashboard() {
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    async function fetchModules() {
      try {
        const { data } = await api.get<{ modules: Module[] }>("/api/Factory");
        const filteredModules = data.modules.filter(
          (mod) => mod.moduleType === "FixedModule" || mod.moduleType === "StorageModule"
        );
        setModules(filteredModules);
      } catch (error) {
        console.error("Failed to fetch modules", error);
      }
    }

    fetchModules();
    const interval = setInterval(fetchModules, 3000);
    return () => clearInterval(interval);
  }, []);

  // Calculate metrics
  const totalModules = modules.length;
  const activeModules = modules.filter(m => 
    m.currentStatus === 'RUNNING' || 
    m.currentStatus === 'ACTIVE' ||
    m.currentStatus === 'BUSY' ||
    m.currentStatus === 'DROPBUSY'
  ).length;
  
  const errorModules = modules.filter(m => 
    m.currentStatus === 'ERROR' || 
    m.currentStatus === 'FAILED'
  ).length;

  const uptime = totalModules > 0 ? Math.round(((totalModules - errorModules) / totalModules) * 100) : 100;
  const efficiency = totalModules > 0 ? Math.round((activeModules / totalModules) * 100) : 0;
  
  // Simulated metrics
  const production = 1247;
  const energyConsumption = 385.7;

  const metrics = [
    {
      label: "Production",
      value: production,
      unit: "units/hr",
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-50",
      iconBg: "bg-blue-500"
    },
    {
      label: "Efficiency",
      value: efficiency,
      unit: "%",
      icon: TrendingUp,
      color: efficiency >= 75 ? "text-green-600" : efficiency >= 50 ? "text-yellow-600" : "text-red-600",
      bg: efficiency >= 75 ? "bg-green-50" : efficiency >= 50 ? "bg-yellow-50" : "bg-red-50",
      iconBg: efficiency >= 75 ? "bg-green-500" : efficiency >= 50 ? "bg-yellow-500" : "bg-red-500"
    },
    {
      label: "Uptime",
      value: uptime,
      unit: "%",
      icon: Activity,
      color: uptime >= 95 ? "text-green-600" : uptime >= 90 ? "text-yellow-600" : "text-red-600",
      bg: uptime >= 95 ? "bg-green-50" : uptime >= 90 ? "bg-yellow-50" : "bg-red-50",
      iconBg: uptime >= 95 ? "bg-green-500" : uptime >= 90 ? "bg-yellow-500" : "bg-red-500"
    },
    {
      label: "Energy",
      value: energyConsumption,
      unit: "kW",
      icon: Zap,
      color: "text-purple-600",
      bg: "bg-purple-50",
      iconBg: "bg-purple-500"
    },
    {
      label: "Active",
      value: activeModules,
      unit: `/${totalModules}`,
      icon: Clock,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      iconBg: "bg-indigo-500"
    },
    {
      label: "Alerts",
      value: errorModules,
      unit: errorModules === 1 ? "issue" : "issues",
      icon: AlertTriangle,
      color: errorModules === 0 ? "text-green-600" : errorModules <= 2 ? "text-yellow-600" : "text-red-600",
      bg: errorModules === 0 ? "bg-green-50" : errorModules <= 2 ? "bg-yellow-50" : "bg-red-50",
      iconBg: errorModules === 0 ? "bg-green-500" : errorModules <= 2 ? "bg-yellow-500" : "bg-red-500"
    }
  ];

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="grid grid-cols-6 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="text-center">
              {/* Icon */}
              <div className={`${metric.iconBg} w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              
              {/* Value */}
              <div className="mb-1">
                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
              </div>
              
              {/* Label */}
              <p className={`text-sm font-medium ${metric.color}`}>{metric.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}