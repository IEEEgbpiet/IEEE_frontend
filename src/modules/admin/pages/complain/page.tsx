import { useState } from "react";

type Ticket = {
  id: string;
  subject: string;
  email: string;
  file?: string;
  description: string;
  status: "Open" | "Closed";
};

const initialTickets: Ticket[] = [
  {
    id: "TCK-801",
    subject: "Certificate not received for Web Workshop",
    email: "rohan.verma@gbpiet.ac.in",
    file: "receipt.pdf",
    description: "I attended the workshop but my certificate verification ID is not showing up. Please verify and issue the certificate.",
    status: "Open",
  },
  {
    id: "TCK-802",
    subject: "Team registration payment query",
    email: "ananya.joshi@gbpiet.ac.in",
    file: "payment_ss.png",
    description: "Our team registered for the hackathon and completed payment. Need confirmation.",
    status: "Open",
  },
];

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentTicket = tickets[selectedIndex] || tickets[0];

  const handleCloseTicket = () => {
    setTickets((prev) =>
      prev.map((t, i) => (i === selectedIndex ? { ...t, status: "Closed" } : t))
    );
  };

  return (
    <section className="space-y-6 bg-admin-bg text-white max-w-3xl">
      <div className="border-b border-white/10 pb-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">
          Full View of Ticket
        </h1>

        <div className="flex gap-2">
          {tickets.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`px-2.5 py-1 text-xs rounded border transition ${
                idx === selectedIndex
                  ? "bg-brand-blue text-white border-brand-blue"
                  : "bg-admin-card text-slate-400 border-white/10 hover:bg-admin-card-hover hover:text-white"
              }`}
            >
              {t.id}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket View matching Page 15 Wireframe */}
      {currentTicket && (
        <div className="space-y-4">
          {/* Top Row: Subject, File, Email */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Subject
              </label>
              <div className="h-10 rounded-lg border border-white/15 bg-admin-card px-3 flex items-center text-sm text-white truncate">
                {currentTicket.subject}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                File
              </label>
              <div className="h-10 rounded-lg border border-white/15 bg-admin-card px-3 flex items-center text-sm text-slate-300 truncate">
                {currentTicket.file || "No attachment"}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Email
              </label>
              <div className="h-10 rounded-lg border border-white/15 bg-admin-card px-3 flex items-center text-sm text-slate-300 truncate">
                {currentTicket.email}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Description
            </label>
            <div className="min-h-[140px] rounded-lg border border-white/15 bg-admin-card p-3.5 text-sm text-slate-200">
              {currentTicket.description}
            </div>
          </div>

          {/* Close Ticket Button */}
          <div className="pt-2 flex items-center justify-center">
            {currentTicket.status === "Open" ? (
              <button
                type="button"
                onClick={handleCloseTicket}
                className="rounded-lg border border-white/20 bg-admin-card px-6 py-2.5 text-xs font-semibold text-white hover:bg-admin-card-hover transition"
              >
                Close Ticket
              </button>
            ) : (
              <span className="text-xs text-emerald-400 font-semibold border border-emerald-500/30 bg-emerald-950/30 px-4 py-2 rounded-lg">
                Ticket Closed & Resolved
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
