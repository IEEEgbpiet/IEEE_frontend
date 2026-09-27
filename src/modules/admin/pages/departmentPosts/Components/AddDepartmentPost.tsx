import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi } from '@/services/adminApi';

export default function AddDepartmentPost() {
  const { dept = "CSE" } = useParams<{ dept: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    category: "Workshop",
    overview: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    "Workshop",
    "Technical Symposium",
    "Hackathon",
    "Research",
    "Guest Lecture",
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    try {
      setIsSubmitting(true);
      setError('');
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('overview', formData.overview);
      formDataToSend.append('branch', dept);
      formDataToSend.append('venue', 'To be updated');
      formDataToSend.append('organizedBy', 'IEEE GBPIET');
      formDataToSend.append('description', formData.overview);
      await adminApi.createDepartmentPost(formDataToSend);
      navigate(`/admin/department-posts/${dept}/manage`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create department post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      date: "",
      category: categories[0],
      overview: "",
    });
  };

  return (
    <section className="space-y-6 bg-admin-bg text-white max-w-2xl">
      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}
      <div className="border-b border-white/10 pb-3">
        <h1 className="text-xl font-semibold text-white">
          Create a New post
        </h1>
      </div>

      {/* Form matching Page 12 Wireframe */}
      <form onSubmit={handleCreate} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs text-slate-300 mb-1">
            Post Title
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Post Title"
            className="w-full h-10 rounded-lg border border-white/15 bg-admin-card px-3 text-sm text-white outline-none focus:border-blue-400/50"
          />
        </div>

        {/* Row: Date, Category */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full h-10 rounded-lg border border-white/15 bg-admin-card px-3 text-sm text-white outline-none focus:border-blue-400/50"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full h-10 rounded-lg border border-white/15 bg-admin-card px-3 text-sm text-white outline-none focus:border-blue-400/50"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-admin-surface text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Overview */}
        <div>
          <label className="block text-xs text-slate-300 mb-1">
            Overview / Description
          </label>
          <textarea
            required
            rows={5}
            value={formData.overview}
            onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
            placeholder="Post details..."
            className="w-full rounded-lg border border-white/15 bg-admin-card p-3 text-sm text-white outline-none focus:border-blue-400/50"
          />
        </div>

        {/* Buttons: Reset, Create */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-white/15 bg-admin-card px-5 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-admin-card-hover transition"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg border border-brand-blue/30 bg-brand-blue px-6 py-2.5 text-xs font-semibold text-white hover:bg-brand-blue-dark transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </section>
  );
}
