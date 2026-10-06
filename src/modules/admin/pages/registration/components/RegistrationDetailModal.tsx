import { X, Copy, Check, Users, User, Crown, Mail, Phone, Building } from 'lucide-react';
import { useState } from 'react';
import type { RegistrationRecord } from '@/services/adminApi';

interface RegistrationDetailModalProps {
  registration: RegistrationRecord | null;
  onClose: () => void;
}

export default function RegistrationDetailModal({
  registration,
  onClose,
}: RegistrationDetailModalProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedList, setCopiedList] = useState(false);

  if (!registration) return null;

  const isTeam = registration.mode === 'TEAM';
  const members = registration.members || [];

  const handleCopyId = () => {
    navigator.clipboard.writeText(registration.registrationId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyAll = () => {
    const lines = [
      `Registration ID: ${registration.registrationId}`,
      `Event: ${registration.eventName}`,
      `Date: ${registration.date}`,
      `Mode: ${registration.mode}`,
      registration.teamName ? `Team Name: ${registration.teamName}` : '',
      `Participants:`,
      ...members.map(
        (m, idx) =>
          `  ${idx + 1}. ${m.name} | Roll: ${m.instituteId} | Email: ${m.email} | Phone: ${m.phone} | Branch: ${m.branch} | Year: ${m.year}`
      ),
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(lines);
    setCopiedList(true);
    setTimeout(() => setCopiedList(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-admin-surface border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span
              className={`p-2 rounded-xl ${
                isTeam
                  ? 'bg-indigo-500/15 text-indigo-400'
                  : 'bg-cyan-500/15 text-cyan-400'
              }`}
            >
              {isTeam ? <Users className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isTeam ? `Team Registration: ${registration.teamName}` : 'Individual Registration'}
              </h3>
              <p className="text-xs text-slate-400">{registration.eventName}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-admin-bg rounded-xl border border-white/5 text-xs">
          <div>
            <div className="text-slate-400">Registration ID:</div>
            <div className="flex items-center gap-1 font-mono font-bold text-blue-400 mt-0.5">
              <span>{registration.registrationId}</span>
              <button
                type="button"
                onClick={handleCopyId}
                className="text-slate-400 hover:text-white cursor-pointer"
                title="Copy ID"
              >
                {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div>
            <div className="text-slate-400">Event Date:</div>
            <div className="font-semibold text-white mt-0.5">{registration.date}</div>
          </div>

          <div>
            <div className="text-slate-400">Mode:</div>
            <div className="font-semibold text-white mt-0.5">{registration.mode}</div>
          </div>
        </div>

        {/* Members Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Participants ({members.length})
            </h4>
            <button
              type="button"
              onClick={handleCopyAll}
              className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
            >
              {copiedList ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedList ? 'Copied Full Summary' : 'Copy Full Summary'}
            </button>
          </div>

          <div className="space-y-3">
            {members.map((m, idx) => {
              const isLeader = isTeam && idx === 0;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border space-y-2 ${
                    isLeader
                      ? 'bg-blue-950/30 border-blue-500/30'
                      : 'bg-admin-bg/80 border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{m.name}</span>
                      {isLeader && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          <Crown className="w-3 h-3 text-amber-400" />
                          Team Leader
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md">
                      {m.branch} • Year {m.year}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300 pt-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span>Roll: <span className="text-white">{m.instituteId}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{m.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <a href={`mailto:${m.email}`} className="text-blue-400 hover:underline">
                        {m.email}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
