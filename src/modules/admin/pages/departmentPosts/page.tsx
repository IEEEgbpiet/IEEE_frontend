import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { adminApi } from "../../../../services/adminApi";

export default function DepartmentPostsHub() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await adminApi.getDashboardDepartmentCounts();
        if (response.success && response.data) {
          setCounts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch department post counts:", error);
      }
    };
    fetchCounts();
  }, []);

  const departments = [
    { name: "CSE", color: "from-blue-500 to-cyan-400" },
    { name: "AIML", color: "from-purple-500 to-pink-500" },
    { name: "EE", color: "from-amber-500 to-orange-400" },
    { name: "ECE", color: "from-emerald-500 to-teal-400" },
    { name: "BT", color: "from-rose-500 to-red-400" },
  ];

  return (
    <div className="space-y-8 bg-admin-bg text-white p-6 min-h-screen">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Department Posts Panel
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage and monitor posts across all departments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {departments.map((dept) => (
          <Link
            key={dept.name}
            to={`/admin/department-posts/${dept.name}`}
            className="group relative flex h-40 flex-col justify-between overflow-hidden rounded-2xl bg-admin-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 border border-white/5 hover:border-white/20"
          >
            {/* Background Glow Effect */}
            <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${dept.color} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-300`} />
            
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${dept.color} p-2.5 opacity-90`}>
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="font-mono text-2xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  {dept.name}
                </h2>
              </div>
              {counts[dept.name] !== undefined && (
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  {counts[dept.name]} {counts[dept.name] === 1 ? 'Post' : 'Posts'}
                </div>
              )}
            </div>
            
            <div className="relative z-10 mt-auto flex items-center text-sm text-slate-400 font-medium group-hover:text-white transition-colors">
              <span>View Directory</span>
              <svg className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
