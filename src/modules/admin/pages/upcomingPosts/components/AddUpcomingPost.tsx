import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  FileText,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  AlignLeft,
  PlusCircle,
  MapPin,
} from "lucide-react";
import { adminApi } from '@/services/adminApi';

export default function AddUpcomingPost() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    venue: "",
    date: "",
    lastDate: "",
    overview: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.venue || !formData.overview) {
      setError("Please fill out all required fields.");
      return;
    }

    if (formData.lastDate && new Date(formData.lastDate) > new Date(formData.date)) {
      setError("Invalid dates: 'Last Date to Register' cannot be after the 'Event Date'. Registration must end before or on the event date.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const formDataToSend = new FormData();
      formDataToSend.append('eventName', formData.title);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('lastDate', formData.lastDate || formData.date);
      formDataToSend.append('venue', formData.venue);
      formDataToSend.append('overview', formData.overview);

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      await adminApi.createUpcomingEvent(formDataToSend);
      navigate('/admin/upcoming-posts/manage');
    } catch (submitError) {
      const msg = submitError instanceof Error ? submitError.message : 'Unable to create upcoming event.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      venue: "",
      date: "",
      lastDate: "",
      overview: "",
    });
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="space-y-6 bg-admin-bg text-white max-w-3xl">
      {/* Back button & Title */}
      <div className="flex flex-col gap-2 border-b border-white/10 pb-4">
        <Link
          to="/admin/upcoming-posts"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors w-fit"
        >
          <ArrowLeft size={14} />
          <span>Back to Upcoming Events</span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Add New Upcoming Event
              <Sparkles size={16} className="text-blue-400" />
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter the event announcement details to schedule a new post.
            </p>
          </div>
        </div>
      </div>

      {/* Styled Form Card */}
      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface p-6 sm:p-8 shadow-2xl">
        {/* Accent top highlight */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/70 to-transparent" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Visual Image Upload Dropzone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Event Flyer / Poster
            </label>
            <label className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/15 bg-admin-subtle/40 p-6 text-center cursor-pointer transition-all duration-300 hover:border-blue-400/60 hover:bg-blue-950/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-500/20">
                <UploadCloud size={24} />
              </div>
              <p className="mt-3 text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                {imageFile ? (
                  <span className="inline-flex items-center gap-1.5 text-blue-400 font-semibold">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    {imageFile.name}
                  </span>
                ) : (
                  "Click to browse or drop event flyer image"
                )}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                PNG, JPG, or WEBP (Recommended 1200 x 630px)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setImageFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>

          {/* Grid: Title and Date */}
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
                  placeholder="e.g. IEEE Tech Symposium 2026"
                  className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Event Date
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

          {/* Grid: Venue and Last Registration Date */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Event Venue / Location
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <MapPin size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. Computer Lab 3, GBPIET or Auditorium"
                  className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Last Date to Register
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Calendar size={16} />
                </div>
                <input
                  type="date"
                  value={formData.lastDate}
                  onChange={(e) => setFormData({ ...formData, lastDate: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
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
                placeholder="Provide a comprehensive summary of the upcoming event, topics, speaker info, and eligibility..."
                className="w-full rounded-xl border border-white/15 bg-admin-subtle/70 pt-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(43,123,255,0.3)] hover:shadow-[0_4px_24px_rgba(43,123,255,0.45)] hover:from-blue-500 hover:to-blue-600 active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <PlusCircle size={16} />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Event Post'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-white/15 bg-admin-card/50 px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-admin-card transition-all"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
