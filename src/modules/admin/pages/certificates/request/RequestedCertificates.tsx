import { useMemo, useState } from "react";
import { Search } from "lucide-react";

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
    <section className="space-y-6 bg-black text-white">
      {/* Heading and Search - Exactly as in Page 4 Wireframe */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
        <h1 className="text-xl font-semibold tracking-wide text-white">
          Requested Certificates
        </h1>

        <div className="relative w-full sm:max-w-xs">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            aria-label="Search certificate requests"
            className="w-full rounded-lg border border-white/15 bg-zinc-950 py-2 pl-4 pr-10 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-white/40"
          />
          <Search
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      {/* Table Container - Exactly as in Page 4 Wireframe */}
      <div className="overflow-hidden rounded-xl border border-white/15 bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-zinc-900 text-slate-200">
                <th className="px-5 py-3.5 font-semibold">Name</th>
                <th className="px-5 py-3.5 font-semibold">Event</th>
                <th className="px-5 py-3.5 font-semibold">Date</th>
                <th className="px-5 py-3.5 font-semibold">Req ID</th>
                <th className="px-5 py-3.5 text-center font-semibold">Approve</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-white/5 last:border-0 hover:bg-zinc-900/40"
                  >
                    <td className="px-5 py-4 text-white font-medium">
                      {request.name}
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {request.event}
                    </td>

                    <td className="px-5 py-4 text-slate-400 text-xs">
                      {request.date}
                    </td>

                    <td className="px-5 py-4 font-mono text-slate-300 text-xs">
                      {request.id}
                    </td>

                    <td className="px-5 py-4 text-center">
                      {request.approved ? (
                        <span className="text-xs text-emerald-400 font-semibold">
                          Approved
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApprove(request.id)}
                          className="rounded-md border border-white/20 bg-zinc-800 px-3 py-1 text-xs font-medium text-white transition hover:bg-zinc-700"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                    No requests found.
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