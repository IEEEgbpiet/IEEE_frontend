import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowLeft, Award, Calendar, Sparkles } from "lucide-react";

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
            History of Issued Certificates
            <Sparkles size={16} className="text-emerald-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Registry of verified and dispatched certificates across IEEE events.
          </p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, event, ID..."
            aria-label="Search certificates"
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
                <th className="px-6 py-4 font-semibold">Event Name</th>
                <th className="px-6 py-4 font-semibold">Certificate ID</th>
                <th className="px-6 py-4 font-semibold">Issue Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredCertificates.length > 0 ? (
                filteredCertificates.map((certificate) => (
                  <tr
                    key={certificate.id}
                    className="group transition-colors duration-200 hover:bg-blue-600/10"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 group-hover:scale-105 group-hover:border-emerald-400/40 group-hover:bg-emerald-500/20 transition-all">
                          <Award size={16} />
                        </div>
                        <span className="text-white font-medium group-hover:text-emerald-200 transition-colors">
                          {certificate.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {certificate.event}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-blue-300 bg-blue-950/40 border border-blue-500/25 px-2.5 py-1 rounded-md">
                        {certificate.id}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-admin-subtle/70 px-3 py-1 text-xs font-medium text-slate-300">
                        <Calendar size={12} className="text-slate-400" />
                        {certificate.issueDate}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No certificates matching &ldquo;{search}&rdquo; found.
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