import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Image as ImageIcon,
  AlignLeft,
  Save,
  RotateCcw,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { adminApi, type UpcomingEvent } from '@/services/adminApi';

export default function EditUpcomingPostPanel() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventName: "",
    title: "",
    date: "",
    lastDate: "",
    image: "",
    overview: "",
  });
  const [initialState, setInitialState] = useState(formData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newImageName, setNewImageName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        setError('');
        const res = await adminApi.getUpcomingEventById(id);
        if (res.success && res.post) {
          const p = res.post as UpcomingEvent;
          let imageUrl = "";
          if (p.image && typeof p.image === 'object' && 'url' in p.image) {
            imageUrl = (p.image as { url: string }).url;
          } else if (typeof p.image === 'string') {
            imageUrl = p.image;
          }

          const formattedDate = p.date ? new Date(p.date as string).toISOString().split('T')[0] : "";
          const formattedLastDate = p.lastDate ? new Date(p.lastDate as string).toISOString().split('T')[0] : "";

          const loaded = {
            eventName: p.eventName || p.title || "",
            title: p.title || p.eventName || "",
            date: formattedDate,
            lastDate: formattedLastDate,
            image: imageUrl,
            overview: p.overview || "",
          };
          setFormData(loaded);
          setInitialState(loaded);
        }
      } catch (err) {
        console.error("Failed to load event details:", err);
        setError("Unable to load event details from MongoDB.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventNameVal = formData.eventName.trim();
    const titleVal = formData.title.trim();
    const overviewVal = formData.overview.trim();

    if (!eventNameVal || !titleVal || !formData.date || !formData.lastDate || !overviewVal) {
      setError("Please fill out all required fields: Event Name, Title, Event Date, Last Date, and Overview.");
      return;
    }

    if (new Date(formData.lastDate) > new Date(formData.date)) {
      setError("Invalid dates: 'Last Date to Register' cannot be after the 'Event Date'.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      setSuccessMsg('');

      if (!id) {
        throw new Error("Missing event postId.");
      }

      // Payload with ONLY schema fields
      const formDataToSend = new FormData();
      formDataToSend.append('eventName', eventNameVal);
      formDataToSend.append('title', titleVal);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('lastDate', formData.lastDate);
      formDataToSend.append('overview', overviewVal);

      if (imageFile) {
        if (imageFile.size > 5 * 1024 * 1024) {
          setError("File size exceeds the 5MB limit.");
          setIsSubmitting(false);
          return;
        }
        formDataToSend.append('image', imageFile);
      }

      const res = await adminApi.updateUpcomingEvent(id, formDataToSend);
      if (res.success) {
        setSuccessMsg(res.message || "Event updated in MongoDB successfully!");
        setTimeout(() => {
          navigate("/admin/upcoming-posts/manage");
        }, 1200);
      } else {
        throw new Error(res.message || "Failed to update event.");
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save upcoming event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialState);
    setImageFile(null);
    setNewImageName("");
    setError('');
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
              Update details for &ldquo;{formData.eventName || formData.title}&rdquo; in MongoDB
            </p>
          </div>
          {isLoading && (
            <span className="text-xs text-blue-400 flex items-center gap-1.5 animate-pulse">
              Loading event details from database...
            </span>
          )}
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {successMsg ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-200 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      ) : null}

      {/* Form Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface p-6 sm:p-8 shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/70 to-transparent" />

        <form onSubmit={handleSave} className="space-y-6">
          {/* Top Row: eventName & title */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Event Name <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Tag size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  placeholder="Event Name"
                  className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Title / Headline <span className="text-blue-400">*</span>
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
                  placeholder="Headline / Title"
                  className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Grid: date and lastDate */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Event Date <span className="text-blue-400">*</span>
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

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Last Date to Register <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Calendar size={16} />
                </div>
                <input
                  type="date"
                  required
                  value={formData.lastDate}
                  onChange={(e) => setFormData({ ...formData, lastDate: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Poster / Flyer Banner Upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Update Banner Image (Optional, Max 5MB)
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <label className="group flex-1 flex items-center gap-3 rounded-xl border-2 border-dashed border-white/15 bg-admin-subtle/50 px-4 py-3 cursor-pointer transition hover:border-blue-400/60 hover:bg-blue-950/20">
                <UploadCloud size={20} className="text-blue-400 shrink-0" />
                <span className="text-xs text-slate-300 group-hover:text-blue-300 truncate">
                  {newImageName ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 size={14} /> {newImageName}
                    </span>
                  ) : (
                    "Click to replace banner image"
                  )}
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setNewImageName(file.name);
                    }
                  }}
                  className="hidden"
                />
              </label>

              {formData.image && (
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-admin-subtle/50 px-3 py-2 shrink-0">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-9 w-9 rounded-lg object-contain bg-black/40 p-1"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-mono">Current Banner</span>
                    <span className="text-xs text-slate-200 flex items-center gap-1">
                      <ImageIcon size={12} className="text-blue-400" /> Active
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Overview */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Event Overview <span className="text-blue-400">*</span>
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

          {/* Submit & Reset Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(43,123,255,0.3)] hover:shadow-[0_4px_24px_rgba(43,123,255,0.45)] hover:from-blue-500 hover:to-blue-600 active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={16} />
              <span>{isSubmitting ? "Saving to MongoDB..." : "Save Changes"}</span>
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
