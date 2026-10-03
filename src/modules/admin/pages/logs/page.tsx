import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound } from "lucide-react";

type LogEntry = {
  id: string;
  action: string;
  module: string;
  user: string;
  timestamp: string;
  status: string;
};

const initialLogs: LogEntry[] = [
  {
    id: "LOG-01",
    action: "Approved Certificate Request (REQ-001)",
    module: "Certificates",
    user: "Admin",
    timestamp: "27 Sep 2026, 21:30",
    status: "Success",
  },
  {
    id: "LOG-02",
    action: "Published New Event Post 'Tech Symposium'",
    module: "Upcoming Events",
    user: "Admin",
    timestamp: "27 Sep 2026, 19:15",
    status: "Success",
  },
  {
    id: "LOG-03",
    action: "Closed Ticket TCK-803",
    module: "Support",
    user: "Admin",
    timestamp: "27 Sep 2026, 16:42",
    status: "Success",
  },
];

export default function LogsPage() {
  const [logs] = useState<LogEntry[]>(initialLogs);

  return (
    <div className="space-y-6 bg-admin-bg text-white">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h1 className="text-xl font-semibold text-white">
          Logs & Setting
        </h1>
        <Link
          to="/admin/change-password"
          className="flex items-center gap-2 rounded-lg border border-brand-blue/40 bg-brand-blue/15 px-3.5 py-1.5 text-xs font-semibold text-brand-blue-light transition-all hover:bg-brand-blue/25"
        >
          <KeyRound size={14} />
          <span>Security & Password</span>
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/15 bg-admin-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-admin-subtle text-slate-200">
                <th className="px-5 py-3.5 font-semibold">Log ID</th>
                <th className="px-5 py-3.5 font-semibold">Action</th>
                <th className="px-5 py-3.5 font-semibold">Module</th>
                <th className="px-5 py-3.5 font-semibold">User</th>
                <th className="px-5 py-3.5 font-semibold">Timestamp</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-white/5 last:border-0 hover:bg-admin-card-hover/50"
                >
                  <td className="px-5 py-4 font-mono text-xs text-slate-300">
                    {log.id}
                  </td>
                  <td className="px-5 py-4 text-white">
                    {log.action}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-400">
                    {log.module}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-300">
                    {log.user}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-400 font-mono">
                    {log.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
