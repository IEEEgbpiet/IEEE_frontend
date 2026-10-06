import { ClipboardList, Users, User, UserCheck } from 'lucide-react';
import type { RegistrationStatsData } from '../types';

interface RegistrationStatsProps {
  stats: RegistrationStatsData;
}

export default function RegistrationStats({ stats }: RegistrationStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Registrations */}
      <div className="bg-admin-surface border border-white/10 rounded-xl p-4 sm:p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Total Entries
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
            {stats.totalRegistrations}
          </div>
        </div>
      </div>

      {/* Total Participants */}
      <div className="bg-admin-surface border border-white/10 rounded-xl p-4 sm:p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Total Students
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
            {stats.totalParticipants}
          </div>
        </div>
      </div>

      {/* Total Teams */}
      <div className="bg-admin-surface border border-white/10 rounded-xl p-4 sm:p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <Users className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Teams
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
            {stats.totalTeams}
          </div>
        </div>
      </div>

      {/* Total Individuals */}
      <div className="bg-admin-surface border border-white/10 rounded-xl p-4 sm:p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <User className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Individual
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
            {stats.totalIndividuals}
          </div>
        </div>
      </div>
    </div>
  );
}
