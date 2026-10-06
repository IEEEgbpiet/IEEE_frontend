import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Layers,
  Award,
  Calendar,
  Headset,
  Sparkles,
  BarChart3,
  ClipboardList,
  Users,
  User,
  UserCheck,
} from "lucide-react";
import {
  DepartmentBarChart,
  DonutChart,
} from "./components/DashboardCharts";
import { adminApi, type RegistrationRecord } from '@/services/adminApi';

type RegistrationSummary = {
  totalRegistrations: number;
  totalParticipants: number;
  totalTeams: number;
  totalIndividuals: number;
};

type DashboardSummary = {
  departmentCounts: Record<string, number>;
  upcomingEvents: Array<{ eventName: string; lastDate: string }>;
  ticketStatus: { pending?: number; rejected?: number; solved?: number };
  certificateStatus: Record<string, number>;
  registrationStats: RegistrationSummary;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>({
    departmentCounts: {},
    upcomingEvents: [],
    ticketStatus: {},
    certificateStatus: {},
    registrationStats: {
      totalRegistrations: 0,
      totalParticipants: 0,
      totalTeams: 0,
      totalIndividuals: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const [
          departmentResponse,
          eventsResponse,
          supportResponse,
          certificateResponse,
          registrationResponse,
        ] = await Promise.all([
          adminApi.getDashboardDepartmentCounts(),
          adminApi.getDashboardEvents(),
          adminApi.getDashboardSupportSummary(),
          adminApi.getDashboardCertificateSummary(),
          adminApi.getAllRegistrations().catch(() => ({ success: false, data: [] })),
        ]);

        // Handle both { success: true, data: { ... } } and direct object returns
        const extractObject = <T extends Record<string, unknown>>(res: unknown): T => {
          if (res && typeof res === 'object') {
            if ('data' in res && res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
              return res.data as T;
            }
            return res as T;
          }
          return {} as T;
        };

        const certData = extractObject<Record<string, number>>(certificateResponse);
        const deptData = extractObject<Record<string, number>>(departmentResponse);
        const supportData = extractObject<{ pending?: number; rejected?: number; solved?: number }>(supportResponse);
        const eventData = (eventsResponse && typeof eventsResponse === 'object' && 'data' in eventsResponse && Array.isArray(eventsResponse.data))
          ? eventsResponse.data
          : (Array.isArray(eventsResponse) ? eventsResponse : []);

        const regList: RegistrationRecord[] = (registrationResponse && typeof registrationResponse === 'object' && 'data' in registrationResponse && Array.isArray((registrationResponse as { data: unknown }).data))
          ? (registrationResponse as { data: RegistrationRecord[] }).data
          : (Array.isArray(registrationResponse) ? (registrationResponse as RegistrationRecord[]) : []);

        let regParticipants = 0;
        let regTeams = 0;
        let regIndividuals = 0;

        for (const r of regList) {
          regParticipants += (r.members || []).length;
          if (r.mode === 'TEAM') regTeams++;
          else regIndividuals++;
        }

        setSummary({
          departmentCounts: deptData,
          upcomingEvents: eventData,
          ticketStatus: supportData,
          certificateStatus: certData,
          registrationStats: {
            totalRegistrations: regList.length,
            totalParticipants: regParticipants,
            totalTeams: regTeams,
            totalIndividuals: regIndividuals,
          },
        });
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const deptStats = useMemo(
    () =>
      Object.entries(summary.departmentCounts).map(([name, count]) => ({
        name,
        count,
      })),
    [summary.departmentCounts],
  );

  const upcomingEvents = useMemo(
    () =>
      (summary.upcomingEvents ?? []).map((event, index) => ({
        id: index + 1,
        title: event.eventName,
        date: event.lastDate
          ? new Date(event.lastDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'Date unavailable',
      })),
    [summary.upcomingEvents],
  );

  const certApproved = Number(summary.certificateStatus.approved ?? 0);
  const certPending = Number(summary.certificateStatus.pending ?? 0);
  const certRejected = Number(summary.certificateStatus.rejected ?? 0);
  const certTotal = certApproved + certPending + certRejected;
  const certFulfillmentPct = certTotal > 0 ? ((certApproved / certTotal) * 100).toFixed(1) : '0';

  const certificateMix = [
    { label: 'Approved', value: certApproved, color: '#38bdf8' },
    { label: 'Pending', value: certPending, color: '#fbbf24' },
    { label: 'Rejected', value: certRejected, color: '#f87171' },
  ];

  const supportStatus = [
    { label: 'Pending', value: Number(summary.ticketStatus.pending ?? 0), color: '#fbbf24' },
    { label: 'Rejected', value: Number(summary.ticketStatus.rejected ?? 0), color: '#f87171' },
    { label: 'Solved', value: Number(summary.ticketStatus.solved ?? 0), color: '#34d399' },
  ];

  return (
    <div className="space-y-8 bg-admin-bg text-white">
      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}


      {/* Event Registrations KPI Overview Section (Moved from Event Registration page) */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/25 bg-blue-600/15 text-blue-400">
              <ClipboardList size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">
                  Event Registrations
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Live Entries
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Participant signups, team compositions, and verification stats
              </p>
            </div>
          </div>

          <Link
            to="/admin/registration"
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-white/10 bg-admin-subtle/80 hover:bg-blue-600/20 hover:border-blue-400/40 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-blue-300 transition-all cursor-pointer"
          >
            <span>Manage Registrations</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
          {/* Total Entries */}
          <Link
            to="/admin/registration"
            className="rounded-xl border border-white/10 bg-admin-subtle/60 p-4 transition-all hover:border-blue-400/30 hover:bg-blue-950/20 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Total Entries</span>
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-4 h-4" />
              </div>
            </div>
            {loading ? (
              <div className="mt-3 h-8 w-16 animate-pulse rounded bg-white/10" />
            ) : (
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
                {summary.registrationStats.totalRegistrations}
              </p>
            )}
            <p className="mt-1 text-[11px] text-slate-400">Submitted registrations</p>
          </Link>

          {/* Total Students */}
          <Link
            to="/admin/registration"
            className="rounded-xl border border-white/10 bg-admin-subtle/60 p-4 transition-all hover:border-indigo-400/30 hover:bg-indigo-950/20 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Total Students</span>
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            {loading ? (
              <div className="mt-3 h-8 w-16 animate-pulse rounded bg-white/10" />
            ) : (
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-indigo-300 font-mono tracking-tight">
                {summary.registrationStats.totalParticipants}
              </p>
            )}
            <p className="mt-1 text-[11px] text-indigo-400/80">Enrolled participants</p>
          </Link>

          {/* Teams */}
          <Link
            to="/admin/registration"
            className="rounded-xl border border-white/10 bg-admin-subtle/60 p-4 transition-all hover:border-emerald-400/30 hover:bg-emerald-950/20 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Teams</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            {loading ? (
              <div className="mt-3 h-8 w-16 animate-pulse rounded bg-white/10" />
            ) : (
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-400 font-mono tracking-tight">
                {summary.registrationStats.totalTeams}
              </p>
            )}
            <p className="mt-1 text-[11px] text-emerald-400/80">Multi-member squads</p>
          </Link>

          {/* Individuals */}
          <Link
            to="/admin/registration"
            className="rounded-xl border border-white/10 bg-admin-subtle/60 p-4 transition-all hover:border-amber-400/30 hover:bg-amber-950/20 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Individual</span>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                <User className="w-4 h-4" />
              </div>
            </div>
            {loading ? (
              <div className="mt-3 h-8 w-16 animate-pulse rounded bg-white/10" />
            ) : (
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-amber-300 font-mono tracking-tight">
                {summary.registrationStats.totalIndividuals}
              </p>
            )}
            <p className="mt-1 text-[11px] text-amber-400/80">Solo participants</p>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface p-6 sm:p-7 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_12px_32px_rgba(43,123,255,0.12)]">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/25 bg-blue-600/15 text-blue-400">
                  <Layers size={20} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white group-hover:text-blue-200 transition-colors">
                    Department Posts Details
                  </h2>
                  <p className="text-xs text-slate-400">Activity breakdown by engineering domain</p>
                </div>
              </div>

              <Link
                to="/admin/department-posts"
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-admin-subtle/80 px-2.5 py-1 text-xs font-medium text-slate-300 transition-all hover:border-blue-400/40 hover:bg-blue-600/20 hover:text-blue-300"
              >
                <span>View</span>
                <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="mt-5">
              {loading ? (
                <div className="space-y-4" role="status" aria-label="Loading department metrics">
                  {[0, 1, 2, 3].map((item) => (
                    <div key={item} className="animate-pulse space-y-2">
                      <div className="h-3 w-1/3 rounded bg-white/10" />
                      <div className="h-2.5 w-full rounded-full bg-white/10" />
                    </div>
                  ))}
                  <span className="sr-only">Loading department metrics</span>
                </div>
              ) : deptStats.length ? (
                <DepartmentBarChart data={deptStats.map((dept) => ({ label: dept.name, value: dept.count, color: '#60a5fa' }))} />
              ) : (
                <div className="text-sm text-slate-400">No department data available.</div>
              )}
            </div>
          </div>
        </div>

        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface p-6 sm:p-7 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_12px_32px_rgba(6,182,212,0.12)]">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/25 bg-cyan-600/15 text-cyan-400">
                  <Award size={20} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white group-hover:text-cyan-200 transition-colors">
                    Certificates Analytics
                  </h2>
                  <p className="text-xs text-slate-400">Issued credentials & pending claims</p>
                </div>
              </div>

              <Link
                to="/admin/certificates"
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-admin-subtle/80 px-2.5 py-1 text-xs font-medium text-slate-300 transition-all hover:border-cyan-400/40 hover:bg-cyan-600/20 hover:text-cyan-300"
              >
                <span>View</span>
                <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">
              <div className="rounded-xl border border-white/10 bg-admin-subtle/60 p-3 sm:p-4 text-center transition-all hover:border-blue-400/30 hover:bg-blue-950/20">
                <p className="text-xs font-medium text-slate-400">Sent (Issued)</p>
                {loading ? (
                  <div className="mx-auto mt-2 h-8 w-12 animate-pulse rounded bg-white/10" />
                ) : (
                  <p className="mt-1 text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
                    {certApproved}
                  </p>
                )}
                {!loading && (
                  <span className="mt-1 inline-block text-[11px] text-emerald-400 font-medium">
                    {certFulfillmentPct}% fulfilled
                  </span>
                )}
              </div>

              <div className="rounded-xl border border-white/10 bg-admin-subtle/60 p-3 sm:p-4 text-center transition-all hover:border-amber-400/30 hover:bg-amber-950/20">
                <p className="text-xs font-medium text-slate-400">Requests</p>
                {loading ? (
                  <div className="mx-auto mt-2 h-8 w-12 animate-pulse rounded bg-white/10" />
                ) : (
                  <p className="mt-1 text-2xl sm:text-3xl font-bold text-amber-300 font-mono tracking-tight">
                    {certPending}
                  </p>
                )}
                {!loading && (
                  <span className="mt-1 inline-block text-[11px] text-amber-400 font-medium">
                    {certPending > 0 ? "Action required" : "All reviewed"}
                  </span>
                )}
              </div>

              <div className="rounded-xl border border-white/10 bg-admin-subtle/60 p-3 sm:p-4 text-center transition-all hover:border-rose-400/30 hover:bg-rose-950/20">
                <p className="text-xs font-medium text-slate-400">Rejected</p>
                {loading ? (
                  <div className="mx-auto mt-2 h-8 w-12 animate-pulse rounded bg-white/10" />
                ) : (
                  <p className="mt-1 text-2xl sm:text-3xl font-bold text-rose-400 font-mono tracking-tight">
                    {certRejected}
                  </p>
                )}
                {!loading && (
                  <span className="mt-1 inline-block text-[11px] text-rose-400/80 font-medium">
                    {certRejected > 0 ? "Declined" : "0 declined"}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-admin-subtle/40 p-4">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <BarChart3 size={14} className="text-cyan-400" />
                  Distribution Ratio
                </span>
                <span className="font-mono text-xs text-cyan-300">
                  {certApproved} / {certTotal || 1} Total
                </span>
              </div>
              {loading ? (
                <div className="flex min-h-32 items-center gap-4 animate-pulse" role="status" aria-label="Loading certificate metrics">
                  <div className="h-32 w-32 shrink-0 rounded-full border-[14px] border-white/10" />
                  <div className="flex-1 space-y-3">
                    {[0, 1, 2].map((item) => <div key={item} className="h-3 rounded bg-white/10" />)}
                  </div>
                  <span className="sr-only">Loading certificate metrics</span>
                </div>
              ) : (
                <DonutChart data={certificateMix} />
              )}
            </div>
          </div>
        </div>

        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface p-6 sm:p-7 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-[0_12px_32px_rgba(99,102,241,0.12)]">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/25 bg-indigo-600/15 text-indigo-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white group-hover:text-indigo-200 transition-colors">
                    Upcoming Events Schedule
                  </h2>
                  <p className="text-xs text-slate-400">Upcoming workshops & symposiums</p>
                </div>
              </div>

              <Link
                to="/admin/upcoming-posts"
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-admin-subtle/80 px-2.5 py-1 text-xs font-medium text-slate-300 transition-all hover:border-indigo-400/40 hover:bg-indigo-600/20 hover:text-indigo-300"
              >
                <span>View</span>
                <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="mt-5 space-y-2.5">
              {loading ? (
                <div className="space-y-2.5" role="status" aria-label="Loading upcoming events">
                  {[0, 1].map((item) => (
                    <div key={item} className="flex animate-pulse items-center gap-3 rounded-xl border border-white/10 bg-admin-subtle/50 p-3.5">
                      <div className="h-8 w-8 shrink-0 rounded-lg bg-white/10" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/5 rounded bg-white/10" />
                        <div className="h-2.5 w-1/3 rounded bg-white/10" />
                      </div>
                    </div>
                  ))}
                  <span className="sr-only">Loading upcoming events</span>
                </div>
              ) : null}
              {!loading && upcomingEvents.length === 0 ? (
                <div className="text-sm text-slate-400">No upcoming events available.</div>
              ) : null}
              {!loading && upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-admin-subtle/50 p-3.5 transition-all hover:border-indigo-400/30 hover:bg-indigo-950/20"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                      <Calendar size={14} />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium text-white truncate">{evt.title}</p>
                      <p className="text-xs text-slate-400">{evt.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface p-6 sm:p-7 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-[0_12px_32px_rgba(168,85,247,0.12)]">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/25 bg-purple-600/15 text-purple-400">
                  <Headset size={20} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white group-hover:text-purple-200 transition-colors">
                    Contact & Support Inquiries
                  </h2>
                  <p className="text-xs text-slate-400">Active queries & member assistance</p>
                </div>
              </div>

              <Link
                to="/admin/support"
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-admin-subtle/80 px-2.5 py-1 text-xs font-medium text-slate-300 transition-all hover:border-purple-400/40 hover:bg-purple-600/20 hover:text-purple-300"
              >
                <span>View</span>
                <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-admin-subtle/40 p-4">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-300">
                <span className="font-medium">Inquiries by status</span>
                <span className="font-mono text-purple-300">
                  {supportStatus.reduce((total, status) => total + status.value, 0)} total
                </span>
              </div>
              {loading ? (
                <div className="flex min-h-32 items-center gap-4 animate-pulse" role="status" aria-label="Loading support summary">
                  <div className="h-32 w-32 shrink-0 rounded-full border-[14px] border-white/10" />
                  <div className="flex-1 space-y-3">
                    {[0, 1, 2].map((item) => <div key={item} className="h-3 rounded bg-white/10" />)}
                  </div>
                  <span className="sr-only">Loading support summary</span>
                </div>
              ) : (
                <DonutChart data={supportStatus} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
