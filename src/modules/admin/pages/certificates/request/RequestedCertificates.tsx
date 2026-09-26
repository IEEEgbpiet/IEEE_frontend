
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

type CertificateRequest = {
  id: string;
  name: string;
  event: string;
  date: string;
};

const requests: CertificateRequest[] = [
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
  const [search, setSearch] = useState("");

 //this is to handle the approve button logic.
  const handleApprove = (requestId: string) => {
    console.log("Approve request:", requestId);

    // TODO: Add approval API call here
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
  }, [search]);

  return (
    <section className="min-h-full w-full text-white">
      {/* Heading and search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row
        sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-wide
          sm:text-2xl">
          Requested Certificates
        </h1>

        <div className="relative w-full sm:max-w-xs">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search requests..."
            aria-label="Search certificate requests"
            className="w-full rounded-lg border border-[#263e68]
              bg-[#101b38] py-2.5 pl-4 pr-10 text-sm
              text-white outline-none placeholder:text-slate-500
              transition focus:border-blue-500
              focus:ring-2 focus:ring-blue-500/20"
          />

          <Search
            size={18}
            className="pointer-events-none absolute right-3
              top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      {/* Requests table */}
      <div className="overflow-hidden rounded-xl border
        border-[#263e68] bg-[#101b38]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]
            border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#263e68]
                bg-[#14264a] text-slate-200">
                <th className="px-5 py-4 font-semibold">
                  Name
                </th>
                <th className="px-5 py-4 font-semibold">
                  Event
                </th>
                <th className="px-5 py-4 font-semibold">
                  Date
                </th>
                <th className="px-5 py-4 font-semibold">
                  Req ID
                </th>
                <th className="px-5 py-4 text-center
                  font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-[#263e68]/70
                      last:border-0 transition-colors
                      hover:bg-[#14264a]/70"
                  >
                    <td className="px-5 py-4 font-medium
                      text-slate-100">
                      {request.name}
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {request.event}
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {request.date}
                    </td>

                    <td className="px-5 py-4 font-mono
                      text-blue-400">
                      {request.id}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleApprove(request.id)}
                        className="rounded-md bg-blue-600
                          px-3 py-1.5 text-xs font-medium
                          text-white transition
                          hover:bg-blue-700
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-blue-400
                          focus-visible:ring-offset-2
                          focus-visible:ring-offset-[#101b38]"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center
                      text-slate-400"
                  >
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Showing {filteredRequests.length} of {requests.length} requests
      </p>
    </section>
  );
}