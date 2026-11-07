import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student, Company, MouDocument, BkkMember, YearlyStatistic, SchoolSettings } from '../types';

interface KopSuratOptions {
  doc: jsPDF;
  settings: SchoolSettings;
  title: string;
  subtitle?: string;
}

/**
 * Draws the official Indonesian School Letterhead (Kop Surat Resmi)
 */
export function drawKopSurat({ doc, settings, title, subtitle }: KopSuratOptions): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Attempt to draw official school logo on top-left of Kop Surat
  try {
    if (settings.logoUrl) {
      doc.addImage(settings.logoUrl, 'PNG', 16, 12, 25, 25);
    }
  } catch (e) {
    // Fallback gracefully without throwing
  }

  // Header Text Lines
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('PEMERINTAH PROVINSI BANTEN', pageWidth / 2, 14, { align: 'center' });
  doc.text('DINAS PENDIDIKAN DAN KEBUDAYAAN', pageWidth / 2, 19, { align: 'center' });
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(11, 25, 44);
  doc.text(settings.namaSekolah.toUpperCase(), pageWidth / 2, 26, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setTextColor(30, 62, 98);
  doc.text('BURSA KERJA KHUSUS (BKK) MITRA MANDIRI', pageWidth / 2, 32, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`${settings.alamatSekolah}, ${settings.kabupatenKota}, Prov. ${settings.provinsi} ${settings.kodePos}`, pageWidth / 2, 37, { align: 'center' });
  doc.text(`Telp: ${settings.telepon} | Email: ${settings.email} | Website: ${settings.website}`, pageWidth / 2, 41, { align: 'center' });

  // Double horizontal separator line (Thick + Thin standard Indonesian Kop Surat)
  doc.setLineWidth(1.2);
  doc.setDrawColor(11, 25, 44);
  doc.line(14, 44, pageWidth - 14, 44);
  
  doc.setLineWidth(0.4);
  doc.line(14, 45.5, pageWidth - 14, 45.5);

  // Document Title
  let currentY = 54;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(11, 25, 44);
  doc.text(title.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });

  if (subtitle) {
    currentY += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(subtitle, pageWidth / 2, currentY, { align: 'center' });
  }

  currentY += 7;
  return currentY;
}

/**
 * Draws the official Signature Block at the bottom of the report
 */
export function drawSignatureBlock(doc: jsPDF, settings: SchoolSettings, startY: number): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // If remaining space on the page is less than 50mm, add a new page
  if (startY > pageHeight - 55) {
    doc.addPage();
    startY = 30;
  } else {
    startY += 10;
  }

  const today = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);

  // Left side: Mengetahui, Kepala Sekolah
  const leftX = 20;
  doc.text('Mengetahui,', leftX, startY);
  doc.text('Kepala SMK Negeri 1 Warunggunung', leftX, startY + 5);
  doc.text('', leftX, startY + 10);
  
  doc.setFont('helvetica', 'bold');
  doc.text(settings.namaKepalaSekolah, leftX, startY + 28);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP. ${settings.nipKepalaSekolah}`, leftX, startY + 33);

  // Right side: Warunggunung Date, Kepala BKK
  const rightX = pageWidth - 80;
  doc.text(`Warunggunung, ${today}`, rightX, startY);
  doc.text('Kepala Bursa Kerja Khusus (BKK)', rightX, startY + 5);

  doc.setFont('helvetica', 'bold');
  doc.text(settings.namaKepalaBkk, rightX, startY + 28);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP. ${settings.nipKepalaBkk}`, rightX, startY + 33);
}

/**
 * Add page numbering to all pages in document
 */
function addPageNumbers(doc: jsPDF, title: string) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Sistem Informasi BKK SMKN 1 Warunggunung | ${title} | Hal ${i} dari ${pageCount}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }
}

/**
 * EXPORT 1: DATA SISWA BEKERJA (Filtered or All)
 */
export function exportStudentsToPDF(
  students: Student[],
  settings: SchoolSettings,
  filterInfo?: { tahun?: string; jurusan?: string; perusahaan?: string }
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  let subtitle = `Tahun Pelajaran: ${settings.tahunAjaranAktif} | Total Data: ${students.length} Siswa`;
  if (filterInfo?.tahun && filterInfo.tahun !== 'all') {
    subtitle += ` | Tahun Lulus: ${filterInfo.tahun}`;
  }
  if (filterInfo?.jurusan && filterInfo.jurusan !== 'all') {
    subtitle += ` | Jurusan: ${filterInfo.jurusan}`;
  }
  if (filterInfo?.perusahaan && filterInfo.perusahaan !== 'all') {
    subtitle += ` | Perusahaan: ${filterInfo.perusahaan}`;
  }

  const startY = drawKopSurat({
    doc,
    settings,
    title: 'LAPORAN DATA ALUMNI/SISWA TELAH BEKERJA',
    subtitle
  });

  const tableData = students.map((s, index) => [
    index + 1,
    s.nisn,
    s.namaLengkap,
    s.jenisKelamin === 'L' ? 'L' : 'P',
    s.jurusan,
    s.tahunLulus,
    s.namaPerusahaan,
    s.jabatan,
    s.statusPekerjaan,
    s.negaraPenempatan === 'Luar Negeri' ? `LN (${s.negaraSpesifik || 'Luar'})` : 'Indonesia',
    s.noHp
  ]);

  autoTable(doc, {
    startY: startY,
    head: [[
      'No',
      'NISN',
      'Nama Siswa',
      'JK',
      'Jurusan',
      'Lulus',
      'Nama Perusahaan',
      'Jabatan / Posisi',
      'Status',
      'Penempatan',
      'No. WhatsApp'
    ]],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: [30, 41, 59]
    },
    headStyles: {
      fillColor: [11, 25, 44],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 22 },
      2: { cellWidth: 38 },
      3: { halign: 'center', cellWidth: 10 },
      4: { cellWidth: 35 },
      5: { halign: 'center', cellWidth: 14 },
      6: { cellWidth: 40 },
      7: { cellWidth: 32 },
      8: { halign: 'center', cellWidth: 20 },
      9: { halign: 'center', cellWidth: 22 },
      10: { halign: 'center', cellWidth: 24 }
    },
    margin: { left: 14, right: 14 }
  });

  // @ts-ignore - jspdf-autotable extends jsPDF
  const finalY = doc.lastAutoTable.finalY;
  drawSignatureBlock(doc, settings, finalY);
  addPageNumbers(doc, 'Data Siswa Bekerja');

  const fileName = `Laporan_Siswa_Bekerja_SMKN1WG_${Date.now()}.pdf`;
  doc.save(fileName);
}

/**
 * EXPORT 2: LAPORAN STATISTIK & KETERSERAPAN LULUSAN
 */
export function exportStatisticsToPDF(
  yearlyStats: YearlyStatistic[],
  students: Student[],
  settings: SchoolSettings
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const startY = drawKopSurat({
    doc,
    settings,
    title: 'LAPORAN STATISTIK KETERSERAPAN LULUSAN BKK',
    subtitle: `Tren Penyerapan Kerja, Wirausaha, dan Kemitraan Industri (${yearlyStats[0]?.tahun || 2021} - ${yearlyStats[yearlyStats.length - 1]?.tahun || 2026})`
  });

  const tableData = yearlyStats.map((item, idx) => [
    idx + 1,
    item.tahun,
    item.totalLulusan,
    item.jumlahBekerja,
    item.jumlahWirausaha,
    item.jumlahMelanjutkan,
    item.jumlahMencariKerja,
    `${item.persentaseBekerja.toFixed(1)}%`
  ]);

  autoTable(doc, {
    startY: startY,
    head: [[
      'No',
      'Tahun',
      'Total Lulusan',
      'Bekerja (Industri)',
      'Wirausaha',
      'Melanjutkan Kuliah',
      'Mencari Kerja',
      'Keterserapan (%)'
    ]],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 2.5,
      textColor: [30, 41, 59]
    },
    headStyles: {
      fillColor: [11, 25, 44],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { halign: 'center' },
      1: { halign: 'center', fontStyle: 'bold' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'right', fontStyle: 'bold' }
    },
    margin: { left: 14, right: 14 }
  });

  // @ts-ignore
  let finalY = doc.lastAutoTable.finalY + 8;

  // Department distribution summary
  const deptCounts: Record<string, number> = {};
  students.forEach(s => {
    deptCounts[s.jurusan] = (deptCounts[s.jurusan] || 0) + 1;
  });

  const deptData = Object.entries(deptCounts).map(([dept, count], i) => [
    i + 1,
    dept,
    count,
    `${((count / (students.length || 1)) * 100).toFixed(1)}%`
  ]);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(11, 25, 44);
  doc.text('Distribusi Siswa Bekerja Berdasarkan Jurusan:', 14, finalY);

  autoTable(doc, {
    startY: finalY + 3,
    head: [['No', 'Kompetensi Keahlian / Jurusan', 'Jumlah Siswa Bekerja', 'Porsi (%)']],
    body: deptData,
    theme: 'striped',
    styles: { fontSize: 8.5, cellPadding: 2 },
    headStyles: { fillColor: [30, 62, 98], textColor: [255, 255, 255] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      2: { halign: 'right', cellWidth: 40 },
      3: { halign: 'right', cellWidth: 30 }
    },
    margin: { left: 14, right: 14 }
  });

  // @ts-ignore
  finalY = doc.lastAutoTable.finalY;
  drawSignatureBlock(doc, settings, finalY);
  addPageNumbers(doc, 'Statistik Keterserapan Lulusan');

  doc.save(`Laporan_Statistik_BKK_SMKN1WG_${Date.now()}.pdf`);
}

/**
 * EXPORT 3: MITRA INDUSTRI & DOKUMEN MOU
 */
export function exportCompaniesAndMousToPDF(
  companies: Company[],
  mous: MouDocument[],
  settings: SchoolSettings
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const startY = drawKopSurat({
    doc,
    settings,
    title: 'DAFTAR MITRA INDUSTRI DAN DOKUMEN KERJA SAMA (MOU)',
    subtitle: `Total Mitra Industri: ${companies.length} | Dokumen Kerjasama: ${mous.length}`
  });

  // Section 1: Perusahaan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(11, 25, 44);
  doc.text('1. DAFTAR MITRA DUNIA USAHA DAN INDUSTRI (DUDIKA)', 14, startY);

  const companyRows = companies.map((c, i) => [
    i + 1,
    c.nama,
    c.bidangUsaha,
    c.alamat,
    c.pimpinan,
    c.contactPerson,
    c.telepon,
    c.status
  ]);

  autoTable(doc, {
    startY: startY + 3,
    head: [[
      'No',
      'Nama Perusahaan',
      'Bidang Usaha',
      'Alamat',
      'Pimpinan',
      'Contact Person',
      'Telepon',
      'Status'
    ]],
    body: companyRows,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [11, 25, 44], textColor: [255, 255, 255] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 45 },
      2: { cellWidth: 40 },
      3: { cellWidth: 60 },
      7: { halign: 'center', cellWidth: 20 }
    },
    margin: { left: 14, right: 14 }
  });

  // @ts-ignore
  let finalY = doc.lastAutoTable.finalY + 8;
  if (finalY > 160) {
    doc.addPage();
    finalY = 20;
  }

  // Section 2: MOU
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(11, 25, 44);
  doc.text('2. REKAPITULASI DOKUMEN PERJANJIAN KERJASAMA (MOU)', 14, finalY);

  const mouRows = mous.map((m, i) => [
    i + 1,
    m.noMou,
    m.namaPerusahaan,
    `${m.tanggalMulai} s.d ${m.tanggalSelesai}`,
    m.pihakSekolah,
    m.pihakPerusahaan,
    m.status
  ]);

  autoTable(doc, {
    startY: finalY + 3,
    head: [[
      'No',
      'Nomor MOU',
      'Nama Mitra Perusahaan',
      'Masa Berlaku',
      'Pihak Sekolah',
      'Pihak Perusahaan',
      'Status MOU'
    ]],
    body: mouRows,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [30, 62, 98], textColor: [255, 255, 255] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 50 },
      2: { cellWidth: 55 },
      3: { halign: 'center', cellWidth: 42 },
      6: { halign: 'center', cellWidth: 25 }
    },
    margin: { left: 14, right: 14 }
  });

  // @ts-ignore
  finalY = doc.lastAutoTable.finalY;
  drawSignatureBlock(doc, settings, finalY);
  addPageNumbers(doc, 'Mitra Industri & MOU');

  doc.save(`Laporan_Mitra_MOU_SMKN1WG_${Date.now()}.pdf`);
}

/**
 * EXPORT 4: STRUKTUR ORGANISASI BKK
 */
export function exportOrganizationToPDF(
  members: BkkMember[],
  settings: SchoolSettings
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const startY = drawKopSurat({
    doc,
    settings,
    title: 'STRUKTUR ORGANISASI BURSA KERJA KHUSUS (BKK)',
    subtitle: 'Surat Keputusan Kepala SMK Negeri 1 Warunggunung tentang Pengurus BKK'
  });

  const memberRows = members.map((m, idx) => [
    idx + 1,
    m.nama,
    m.nip,
    m.jabatan,
    m.noHp,
    m.tugas
  ]);

  autoTable(doc, {
    startY: startY,
    head: [[
      'No',
      'Nama Lengkap',
      'NIP / NUPTK',
      'Jabatan Organisasi',
      'Nomor Kontak',
      'Tugas & Tanggung Jawab'
    ]],
    body: memberRows,
    theme: 'grid',
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    headStyles: { fillColor: [11, 25, 44], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 40, fontStyle: 'bold' },
      2: { cellWidth: 32 },
      3: { cellWidth: 36, fontStyle: 'bold' },
      4: { cellWidth: 26 },
      5: { cellWidth: 45 }
    },
    margin: { left: 14, right: 14 }
  });

  // @ts-ignore
  const finalY = doc.lastAutoTable.finalY;
  drawSignatureBlock(doc, settings, finalY);
  addPageNumbers(doc, 'Struktur Organisasi BKK');

  doc.save(`Struktur_Organisasi_BKK_SMKN1WG_${Date.now()}.pdf`);
}
