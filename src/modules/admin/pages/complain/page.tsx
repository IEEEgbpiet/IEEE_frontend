import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Search,
  Headset,
  Mail,
  User,
  Calendar,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Sparkles,
  Eye,
  X,
  Copy,
  Check,
} from "lucide-react";
import { adminApi, type SupportTicket } from "@/services/adminApi";

type MappedTicket = {
  _id: string;
  ticketId: string;
  name: string;
  email: string;
  subject: string;
  description: string;
  solvedStatus: "pending" | "rejected" | "solved";
  createdAt: string;
};

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<MappedTicket[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "solved" | "rejected"
  >("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [actionLoading, setActionLoading] = useState<
    Record<string, string>
  >({});
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    type: "close" | "reject";
  } | null>(null);
  const [viewTicket, setViewTicket] = useState<MappedTicket | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminApi.getSupportTickets();
      const data = (response?.tickets ?? []) as SupportTicket[];

      const mapped: MappedTicket[] = data.map((item) => ({
        _id: String(item._id ?? ""),
        ticketId: String(item.ticketId ?? ""),
        name: String(item.name ?? "Unknown"),
        email: String(item.email ?? ""),
        subject: String(item.subject ?? "No subject"),
        description: String(
          item.description ?? item.message ?? "No description."
        ),
        solvedStatus: (
          ["pending", "rejected", "solved"].includes(
            String(item.solvedStatus ?? "").toLowerCase()
          )
            ? String(item.solvedStatus).toLowerCase()
            : "pending"
        ) as MappedTicket["solvedStatus"],
        createdAt: item.createdAt
          ? new Date(String(item.createdAt)).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "N/A",
      }));

      setTickets(mapped);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load support tickets."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTickets();
  }, [fetchTickets]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleViewTicket = async (ticket: MappedTicket) => {
    // If we already have the description from the list, just show it
    if (ticket.description && ticket.description !== "No description.") {
      setViewTicket(ticket);
      return;
    }

    try {
      setViewLoading(true);
      const res = await adminApi.viewSupportTicket(ticket._id);
      if (res.success && res.ticket) {
        const detailed: MappedTicket = {
          ...ticket,
          description: String(
            res.ticket.description ??
              res.ticket.message ??
              "No description."
          ),
        };
        setViewTicket(detailed);
      } else {
        setViewTicket(ticket);
      }
    } catch {
      setViewTicket(ticket);
    } finally {
      setViewLoading(false);
    }
  };

  const handleCloseTicket = async (id: string) => {
    try {
      setConfirmAction(null);
      setActionLoading((prev) => ({ ...prev, [id]: "close" }));
      setError("");
      const res = await adminApi.closeSupportTicket(id);
      setTickets((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, solvedStatus: "solved" as const } : t
        )
      );
      showSuccess(res.message || "Ticket marked as solved successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to close ticket."
      );
    } finally {
      setActionLoading((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleRejectTicket = async (id: string) => {
    try {
      setConfirmAction(null);
      setActionLoading((prev) => ({ ...prev, [id]: "reject" }));
      setError("");
      const res = await adminApi.rejectSupportTicket(id);
      setTickets((prev) =>
        prev.map((t) =>
          t._id === id
            ? { ...t, solvedStatus: "rejected" as const }
            : t
        )
      );
      showSuccess(res.message || "Ticket rejected successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to reject ticket."
      );
    } finally {
      setActionLoading((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleCopyId = (ticketId: string) => {
    navigator.clipboard.writeText(ticketId).then(() => {
      setCopiedId(ticketId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const statusBadge = (status: MappedTicket["solvedStatus"]) => {
    switch (status) {
      case "solved":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-300">
            <CheckCircle2 size={12} />
            Solved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/25 bg-red-950/40 px-2.5 py-1 text-xs font-semibold text-red-300">
            <XCircle size={12} />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-950/40 px-2.5 py-1 text-xs font-semibold text-amber-300">
            <AlertTriangle size={12} />
            Pending
          </span>
        );
    }
  };

  const filteredTickets = useMemo(() => {
    let result = tickets;

    if (statusFilter !== "all") {
      result = result.filter((t) => t.solvedStatus === statusFilter);
    }

    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((t) =>
        [t.name, t.email, t.subject, t.ticketId, t.createdAt].some(
          (value) => value.toLowerCase().includes(query)
        )
      );
    }

    return result;
  }, [tickets, search, statusFilter]);

  const counts = useMemo(() => {
    const pending = tickets.filter(
      (t) => t.solvedStatus === "pending"
    ).length;
    const solved = tickets.filter(
      (t) => t.solvedStatus === "solved"
    ).length;
    const rejected = tickets.filter(
      (t) => t.solvedStatus === "rejected"
    ).length;
    return { pending, solved, rejected, total: tickets.length };
  }, [tickets]);

  return (
    <section className="space-y-6 bg-admin-bg text-white">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-admin-card via-admin-surface to-admin-card p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300 w-fit">
            <Sparkles size={13} className="text-purple-400" />
            <span>Support Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Contact & Support Tickets
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Manage incoming support inquiries, resolve tickets, and track member
            assistance requests.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Total",
            value: counts.total,
            color: "blue",
            border: "border-blue-500/20",
            bg: "bg-blue-500/10",
            text: "text-blue-300",
          },
          {
            label: "Pending",
            value: counts.pending,
            color: "amber",
            border: "border-amber-500/20",
            bg: "bg-amber-500/10",
            text: "text-amber-300",
          },
          {
            label: "Solved",
            value: counts.solved,
            color: "emerald",
            border: "border-emerald-500/20",
            bg: "bg-emerald-500/10",
            text: "text-emerald-300",
          },
          {
            label: "Rejected",
            value: counts.rejected,
            color: "red",
            border: "border-red-500/20",
            bg: "bg-red-500/10",
            text: "text-red-300",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border ${stat.border} ${stat.bg} p-4 text-center transition-all hover:scale-[1.02]`}
          >
            <p className="text-xs font-medium text-slate-400">{stat.label}</p>
            {loading ? (
              <div className="mx-auto mt-2 h-8 w-12 animate-pulse rounded bg-white/10" />
            ) : (
              <p
                className={`mt-1 text-2xl font-bold font-mono tracking-tight ${stat.text}`}
              >
                {stat.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Success / Error Messages */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-xs font-medium text-emerald-300">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          <AlertTriangle size={16} className="text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {(
            [
              { key: "all", label: "All" },
              { key: "pending", label: "Pending" },
              { key: "solved", label: "Solved" },
              { key: "rejected", label: "Rejected" },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setStatusFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === f.key
                  ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                  : "bg-admin-subtle/60 text-slate-400 border border-white/10 hover:text-white hover:bg-admin-subtle"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, ticket ID..."
            aria-label="Search tickets"
            className="w-full h-10 rounded-xl border border-white/15 bg-admin-card py-2 pl-4 pr-10 text-sm text-white outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
          />
          <Search
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      {/* Confirm Action Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-admin-card p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                  confirmAction.type === "reject"
                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                }`}
              >
                {confirmAction.type === "reject" ? (
                  <XCircle size={20} />
                ) : (
                  <CheckCircle2 size={20} />
                )}
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  {confirmAction.type === "reject"
                    ? "Reject Ticket"
                    : "Close Ticket"}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {confirmAction.type === "reject"
                    ? "Are you sure you want to reject this support ticket?"
                    : "Are you sure you want to mark this ticket as solved?"}
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="rounded-lg border border-white/15 bg-admin-subtle/60 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-admin-subtle hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  confirmAction.type === "reject"
                    ? handleRejectTicket(confirmAction.id)
                    : handleCloseTicket(confirmAction.id)
                }
                className={`rounded-lg px-4 py-2 text-xs font-semibold text-white transition-all ${
                  confirmAction.type === "reject"
                    ? "bg-gradient-to-r from-red-600 to-red-500 shadow-[0_2px_12px_rgba(239,68,68,0.3)]"
                    : "bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-[0_2px_12px_rgba(16,185,129,0.3)]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {confirmAction.type === "reject" ? (
                    <>
                      <XCircle size={13} />
                      Yes, Reject
                    </>
                  ) : (
                    <>
                      <Check size={13} />
                      Yes, Close
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {viewTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-2xl rounded-2xl border border-white/10 bg-admin-card p-6 sm:p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setViewTicket(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
            >
              <X size={18} />
            </button>

            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Headset size={18} className="text-purple-400" />
                  <h3 className="text-lg font-bold text-white">
                    Ticket Details
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Full view of support inquiry
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Ticket ID
                  </label>
                  <div className="h-10 rounded-lg border border-white/15 bg-admin-subtle/50 px-3 flex items-center text-sm text-purple-300 font-mono">
                    {viewTicket.ticketId}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Status
                  </label>
                  <div className="h-10 rounded-lg border border-white/15 bg-admin-subtle/50 px-3 flex items-center">
                    {statusBadge(viewTicket.solvedStatus)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Name
                  </label>
                  <div className="h-10 rounded-lg border border-white/15 bg-admin-subtle/50 px-3 flex items-center text-sm text-white">
                    {viewTicket.name}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Email
                  </label>
                  <div className="h-10 rounded-lg border border-white/15 bg-admin-subtle/50 px-3 flex items-center text-sm text-slate-300">
                    {viewTicket.email}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Subject
                </label>
                <div className="min-h-[40px] rounded-lg border border-white/15 bg-admin-subtle/50 px-3 py-2.5 text-sm text-white">
                  {viewTicket.subject}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Description / Message
                </label>
                <div className="min-h-[120px] rounded-lg border border-white/15 bg-admin-subtle/50 p-3.5 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {viewLoading ? (
                    <span className="flex items-center gap-2 text-slate-400">
                      <Loader2 size={14} className="animate-spin" />
                      Loading details…
                    </span>
                  ) : (
                    viewTicket.description
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-500">
                Submitted on {viewTicket.createdAt}
              </div>

              {/* Actions in modal */}
              {viewTicket.solvedStatus === "pending" && (
                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setViewTicket(null);
                      setConfirmAction({
                        id: viewTicket._id,
                        type: "close",
                      });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_2px_12px_rgba(16,185,129,0.3)] hover:from-emerald-500 hover:to-emerald-600 transition-all"
                  >
                    <CheckCircle2 size={13} />
                    Mark as Solved
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setViewTicket(null);
                      setConfirmAction({
                        id: viewTicket._id,
                        type: "reject",
                      });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition-all"
                  >
                    <XCircle size={13} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-admin-subtle/80 text-xs uppercase tracking-wider text-slate-300">
                <th className="px-5 py-4 font-semibold">Ticket ID</th>
                <th className="px-5 py-4 font-semibold">Sender</th>
                <th className="px-5 py-4 font-semibold">Email</th>
                <th className="px-5 py-4 font-semibold">Subject</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Status</th>
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
                      <Loader2
                        size={18}
                        className="animate-spin text-purple-400"
                      />
                      Loading support tickets…
                    </div>
                  </td>
                </tr>
              ) : filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => {
                  const isActioning = actionLoading[ticket._id];
                  return (
                    <tr
                      key={ticket._id}
                      className={`group transition-colors duration-200 hover:bg-blue-600/10 ${
                        isActioning
                          ? "opacity-60 pointer-events-none"
                          : ""
                      }`}
                    >
                      {/* Ticket ID */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleCopyId(ticket.ticketId)}
                          title="Click to copy"
                          className="inline-flex items-center gap-1.5 font-mono text-xs text-purple-300 bg-purple-950/40 border border-purple-500/25 px-2.5 py-1 rounded-md hover:bg-purple-950/60 transition-all cursor-pointer"
                        >
                          {copiedId === ticket.ticketId ? (
                            <>
                              <CheckCircle2
                                size={12}
                                className="text-emerald-400"
                              />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              {ticket.ticketId}
                            </>
                          )}
                        </button>
                      </td>

                      {/* Sender */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-purple-500/25 bg-purple-500/10 text-purple-400 group-hover:scale-105 transition-all">
                            <User size={14} />
                          </div>
                          <span className="text-white font-medium text-sm">
                            {ticket.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-slate-300 text-xs">
                          <Mail size={12} className="text-slate-400" />
                          {ticket.email}
                        </span>
                      </td>

                      {/* Subject */}
                      <td className="px-5 py-4 text-slate-300 max-w-[200px] truncate text-sm">
                        <span className="inline-flex items-center gap-1.5">
                          <MessageSquare
                            size={12}
                            className="text-slate-400 shrink-0"
                          />
                          {ticket.subject}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-admin-subtle/70 px-3 py-1 text-xs font-medium text-slate-300">
                          <Calendar
                            size={12}
                            className="text-slate-400"
                          />
                          {ticket.createdAt}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {statusBadge(ticket.solvedStatus)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {isActioning ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-slate-300">
                              <Loader2
                                size={13}
                                className="animate-spin"
                              />
                              {isActioning === "close"
                                ? "Closing…"
                                : "Rejecting…"}
                            </span>
                          ) : (
                            <>
                              {/* View */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleViewTicket(ticket)
                                }
                                title="View full ticket details"
                                className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-admin-subtle/60 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-admin-subtle hover:text-white transition-all"
                              >
                                <Eye size={13} />
                                View
                              </button>

                              {ticket.solvedStatus === "pending" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setConfirmAction({
                                        id: ticket._id,
                                        type: "close",
                                      })
                                    }
                                    title="Mark as solved"
                                    className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-2.5 py-1.5 text-xs font-semibold text-white shadow-[0_2px_8px_rgba(16,185,129,0.25)] hover:from-emerald-500 hover:to-emerald-600 active:scale-[0.97] transition-all"
                                  >
                                    <Check size={13} />
                                    Solve
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setConfirmAction({
                                        id: ticket._id,
                                        type: "reject",
                                      })
                                    }
                                    title="Reject ticket"
                                    className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 hover:text-red-200 active:scale-[0.97] transition-all"
                                  >
                                    <X size={13} />
                                    Reject
                                  </button>
                                </>
                              )}
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
                    {search || statusFilter !== "all"
                      ? "No tickets matching your filters."
                      : "No support tickets found."}
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
