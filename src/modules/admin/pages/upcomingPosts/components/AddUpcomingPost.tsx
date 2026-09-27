import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddUpcomingPost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [regDate, setRegDate] = useState("");
  const [overview, setOverview] = useState("");
  const [imageName, setImageName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !regDate) return;
    navigate("/admin/upcoming-posts/manage");
  };

  return (
    <section className="space-y-6 bg-black text-white max-w-2xl">
      <div className="border-b border-white/10 pb-3">
        <h1 className="text-xl font-semibold text-white">
          Add New Upcoming Event
        </h1>
      </div>

      {/* Form matching Page 7 Wireframe */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Top Row: Add image, Title, Reg Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Add image
            </label>
            <label className="flex h-10 items-center justify-center rounded-lg border border-white/15 bg-zinc-950 text-xs text-slate-400 cursor-pointer hover:border-white/40">
              <span>{imageName || "Choose file"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageName(e.target.files?.[0]?.name || "")}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full h-10 rounded-lg border border-white/15 bg-zinc-950 px-3 text-sm text-white outline-none focus:border-white/40"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Reg Date
            </label>
            <input
              type="date"
              required
              value={regDate}
              onChange={(e) => setRegDate(e.target.value)}
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
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="Overview"
            className="w-full rounded-lg border border-white/15 bg-zinc-950 p-3 text-sm text-white outline-none focus:border-white/40"
          />
        </div>

        {/* Add Post Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="rounded-lg border border-white/20 bg-zinc-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition"
          >
            Add Post
          </button>
        </div>
      </form>
    </section>
  );
}
