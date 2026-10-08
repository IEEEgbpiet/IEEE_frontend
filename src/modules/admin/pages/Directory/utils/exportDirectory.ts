import * as XLSX from 'xlsx';
import type { StudentDirectoryRecord } from '@/services/adminApi';

/**
 * Builds array-of-arrays representation for Excel / CSV export
 */
function buildDirectoryRows(students: StudentDirectoryRecord[]): (string | number)[][] {
  const headers = [
    'S.No',
    'Student Name',
    'Institute ID / Roll No',
    'Branch',
    'Current Year',
    'Batch Year',
    'Email Address',
    'Phone Number',
    'Registered Date',
  ];

  const rows = students.map((s, idx) => [
    idx + 1,
    s.name || 'N/A',
    s.instituteId || 'N/A',
    s.branch ? s.branch.toUpperCase() : 'N/A',
    s.year ? `${s.year} Year` : 'N/A',
    s.batchYear || 'N/A',
    s.email || 'N/A',
    s.phone || 'N/A',
    s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN') : 'N/A',
  ]);

  return [headers, ...rows];
}

/**
 * Export students list to Excel (.xlsx) file
 */
export function exportDirectoryToExcel(
  students: StudentDirectoryRecord[],
  filenamePrefix: string = 'Student_Directory'
): void {
  const wb = XLSX.utils.book_new();
  const rows = buildDirectoryRows(students);
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column width hints
  ws['!cols'] = [
    { wch: 6 },  // S.No
    { wch: 24 }, // Name
    { wch: 22 }, // Institute ID
    { wch: 16 }, // Branch
    { wch: 14 }, // Year
    { wch: 12 }, // Batch Year
    { wch: 28 }, // Email
    { wch: 16 }, // Phone
    { wch: 16 }, // Registered Date
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Student Directory');

  const timestamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${filenamePrefix}_${timestamp}.xlsx`);
}

/**
 * Export students list to CSV file
 */
export function exportDirectoryToCSV(
  students: StudentDirectoryRecord[],
  filenamePrefix: string = 'Student_Directory'
): void {
  const rows = buildDirectoryRows(students);
  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          const str = String(cell ?? '');
          return str.includes(',') || str.includes('"') || str.includes('\n')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(',')
    )
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `${filenamePrefix}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
