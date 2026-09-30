import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi } from '@/services/adminApi';

export default function EditDepartmentPostPanel() {
  const { dept = "CSE", id } = useParams<{ dept: string, id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialData = {
    title: "",
    date: "",
    time: "",
    category: "Workshop",
    venue: "",
    organizedBy: "",
    reportAuthor: "",
    overview: "",
    description: "",
    keyDiscussion: "",
    studentsPresent: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    "Workshop",
    "Technical Symposium",
    "Hackathon",
    "Research",
    "Guest Lecture",
    "Coding Contest",
  ];

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await adminApi.getDepartmentPostById(id);
        if (res.success && res.post) {
          const p = res.post;
          
          let kd = "";
          if (Array.isArray(p.keyDiscussion)) kd = p.keyDiscussion.join(", ");
          else if (typeof p.keyDiscussion === 'string') kd = p.keyDiscussion;

          let sp = "";
          if (Array.isArray(p.studentsPresent)) sp = p.studentsPresent.join(", ");
          else if (typeof p.studentsPresent === 'string') sp = p.studentsPresent;

          setFormData({
            title: (p.title as string) || "",
            date: (p.date as string) || "",
            time: (p.time as string) || "",
            category: (p.category as string) || "Workshop",
            venue: (p.venue as string) || "",
            organizedBy: (p.organizedBy as string) || "",
            reportAuthor: (p.reportAuthor as string) || "",
            overview: (p.overview as string) || "",
            description: (p.description as string) || "",
            keyDiscussion: kd,
            studentsPresent: sp,
          });

          if (p.image && typeof p.image === 'object' && 'url' in p.image) {
            setExistingImageUrl((p.image as any).url);
          }
        }
      } catch (err) {
        setError("Failed to fetch existing post data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!formData.title || !formData.date || !formData.venue || !formData.organizedBy || !formData.overview || !formData.description) {
        setError("Please fill out all required fields.");
        return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('date', formData.date);
      if (formData.time) formDataToSend.append('time', formData.time);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('venue', formData.venue);
      formDataToSend.append('organizedBy', formData.organizedBy);
      if (formData.reportAuthor) formDataToSend.append('reportAuthor', formData.reportAuthor);
      formDataToSend.append('overview', formData.overview);
      formDataToSend.append('description', formData.description);

      // Arrays
      if (formData.keyDiscussion) {
        const keyArr = formData.keyDiscussion.split(',').map(s => s.trim()).filter(s => s);
        formDataToSend.append('keyDiscussion', JSON.stringify(keyArr));
      } else {
        formDataToSend.append('keyDiscussion', JSON.stringify([]));
      }

      if (formData.studentsPresent) {
        const stdArr = formData.studentsPresent.split(',').map(s => s.trim()).filter(s => s);
        formDataToSend.append('studentsPresent', JSON.stringify(stdArr));
      } else {
        formDataToSend.append('studentsPresent', JSON.stringify([]));
      }

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      await adminApi.updateDepartmentPost(id, formDataToSend);
      navigate(`/admin/department-posts/${dept}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to update department post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    navigate(`/admin/department-posts/${dept}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-admin-bg">
        <svg className="h-12 w-12 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <section className="space-y-6 bg-admin-bg text-white max-w-4xl mx-auto p-2">
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/10 p-2.5">
            <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Post Panel</h1>
            <p className="text-sm text-slate-400">Updating event details for {id}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Core Info Box */}
        <div className="rounded-xl border border-white/10 bg-admin-card p-6 space-y-5">
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Core Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Post Title <span className="text-red-400">*</span></label>
                    <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full h-11 rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-emerald-500/50 focus:bg-admin-card-hover" />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Category <span className="text-red-400">*</span></label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full h-11 rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-emerald-500/50">
                        {categories.map((c) => (<option key={c} value={c} className="bg-admin-surface text-white">{c}</option>))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Organized By <span className="text-red-400">*</span></label>
                    <input type="text" required value={formData.organizedBy} onChange={(e) => setFormData({ ...formData, organizedBy: e.target.value })} className="w-full h-11 rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-emerald-500/50 focus:bg-admin-card-hover" />
                </div>
            </div>
        </div>

        {/* Schedule & Location */}
        <div className="rounded-xl border border-white/10 bg-admin-card p-6 space-y-5">
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Schedule & Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Date <span className="text-red-400">*</span></label>
                    <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full h-11 rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-emerald-500/50 focus:bg-admin-card-hover" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Time <span className="text-slate-500">(Optional)</span></label>
                    <input type="text" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full h-11 rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-emerald-500/50 focus:bg-admin-card-hover" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Venue <span className="text-red-400">*</span></label>
                    <input type="text" required value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} className="w-full h-11 rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-emerald-500/50 focus:bg-admin-card-hover" />
                </div>
            </div>
        </div>

        {/* Content & Descriptions */}
        <div className="rounded-xl border border-white/10 bg-admin-card p-6 space-y-5">
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Content & Reporting</h2>
            
            <div className="grid grid-cols-1 gap-5">
                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Overview (Executive Summary) <span className="text-red-400">*</span></label>
                    <textarea required rows={2} value={formData.overview} onChange={(e) => setFormData({ ...formData, overview: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white outline-none transition focus:border-emerald-500/50 focus:bg-admin-card-hover resize-y" />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Detailed Description <span className="text-red-400">*</span></label>
                    <textarea required rows={5} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white outline-none transition focus:border-emerald-500/50 focus:bg-admin-card-hover resize-y" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Key Discussion Points <span className="text-slate-500">(Comma separated)</span></label>
                        <input type="text" value={formData.keyDiscussion} onChange={(e) => setFormData({ ...formData, keyDiscussion: e.target.value })} className="w-full h-11 rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-emerald-500/50 focus:bg-admin-card-hover" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Students Present <span className="text-slate-500">(Comma separated)</span></label>
                        <input type="text" value={formData.studentsPresent} onChange={(e) => setFormData({ ...formData, studentsPresent: e.target.value })} className="w-full h-11 rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-emerald-500/50 focus:bg-admin-card-hover" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Report Author <span className="text-slate-500">(Optional)</span></label>
                        <input type="text" value={formData.reportAuthor} onChange={(e) => setFormData({ ...formData, reportAuthor: e.target.value })} className="w-full h-11 rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-emerald-500/50 focus:bg-admin-card-hover" />
                    </div>
                </div>
            </div>
        </div>

        {/* Media Upload */}
        <div className="rounded-xl border border-white/10 bg-admin-card p-6 space-y-5">
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Media Upload</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {existingImageUrl && !imageFile && (
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Banner</label>
                        <div className="rounded-xl overflow-hidden border border-white/10 h-40 bg-black/50">
                            <img src={existingImageUrl} alt="Current banner" className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}
                <div className={existingImageUrl && !imageFile ? "col-span-1" : "sm:col-span-2"}>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">{existingImageUrl ? "Replace Image" : "Featured Image"} <span className="text-slate-500">(Max 5MB)</span></label>
                    <div className="flex h-40 justify-center rounded-xl border border-dashed border-white/20 px-6 py-6 hover:bg-white/[0.02] transition-colors items-center">
                        <div className="text-center">
                        <svg className="mx-auto h-8 w-8 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                        </svg>
                        <div className="mt-2 flex justify-center text-sm leading-6 text-slate-400">
                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-emerald-400 focus-within:outline-none hover:text-emerald-300">
                            <span>Upload a new file</span>
                            <input id="file-upload" name="file-upload" type="file" accept="image/jpeg, image/png, image/webp" className="sr-only" ref={fileInputRef} onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setImageFile(e.target.files[0]);
                                }
                            }} />
                            </label>
                        </div>
                        {imageFile && <p className="mt-2 text-xs text-emerald-400 font-medium truncate max-w-[200px] mx-auto">Selected: {imageFile.name}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 pb-12">
          <button type="button" onClick={handleReset} className="rounded-xl border border-white/10 bg-transparent px-6 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="rounded-xl border border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2">
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>
    </section>
  );
}
