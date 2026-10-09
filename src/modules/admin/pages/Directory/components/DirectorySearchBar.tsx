import { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  RotateCw,
  Download,
  LayoutGrid,
  List,
  ArrowUpDown,
  FileSpreadsheet,
  FileText,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';

export type SortOption =
  | 'name_asc'
  | 'name_desc'
  | 'id_asc'
  | 'id_desc'
  | 'year_asc'
  | 'year_desc'
  | 'batch_desc'
  | 'batch_asc';

interface DirectorySearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  branchFilter: string;
  onBranchFilterChange: (branch: string) => void;
  yearFilter: string;
  onYearFilterChange: (year: string) => void;
  batchFilter: string;
  onBatchFilterChange: (batch: string) => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  availableBranches: string[];
  availableBatches: number[];
  onRefresh: () => void;
  isLoading: boolean;
  totalFiltered: number;
  totalAll: number;
  onExportExcel: () => void;
  onExportCSV: () => void;
  onResetFilters: () => void;
}

export default function DirectorySearchBar({
  searchQuery,
  onSearchChange,
  branchFilter,
  onBranchFilterChange,
  yearFilter,
  onYearFilterChange,
  batchFilter,
  onBatchFilterChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  availableBranches,
  availableBatches,
  onRefresh,
  isLoading,
  totalFiltered,
  totalAll,
  onExportExcel,
  onExportCSV,
  onResetFilters,
}: DirectorySearchBarProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Close export dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    if (showExportMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    branchFilter !== 'all' ||
    yearFilter !== 'all' ||
    batchFilter !== 'all';

  return (
    <div className="bg-admin-surface border border-white/10 rounded-2xl p-3 sm:p-4 space-y-3 shadow-xl">
      {/* Top Bar: Search Input + Quick Actions */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
        {/* Dominant Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search student name, roll / institute ID, email, phone, branch, year..."
            className="w-full bg-admin-bg border border-white/10 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between lg:justify-end">
          {/* Toggle Advanced Filters Button */}
          <button
            type="button"
            onClick={() => setShowAdvancedFilters((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              showAdvancedFilters || hasActiveFilters
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                : 'bg-admin-bg border-white/10 text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Toggle Filter Options"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            )}
          </button>

          {/* Sort By Dropdown */}
          <div className="relative">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as SortOption)}
              className="bg-admin-bg border border-white/10 rounded-xl pl-8 pr-7 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none"
            >
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
              <option value="id_asc">Institute ID: Asc</option>
              <option value="id_desc">Institute ID: Desc</option>
              <option value="year_asc">Year: 1st to 4th</option>
              <option value="year_desc">Year: 4th to 1st</option>
              <option value="batch_desc">Batch: Newest First</option>
              <option value="batch_asc">Batch: Oldest First</option>
            </select>
          </div>

          {/* View Mode Switcher (Grid / Table) */}
          <div className="flex items-center bg-admin-bg border border-white/10 rounded-xl p-1">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Export Dropdown */}
          <div className="relative" ref={exportRef}>
            <button
              type="button"
              onClick={() => setShowExportMenu((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-admin-bg border border-white/10 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Export Student Directory"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-1.5 w-48 rounded-xl border border-white/10 bg-admin-card p-1 shadow-2xl z-30 animate-fadeIn backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onExportExcel();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-medium">Export to Excel</div>
                    <div className="text-[10px] text-slate-400">Microsoft Excel (.xlsx)</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onExportCSV();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-medium">Export to CSV</div>
                    <div className="text-[10px] text-slate-400">Comma Separated Values</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-admin-bg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh Student Directory"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Advanced Filters Expandable Row */}
      {showAdvancedFilters && (
        <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 animate-fadeIn">
          {/* Branch Filter */}
          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Branch / Department
            </label>
            <select
              value={branchFilter}
              onChange={(e) => onBranchFilterChange(e.target.value)}
              className="w-full bg-admin-bg border border-white/10 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="all">All Branches</option>
              {availableBranches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Year of Study Filter */}
          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Current Year
            </label>
            <select
              value={yearFilter}
              onChange={(e) => onYearFilterChange(e.target.value)}
              className="w-full bg-admin-bg border border-white/10 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="all">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          {/* Batch Year Filter */}
          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Graduation Batch
            </label>
            <select
              value={batchFilter}
              onChange={(e) => onBatchFilterChange(e.target.value)}
              className="w-full bg-admin-bg border border-white/10 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="all">All Batches</option>
              {availableBatches.map((batch) => (
                <option key={batch} value={String(batch)}>
                  Batch {batch}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Results Status & Active Filter Tags */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 px-1 pt-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            Showing <strong className="text-white font-mono">{totalFiltered}</strong> of{' '}
            <strong className="text-slate-300 font-mono">{totalAll}</strong> students
          </span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-blue-300">
              Query: &quot;{searchQuery}&quot;
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {branchFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-purple-300">
              Branch: {branchFilter}
              <button
                type="button"
                onClick={() => onBranchFilterChange('all')}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {yearFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-emerald-300">
              Year: {yearFilter}
              <button
                type="button"
                onClick={() => onYearFilterChange('all')}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {batchFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-amber-300">
              Batch: {batchFilter}
              <button
                type="button"
                onClick={() => onBatchFilterChange('all')}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onResetFilters}
              className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
