import { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown, Loader2 } from 'lucide-react';
import type { RegistrationRecord } from '@/services/adminApi';
import { exportToExcel, exportToPDF } from '../utils/exportRegistrations';

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

  const handleExcelFiltered = () => {
    setIsOpen(false);
    exportToExcel(filteredRegistrations, filterLabel);
  };

  const handleExcelAll = () => {
    setIsOpen(false);
    exportToExcel(allRegistrations, 'All Events');
  };

  const handlePdfFiltered = async () => {
    setIsOpen(false);
    setIsPdfExporting(true);
    try {
      await exportToPDF(filteredRegistrations, filterLabel);
    } finally {
      setIsPdfExporting(false);
    }
  };

  const handlePdfAll = async () => {
    setIsOpen(false);
    setIsPdfExporting(true);
    try {
      await exportToPDF(allRegistrations, 'All Events');
    } finally {
      setIsPdfExporting(false);
    }
  };

  const isEmpty = filteredRegistrations.length === 0 && allRegistrations.length === 0;
  const isFiltered = filteredRegistrations.length !== allRegistrations.length;

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={isEmpty || isPdfExporting}
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        title="Export registration data"
      >
        {isPdfExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {isPdfExporting ? 'Generating PDF...' : 'Export Data'}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-admin-surface border border-white/10 rounded-2xl shadow-2xl shadow-black/40 z-30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Excel Section */}
          <div className="px-4 pt-3 pb-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              <FileSpreadsheet className="w-3 h-3" />
              Excel Format (.xlsx)
            </div>
          </div>

          <div className="px-2 pb-2 space-y-1">
            <button
              type="button"
              onClick={handleExcelFiltered}
              disabled={filteredRegistrations.length === 0}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs text-slate-200 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer group"
            >
              <div className="font-semibold">
                Export Filtered View{' '}
                <span className="text-emerald-400 font-bold">
                  ({filteredRegistrations.length} records)
                </span>
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                3 sheets: Individuals · Teams · All Participants
              </div>
            </button>

            {isFiltered && (
              <button
                type="button"
                onClick={handleExcelAll}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                <div className="font-semibold">
                  Export All Registrations{' '}
                  <span className="text-slate-400 font-bold">
                    ({allRegistrations.length} records)
                  </span>
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">Ignores current filters</div>
              </button>
            )}
          </div>

          <div className="border-t border-white/10 mx-3" />

          {/* PDF Section */}
          <div className="px-4 pt-3 pb-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-400 uppercase tracking-wider">
              <FileText className="w-3 h-3" />
              PDF Format (.pdf) — Landscape A4
            </div>
          </div>

          <div className="px-2 pb-3 space-y-1">
            <button
              type="button"
              onClick={handlePdfFiltered}
              disabled={filteredRegistrations.length === 0}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs text-slate-200 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <div className="font-semibold">
                Export Filtered View{' '}
                <span className="text-rose-400 font-bold">
                  ({filteredRegistrations.length} records)
                </span>
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Individuals page · Teams grouped with leader highlighted
              </div>
            </button>

            {isFiltered && (
              <button
                type="button"
                onClick={handlePdfAll}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                <div className="font-semibold">
                  Export All Registrations{' '}
                  <span className="text-slate-400 font-bold">
                    ({allRegistrations.length} records)
                  </span>
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">Ignores current filters</div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
