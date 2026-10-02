import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  User,
  Calendar,
  CheckCircle2,
  Check,
  X,
  Sparkles,
  Mail,
  GraduationCap,
  Medal,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { adminApi, type CertificateApplication } from "@/services/adminApi";

type MappedRequest = {
  _id: string;
  name: string;
  email: string;
  branch: string;
  eventName: string;
  date: string;
  position: string;
  status: "pending" | "approved" | "rejected";
};

export default function RequestedCertificates() {
  const [requests, setRequests] = useState<MappedRequest[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [actionLoading, setActionLoading] = useState<Record<string, string>>(
    {}
  ); // id -> 'approve' | 'reject'
  const [confirmReject, setConfirmReject] = useState<string | null>(null); // id pending rejection confirmation

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminApi.getCertificateApplications();
      const data = (response?.data ?? []) as CertificateApplication[];

      const pending = data
        .filter(
          (item) =>
            String(item.status ?? "").toLowerCase() === "pending"
        )
        .map((item) => ({
          _id: String(item._id ?? ""),
          name: String(item.name ?? "Unknown"),
          email: String(item.email ?? ""),
          branch: String(item.branch ?? ""),
          eventName: String(item.eventName ?? item.event ?? "Event"),
          date: item.date
            ? new Date(String(item.date)).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "N/A",
          position: String(item.position ?? "—"),
          status: "pending" as const,
        }));

      setRequests(pending);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load pending certificate requests."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRequests();
  }, [fetchRequests]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleApprove = async (id: string) => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: "approve" }));
      setError("");
      const res = await adminApi.approveCertificate(id);
      // Remove from list after approval
      setRequests((prev) => prev.filter((r) => r._id !== id));
      showSuccess(
        res.message || "Certificate approved and emailed to the applicant!"
      );
    } catch (approveError) {
      setError(
        approveError instanceof Error
          ? approveError.message
          : "Unable to approve the certificate request."
      );
    } finally {
      setActionLoading((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      setConfirmReject(null);
      setActionLoading((prev) => ({ ...prev, [id]: "reject" }));
      setError("");
      const res = await adminApi.rejectCertificate(id);
      // Remove from list after rejection
      setRequests((prev) => prev.filter((r) => r._id !== id));
      showSuccess(res.message || "Certificate request rejected.");
    } catch (rejectError) {
      setError(
        rejectError instanceof Error
          ? rejectError.message
          : "Unable to reject the certificate request."
      );
    } finally {
      setActionLoading((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return requests;

    return requests.filter((request) =>
      [
        request.name,
        request.email,
        request.branch,
        request.eventName,
        request.date,
        request.position,
        request._id,
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [requests, search]);

  return (
    <section className="space-y-6 bg-admin-bg text-white">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
        <div>
          <Link
            to="/admin/certificates"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors mb-1.5"
          >
            <ArrowLeft size={14} />
            <span>Back to Certificates</span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Requested Certificates
            <Sparkles size={16} className="text-amber-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review pending attendee claims, verify participant records, approve
            or reject requests.
          </p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, event..."
            aria-label="Search certificate requests"
            className="w-full h-10 rounded-xl border border-white/15 bg-admin-card py-2 pl-4 pr-10 text-sm text-white outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
          />
          <Search
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-xs font-medium text-emerald-300 shadow-[0_4px_20px_rgba(16,185,129,0.15)] animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          <AlertTriangle size={16} className="text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Rejection Confirmation Modal */}
      {confirmReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-admin-card p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Confirm Rejection
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Are you sure you want to reject this certificate request? This
                  action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmReject(null)}
                className="rounded-lg border border-white/15 bg-admin-subtle/60 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-admin-subtle hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleReject(confirmReject)}
                className="rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_2px_12px_rgba(239,68,68,0.3)] hover:shadow-[0_2px_18px_rgba(239,68,68,0.5)] transition-all"
              >
                <span className="flex items-center gap-1.5">
                  <X size={13} />
                  Yes, Reject
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Count Badge */}
      {!loading && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
            {filteredRequests.length} pending request
            {filteredRequests.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Modern Table Container */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-admin-subtle/80 text-xs uppercase tracking-wider text-slate-300">
                <th className="px-5 py-4 font-semibold">Attendee</th>
                <th className="px-5 py-4 font-semibold">Email</th>
                <th className="px-5 py-4 font-semibold">Branch</th>
                <th className="px-5 py-4 font-semibold">Event</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Position</th>
                <th className="px-5 py-4 text-center font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-500 text-sm"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin text-blue-400" />
                      Loading pending certificate requests…
                    </div>
                  </td>
                </tr>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((request) => {
                  const isActioning = actionLoading[request._id];
                  return (
                    <tr
                      key={request._id}
                      className={`group transition-colors duration-200 hover:bg-blue-600/10 ${
                        isActioning ? "opacity-60 pointer-events-none" : ""
                      }`}
                    >
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/25 bg-amber-500/10 text-amber-400 group-hover:scale-105 group-hover:border-amber-400/40 group-hover:bg-amber-500/20 transition-all">
                            <User size={16} />
                          </div>
                          <span className="text-white font-medium group-hover:text-amber-200 transition-colors">
                            {request.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-slate-300 text-xs">
                          <Mail size={12} className="text-slate-400" />
                          {request.email}
                        </span>
                      </td>

                      {/* Branch */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-300">
                          <GraduationCap size={12} />
                          {request.branch}
                        </span>
                      </td>

                      {/* Event */}
                      <td className="px-5 py-4 text-slate-300 max-w-[180px] truncate">
                        {request.eventName}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-admin-subtle/70 px-3 py-1 text-xs font-medium text-slate-300">
                          <Calendar size={12} className="text-slate-400" />
                          {request.date}
                        </span>
                      </td>

                      {/* Position */}
                      <td className="px-5 py-4">
                        {request.position && request.position !== "—" ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-950/40 px-2.5 py-1 text-xs font-semibold text-amber-300">
                            <Medal size={12} />
                            {request.position}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {isActioning === "approve" ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-blue-300">
                              <Loader2 size={13} className="animate-spin" />
                              Approving…
                            </span>
                          ) : isActioning === "reject" ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-red-300">
                              <Loader2 size={13} className="animate-spin" />
                              Rejecting…
                            </span>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(request._id)}
                                title="Approve — sends certificate via email"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_2px_12px_rgba(16,185,129,0.3)] hover:shadow-[0_2px_18px_rgba(16,185,129,0.45)] hover:from-emerald-500 hover:to-emerald-600 active:scale-[0.97] transition-all"
                              >
                                <Check size={13} />
                                <span>Approve</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmReject(request._id)}
                                title="Reject certificate request"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 hover:text-red-200 hover:border-red-500/50 active:scale-[0.97] transition-all"
                              >
                                <X size={13} />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-500 text-sm"
                  >
                    {search
                      ? `No pending requests matching "${search}" found.`
                      : "No pending certificate requests at this time."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}