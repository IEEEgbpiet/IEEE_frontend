import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Bell, CalendarDays, Image as ImageIcon, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { adminApi, type AnnouncementRecord } from '@/services/adminApi';

const getAnnouncementId = (announcement: AnnouncementRecord) =>
  announcement.AnnouncementId || announcement._id;

const getImageUrl = (announcement: AnnouncementRecord) =>
  announcement.image?.url || '';

export default function AnnouncementsDirectory() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchAnnouncements = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await adminApi.getAnnouncements();
      setAnnouncements(response.success && Array.isArray(response.data) ? response.data : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load announcements.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleDelete = async (announcement: AnnouncementRecord) => {
    const id = getAnnouncementId(announcement);
    if (!window.confirm(`Delete "${announcement.title || 'this announcement'}"?`)) return;

    try {
      setDeletingId(id);
      setError('');
      await adminApi.deleteAnnouncement(id);
      setAnnouncements((current) => current.filter((item) => getAnnouncementId(item) !== id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete announcement.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-6 bg-admin-bg text-white">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-300">
            <Bell size={15} />
            Content Management
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Announcements</h1>
          <p className="mt-1 text-sm text-slate-400">Create, edit, and publish branch announcements.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/announcements/add')}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Plus size={16} />
          New announcement
        </button>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          <AlertCircle size={17} className="mt-0.5 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-white/10 bg-admin-card">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
          <h2 className="text-sm font-semibold text-slate-200">Published announcements</h2>
          {!isLoading && <span className="text-xs text-slate-400">{announcements.length} total</span>}
        </div>

        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-400">
            <Loader2 size={18} className="animate-spin text-blue-400" />
            Loading announcements...
          </div>
        ) : announcements.length ? (
          <div className="divide-y divide-white/5">
            {announcements.map((announcement) => {
              const id = getAnnouncementId(announcement);
              const imageUrl = getImageUrl(announcement);
              const createdDate = announcement.createdAt
                ? new Date(announcement.createdAt).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Date unavailable';

              return (
                <article key={id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:px-5">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-admin-subtle text-blue-300">
                      {imageUrl ? (
                        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon size={20} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-white">
                        {announcement.title || 'Untitled announcement'}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-400">
                        {announcement.description || 'No description'}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="font-mono">{announcement.AnnouncementId || announcement._id}</span>
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays size={12} />
                          {createdDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:shrink-0">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/announcements/edit/${encodeURIComponent(id)}`)}
                      aria-label={`Edit ${announcement.title || 'announcement'}`}
                      className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-admin-subtle px-3 text-xs font-semibold text-slate-200 transition hover:border-blue-400/40 hover:text-blue-300"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(announcement)}
                      disabled={deletingId === id}
                      aria-label={`Delete ${announcement.title || 'announcement'}`}
                      className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 text-xs font-semibold text-red-300 transition hover:bg-red-500/15 disabled:cursor-wait disabled:opacity-60"
                    >
                      {deletingId === id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-52 flex-col items-center justify-center px-5 text-center">
            <Bell size={24} className="text-slate-500" />
            <p className="mt-3 text-sm font-medium text-slate-200">No announcements yet</p>
            <p className="mt-1 text-xs text-slate-500">Create the first announcement for the branch.</p>
          </div>
        )}
      </div>
    </section>
  );
}