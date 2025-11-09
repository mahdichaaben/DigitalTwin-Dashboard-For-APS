import AlertTable from "@/components/Alerts/AlertTable";
import { CheckCircle, Clock, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/axiosConfig";

interface AlertStats {
  total: number;
  firing: number;
  resolved: number;
  todayCount: number;
}

export default function AlertsPage() {
  const [stats, setStats] = useState<AlertStats>({
    total: 0,
    firing: 0,
    resolved: 0,
    todayCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/api/Alert/filter");
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        
        const todayAlerts = data.filter((alert: any) => {
          const alertDate = new Date(alert.startedAt).toISOString().split('T')[0];
          return alertDate === today;
        });

        setStats({
          total: data.length,
          firing: data.filter((alert: any) => alert.status?.toLowerCase() === 'firing').length,
          resolved: data.filter((alert: any) => alert.status?.toLowerCase() === 'resolved').length,
          todayCount: todayAlerts.length
        });
      } catch (error) {
        console.error('Failed to fetch alert stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, icon: Icon, iconColor, ringColor }: {
    title: string;
    value: number;
    icon: any;
    iconColor: string; // e.g., 'text-blue-600'
    ringColor: string; // e.g., 'ring-blue-100'
  }) => (
    <div className="bg-white rounded-xl border border-green-100 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {loading ? (
              <span className="inline-block w-8 h-6 bg-gray-200 rounded animate-pulse" />
            ) : (
              value.toLocaleString()
            )}
          </p>
        </div>
        <div className={`relative w-12 h-12 rounded-full ring-8 ${ringColor} flex items-center justify-center bg-white`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Header */}


      {/* Stats */}
      <div className="px-6 py-6">

        {/* Table */}
        <div className="bg-white rounded-xl border border-green-100 shadow-sm">
          <div className="px-6 py-4 border-b border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Alert Details</h2>
                <p className="text-sm text-gray-600">Filter and review system alerts</p>
              </div>
              <span className="hidden md:inline-flex items-center text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-2 py-1">
                Today: {loading ? "—" : stats.todayCount}
              </span>
            </div>
          </div>
          <div className="p-2">
            <AlertTable />
          </div>
        </div>
      </div>
    </div>
  );
}
