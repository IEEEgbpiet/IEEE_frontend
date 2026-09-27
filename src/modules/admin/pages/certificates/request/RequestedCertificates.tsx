import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowLeft, User, Calendar, CheckCircle2, Check, Sparkles } from "lucide-react";

type CertificateRequest = {
  id: string;
  name: string;
  event: string;
  date: string;
  approved?: boolean;
};

const initialRequests: CertificateRequest[] = [
  {
    id: "REQ-001",
    name: "Aarav Sharma",
    event: "AI Workshop",
    date: "12 Sep 2026",
  },
  {
    id: "REQ-002",
    name: "Priya Singh",
    event: "Web Development",
    date: "15 Sep 2026",
  },
  {
    id: "REQ-003",
    name: "Rahul Verma",
    event: "Tech Symposium",
    date: "18 Sep 2026",
  },
];

export default function RequestedCertificates() {
  const [requests, setRequests] = useState<CertificateRequest[]>(initialRequests);
  const [search, setSearch] = useState("");

  const handleApprove = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, approved: true } : r))
    );
  };

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return requests;

    return requests.filter((request) =>
      [
        request.name,
        request.event,
        request.date,
        request.id,
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
            Review participant attendance claims and issue verification approvals.
          </p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, event, ID..."
            aria-label="Search certificate requests"
            className="w-full h-10 rounded-xl border border-white/15 bg-admin-card py-2 pl-4 pr-10 text-sm text-white outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
          />
          <Search
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      {/* Modern Table Container */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-admin-subtle/80 text-xs uppercase tracking-wider text-slate-300">
                <th className="px-6 py-4 font-semibold">Attendee Name</th>
                <th className="px-6 py-4 font-semibold">Claimed Event</th>
                <th className="px-6 py-4 font-semibold">Event Date</th>
                <th className="px-6 py-4 font-semibold">Request ID</th>
                <th className="px-6 py-4 text-center font-semibold">Approval Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="group transition-colors duration-200 hover:bg-blue-600/10"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/25 bg-amber-500/10 text-amber-400 group-hover:scale-105 group-hover:border-amber-400/40 group-hover:bg-amber-500/20 transition-all">
                          <User size={16} />
                        </div>
                        <span className="text-white font-medium group-hover:text-amber-200 transition-colors">
                          {request.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {request.event}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-admin-subtle/70 px-3 py-1 text-xs font-medium text-slate-300">
                        <Calendar size={12} className="text-slate-400" />
                        {request.date}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-amber-300 bg-amber-950/40 border border-amber-500/25 px-2.5 py-1 rounded-md">
                        {request.id}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {request.approved ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-300 shadow-[0_2px_12px_rgba(16,185,129,0.2)]">
                          <CheckCircle2 size={13} className="text-emerald-400" />
                          Approved
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApprove(request.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_2px_12px_rgba(43,123,255,0.3)] hover:shadow-[0_2px_18px_rgba(43,123,255,0.45)] hover:from-blue-500 hover:to-blue-600 active:scale-[0.97] transition-all"
                        >
                          <Check size={13} />
                          <span>Approve</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No certificate requests matching &ldquo;{search}&rdquo; found.
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