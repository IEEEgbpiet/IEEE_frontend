import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, Clock, FileSignature, ArrowRight, Sparkles, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { adminApi } from "@/services/adminApi";

export default function Certificates() {
  const [stats, setStats] = useState<{
    pending: number;
    approved: number;
    rejected: number;
  }>({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getDashboardCertificateSummary();
        const raw = (res && typeof res === "object" && "data" in res && res.data && typeof res.data === "object")
          ? (res.data as Record<string, number>)
          : ((res as unknown) as Record<string, number>) ?? {};

        if (mounted) {
          setStats({
            pending: Number(raw.pending ?? 0),
            approved: Number(raw.approved ?? 0),
            rejected: Number(raw.rejected ?? 0),
          });
        }
      } catch (err) {
        console.error("Failed to load certificate dashboard summary:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadStats();
    return () => {
      mounted = false;
    };
  }, []);

  const total = stats.approved + stats.pending + stats.rejected;

  return (
    <div className="space-y-8 bg-admin-bg text-white">
      {/* Header section with badge */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-admin-card via-admin-surface to-admin-card p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300 w-fit">
            <Sparkles size={13} className="text-blue-400" />
            <span>Credentials & Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Emails & Certificates Section
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Issue authenticated participation certificates, process student claims, and manage certificate generation details.
          </p>

          {/* Real-time Status Strip */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-white/10 bg-admin-subtle/50 px-3.5 py-2.5">
              <span className="text-[11px] font-medium text-slate-400">Total Applications</span>
              <p className="text-lg font-bold font-mono text-white">
                {loading ? "..." : total}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-3.5 py-2.5">
              <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={12} /> Issued
              </span>
              <p className="text-lg font-bold font-mono text-emerald-300">
                {loading ? "..." : stats.approved}
              </p>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 px-3.5 py-2.5">
              <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
                <AlertCircle size={12} /> Pending Review
              </span>
              <p className="text-lg font-bold font-mono text-amber-300">
                {loading ? "..." : stats.pending}
              </p>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 px-3.5 py-2.5">
              <span className="text-[11px] font-medium text-rose-400 flex items-center gap-1">
                <XCircle size={12} /> Rejected
              </span>
              <p className="text-lg font-bold font-mono text-rose-300">
                {loading ? "..." : stats.rejected}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Modern Action Cards with Smooth Hover Effects */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Issued Certificates */}
        <Link
          to="/admin/certificates/issued"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface p-7 text-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-[0_12px_32px_rgba(16,185,129,0.15)]"
        >
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-600/15 text-emerald-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-600/25 group-hover:text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Award size={24} />
              </div>
              <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 font-mono">
                {loading ? "..." : `${stats.approved} Issued`}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white group-hover:text-emerald-200 transition-colors">
                Issued Certificates
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Access the registry of previously dispatched credentials, search by verification ID, and review history.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 pt-4 border-t border-white/10 text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
            <span>View Issued Registry</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </div>
        </Link>

        {/* Card 2: Requested Certificates */}
        <Link
          to="/admin/certificates/requests"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface p-7 text-white transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-[0_12px_32px_rgba(245,158,11,0.15)]"
        >
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-600/15 text-amber-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-600/25 group-hover:text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Clock size={24} />
              </div>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-mono ${
                stats.pending > 0
                  ? "border-amber-500/40 bg-amber-500/15 text-amber-300 animate-pulse"
                  : "border-white/10 bg-admin-subtle/80 text-slate-400"
              }`}>
                {loading ? "..." : `${stats.pending} Pending`}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white group-hover:text-amber-200 transition-colors">
                Requested Certificates
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Review pending attendee claims, verify participant attendance records, and grant instant approvals.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 pt-4 border-t border-white/10 text-xs font-semibold text-amber-400 group-hover:text-amber-300">
            <span>Process Requests</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </div>
        </Link>

        {/* Card 3: Templates & Details */}
        <Link
          to="/admin/certificates/templates"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface p-7 text-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-[0_12px_32px_rgba(43,123,255,0.15)]"
        >
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-600/15 text-blue-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600/25 group-hover:text-blue-300 shadow-[0_0_15px_rgba(43,123,255,0.2)]">
                <FileSignature size={24} />
              </div>
              <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
                Manual Issuance
              </span>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors">
                Certificate Details
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Manually issue credentials by entering attendee name, event name, branch, and merit or participation position.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 pt-4 border-t border-white/10 text-xs font-semibold text-blue-400 group-hover:text-blue-300">
            <span>Enter Details</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </div>
        </Link>
      </div>
    </div>
  );
}