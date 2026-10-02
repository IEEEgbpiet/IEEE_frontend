import { useState } from 'react';
import { pastMembers2026, pastMembers2025, type PastMember } from '@/data/teams/previousmemeber';

export function PreviousMember() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const renderMemberList = (members: PastMember[], batchYear: string) => (
    <div className="p-4 border-t border-cyan-500/20 divide-y divide-cyan-500/10">
      {members.map((m, idx) => (
        <div
          key={idx}
          className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 px-2 hover:bg-cyan-500/5 rounded-lg transition-colors gap-1"
        >
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-mono text-sm">#{idx + 1}</span>
            <span className="text-white font-medium text-base">{m.name}</span>
          </div>
          <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300 max-sm:ml-7">
            {m.role && (
              <span className="text-cyan-400/80 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {m.role}
              </span>
            )}
            <span className="text-slate-400 font-mono">({batchYear})</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mt-20 border-t border-cyan-500/30 pt-10 px-4 sm:px-6">
      <h2 className="text-2xl font-bold text-center text-cyan-400 mb-8">Previous Year Members</h2>

      <div className="space-y-4 max-w-4xl mx-auto">
        {/* Batch 2026 Passout Dropdown */}
        <div className="border border-cyan-500/40 rounded-xl bg-slate-950/60 overflow-hidden backdrop-blur-sm">
          <button
            onClick={() => toggleSection('2026')}
            className="w-full flex justify-between items-center p-4 text-left text-lg font-semibold text-white hover:bg-cyan-500/10 transition-colors"
          >
            <span>Batch 2026 Passout</span>
            <span className="text-cyan-400 text-2xl font-bold">
              {openSection === '2026' ? '−' : '+'}
            </span>
          </button>

          {openSection === '2026' && renderMemberList(pastMembers2026, '2026')}
        </div>

        {/* Batch 2025 Passout Dropdown */}
        <div className="border border-cyan-500/40 rounded-xl bg-slate-950/60 overflow-hidden backdrop-blur-sm">
          <button
            onClick={() => toggleSection('2025')}
            className="w-full flex justify-between items-center p-4 text-left text-lg font-semibold text-white hover:bg-cyan-500/10 transition-colors"
          >
            <span>Batch 2025 Passout</span>
            <span className="text-cyan-400 text-2xl font-bold">
              {openSection === '2025' ? '−' : '+'}
            </span>
          </button>

          {openSection === '2025' && renderMemberList(pastMembers2025, '2025')}
        </div>
      </div>
    </div>
  );
}