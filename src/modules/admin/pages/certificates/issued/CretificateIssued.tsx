import { useMemo, useState } from "react";
import { Search } from "lucide-react";

type Certificate = {
  id: string;
  name: string;
  event: string;
  issueDate: string;
};

const initialCertificates: Certificate[] = [
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
  const [certificates] = useState<Certificate[]>(initialCertificates);
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
  }, [certificates, search]);

  return (
    <section className="space-y-6 bg-black text-white">
      {/* Heading and Search - Exactly as in Page 3 Wireframe */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
        <h1 className="text-xl font-semibold tracking-wide text-white">
          History of Issued Certificated
        </h1>

        <div className="relative w-full sm:max-w-xs">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            aria-label="Search certificates"
            className="w-full rounded-lg border border-white/15 bg-zinc-950 py-2 pl-4 pr-10 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-white/40"
          />
          <Search
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      {/* Table Container - Exactly as in Page 3 Wireframe */}
      <div className="overflow-hidden rounded-xl border border-white/15 bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-zinc-900 text-slate-200">
                <th className="px-5 py-3.5 font-semibold">Name</th>
                <th className="px-5 py-3.5 font-semibold">Event</th>
                <th className="px-5 py-3.5 font-semibold">ID</th>
                <th className="px-5 py-3.5 font-semibold">Issue Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredCertificates.length > 0 ? (
                filteredCertificates.map((certificate) => (
                  <tr
                    key={certificate.id}
                    className="border-b border-white/5 last:border-0 hover:bg-zinc-900/40"
                  >
                    <td className="px-5 py-4 text-white font-medium">
                      {certificate.name}
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {certificate.event}
                    </td>

                    <td className="px-5 py-4 font-mono text-slate-300 text-xs">
                      {certificate.id}
                    </td>

                    <td className="px-5 py-4 text-slate-400 text-xs">
                      {certificate.issueDate}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-slate-500">
                    No certificates found.
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