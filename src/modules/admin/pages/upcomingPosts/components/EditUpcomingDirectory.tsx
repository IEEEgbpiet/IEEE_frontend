import { useState } from "react";
import { useNavigate } from "react-router-dom";

type UpcomingEvent = {
  id: string;
  name: string;
  date: string;
};

const initialEvents: UpcomingEvent[] = [
  {
    id: "EVT-01",
    name: "IEEE Tech Symposium 2026",
    date: "15 Oct 2026",
  },
  {
    id: "EVT-02",
    name: "Robotics & AI Workshop",
    date: "28 Oct 2026",
  },
  {
    id: "EVT-03",
    name: "National Level Hackathon",
    date: "10 Nov 2026",
  },
];

export default function EditUpcomingDirectory() {
  const navigate = useNavigate();
  const [events] = useState<UpcomingEvent[]>(initialEvents);

  return (
    <section className="space-y-6 bg-black text-white">
      <div className="border-b border-white/10 pb-3">
        <h1 className="text-xl font-semibold text-white">
          Edit posts Directory
        </h1>
      </div>

      {/* Table matching Page 8 Wireframe */}
      <div className="overflow-hidden rounded-xl border border-white/15 bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-zinc-900 text-slate-200">
                <th className="px-5 py-3.5 font-semibold">Event Name</th>
                <th className="px-5 py-3.5 font-semibold">Date</th>
                <th className="px-5 py-3.5 text-center font-semibold">Edit</th>
              </tr>
            </thead>

            <tbody>
              {events.map((evt) => (
                <tr
                  key={evt.id}
                  className="border-b border-white/5 last:border-0 hover:bg-zinc-900/40"
                >
                  <td className="px-5 py-4 text-white font-medium">
                    {evt.name}
                  </td>

                  <td className="px-5 py-4 text-slate-400 text-xs">
                    {evt.date}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/upcoming-posts/edit/${evt.id}`)}
                      className="rounded-md border border-white/20 bg-zinc-800 px-3 py-1 text-xs font-medium text-white transition hover:bg-zinc-700"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
