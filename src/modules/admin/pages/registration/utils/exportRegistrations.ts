import * as XLSX from 'xlsx';
import type { RegistrationRecord } from '@/services/adminApi';

// ----------------------------------------------------------------
// Excel Export  (xlsx)
// ----------------------------------------------------------------

export function exportToExcel(
  registrations: RegistrationRecord[],
  label: string = 'All Events'
): void {
  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Individual Registrations ──────────────────────────
  const individualRows = buildIndividualRows(registrations);
  const wsIndividual = XLSX.utils.aoa_to_sheet(individualRows);
  applyColumnWidths(wsIndividual, [14, 20, 32, 20, 20, 16, 12, 10, 8, 32]);
  XLSX.utils.book_append_sheet(wb, wsIndividual, 'Individual Registrations');

  // ── Sheet 2: Team Registrations ────────────────────────────────
  const teamRows = buildTeamRows(registrations);
  const wsTeam = XLSX.utils.aoa_to_sheet(teamRows);
  applyColumnWidths(wsTeam, [14, 24, 32, 20, 20, 16, 12, 10, 8, 32]);
  XLSX.utils.book_append_sheet(wb, wsTeam, 'Team Registrations');

  // ── Sheet 3: Combined flat list ────────────────────────────────
  const allRows = buildAllFlatRows(registrations);
  const wsAll = XLSX.utils.aoa_to_sheet(allRows);
  applyColumnWidths(wsAll, [14, 8, 24, 32, 20, 20, 16, 12, 10, 8, 32]);
  XLSX.utils.book_append_sheet(wb, wsAll, 'All Participants');

  const safeLabel = label.replace(/[^a-zA-Z0-9 _-]/g, '').trim().slice(0, 40);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `IEEE_Registrations_${safeLabel}_${timestamp}.xlsx`;

  XLSX.writeFile(wb, filename);
}

// ----------------------------------------------------------------
// PDF Export  (jspdf + jspdf-autotable)  – lazy import to keep
// initial bundle weight low
// ----------------------------------------------------------------

export async function exportToPDF(
  registrations: RegistrationRecord[],
  label: string = 'All Events'
): Promise<void> {
  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);

  const doc = new jsPDF({ orientation: 'landscape', format: 'a4' });

  const timestamp = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // ── PAGE HEADER helper ──────────────────────────────────────────
  const addPageHeader = (title: string) => {
    doc.setFillColor(2, 8, 23);
    doc.rect(0, 0, 297, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('IEEE GBPIET Student Branch', 14, 9);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(title, 14, 16);
    doc.setTextColor(100, 130, 200);
    doc.text(`Generated: ${timestamp}  |  Event Filter: ${label}`, 297 - 14, 16, { align: 'right' });
    doc.setTextColor(30, 30, 30);
  };

  // ── INDIVIDUAL SHEET ────────────────────────────────────────────
  const individuals = registrations.filter((r) => r.mode === 'INDIVIDUAL');

  addPageHeader('Individual Registrations');

  autoTable(doc, {
    startY: 26,
    head: [['Reg ID', 'Event', 'Date', 'Name', 'Roll No', 'Email', 'Phone', 'Branch', 'Year']],
    body: individuals.flatMap((r) =>
      (r.members || []).map((m) => [
        r.registrationId,
        r.eventName,
        r.date,
        m.name,
        m.instituteId,
        m.email,
        m.phone,
        m.branch,
        m.year,
      ])
    ),
    headStyles: {
      fillColor: [11, 63, 156],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: { fontSize: 8, cellPadding: 3 },
    alternateRowStyles: { fillColor: [245, 248, 255] },
    columnStyles: {
      0: { cellWidth: 22, fontStyle: 'bold' },
      1: { cellWidth: 55 },
      2: { cellWidth: 22 },
      5: { cellWidth: 48 },
    },
    margin: { left: 14, right: 14 },
  });

  // ── TEAM SHEET ─────────────────────────────────────────────────
  const teams = registrations.filter((r) => r.mode === 'TEAM');

  if (teams.length > 0) {
    doc.addPage();
    addPageHeader('Team Registrations');

    // Build body: for each team, a group-header row then one row per member
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const teamBody: any[] = [];

    teams.forEach((r) => {
      // Team header row spanning all columns
      teamBody.push([
        {
          content: `Team: ${r.teamName ?? ''}  |  Reg ID: ${r.registrationId}  |  Event: ${r.eventName}  |  Date: ${r.date}`,
          colSpan: 9,
          styles: { fillColor: [20, 48, 110], textColor: 255, fontStyle: 'bold', fontSize: 7.5 },
        },
      ]);

      (r.members || []).forEach((m, idx) => {
        const role = idx === 0 ? 'Leader' : `Member ${idx + 1}`;
        teamBody.push([role, m.name, m.instituteId, m.email, m.phone, m.branch, m.year, '', '']);
      });
    });

    autoTable(doc, {
      startY: 26,
      head: [['Role', 'Name', 'Roll No', 'Email', 'Phone', 'Branch', 'Year', '', '']],
      body: teamBody,
      headStyles: {
        fillColor: [11, 63, 156],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: { fontSize: 8, cellPadding: 3 },
      alternateRowStyles: { fillColor: [245, 248, 255] },
      columnStyles: {
        3: { cellWidth: 48 },
      },
      margin: { left: 14, right: 14 },
    });
  }

  const safeLabel = label.replace(/[^a-zA-Z0-9 _-]/g, '').trim().slice(0, 40);
  const tsFile = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  doc.save(`IEEE_Registrations_${safeLabel}_${tsFile}.pdf`);
}

// ----------------------------------------------------------------
// Row Builders
// ----------------------------------------------------------------

function buildIndividualRows(registrations: RegistrationRecord[]): (string | number)[][] {
  const HEADER = [
    'Registration ID', 'Event Name', 'Event Date',
    'Participant Name', 'Roll No / Institute ID',
    'Email', 'Phone', 'Branch', 'Year',
  ];

  const rows: (string | number)[][] = [HEADER];

  registrations
    .filter((r) => r.mode === 'INDIVIDUAL')
    .forEach((r) => {
      (r.members || []).forEach((m) => {
        rows.push([
          r.registrationId,
          r.eventName,
          r.date,
          m.name,
          m.instituteId,
          m.email,
          m.phone,
          m.branch,
          m.year,
        ]);
      });
    });

  return rows;
}

function buildTeamRows(registrations: RegistrationRecord[]): (string | number)[][] {
  const HEADER = [
    'Registration ID', 'Team Name', 'Event Name', 'Event Date',
    'Member Name', 'Roll No / Institute ID',
    'Email', 'Phone', 'Branch', 'Year', 'Role',
  ];

  const rows: (string | number)[][] = [HEADER];

  registrations
    .filter((r) => r.mode === 'TEAM')
    .forEach((r) => {
      (r.members || []).forEach((m, idx) => {
        rows.push([
          r.registrationId,
          r.teamName ?? '',
          r.eventName,
          r.date,
          m.name,
          m.instituteId,
          m.email,
          m.phone,
          m.branch,
          m.year,
          idx === 0 ? 'Team Leader' : `Member ${idx + 1}`,
        ]);
      });
    });

  return rows;
}

function buildAllFlatRows(registrations: RegistrationRecord[]): (string | number)[][] {
  const HEADER = [
    'Registration ID', 'Mode', 'Team Name', 'Event Name', 'Event Date',
    'Member Name', 'Roll No / Institute ID',
    'Email', 'Phone', 'Branch', 'Year', 'Role',
  ];

  const rows: (string | number)[][] = [HEADER];

  registrations.forEach((r) => {
    (r.members || []).forEach((m, idx) => {
      rows.push([
        r.registrationId,
        r.mode,
        r.teamName ?? '',
        r.eventName,
        r.date,
        m.name,
        m.instituteId,
        m.email,
        m.phone,
        m.branch,
        m.year,
        r.mode === 'TEAM' ? (idx === 0 ? 'Team Leader' : `Member ${idx + 1}`) : 'Individual',
      ]);
    });
  });

  return rows;
}

function applyColumnWidths(ws: XLSX.WorkSheet, widths: number[]): void {
  ws['!cols'] = widths.map((w) => ({ wch: w }));
}
