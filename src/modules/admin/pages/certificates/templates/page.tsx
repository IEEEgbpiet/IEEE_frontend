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
  Mail,
  Loader2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { adminApi } from "@/services/adminApi";

export default function ManualCertificateEntry() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    event: "",
    date: "",
    branch: "CSE",
    position: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

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
    { label: "Participant (No Position)", value: "" },
    { label: "1st Place", value: "1st" },
    { label: "2nd Place", value: "2nd" },
    { label: "3rd Place", value: "3rd" },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameVal = formData.name.trim();
    const emailVal = formData.email.trim();
    const eventVal = formData.event.trim();

    if (!nameVal || !emailVal || !eventVal || !formData.date || !formData.branch) {
      setError("Please fill in all required fields: Name, Email, Event, Date, and Branch.");
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMsg("");

      const payload: {
        name: string;
        email: string;
        branch: string;
        event: string;
        date: string;
        position?: string;
      } = {
        name: nameVal,
        email: emailVal,
        branch: formData.branch,
        event: eventVal,
        date: formData.date,
      };

      // Only include position if one was selected
      if (formData.position) {
        payload.position = formData.position;
      }

      const res = await adminApi.createManualCertificate(payload);

      if (res.success) {
        const certId = res.data?.certificateId ?? "";
        setSuccessMsg(
          res.message ||
            `Certificate issued and emailed to ${emailVal} successfully!` +
              (certId ? ` (ID: ${certId})` : "")
        );

        // Reset form on success
        setFormData({
          name: "",
          email: "",
          event: "",
          date: "",
          branch: "CSE",
          position: "",
        });
      } else {
        throw new Error(res.message || "Failed to issue certificate.");
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to issue certificate. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      event: "",
      date: "",
      branch: "CSE",
      position: "",
    });
    setError("");
    setSuccessMsg("");
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
              Issue Certificate Manually
              <Sparkles size={16} className="text-blue-400" />
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Directly generate and email an authenticated IEEE certificate to
              the recipient. Uses the <code className="text-blue-300 bg-blue-950/40 px-1 py-0.5 rounded text-[10px]">/adminApply</code> endpoint.
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-xs font-medium text-emerald-300 shadow-[0_4px_20px_rgba(16,185,129,0.15)]">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-medium text-red-200">
          <AlertTriangle size={16} className="text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Styled Form Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface p-6 sm:p-8 shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/70 to-transparent" />

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Participant Name <span className="text-blue-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User size={16} />
              </div>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Aarav Sharma"
                className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Participant Email <span className="text-blue-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail size={16} />
              </div>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="e.g. aarav.sharma@gmail.com"
                className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Row: Event & Date */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Event Name <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Award size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={formData.event}
                  onChange={(e) =>
                    setFormData({ ...formData, event: e.target.value })
                  }
                  placeholder="e.g. National Hackathon 2026"
                  className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

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
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Row: Branch & Position */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Branch / Department <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <GraduationCap size={16} />
                </div>
                <select
                  value={formData.branch}
                  onChange={(e) =>
                    setFormData({ ...formData, branch: e.target.value })
                  }
                  className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  {branchList.map((b) => (
                    <option
                      key={b}
                      value={b}
                      className="bg-admin-surface text-white"
                    >
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Position / Merit Role{" "}
                <span className="text-slate-500 text-[10px] normal-case">(optional)</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Medal size={16} />
                </div>
                <select
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="w-full h-11 rounded-xl border border-white/15 bg-admin-subtle/70 pl-10 pr-4 text-sm text-white outline-none transition-all duration-200 focus:border-blue-400 focus:bg-admin-card focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  {positionsList.map((p) => (
                    <option
                      key={p.value}
                      value={p.value}
                      className="bg-admin-surface text-white"
                    >
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Info note */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-xs text-blue-200/80">
            <strong className="text-blue-300">Note:</strong> This will directly generate
            a PDF certificate via Puppeteer and email it to the participant's
            email address using Resend. No approval step is required.
          </div>

          {/* Submit & Reset Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(43,123,255,0.3)] hover:shadow-[0_4px_24px_rgba(43,123,255,0.45)] hover:from-blue-500 hover:to-blue-600 active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Generating & Emailing…</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Issue Certificate</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-admin-card/50 px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-admin-card transition-all disabled:opacity-50"
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
