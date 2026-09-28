import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Pencil,
  Plus,
  Sparkles,
} from "lucide-react";

type UpcomingEvent = {
  id: string;
  name: string;
  date: string;
};

const initialEvents: UpcomingEvent[] = [
  {
    id: "EVT-01",
    name: "IEEE Tech Symposium 2026",
    date: "15 Oct 2026",
  },
  {
    id: "EVT-02",
    name: "Robotics & AI Workshop",
    date: "28 Oct 2026",
  },
  {
    id: "EVT-03",
    name: "National Level Hackathon",
    date: "10 Nov 2026",
  },
];

export default function EditUpcomingDirectory() {
  const navigate = useNavigate();
  const [events] = useState<UpcomingEvent[]>(initialEvents);

  return (
    <section className="space-y-6 bg-admin-bg text-white">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
        <div>
          <Link
            to="/admin/upcoming-posts"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors mb-1.5"
          >
            <ArrowLeft size={14} />
            <span>Back to Upcoming Events</span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Edit Posts Directory
            <Sparkles size={16} className="text-blue-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage scheduled announcements and update post records.
          </p>
        </div>

        <Link
          to="/admin/upcoming-posts/add"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_4px_16px_rgba(43,123,255,0.25)] hover:shadow-[0_4px_20px_rgba(43,123,255,0.4)] hover:from-blue-500 hover:to-blue-600 active:scale-[0.98] transition-all w-fit"
        >
          <Plus size={15} />
          <span>Add New Event</span>
        </Link>
      </div>

      {/* Modern Table Container */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-admin-subtle/80 text-xs uppercase tracking-wider text-slate-300">
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Event Name</th>
                <th className="px-6 py-4 font-semibold">Event Date</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {events.map((evt) => (
                <tr
                  key={evt.id}
                  className="group transition-colors duration-200 hover:bg-blue-600/10"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-slate-300 bg-admin-subtle border border-white/10 px-2.5 py-1 rounded-md">
                      {evt.id}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400 group-hover:scale-105 group-hover:border-blue-400/40 group-hover:bg-blue-500/20 transition-all">
                        <Calendar size={16} />
                      </div>
                      <span className="text-white font-medium group-hover:text-blue-200 transition-colors">
                        {evt.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-950/40 px-3 py-1 text-xs font-medium text-blue-300">
                      <Calendar size={12} className="text-blue-400" />
                      {evt.date}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/upcoming-posts/edit/${evt.id}`)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-admin-subtle/80 px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition-all duration-200 hover:border-blue-400/50 hover:bg-blue-600 hover:text-white hover:shadow-[0_2px_12px_rgba(43,123,255,0.3)] active:scale-[0.97]"
                    >
                      <Pencil size={13} />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
