import { useMemo } from 'react';
import {
  Users,
  GraduationCap,
  Building2,
  UserCheck,
} from 'lucide-react';
import type { StudentDirectoryRecord } from '@/services/adminApi';

interface DirectoryStatsProps {
  students: StudentDirectoryRecord[];
  totalFiltered: number;
}

export default function DirectoryStats({ students, totalFiltered }: DirectoryStatsProps) {
  const stats = useMemo(() => {
    const total = students.length;
    const branchSet = new Set<string>();
    const batchSet = new Set<number>();
    let maleCount = 0;
    let femaleCount = 0;
    let otherCount = 0;

    students.forEach((s) => {
      if (s.branch) branchSet.add(s.branch.toUpperCase());
      if (s.batchYear) batchSet.add(s.batchYear);
      const g = (s.gender || '').toUpperCase();
      if (g === 'MALE') maleCount++;
      else if (g === 'FEMALE') femaleCount++;
      else if (g) otherCount++;
    });

    return {
      total,
      branchesCount: branchSet.size,
      batchesCount: batchSet.size,
      maleCount,
      femaleCount,
      otherCount,
    };
  }, [students]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Students Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-950/40 via-admin-card to-admin-surface p-4 sm:p-5 shadow-lg group hover:border-blue-500/40 transition-all duration-300">
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Enrolled</p>
            <h3 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
              {stats.total}
            </h3>
            <p className="mt-1 text-[11px] text-blue-400 font-medium flex items-center gap-1">
              <span>{totalFiltered} matching view</span>
            </p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Branches Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-950/40 via-admin-card to-admin-surface p-4 sm:p-5 shadow-lg group hover:border-purple-500/40 transition-all duration-300">
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Departments</p>
            <h3 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
              {stats.branchesCount}
            </h3>
            <p className="mt-1 text-[11px] text-purple-300 font-medium">
              Academic Branches
            </p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Batches Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-950/40 via-admin-card to-admin-surface p-4 sm:p-5 shadow-lg group hover:border-emerald-500/40 transition-all duration-300">
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Graduation Batches</p>
            <h3 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
              {stats.batchesCount}
            </h3>
            <p className="mt-1 text-[11px] text-emerald-400 font-medium">
              Active Cohorts
            </p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Demographics Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-pink-950/40 via-admin-card to-admin-surface p-4 sm:p-5 shadow-lg group hover:border-pink-500/40 transition-all duration-300">
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-pink-500/10 rounded-full blur-xl group-hover:bg-pink-500/20 transition-all" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Gender Ratio</p>
            <h3 className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-white font-mono">
              {stats.maleCount}M : {stats.femaleCount}F
            </h3>
            <p className="mt-1 text-[11px] text-pink-300 font-medium">
              {stats.total > 0
                ? `${Math.round((stats.femaleCount / stats.total) * 100)}% Female representation`
                : 'Balanced representation'}
            </p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-pink-500/15 border border-pink-500/25 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
