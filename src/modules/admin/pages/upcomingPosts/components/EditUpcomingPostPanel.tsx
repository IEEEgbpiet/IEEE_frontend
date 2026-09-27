import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <section className="space-y-6 bg-black text-white max-w-2xl">
      <div className="border-b border-white/10 pb-3">
        <h1 className="text-xl font-semibold text-white">
          Edit Post Panel
        </h1>
      </div>

      {/* Form matching Page 9 Wireframe */}
      <form onSubmit={handleSave} className="space-y-4">
        {/* Top Row: Title, Imgage, Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-10 rounded-lg border border-white/15 bg-zinc-950 px-3 text-sm text-white outline-none focus:border-white/40"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Imgage
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="Image path"
              className="w-full h-10 rounded-lg border border-white/15 bg-zinc-950 px-3 text-sm text-white outline-none focus:border-white/40"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full h-10 rounded-lg border border-white/15 bg-zinc-950 px-3 text-sm text-white outline-none focus:border-white/40"
            />
          </div>
        </div>

        {/* Overview */}
        <div>
          <label className="block text-xs text-slate-300 mb-1">
            Overview
          </label>
          <textarea
            required
            rows={5}
            value={formData.overview}
            onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
            className="w-full rounded-lg border border-white/15 bg-zinc-950 p-3 text-sm text-white outline-none focus:border-white/40"
          />
        </div>

        {/* Buttons: Save Changes, Reset */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg border border-white/20 bg-zinc-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-white/15 bg-zinc-950 px-5 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-zinc-900 transition"
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}
