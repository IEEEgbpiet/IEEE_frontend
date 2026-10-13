import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { ArrowLeft, Bell, CalendarDays, Image as ImageIcon, Loader2, Save, UploadCloud } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '@/services/adminApi';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function AnnouncementFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({ title: '', description: '' });
  const [initialData, setInitialData] = useState({ title: '', description: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const loadAnnouncement = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await adminApi.getAnnouncements();
        const announcement = response.data?.find(
          (item) => item._id === id || item.AnnouncementId === id,
        );

        if (!response.success || !announcement) {
          setError('Announcement not found. It may have been removed.');
          return;
        }

        const loaded = {
          title: announcement.title || '',
          description: announcement.description || '',
        };
        setFormData(loaded);
        setInitialData(loaded);
        setExistingImageUrl(announcement.image?.url || '');
        setCreatedAt(announcement.createdAt || '');
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load announcement.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadAnnouncement();
  }, [id]);

  useEffect(() => () => {
    if (selectedImageUrl.startsWith('blob:')) URL.revokeObjectURL(selectedImageUrl);
  }, [selectedImageUrl]);

  const handleTextChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError('');
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setSelectedImageUrl(file ? URL.createObjectURL(file) : '');
    setError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (imageFile && imageFile.size > MAX_IMAGE_SIZE) {
      setError('Image file size must be 5MB or less.');
      return;
    }
    if (imageFile && !ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      setError('Choose a JPG, PNG, or WEBP image.');
      return;
    }

    const titleChanged = formData.title !== initialData.title;
    const descriptionChanged = formData.description !== initialData.description;
    const hasContent = Boolean(formData.title.trim() || formData.description.trim() || imageFile);

    if (isEditing && !titleChanged && !descriptionChanged && !imageFile) {
      setError('Make at least one change before saving.');
      return;
    }
    if (!isEditing && !hasContent) {
      setError('Provide at least one field: title, description, or image.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();

      if (isEditing) {
        if (titleChanged) payload.append('title', formData.title.trim());
        if (descriptionChanged) payload.append('description', formData.description.trim());
      } else {
        if (formData.title.trim()) payload.append('title', formData.title.trim());
        if (formData.description.trim()) payload.append('description', formData.description.trim());
      }
      if (imageFile) payload.append('image', imageFile);

      const response = isEditing
        ? await adminApi.updateAnnouncement(id as string, payload)
        : await adminApi.createAnnouncement(payload);

      if (!response.success) {
        throw new Error(response.message || 'Unable to save announcement.');
      }
      navigate('/admin/announcements');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save announcement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedImage = selectedImageUrl || existingImageUrl;
  const formattedCreatedAt = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Assigned when published';

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-sm text-slate-400">
        <Loader2 size={18} className="animate-spin text-blue-400" />
        Loading announcement...
      </div>
    );
  }

  return (
    <section className="max-w-3xl space-y-6 bg-admin-bg text-white">
      <div className="border-b border-white/10 pb-4">
        <Link
          to="/admin/announcements"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-blue-300"
        >
          <ArrowLeft size={14} />
          Back to announcements
        </Link>
        <div className="mt-3 flex items-start gap-3">
          <span className="rounded-lg border border-blue-400/20 bg-blue-500/10 p-2 text-blue-300">
            <Bell size={19} />
          </span>
          <div>
            <h1 className="text-xl font-bold">{isEditing ? 'Edit announcement' : 'New announcement'}</h1>
            <p className="mt-1 text-sm text-slate-400">
              {isEditing ? `ID: ${id}` : 'Add a headline, message, image, or any combination.'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-5 rounded-xl border border-white/10 bg-admin-card p-5 sm:p-6">
          <div>
            <label htmlFor="announcement-title" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Title <span className="font-normal normal-case text-slate-500">(optional)</span>
            </label>
            <input
              id="announcement-title"
              name="title"
              type="text"
              maxLength={180}
              value={formData.title}
              onChange={handleTextChange}
              disabled={isSubmitting}
              placeholder="Announcement headline"
              className="h-11 w-full rounded-lg border border-white/10 bg-black/20 px-3.5 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/15 disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="announcement-description" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Description <span className="font-normal normal-case text-slate-500">(optional)</span>
            </label>
            <textarea
              id="announcement-description"
              name="description"
              rows={6}
              value={formData.description}
              onChange={handleTextChange}
              disabled={isSubmitting}
              placeholder="Write the announcement details..."
              className="w-full resize-y rounded-lg border border-white/10 bg-black/20 p-3.5 text-sm leading-6 text-white outline-none placeholder:text-slate-500 transition focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/15 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Image <span className="font-normal normal-case text-slate-500">(optional, JPG/PNG/WEBP, max 5MB)</span>
            </label>
            <div className="flex flex-col gap-4 rounded-lg border border-dashed border-white/15 bg-admin-subtle/40 p-4 sm:flex-row sm:items-center">
              {displayedImage ? (
                <img src={displayedImage} alt="Announcement preview" className="h-24 w-full rounded-md border border-white/10 object-cover sm:w-36" />
              ) : (
                <div className="flex h-24 w-full items-center justify-center rounded-md border border-white/10 bg-black/15 text-slate-500 sm:w-36">
                  <ImageIcon size={24} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                  className="block w-full text-xs text-slate-400 file:mr-3 file:rounded-md file:border-0 file:bg-blue-500/15 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-blue-200 hover:file:bg-blue-500/25"
                />
                {imageFile && <p className="mt-2 truncate text-xs text-slate-400">Selected: {imageFile.name}</p>}
                {isEditing && existingImageUrl && !imageFile && (
                  <p className="mt-2 text-xs text-slate-500">Uploading a new image replaces the current image.</p>
                )}
              </div>
              <UploadCloud size={18} className="hidden shrink-0 text-blue-300 sm:block" />
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-slate-400">
            <CalendarDays size={14} className="text-blue-300" />
            <span>Announcement date: {formattedCreatedAt}</span>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link
            to="/admin/announcements"
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/10 px-4 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Publish announcement'}
          </button>
        </div>
      </form>
    </section>
  );
}