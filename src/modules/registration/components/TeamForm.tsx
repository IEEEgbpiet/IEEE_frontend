import { Users, Plus, Trash2, Crown } from 'lucide-react';
import MemberFields from './MemberFields';
import type { MemberFormState } from '../types';

interface TeamFormProps {
  teamName: string;
  onTeamNameChange: (name: string) => void;
  members: MemberFormState[];
  onMemberChange: (index: number, field: keyof MemberFormState, value: string | number) => void;
  onAddMember: () => void;
  onRemoveMember: (index: number) => void;
}

export default function TeamForm({
  teamName,
  onTeamNameChange,
  members,
  onMemberChange,
  onAddMember,
  onRemoveMember,
}: TeamFormProps) {
  const isMaxReached = members.length >= 4;

  return (
    <div className="space-y-6">
      {/* Team Name Input */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-blue-400 uppercase tracking-wider">
          <Users className="w-4 h-4" />
          2. Team Details
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
          <label
            htmlFor="team-name"
            className="block text-xs font-semibold text-slate-300 mb-1.5"
          >
            Team Name <span className="text-rose-400">*</span>
          </label>
          <input
            id="team-name"
            type="text"
            value={teamName}
            onChange={(e) => onTeamNameChange(e.target.value)}
            placeholder="e.g. CyberKnights, NeuralNet, Team Innovate"
            required
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Must be a unique name for this event.
          </p>
        </div>
      </div>

      {/* Team Members List */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-bold text-blue-400 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            3. Team Members (1 Leader + up to 3 Members)
          </div>
          <div className="text-xs text-slate-400">
            Current size: <span className="text-white font-semibold">{members.length}</span> / 4 participants
          </div>
        </div>

        {/* Member Cards */}
        <div className="space-y-4">
          {members.map((member, index) => {
            const isLeader = index === 0;

            return (
              <div
                key={index}
                className={`border rounded-xl p-5 space-y-4 transition-all ${
                  isLeader
                    ? 'bg-slate-950/80 border-blue-500/30 ring-1 ring-blue-500/20'
                    : 'bg-slate-950/50 border-slate-800'
                }`}
              >
                {/* Member Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isLeader ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        Team Leader (First Entry)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                        Member {index + 1}
                      </span>
                    )}
                    {isLeader && (
                      <span className="text-xs text-slate-400 hidden md:inline">
                        • Primary correspondence & certification contact
                      </span>
                    )}
                  </div>

                  {/* Remove Button for Added Members */}
                  {!isLeader && (
                    <button
                      type="button"
                      onClick={() => onRemoveMember(index)}
                      className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Member Input Fields */}
                <MemberFields
                  member={member}
                  onChange={(field, value) => onMemberChange(index, field, value)}
                  idPrefix={`team-member-${index}`}
                />
              </div>
            );
          })}
        </div>

        {/* Add Member Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl">
          <div className="text-xs text-slate-400">
            {!isMaxReached ? (
              <>
                You can add up to <span className="text-white font-medium">{4 - members.length}</span> more team member(s).
              </>
            ) : (
              <span className="text-amber-400 font-medium">
                Maximum limit of 4 team members reached (1 Leader + 3 Members).
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={isMaxReached}
            onClick={onAddMember}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              isMaxReached
                ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                : 'bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 cursor-pointer'
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Team Member
          </button>
        </div>
      </div>
    </div>
  );
}
