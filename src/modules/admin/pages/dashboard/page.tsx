import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  const deptStats = [
    { name: "CSE", count: 18 },
    { name: "AIML", count: 12 },
    { name: "EE", count: 9 },
    { name: "ECE", count: 14 },
    { name: "BT", count: 7 },
  ];

  const upcomingEvents = [
    { id: 1, title: "IEEE Tech Symposium 2026", date: "Oct 15, 2026", regs: 142 },
    { id: 2, title: "Robotics & AI Workshop", date: "Oct 28, 2026", regs: 88 },
    { id: 3, title: "National Level Hackathon", date: "Nov 10, 2026", regs: 210 },
  ];

  const supportTickets = [
    { id: "TCK-801", user: "Rohan Verma", subject: "Certificate not received for Web Workshop", status: "Pending" },
    { id: "TCK-802", user: "Ananya Joshi", subject: "Team registration payment query", status: "Open" },
    { id: "TCK-803", user: "Vikram Das", subject: "Speaker session timing clarification", status: "Closed" },
  ];

  return (
    <div className="space-y-6 bg-black text-white">
      {/* 4 Dynamic Area Grid Boxes - As in Page 1 Wireframe */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Box 1: Number of Posts details all details */}
        <div className="flex flex-col justify-between rounded-xl border border-white/15 bg-zinc-950 p-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-base font-semibold text-white">Number of Posts details all details</h2>
              <Link to="/admin/department-posts" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                View <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="mt-4 space-y-2.5">
              {deptStats.map((dept) => (
                <div key={dept.name} className="flex items-center justify-between text-sm py-1 border-b border-white/5 last:border-0">
                  <span className="text-slate-300">{dept.name} Department</span>
                  <span className="font-mono text-xs font-semibold text-white bg-zinc-900 border border-white/10 px-2 py-0.5 rounded">
                    {dept.count} posts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Box 2: Certificates Sent and request in graphical format */}
        <div className="flex flex-col justify-between rounded-xl border border-white/15 bg-zinc-950 p-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-base font-semibold text-white">Certificates Sent and request in graphical format</h2>
              <Link to="/admin/certificates" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                View <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-white/10 bg-zinc-900/60 p-4 text-center">
                <p className="text-xs text-slate-400">Sent (Issued)</p>
                <p className="mt-1 text-3xl font-bold text-white font-mono">148</p>
              </div>

              <div className="rounded-lg border border-white/10 bg-zinc-900/60 p-4 text-center">
                <p className="text-xs text-slate-400">Requests</p>
                <p className="mt-1 text-3xl font-bold text-white font-mono">12</p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-white/10 bg-zinc-900/40 p-3">
              <div className="flex justify-between text-xs text-slate-300 mb-2">
                <span>Distribution Graph</span>
                <span className="font-mono">148 / 160</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden flex">
                <div className="h-full bg-white" style={{ width: "92.5%" }} />
                <div className="h-full bg-zinc-600" style={{ width: "7.5%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Box 3: Upcoming Events Details */}
        <div className="flex flex-col justify-between rounded-xl border border-white/15 bg-zinc-950 p-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-base font-semibold text-white">Upcoming Events Details</h2>
              <Link to="/admin/upcoming-posts" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                View <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="mt-4 space-y-2">
              {upcomingEvents.map((evt) => (
                <div key={evt.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-900/50 p-3">
                  <div>
                    <p className="text-sm font-medium text-white">{evt.title}</p>
                    <p className="text-xs text-slate-400">{evt.date}</p>
                  </div>
                  <span className="font-mono text-xs text-slate-300">{evt.regs} regs</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Box 4: Contact & support details */}
        <div className="flex flex-col justify-between rounded-xl border border-white/15 bg-zinc-950 p-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-base font-semibold text-white">Contact & support details</h2>
              <Link to="/admin/support" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                View <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="mt-4 space-y-2">
              {supportTickets.map((tck) => (
                <div key={tck.id} className="rounded-lg border border-white/10 bg-zinc-900/50 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-slate-400">{tck.id}</span>
                    <span className="text-[11px] text-slate-300 bg-zinc-800 px-2 py-0.5 rounded">
                      {tck.status}
                    </span>
                  </div>
                  <p className="truncate text-xs text-white">{tck.subject}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
