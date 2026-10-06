import { useState, useRef, useEffect } from 'react';
import { FileText, ChevronDown, Loader2, Sparkles } from 'lucide-react';
import type { RegistrationRecord } from '@/services/adminApi';
import { exportToPDF } from '../utils/exportRegistrations';

interface ExportButtonProps {
  /** The currently visible (filtered) list to export */
  filteredRegistrations: RegistrationRecord[];
  /** Full unfiltered list for "Export All" */
  allRegistrations: RegistrationRecord[];
  /** Human-readable label for the current filter (e.g. "GenAI Summit" or "All Events") */
  filterLabel: string;
}

export default function ExportButton({
  filteredRegistrations,
  allRegistrations,
  filterLabel,
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const isEmpty = filteredRegistrations.length === 0 && allRegistrations.length === 0;
  const isFiltered = filteredRegistrations.length !== allRegistrations.length;

  const handleExportFiltered = async () => {
    setIsOpen(false);
    setIsPdfExporting(true);
    try {
      await exportToPDF(filteredRegistrations, filterLabel);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsPdfExporting(false);
    }
  };

  const handleExportAll = async () => {
    setIsOpen(false);
    setIsPdfExporting(true);
    try {
      await exportToPDF(allRegistrations, 'All Events');
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsPdfExporting(false);
    }
  };

  // If no filter is active, clicking the main button directly exports all
  const handleMainClick = () => {
    if (isFiltered) {
      setIsOpen((prev) => !prev);
    } else {
      handleExportAll();
    }
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Primary Export PDF Button */}
      <button
        type="button"
        disabled={isEmpty || isPdfExporting}
        onClick={handleMainClick}
        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-rose-950/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap border border-rose-500/30"
        title={isFiltered ? 'Choose PDF export scope' : 'Export registrations as PDF'}
      >
        {isPdfExporting ? (
          <Loader2 className="w-4 h-4 animate-spin text-white" />
        ) : (
          <FileText className="w-4 h-4 text-white" />
        )}
        <span>{isPdfExporting ? 'Generating PDF...' : 'Export PDF'}</span>

        {isFiltered && (
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {/* PDF Scope Dropdown (shown only when filters are active) */}
      {isOpen && isFiltered && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-admin-surface border border-white/10 rounded-2xl shadow-2xl shadow-black/60 z-30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
          <div className="px-4 pt-3 pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-400 uppercase tracking-wider">
              <FileText className="w-3 h-3" />
              PDF Document Export
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Select which dataset to generate into the PDF report:
            </p>
          </div>

          <div className="p-2 space-y-1.5">
            {/* Filtered View Option */}
            <button
              type="button"
              onClick={handleExportFiltered}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all flex items-start gap-2.5 cursor-pointer group"
            >
              <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 group-hover:scale-105 transition-transform mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white group-hover:text-rose-200">
                    Filtered View
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                    {filteredRegistrations.length}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5" title={filterLabel}>
                  {filterLabel}
                </div>
              </div>
            </button>

            {/* All Registrations Option */}
            <button
              type="button"
              onClick={handleExportAll}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all flex items-start gap-2.5 cursor-pointer group"
            >
              <div className="p-1.5 rounded-lg bg-white/10 text-slate-300 group-hover:scale-105 transition-transform mt-0.5">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white group-hover:text-slate-200">
                    All Registrations
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                    {allRegistrations.length}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Complete event entries database
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
