import { Link } from "react-router-dom";
import { CalendarPlus, FolderEdit, ArrowRight, Sparkles } from "lucide-react";

export default function UpcomingEventsHub() {
  return (
    <div className="space-y-8 bg-admin-bg text-white">
      {/* Header section with badge */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-admin-card via-admin-surface to-admin-card p-6 sm:p-8 backdrop-blur-xl">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300 w-fit">
            <Sparkles size={13} className="text-blue-400" />
            <span>Events Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Upcoming Events Section
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Create, schedule, and manage upcoming IEEE student chapter workshops, hackathons, and technical symposiums.
          </p>
        </div>
      </div>

      {/* Modern 2 Action Cards with Smooth Hover Effects */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Card 1: Add Posts */}
        <Link
          to="/admin/upcoming-posts/add"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface p-7 text-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-[0_12px_32px_rgba(43,123,255,0.15)]"
        >
          {/* Ambient top highlight */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-600/15 text-blue-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600/25 group-hover:text-blue-300 shadow-[0_0_15px_rgba(43,123,255,0.2)]">
              <CalendarPlus size={24} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors">
                Add New Event Post
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Publish a new upcoming event announcement with poster thumbnail, title, registration date, and event overview.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 pt-4 border-t border-white/10 text-xs font-semibold text-blue-400 group-hover:text-blue-300">
            <span>Create Event</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </div>
        </Link>

        {/* Card 2: Edit Posts Directory */}
        <Link
          to="/admin/upcoming-posts/manage"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface p-7 text-white transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-[0_12px_32px_rgba(99,102,241,0.15)]"
        >
          {/* Ambient top highlight */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-600/15 text-indigo-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-600/25 group-hover:text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <FolderEdit size={24} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white group-hover:text-indigo-200 transition-colors">
                Edit Posts Directory
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Browse existing scheduled events, update details or dates, and manage active post listings.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 pt-4 border-t border-white/10 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
            <span>Browse Directory</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
