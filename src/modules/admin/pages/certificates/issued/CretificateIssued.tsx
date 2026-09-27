
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

type Certificate = {
  id: string;
  name: string;
  event: string;
  issueDate: string;
};

//Faltu data hai.Replace with api req here.
const certificates: Certificate[] = [
  {
    id: "CERT-001",
    name: "Aarav Sharma",
    event: "Web Development Workshop",
    issueDate: "12 Sep 2026", 
  },
  {
    id: "CERT-002",
    name: "Priya Singh",
    event: "AI Workshop",
    issueDate: "15 Sep 2026",
  },
  {
    id: "CERT-003",
    name: "Rahul Verma",
    event: "Technical Symposium",
    issueDate: "18 Sep 2026",
  },
];

export default function IssuedCertificates() {
  const [search, setSearch] = useState("");

  const filteredCertificates = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return certificates;

    return certificates.filter((certificate) =>
      [
        certificate.name,
        certificate.event,
        certificate.id,
        certificate.issueDate,
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [search]);

  return (
    <section className="min-h-full w-full text-white">
      {/* Page heading and search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row
        sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-wide
          sm:text-2xl">
          Issued Certificates
        </h1>

        <div className="relative w-full sm:max-w-xs">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search certificates..."
            aria-label="Search certificates"
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

      {/* Certificates table */}
      <div className="overflow-hidden rounded-xl border
        border-[#263e68] bg-[#101b38]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]
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
                  ID
                </th>
                <th className="px-5 py-4 font-semibold">
                  Issue Date
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCertificates.length > 0 ? (
                filteredCertificates.map((certificate) => (
                  <tr
                    key={certificate.id}
                    className="border-b border-[#263e68]/70
                      last:border-0 transition-colors
                      hover:bg-[#14264a]/70"
                  >
                    <td className="px-5 py-4 font-medium
                      text-slate-100">
                      {certificate.name}
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {certificate.event}
                    </td>

                    <td className="px-5 py-4 font-mono
                      text-blue-400">
                      {certificate.id}
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {certificate.issueDate}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-12 text-center
                      text-slate-400"
                  >
                    No certificates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Showing {filteredCertificates.length} of{" "}
        {certificates.length} certificates
      </p>
    </section>
  );
}