import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Award,
  Calendar,
  GraduationCap,
  Medal,
  CheckCircle2,
  Sparkles,
  Send,
} from "lucide-react";

export default function ManualCertificateEntry() {
  const [formData, setFormData] = useState({
    name: "",
    event: "IEEE Tech Symposium",
    date: "",
    branch: "CSE",
    position: "Participant",
  });

  const [message, setMessage] = useState("");

  const eventsList = [
    "IEEE Tech Symposium",
    "AI Workshop",
    "Robotics BootCamp",
    "Web Development",
    "VLSI Workshop",
  ];

  const branchList = [
    "CSE",
    "AIML",
    "EE",
    "ECE",
    "BT",
    "ME",
    "CE",
  ];

  const positionsList = [
    "Participant",
    "Winner",
    "1st Runner Up",
    "2nd Runner Up",
    "Coordinator",
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setMessage(`Certificate generated successfully for ${formData.name}!`);
    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <section className="space-y-6 bg-admin-bg text-white max-w-3xl">
      {/* Back button & Title */}
      <div className="flex flex-col gap-2 border-b border-white/10 pb-4">
        <Link
          to="/admin/certificates"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors w-fit"
        >
          <ArrowLeft size={14} />
          <span>Back to Certificates</span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Enter Details for Certificate
              <Sparkles size={16} className="text-blue-400" />
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Fill in participant data to issue an authenticated IEEE certificate.
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-xs font-medium text-emerald-300 shadow-[0_4px_20px_rgba(16,185,129,0.15)]">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Styled Form Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface p-6 sm:p-8 shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/70 to-transparent" />

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Participant Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User size={16} />
              </div>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aarav Sharma"
                className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Row: Event & Date */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Event Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Award size={16} />
                </div>
                <select
                  value={formData.event}
                  onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  {eventsList.map((evt) => (
                    <option key={evt} value={evt} className="bg-admin-surface text-white">
                      {evt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Issue Date
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

          {/* Row: Branch & Position */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Branch / Department
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <GraduationCap size={16} />
                </div>
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  {branchList.map((b) => (
                    <option key={b} value={b} className="bg-admin-surface text-white">
                      {b} Department
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Position / Merit Role
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Medal size={16} />
                </div>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  {positionsList.map((p) => (
                    <option key={p} value={p} className="bg-admin-surface text-white">
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(43,123,255,0.3)] hover:shadow-[0_4px_24px_rgba(43,123,255,0.45)] hover:from-blue-500 hover:to-blue-600 active:scale-[0.98] transition-all duration-200"
            >
              <Send size={15} />
              <span>Generate Certificate</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
