import { useEffect, useState } from "react";
import { adminApi } from '@/services/adminApi';

type Ticket = {
  id: string;
  subject: string;
  email: string;
  file?: string;
  description: string;
  status: "Open" | "Closed";
};

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await adminApi.getSupportTickets();
        const data = response?.tickets ?? [];

        setTickets(
          data.map((item: Record<string, unknown>, index: number) => ({
            id: String((item.ticketId ?? item._id ?? `TCK-${index + 1}`) as string),
            subject: String((item.subject ?? 'Support enquiry') as string),
            email: String((item.email ?? 'unknown@example.com') as string),
            file: '',
            description: String((item.description ?? 'No description available.') as string),
            status: String((item.solvedStatus ?? 'pending') as string).toLowerCase() === 'solved' ? 'Closed' : 'Open',
          })),
        );
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load support tickets.');
      } finally {
        setLoading(false);
      }
    };

    void loadTickets();
  }, []);

  const currentTicket = tickets[selectedIndex] || tickets[0];

  const handleCloseTicket = async () => {
    if (!currentTicket) return;

    try {
      const ticketId = currentTicket.id.includes('TCK') ? currentTicket.id : currentTicket.id;
      await adminApi.closeSupportTicket(String(ticketId));
      setTickets((prev) => prev.map((t, i) => (i === selectedIndex ? { ...t, status: 'Closed' } : t)));
    } catch (closeError) {
      setError(closeError instanceof Error ? closeError.message : 'Unable to close ticket.');
    }
  };

  return (
    <section className="space-y-6 bg-admin-bg text-white max-w-3xl">
      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}
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

      {loading ? <div className="text-sm text-slate-400">Loading tickets…</div> : null}

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
