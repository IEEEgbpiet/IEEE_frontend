import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  FolderOpen,
  SearchX,
  AlertCircle,
  RefreshCw,
  Users,
} from 'lucide-react';
import { adminApi, type StudentDirectoryRecord } from '@/services/adminApi';

// Internal Components
import DirectorySearchBar, { type SortOption } from './components/DirectorySearchBar';
import StudentCard from './components/StudentCard';
import StudentTable from './components/StudentTable';
import StudentDetailModal from './components/StudentDetailModal';
import {
  exportDirectoryToExcel,
  exportDirectoryToCSV,
} from './utils/exportDirectory';

export default function DirectoryPage() {
  const [students, setStudents] = useState<StudentDirectoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('name_asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Detail Modal state
  const [selectedStudent, setSelectedStudent] = useState<StudentDirectoryRecord | null>(
    null
  );

  useEffect(() => {
    document.title = 'Student Directory | IEEE Admin Portal';
  }, []);

  // Fetch Student Directory from live API
  const fetchDirectory = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getStudentDirectory();

      const list: StudentDirectoryRecord[] = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? (res as unknown as StudentDirectoryRecord[])
        : [];

      setStudents(list);
    } catch (err: unknown) {
      console.error('Failed to load student directory:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to reach Student Directory endpoint (/api/v1/directory/getAll).'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDirectory();
  }, [fetchDirectory]);

  // Dynamic lists of branches and batch years extracted from dataset
  const availableBranches = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.branch) set.add(s.branch.toUpperCase().trim());
    });
    return Array.from(set).sort();
  }, [students]);

  const availableBatches = useMemo(() => {
    const set = new Set<number>();
    students.forEach((s) => {
      if (s.batchYear) set.add(s.batchYear);
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [students]);

  // Filter and Search data from response
  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return students
      .filter((student) => {
        // 1. Branch Filter
        if (
          branchFilter !== 'all' &&
          (student.branch || '').toUpperCase() !== branchFilter.toUpperCase()
        ) {
          return false;
        }

        // 2. Year Filter
        if (
          yearFilter !== 'all' &&
          String(student.year || '') !== yearFilter
        ) {
          return false;
        }

        // 3. Batch Year Filter
        if (
          batchFilter !== 'all' &&
          String(student.batchYear || '') !== batchFilter
        ) {
          return false;
        }

        // 4. Search Bar query matching against response data fields
        if (!query) return true;

        const matchName = (student.name || '').toLowerCase().includes(query);
        const matchId = (student.instituteId || '').toLowerCase().includes(query);
        const matchBranch = (student.branch || '').toLowerCase().includes(query);
        const matchEmail = (student.email || '').toLowerCase().includes(query);
        const matchPhone = (student.phone || '').toLowerCase().includes(query);
        const matchYear =
          String(student.year || '').includes(query) ||
          `year ${student.year}`.toLowerCase().includes(query) ||
          `${student.year}rd year`.toLowerCase().includes(query);
        const matchBatch = String(student.batchYear || '').includes(query);

        return (
          matchName ||
          matchId ||
          matchBranch ||
          matchEmail ||
          matchPhone ||
          matchYear ||
          matchBatch
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name_asc':
            return (a.name || '').localeCompare(b.name || '');
          case 'name_desc':
            return (b.name || '').localeCompare(a.name || '');
          case 'id_asc':
            return (a.instituteId || '').localeCompare(b.instituteId || '');
          case 'id_desc':
            return (b.instituteId || '').localeCompare(a.instituteId || '');
          case 'year_asc':
            return (a.year || 0) - (b.year || 0);
          case 'year_desc':
            return (b.year || 0) - (a.year || 0);
          case 'batch_desc':
            return (b.batchYear || 0) - (a.batchYear || 0);
          case 'batch_asc':
            return (a.batchYear || 0) - (b.batchYear || 0);
          default:
            return 0;
        }
      });
  }, [
    students,
    searchQuery,
    branchFilter,
    yearFilter,
    batchFilter,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setBranchFilter('all');
    setYearFilter('all');
    setBatchFilter('all');
    setSortBy('name_asc');
  };

  const handleExportExcel = () => {
    exportDirectoryToExcel(filteredStudents, 'Student_Directory');
  };

  const handleExportCSV = () => {
    exportDirectoryToCSV(filteredStudents, 'Student_Directory');
  };

  return (
    <div className="space-y-6 bg-admin-bg text-white">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-admin-card via-admin-surface to-admin-card p-6 sm:p-7 backdrop-blur-xl shadow-xl">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300 w-fit">
              <FolderOpen size={13} className="text-blue-400" />
              <span>Institutional Records • /api/v1/directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Student Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Comprehensive registry of student profiles, departments, batches, and contact records.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Live API Status Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>API Live</span>
            </div>

            <button
              type="button"
              onClick={fetchDirectory}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-admin-surface hover:bg-white/5 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
              title="Reload from API"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="flex-1">
            <strong className="font-semibold text-white">API Notice:</strong> {error}
          </div>
          <button
            type="button"
            onClick={fetchDirectory}
            className="px-3 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-white font-medium cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search & Multi-Filter Bar */}
      <DirectorySearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        branchFilter={branchFilter}
        onBranchFilterChange={setBranchFilter}
        yearFilter={yearFilter}
        onYearFilterChange={setYearFilter}
        batchFilter={batchFilter}
        onBatchFilterChange={setBatchFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        availableBranches={availableBranches}
        availableBatches={availableBatches}
        onRefresh={fetchDirectory}
        isLoading={loading}
        totalFiltered={filteredStudents.length}
        totalAll={students.length}
        onExportExcel={handleExportExcel}
        onExportCSV={handleExportCSV}
        onResetFilters={handleResetFilters}
      />

      {/* Student List View */}
      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-admin-surface p-12 text-center space-y-4">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-300">
            Fetching student profiles from backend directory...
          </p>
        </div>
      ) : students.length === 0 ? (
        /* Empty directory state (API returned 0 records) */
        <div className="rounded-2xl border border-white/10 bg-admin-surface p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400">
            <Users className="w-7 h-7 text-blue-400" />
          </div>
          <h3 className="text-base font-semibold text-white">
            Student Directory is Empty
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No student directory profiles were found from <code className="text-slate-300">/api/v1/directory/getAll</code>. As students are registered, their profiles will appear here.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={fetchDirectory}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Directory</span>
            </button>
          </div>
        </div>
      ) : filteredStudents.length === 0 ? (
        /* Empty search results state */
        <div className="rounded-2xl border border-white/10 bg-admin-surface p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400">
            <SearchX className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-white">
            No Matching Student Profiles Found
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {searchQuery.trim()
              ? `No student records match the search query "${searchQuery}". Try searching by roll number, department, or resetting active filters.`
              : 'No students match the selected filter combination.'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Clear Search & Reset Filters
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fadeIn">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student._id || student.instituteId}
              student={student}
              onViewDetails={setSelectedStudent}
            />
          ))}
        </div>
      ) : (
        <div className="animate-fadeIn">
          <StudentTable
            students={filteredStudents}
            onViewDetails={setSelectedStudent}
          />
        </div>
      )}

      {/* Student Profile Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
