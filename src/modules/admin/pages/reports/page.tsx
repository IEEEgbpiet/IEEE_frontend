import { useState } from "react";

type ReportItem = {
  id: string;
  title: string;
  type: string;
  date: string;
};

const initialReports: ReportItem[] = [
  {
    id: "MOM-01",
    title: "Executive Core Team Meeting #9",
    type: "MoM",
    date: "20 Sep 2026",
  },
  {
    id: "REP-01",
    title: "Technical Symposium Outcome Report",
    type: "Report",
    date: "10 Aug 2026",
  },
  {
    id: "MOM-02",
    title: "Advisory Board Meeting",
    type: "MoM",
    date: "15 Jul 2026",
  },
];

export default function ReportsPage() {
  const [reports] = useState<ReportItem[]>(initialReports);

  return (
    <div className="space-y-6 bg-black text-white">
      <div className="border-b border-white/10 pb-3">
        <h1 className="text-xl font-semibold text-white">
          Reports & Minutes of Meeting
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-xl border border-white/15 bg-zinc-950 p-5"
          >
            <div>
              <span className="text-[11px] font-mono text-slate-400">
                {item.type} • {item.date}
              </span>
              <h2 className="mt-2 text-sm font-semibold text-white">
                {item.title}
              </h2>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-500">{item.id}</span>
              <button
                type="button"
                className="text-xs text-white border border-white/20 bg-zinc-900 px-3 py-1 rounded hover:bg-zinc-800"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
