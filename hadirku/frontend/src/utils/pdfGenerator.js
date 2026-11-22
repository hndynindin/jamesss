import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateAttendancePDF = ({ title, period, dateRange, className, summary, studentBreakdown }) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header / Kop Laporan Sekolah
  doc.setFillColor(11, 17, 32); // Dark Navy background for banner
  doc.rect(0, 0, 210, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('VELOCHECK – PRESENSI SEKOLAH (SMK KARTIKA X-1)', 105, 11, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(190, 210, 250);
  doc.text('SMK KARTIKA X-1 • KONSENTRASI KEAHLIAN TEKNIK KOMPUTER DAN JARINGAN', 105, 17, { align: 'center' });
  doc.text('Jadwal Masuk Pagi: 06:30 (Batas: 06:35) - 11:50 WIB • Jadwal Masuk Siang: 12:30 - 17:50 WIB', 105, 22, { align: 'center' });

  // Document Title & Meta
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(title || 'LAPORAN REKAPITULASI KEHADIRAN SISWA', 14, 36);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text(`Kelas / Jurusan : ${className || 'Semua Kelas'}`, 14, 42);
  doc.text(`Periode Laporan : ${period.toUpperCase()} (${dateRange})`, 14, 47);
  doc.text(`Dicetak Pada    : ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 52);

  // Summary Metrics Box
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(14, 57, 182, 18, 2, 2, 'F');
  doc.setDrawColor(209, 213, 219);
  doc.roundedRect(14, 57, 182, 18, 2, 2, 'S');

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL PRESENSI', 25, 63, { align: 'center' });
  doc.text('HADIR', 62, 63, { align: 'center' });
  doc.text('IZIN', 95, 63, { align: 'center' });
  doc.text('SAKIT', 125, 63, { align: 'center' });
  doc.text('ALPA', 152, 63, { align: 'center' });
  doc.text('TERLAMBAT', 180, 63, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(String(summary?.TOTAL || 0), 25, 71, { align: 'center' });

  doc.setTextColor(34, 197, 94); // Green
  doc.text(String(summary?.HADIR || 0), 62, 71, { align: 'center' });

  doc.setTextColor(202, 138, 4); // Yellow/Amber
  doc.text(String(summary?.IZIN || 0), 95, 71, { align: 'center' });

  doc.setTextColor(59, 130, 246); // Blue
  doc.text(String(summary?.SAKIT || 0), 125, 71, { align: 'center' });

  doc.setTextColor(239, 68, 68); // Red
  doc.text(String(summary?.ALPA || 0), 152, 71, { align: 'center' });

  doc.setTextColor(249, 115, 22); // Orange
  doc.text(String(summary?.LATE_COUNT || 0), 180, 71, { align: 'center' });

  // Table Data
  const tableRows = (studentBreakdown || []).map((s, index) => [
    index + 1,
    s.nis,
    s.student_name,
    s.class_name,
    s.hadir,
    s.izin,
    s.sakit,
    s.alpa,
    s.late || 0,
    `${s.percentage}%`
  ]);

  doc.autoTable({
    startY: 81,
    head: [['No', 'NIS', 'Nama Lengkap Siswa', 'Kelas', 'H', 'I', 'S', 'A', 'Telat', '% Kehadiran']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [31, 41, 55]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 22 },
      2: { cellWidth: 55 },
      3: { halign: 'center', cellWidth: 24 },
      4: { halign: 'center', cellWidth: 10, textColor: [34, 197, 94], fontStyle: 'bold' },
      5: { halign: 'center', cellWidth: 10, textColor: [202, 138, 4] },
      6: { halign: 'center', cellWidth: 10, textColor: [59, 130, 246] },
      7: { halign: 'center', cellWidth: 10, textColor: [239, 68, 68], fontStyle: 'bold' },
      8: { halign: 'center', cellWidth: 13, textColor: [249, 115, 22] },
      9: { halign: 'center', cellWidth: 18, fontStyle: 'bold' }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: 14, right: 14 }
  });

  // Signatures at the bottom
  const finalY = doc.lastAutoTable.finalY + 15;
  const pageHeight = doc.internal.pageSize.height;

  // Add new page if signatures don't fit
  if (finalY + 40 > pageHeight) {
    doc.addPage();
  }

  const signY = (finalY + 40 > pageHeight) ? 25 : finalY;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);

  doc.text('Mengetahui,', 25, signY);
  doc.text('Kepala SMK KARTIKA X-1', 25, signY + 5);
  doc.text('( Drs. H. Suryanto, M.Pd )', 25, signY + 30);
  doc.text('NIP. 196803151994031004', 25, signY + 34);

  doc.text('Jakarta, ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), 135, signY);
  doc.text('Wali Kelas / Guru Pengampu,', 135, signY + 5);
  doc.text('( Budi Santoso, S.Kom )', 135, signY + 30);
  doc.text('NIP. 198504122010011003', 135, signY + 34);

  // Footer page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(156, 163, 175);
    doc.text(`Dokumen resmi VeloCheck - Sistem Presensi Digital • Halaman ${i} dari ${pageCount}`, 105, 290, { align: 'center' });
  }

  // Save PDF
  const cleanClassName = (className || 'Semua-Kelas').replace(/\s+/g, '-');
  const filename = `VeloCheck-Rekap-${cleanClassName}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};
