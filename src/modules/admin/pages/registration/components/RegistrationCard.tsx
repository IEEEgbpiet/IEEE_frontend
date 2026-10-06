import { useState } from 'react';
import {
  Users,
  User,
  Crown,
  Calendar,
  Mail,
  Phone,
  Building,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import type { RegistrationRecord } from '@/services/adminApi';

interface RegistrationCardProps {
  registration: RegistrationRecord;
}

export default function RegistrationCard({ registration }: RegistrationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const isTeam = registration.mode === 'TEAM';
  const members = registration.members || [];

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(registration.registrationId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="bg-admin-surface border border-white/10 rounded-2xl overflow-hidden transition-all duration-200 hover:border-blue-500/20 shadow-md">

      {/* ── Collapsed Summary Row (always visible) ─────────────────── */}
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="w-full text-left px-4 sm:px-5 py-4 flex items-center gap-3 sm:gap-4 hover:bg-white/[0.03] transition-colors cursor-pointer"
      >
        {/* Mode Badge */}
        <span
          className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
            isTeam
              ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25'
              : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
          }`}
        >
          {isTeam ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
          <span className="hidden sm:inline">{isTeam ? 'Team' : 'Individual'}</span>
        </span>

        {/* Main info — grows to fill space */}
        <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3">
          {/* Event Name */}
          <div className="sm:col-span-2 min-w-0">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-none mb-0.5">
              Event
            </div>
            <div className="text-sm sm:text-base font-bold text-white truncate leading-tight">
              {registration.eventName}
            </div>
          </div>

          {/* Team Name OR Participant Name */}
          <div className="min-w-0">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-none mb-0.5">
              {isTeam ? 'Team Name' : 'Participant'}
            </div>
            <div
              className={`text-sm font-semibold truncate leading-tight ${
                isTeam ? 'text-indigo-300' : 'text-cyan-300'
              }`}
            >
              {isTeam ? registration.teamName : members[0]?.name ?? '—'}
            </div>
          </div>
        </div>

        {/* Right Meta: Date + member count + Reg ID */}
        <div className="flex-shrink-0 hidden md:flex flex-col items-end gap-1 text-right">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{registration.date}</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {isTeam
              ? `${members.length} member${members.length !== 1 ? 's' : ''}`
              : 'Individual'}
          </div>

          {/* Registration ID Pill */}
          <div className="flex items-center gap-1 bg-admin-bg border border-white/10 rounded-lg px-2 py-0.5">
            <span className="font-mono text-[10px] font-bold text-blue-400">
              #{registration.registrationId}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="text-slate-400 hover:text-white transition-colors"
              title="Copy ID"
            >
              {copiedId
                ? <Check className="w-2.5 h-2.5 text-emerald-400" />
                : <Copy className="w-2.5 h-2.5" />}
            </button>
          </div>
        </div>

        {/* Expand Arrow */}
        <ChevronRight
          className={`flex-shrink-0 w-5 h-5 text-slate-400 transition-transform duration-200 ${
            expanded ? 'rotate-90 text-blue-400' : ''
          }`}
        />
      </button>

      {/* Mobile-only meta strip */}
      {!expanded && (
        <div className="flex md:hidden items-center justify-between px-4 pb-3 gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{registration.date}</span>
          </div>
          <div className="flex items-center gap-1 bg-admin-bg border border-white/10 rounded-lg px-2 py-0.5">
            <span className="font-mono font-bold text-blue-400">#{registration.registrationId}</span>
            <button type="button" onClick={handleCopyId} className="text-slate-400 hover:text-white">
              {copiedId ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
            </button>
          </div>
          <span>{isTeam ? `${members.length} members` : 'Individual'}</span>
        </div>
      )}

      {/* ── Expanded Detail Panel ────────────────────────────────── */}
      {expanded && (
        <div className="border-t border-white/5 px-4 sm:px-5 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Mobile meta row */}
          <div className="flex md:hidden items-center justify-between text-[11px] text-slate-500 pb-1 border-b border-white/5">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{registration.date}</span>
            </div>
            <div className="flex items-center gap-1 bg-admin-bg border border-white/10 rounded-lg px-2 py-0.5">
              <span className="font-mono font-bold text-blue-400">#{registration.registrationId}</span>
            </div>
          </div>

          {/* Member Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {members.map((m, idx) => {
              const isLeader = isTeam && idx === 0;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border space-y-2.5 text-xs ${
                    isLeader
                      ? 'bg-blue-950/25 border-blue-500/30'
                      : 'bg-admin-bg/70 border-white/5'
                  }`}
                >
                  {/* Member Name + Role */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-white text-sm leading-tight">{m.name}</span>
                    {isLeader ? (
                      <span className="flex-shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/25">
                        <Crown className="w-2.5 h-2.5 text-amber-400" />
                        Leader
                      </span>
                    ) : isTeam ? (
                      <span className="flex-shrink-0 text-[10px] font-semibold text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
                        Member {idx + 1}
                      </span>
                    ) : null}
                  </div>

                  {/* Branch & Year */}
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 font-semibold text-[10px] border border-blue-500/15">
                    {m.branch} · Year {m.year}
                  </div>

                  {/* Details list */}
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Building className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      <span className="truncate">
                        Roll: <span className="text-slate-200">{m.instituteId}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      <span>{m.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Mail className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      <a
                        href={`mailto:${m.email}`}
                        className="truncate text-slate-300 hover:text-blue-400 transition-colors"
                        title={m.email}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {m.email}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
