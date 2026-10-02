import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  Award,
  Calendar,
  Mail,
  GraduationCap,
  Medal,
  Sparkles,
  Loader2,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { adminApi, type CertificateApplication } from "@/services/adminApi";

type MappedCertificate = {
  _id: string;
  certificateId: string;
  name: string;
  email: string;
  branch: string;
  eventName: string;
  date: string;
  position: string;
  issueDate: string;
};

export default function IssuedCertificates() {
  const [certificates, setCertificates] = useState<MappedCertificate[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadCertificates = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminApi.getCertificateApplications();
      const data = (response?.data ?? []) as CertificateApplication[];

      const approved = data
        .filter(
          (item) => String(item.status ?? "").toLowerCase() === "approved"
        )
        .map((item) => ({
          _id: String(item._id ?? ""),
          certificateId: String(
            item.certificateId ?? item._id ?? ""
          ),
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
          position: String(item.position ?? ""),
          issueDate: item.updatedAt
            ? new Date(String(item.updatedAt)).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A",
        }));

      setCertificates(approved);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load certificate data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCertificates();
  }, [loadCertificates]);

  const handleCopyId = (certId: string) => {
    navigator.clipboard.writeText(certId).then(() => {
      setCopiedId(certId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filteredCertificates = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return certificates;

    return certificates.filter((certificate) =>
      [
        certificate.name,
        certificate.email,
        certificate.branch,
        certificate.eventName,
        certificate.certificateId,
        certificate.issueDate,
        certificate.position,
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
            Issued Certificates
            <Sparkles size={16} className="text-emerald-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Registry of approved and dispatched certificates across IEEE events.
          </p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, cert ID..."
            aria-label="Search certificates"
            className="w-full h-10 rounded-xl border border-white/15 bg-admin-card py-2 pl-4 pr-10 text-sm text-white outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
          />
          <Search
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Issued Count Badge */}
      {!loading && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <CheckCircle2 size={12} />
            {filteredCertificates.length} issued certificate
            {filteredCertificates.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Modern Table Container */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-admin-subtle/80 text-xs uppercase tracking-wider text-slate-300">
                <th className="px-5 py-4 font-semibold">Attendee</th>
                <th className="px-5 py-4 font-semibold">Email</th>
                <th className="px-5 py-4 font-semibold">Branch</th>
                <th className="px-5 py-4 font-semibold">Event</th>
                <th className="px-5 py-4 font-semibold">Position</th>
                <th className="px-5 py-4 font-semibold">Certificate ID</th>
                <th className="px-5 py-4 font-semibold">Issued On</th>
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
                        className="animate-spin text-emerald-400"
                      />
                      Loading issued certificates…
                    </div>
                  </td>
                </tr>
              ) : filteredCertificates.length > 0 ? (
                filteredCertificates.map((certificate) => (
                  <tr
                    key={certificate._id}
                    className="group transition-colors duration-200 hover:bg-blue-600/10"
                  >
                    {/* Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 group-hover:scale-105 group-hover:border-emerald-400/40 group-hover:bg-emerald-500/20 transition-all">
                          <Award size={16} />
                        </div>
                        <span className="text-white font-medium group-hover:text-emerald-200 transition-colors">
                          {certificate.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-slate-300 text-xs">
                        <Mail size={12} className="text-slate-400" />
                        {certificate.email}
                      </span>
                    </td>

                    {/* Branch */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-300">
                        <GraduationCap size={12} />
                        {certificate.branch}
                      </span>
                    </td>

                    {/* Event */}
                    <td className="px-5 py-4 text-slate-300 max-w-[180px] truncate">
                      {certificate.eventName}
                    </td>

                    {/* Position */}
                    <td className="px-5 py-4">
                      {certificate.position ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-950/40 px-2.5 py-1 text-xs font-semibold text-amber-300">
                          <Medal size={12} />
                          {certificate.position}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">
                          Participant
                        </span>
                      )}
                    </td>

                    {/* Certificate ID */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleCopyId(certificate.certificateId)}
                        title="Click to copy Certificate ID"
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-500/25 px-2.5 py-1 rounded-md hover:bg-emerald-950/60 hover:border-emerald-500/40 transition-all cursor-pointer"
                      >
                        {copiedId === certificate.certificateId ? (
                          <>
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            {certificate.certificateId}
                          </>
                        )}
                      </button>
                    </td>

                    {/* Issue Date */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-admin-subtle/70 px-3 py-1 text-xs font-medium text-slate-300">
                        <Calendar size={12} className="text-slate-400" />
                        {certificate.issueDate}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-500 text-sm"
                  >
                    {search
                      ? `No issued certificates matching "${search}" found.`
                      : "No issued certificates found."}
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