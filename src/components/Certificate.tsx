import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

import {
  Award,
  Calendar,
  GraduationCap,
  Mail,
  User,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  Copy,
  Check,
  FileCheck,
  ArrowRight,
  ShieldCheck,
  Info,
} from "lucide-react";

import {
  adminApi,
  type CertificateApplication,
} from "@/services/adminApi";

const BRANCH_OPTIONS = [
  {
    value: "CSE",
    label: "Computer Science & Engineering (CSE)",
  },
  {
    value: "AIML",
    label: "Artificial Intelligence & Machine Learning (AIML)",
  },
  {
    value: "ECE",
    label: "Electronics & Communication Engineering (ECE)",
  },
  {
    value: "EE",
    label: "Electrical Engineering (EE)",
  },
  {
    value: "ME",
    label: "Mechanical Engineering (ME)",
  },
  {
    value: "CE",
    label: "Civil Engineering (CE)",
  },
  {
    value: "BT",
    label: "Biotechnology (BT)",
  },
];

export default function CertificateForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branch: "CSE",
    event: "",
    date: "",
  });

  const [recentEvents, setRecentEvents] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [successData, setSuccessData] = useState<{
    message: string;
    certificate?: CertificateApplication;
  } | null>(null);

  const [copiedId, setCopiedId] = useState(false);

  // Fetch recent event suggestions
  useEffect(() => {
    let mounted = true;

    const fetchEventSuggestions = async () => {
      try {
        const res = await adminApi.getUpcomingEvents();

        if (mounted && res?.posts && Array.isArray(res.posts)) {
          const names = Array.from(
            new Set(
              res.posts
                .map((p) => p.eventName || p.title)
                .filter(Boolean)
            )
          );

          if (names.length > 0) {
            setRecentEvents(names);
          }
        }
      } catch {
        // Silently ignore if endpoint is unavailable
      }
    };

    void fetchEventSuggestions();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleCopyId = (certId: string) => {
    navigator.clipboard
      .writeText(certId)
      .then(() => {
        setCopiedId(true);

        setTimeout(() => {
          setCopiedId(false);
        }, 2500);
      })
      .catch(() => {
        setError("Unable to copy certificate ID.");
      });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const event = formData.event.trim();
    const date = formData.date.trim();
    const branch = formData.branch.trim();

    if (!name || !email || !event || !date || !branch) {
      setError(
        "Please fill in all required fields: Name, Email, Branch, Event, and Date."
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const payload = {
        name,
        email,
        branch,
        event,
        date,
      };

      const res = await adminApi.applyCertificate(payload);

      setSuccessData({
        message:
          res?.message ||
          "Application submitted successfully. Awaiting admin approval.",
        certificate: res?.data,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit certificate application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      branch: "CSE",
      event: "",
      date: "",
    });

    setSuccessData(null);
    setError("");
    setCopiedId(false);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 px-4 py-16 text-white sm:py-20 lg:py-24">
      {/* Background Glow Orbs */}
      <div className="pointer-events-none absolute left-1/2 top-12 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/15 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-20 right-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300">
            <Sparkles size={13} className="text-blue-400" />
            <span>Official IEEE GBPIET Credential Portal</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Apply for{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              Certificate
            </span>
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-400 sm:text-base">
            Participated in an IEEE GBPIET event, workshop, or competition?
            Submit your claim below to receive your verified digital
            certificate.
          </p>
        </div>

        {/* Success View */}
        {successData ? (
          <div className="overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
                <CheckCircle2 size={34} />
              </div>

              <h2 className="mt-4 text-2xl font-bold text-white">
                Application Received!
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                {successData.message}
              </p>
            </div>

            {/* Application Details */}
            <div className="mt-6 space-y-3.5 rounded-xl border border-white/10 bg-slate-950/60 p-5">
              {successData.certificate?.certificateId && (
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Tracking / Certificate ID
                    </span>

                    <p className="font-mono text-base font-bold text-cyan-400">
                      {successData.certificate.certificateId}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopyId(
                        successData.certificate!.certificateId!
                      )
                    }
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    {copiedId ? (
                      <>
                        <Check size={13} className="text-emerald-400" />
                        <span className="text-emerald-300">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                <div>
                  <span className="text-slate-400">Attendee Name</span>
                  <p className="font-medium text-white">
                    {formData.name}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400">Dispatched To</span>
                  <p className="font-medium text-white">
                    {formData.email}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400">Event</span>
                  <p className="font-medium text-white">
                    {formData.event}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400">Status</span>
                  <p className="inline-flex items-center gap-1 font-semibold text-amber-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                    Pending Verification
                  </p>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3.5 text-xs text-blue-200">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-blue-400"
              />

              <p>
                Our branch coordinators verify participant records before
                granting approval. Once approved, the authenticated
                certificate will be dispatched directly to your inbox.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleReset}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-cyan-500"
              >
                Submit Another Application
              </button>

              <Link
                to="/"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          /* Form Card */
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl sm:p-9"
          >
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-200">
                <AlertTriangle
                  size={16}
                  className="mt-0.5 shrink-0 text-rose-400"
                />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  <User size={13} className="text-blue-400" />
                  Full Name <span className="text-rose-400">*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rohan Sharma"
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                />

                <span className="mt-1 block text-[11px] text-slate-500">
                  Enter your name exactly as it should appear on the
                  certificate.
                </span>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  <Mail size={13} className="text-blue-400" />
                  Email Address <span className="text-rose-400">*</span>
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. rohan.sharma@example.com"
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                />

                <span className="mt-1 block text-[11px] text-slate-500">
                  Your approved certificate will be emailed to this address.
                </span>
              </div>

              {/* Branch */}
              <div>
                <label
                  htmlFor="branch"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  <GraduationCap
                    size={13}
                    className="text-blue-400"
                  />
                  Branch / Department{" "}
                  <span className="text-rose-400">*</span>
                </label>

                <select
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                >
                  {BRANCH_OPTIONS.map((branch) => (
                    <option
                      key={branch.value}
                      value={branch.value}
                      className="bg-slate-900 text-white"
                    >
                      {branch.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event */}
              <div>
                <label
                  htmlFor="event"
                  className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  <span className="flex items-center gap-1.5">
                    <Award size={13} className="text-blue-400" />
                    Event Participated In{" "}
                    <span className="text-rose-400">*</span>
                  </span>

                  {recentEvents.length > 0 && (
                    <span className="text-[10px] font-normal lowercase text-slate-400">
                      (suggestions enabled)
                    </span>
                  )}
                </label>

                <input
                  id="event"
                  name="event"
                  list="events-datalist"
                  type="text"
                  value={formData.event}
                  onChange={handleChange}
                  placeholder="e.g. National Hackathon 2026, Spandan, etc."
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                />

                <datalist id="events-datalist">
                  {recentEvents.map((evt) => (
                    <option key={evt} value={evt} />
                  ))}

                  <option value="National Hackathon 2026" />
                  <option value="KiCad PCB Design Workshop" />
                  <option value="RoboQuest Competition" />
                  <option value="Spandan Annual Tech Fest" />
                  <option value="Goonj Technical Symposium" />
                </datalist>
              </div>

              {/* Event Date */}
              <div>
                <label
                  htmlFor="date"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  <Calendar size={13} className="text-blue-400" />
                  Event Date <span className="text-rose-400">*</span>
                </label>

                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 [color-scheme:dark]"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-cyan-500 hover:shadow-blue-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin text-white"
                      />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck size={16} />
                      <span>Submit Certificate Application</span>
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
              <Info size={13} className="shrink-0 text-slate-400" />

              <span>
                Certificates are digitally authenticated and verified
                through the IEEE GBPIET branch registry.
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}