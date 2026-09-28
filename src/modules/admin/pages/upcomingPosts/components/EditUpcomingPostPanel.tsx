import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Image as ImageIcon,
  AlignLeft,
  Save,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function EditUpcomingPostPanel() {
  const navigate = useNavigate();

  const initialData = {
    title: "IEEE Tech Symposium 2026",
    date: "2026-10-15",
    image: "/images/IeeeLogo.webp",
    overview: "State-wide technical conference with keynote talks, project exhibitions, and paper presentations.",
  };

  const [formData, setFormData] = useState(initialData);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin/upcoming-posts/manage");
  };

  const handleReset = () => {
    setFormData(initialData);
  };

  return (
    <section className="space-y-6 bg-admin-bg text-white max-w-3xl">
      {/* Back button & Title */}
      <div className="flex flex-col gap-2 border-b border-white/10 pb-4">
        <Link
          to="/admin/upcoming-posts/manage"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors w-fit"
        >
          <ArrowLeft size={14} />
          <span>Back to Posts Directory</span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Edit Post Panel
              <Sparkles size={16} className="text-blue-400" />
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Update details for &ldquo;{formData.title}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Styled Form Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface p-6 sm:p-8 shadow-2xl">
        {/* Accent top highlight */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/70 to-transparent" />

        <form onSubmit={handleSave} className="space-y-6">
          {/* Top Row: Title & Date */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Event Title
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <FileText size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Event Title"
                  className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Registration / Event Date
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Calendar size={16} />
                </div>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Image Path with Visual Thumbnail */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Poster / Image Path
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1 w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <ImageIcon size={16} />
                </div>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/example.webp"
                  className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20 font-mono text-xs"
                />
              </div>

              {formData.image && (
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-admin-subtle/50 px-3 py-1.5 shrink-0">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-8 w-8 rounded-lg object-contain bg-black/40 p-1"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-xs text-slate-400 font-mono">Current Poster</span>
                </div>
              )}
            </div>
          </div>

          {/* Overview */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Event Overview & Details
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute top-3 left-3.5 text-slate-400">
                <AlignLeft size={16} />
              </div>
              <textarea
                required
                rows={5}
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-admin-subtle/70 pt-3 pl-10 pr-4 text-sm text-white outline-none transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(43,123,255,0.3)] hover:shadow-[0_4px_24px_rgba(43,123,255,0.45)] hover:from-blue-500 hover:to-blue-600 active:scale-[0.98] transition-all duration-200"
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-admin-card/50 px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-admin-card transition-all"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
