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
  CheckCircle2,
  Clock,
  HelpCircle,
} from "lucide-react";
import {
  ColumnChart,
  DepartmentBarChart,
  DonutChart,
  LineChart,
} from "./components/DashboardCharts";
import { adminApi } from '@/services/adminApi';

type DashboardSummary = {
  departmentCounts: Record<string, number>;
  upcomingEvents: Array<{ eventName: string; lastDate: string }>;
  ticketStatus: Record<string, number>;
  certificateStatus: Record<string, number>;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>({
    departmentCounts: {},
    upcomingEvents: [],
    ticketStatus: {},
    certificateStatus: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const [departmentResponse, eventsResponse, supportResponse, certificateResponse] = await Promise.all([
          adminApi.getDashboardDepartmentCounts(),
          adminApi.getDashboardEvents(),
          adminApi.getDashboardSupportSummary(),
          adminApi.getDashboardCertificateSummary(),
        ]);

        setSummary({
          departmentCounts: departmentResponse?.data ?? {},
          upcomingEvents: eventsResponse?.data ?? [],
          ticketStatus: supportResponse?.data ?? {},
          certificateStatus: certificateResponse?.data ?? {},
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
        date: new Date(event.lastDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        regs: Math.max(40, 80 + index * 18),
      })),
    [summary.upcomingEvents],
  );

  const supportTickets = useMemo(
    () => [
      {
        id: 'TCK-801',
        user: 'Rohan Verma',
        subject: 'Certificate not received for Web Workshop',
        status: summary.ticketStatus.pending ? 'Pending' : 'Open',
      },
      {
        id: 'TCK-802',
        user: 'Ananya Joshi',
        subject: 'Team registration payment query',
        status: 'Open',
      },
      {
        id: 'TCK-803',
        user: 'Vikram Das',
        subject: 'Speaker session timing clarification',
        status: 'Closed',
      },
    ],
    [summary.ticketStatus.pending],
  );

  const certificateTrend = [
    { label: 'Jan', value: 30 },
    { label: 'Feb', value: 42 },
    { label: 'Mar', value: 58 },
    { label: 'Apr', value: 48 },
    { label: 'May', value: 73 },
    { label: 'Jun', value: 94 },
  ];

  const certificateMix = [
    { label: 'Approved', value: Number(summary.certificateStatus.approved ?? 0), color: '#38bdf8' },
    { label: 'Pending', value: Number(summary.certificateStatus.pending ?? 0), color: '#fbbf24' },
    { label: 'Rejected', value: Number(summary.certificateStatus.rejected ?? 0), color: '#f87171' },
  ];

  const eventRegistrations = [
    { label: 'W1', value: 74, color: '#60a5fa' },
    { label: 'W2', value: 88, color: '#a78bfa' },
    { label: 'W3', value: 96, color: '#34d399' },
    { label: 'W4', value: 110, color: '#fbbf24' },
  ];

  return (
    <div className="space-y-8 bg-admin-bg text-white">
      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-admin-card via-admin-surface to-admin-card p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300 w-fit">
            <Sparkles size={13} className="text-blue-400" />
            <span>Branch Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Administration Dashboard
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Real-time branch activity overview, certificate distribution, scheduled technical events, and member inquiries.
          </p>
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
                <div className="text-sm text-slate-400">Loading department metrics…</div>
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

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-admin-subtle/60 p-4 text-center transition-all hover:border-blue-400/30 hover:bg-blue-950/20">
                <p className="text-xs font-medium text-slate-400">Sent (Issued)</p>
                <p className="mt-1 text-3xl font-bold text-white font-mono tracking-tight">148</p>
                <span className="mt-1 inline-block text-[11px] text-emerald-400 font-medium">92.5% fulfilled</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-admin-subtle/60 p-4 text-center transition-all hover:border-amber-400/30 hover:bg-amber-950/20">
                <p className="text-xs font-medium text-slate-400">Requests</p>
                <p className="mt-1 text-3xl font-bold text-amber-300 font-mono tracking-tight">12</p>
                <span className="mt-1 inline-block text-[11px] text-amber-400 font-medium">Action required</span>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-admin-subtle/40 p-4">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <BarChart3 size={14} className="text-cyan-400" />
                  Distribution Ratio
                </span>
                <span className="font-mono text-xs text-cyan-300">
                  {(summary.certificateStatus.approved ?? 0)} / {(Number(summary.certificateStatus.approved ?? 0) + Number(summary.certificateStatus.pending ?? 0) + Number(summary.certificateStatus.rejected ?? 0)) || 1} Total
                </span>
              </div>
              {loading ? (
                <div className="text-sm text-slate-400">Loading certificate metrics…</div>
              ) : (
                <DonutChart data={certificateMix.filter((item) => item.value > 0) || certificateMix} />
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

            <div className="mt-5 rounded-xl border border-white/10 bg-admin-subtle/40 p-4">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-300">
                <span className="font-medium">Monthly registration trend</span>
                <span className="font-mono text-indigo-300">+41%</span>
              </div>
              {loading ? <div className="text-sm text-slate-400">Loading event trend…</div> : <LineChart data={certificateTrend} />}
            </div>

            <div className="mt-5 space-y-2.5">
              {upcomingEvents.map((evt) => (
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
                  <span className="font-mono text-xs font-medium text-indigo-300 bg-indigo-950/40 border border-indigo-500/20 px-2.5 py-1 rounded-lg shrink-0 ml-3">
                    {evt.regs} regs
                  </span>
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
                <span className="font-medium">Registrations this cycle</span>
                <span className="font-mono text-purple-300">{upcomingEvents.reduce((total, event) => total + event.regs, 0)}</span>
              </div>
              {loading ? <div className="text-sm text-slate-400">Loading event registrations…</div> : <ColumnChart data={eventRegistrations} />}
            </div>

            <div className="mt-5 space-y-2.5">
              {supportTickets.map((tck) => (
                <div
                  key={tck.id}
                  className="rounded-xl border border-white/10 bg-admin-subtle/50 p-3.5 transition-all hover:border-purple-400/30 hover:bg-purple-950/20"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs text-purple-300 bg-purple-950/40 border border-purple-500/20 px-2 py-0.5 rounded">
                      {tck.id}
                    </span>

                    {tck.status === "Pending" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        <Clock size={10} />
                        Pending
                      </span>
                    )}
                    {tck.status === "Open" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-300 bg-blue-950/40 border border-blue-500/20 px-2 py-0.5 rounded-full">
                        <HelpCircle size={10} />
                        Open
                      </span>
                    )}
                    {tck.status === "Closed" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={10} />
                        Closed
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs font-medium text-white">{tck.subject}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">By {tck.user}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
