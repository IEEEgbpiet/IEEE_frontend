import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { adminApi } from '@/services/adminApi';

type UpcomingEvent = {
  id: string;
  name: string;
  title: string;
  date: string;
  lastDate: string;
  imageUrl?: string;
};

export default function EditUpcomingDirectory() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await adminApi.getUpcomingEvents();
      if (res.success && Array.isArray(res.posts)) {
        setEvents(
          res.posts.map((p) => {
            const img = typeof p.image === 'object' && p.image ? p.image.url : (p.image as string) || '';
            return {
              id: (p.postId || p._id || p.id) as string,
              name: (p.eventName || p.title) as string,
              title: (p.title || p.eventName) as string,
              imageUrl: img,
              date: p.date
                ? new Date(p.date as string).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "TBD",
              lastDate: p.lastDate
                ? new Date(p.lastDate as string).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "TBD",
            };
          })
        );
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("Failed to load upcoming events:", err);
      setError("Unable to retrieve events from MongoDB.");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this event post from the remote database?")) {
      return;
    }
    try {
      setDeletingId(id);
      await adminApi.deleteUpcomingEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete event post from database.";
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

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
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Edit Posts Directory
              <Sparkles size={16} className="text-blue-400" />
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage scheduled announcements stored in remote MongoDB database.
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

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* Modern Table Container */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-admin-subtle/80 text-xs uppercase tracking-wider text-slate-300">
                <th className="px-6 py-4 font-semibold">Post ID</th>
                <th className="px-6 py-4 font-semibold">Event Name & Title</th>
                <th className="px-6 py-4 font-semibold">Event Date</th>
                <th className="px-6 py-4 font-semibold">Last Date</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-3" />
                      <p className="text-xs text-slate-400">Fetching events from MongoDB...</p>
                    </div>
                  </td>
                </tr>
              ) : events.length > 0 ? (
                events.map((evt) => (
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
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400 group-hover:scale-105 group-hover:border-blue-400/40 group-hover:bg-blue-500/20 transition-all overflow-hidden">
                          {evt.imageUrl ? (
                            <img src={evt.imageUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <FileText size={16} />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-medium group-hover:text-blue-200 transition-colors">
                            {evt.name}
                          </span>
                          {evt.title && evt.title !== evt.name ? (
                            <span className="text-xs text-slate-400">{evt.title}</span>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-950/40 px-3 py-1 text-xs font-medium text-blue-300">
                        <Calendar size={12} className="text-blue-400" />
                        {evt.date}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-950/30 px-3 py-1 text-xs font-medium text-amber-300">
                        <Calendar size={12} className="text-amber-400" />
                        {evt.lastDate}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/upcoming-posts/edit/${evt.id}`)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-admin-subtle/80 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all duration-200 hover:border-blue-400/50 hover:bg-blue-600 hover:text-white hover:shadow-[0_2px_12px_rgba(43,123,255,0.3)] active:scale-[0.97]"
                        >
                          <Pencil size={13} />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          disabled={deletingId === evt.id}
                          onClick={() => handleDelete(evt.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-400 transition-all duration-200 hover:border-red-500/50 hover:bg-red-600 hover:text-white active:scale-[0.97] disabled:opacity-50"
                          title="Delete event"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <Calendar className="mb-3 h-10 w-10 text-slate-600" />
                      <p className="text-sm font-medium text-slate-300">No upcoming events found</p>
                      <p className="text-xs text-slate-500 mt-1">Click &ldquo;Add New Event&rdquo; to schedule an announcement.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
