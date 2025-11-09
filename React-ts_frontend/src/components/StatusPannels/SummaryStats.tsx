// components/panels/SummaryStats.tsx

interface Props {
  logs: {
    module_state: string;
  }[];
}

export default function SummaryStats({ logs }: Props) {
  const statuses = ["IDLE", "BUSY", "RUNNING", "ERROR"];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statuses.map((status) => {
        const count = logs.filter((log) => log.module_state.toUpperCase() === status).length;
        return (
          <div key={status} className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{count}</div>
              <div className={`text-sm font-medium ${
                status === "IDLE" ? "text-green-600" :
                status === "BUSY" ? "text-yellow-600" :
                status === "RUNNING" ? "text-blue-600" :
                "text-red-600"
              }`}>
                {status}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
