import { Student, Company } from '../types';

/**
 * Escapes CSV field value and wraps with quotes if needed
 */
function escapeCSV(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Download a CSV file that Excel opens cleanly in Indonesian locale (with UTF-8 BOM)
 */
function downloadCSV(csvContent: string, fileName: string) {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export Students to Excel-compatible CSV
 */
export function exportStudentsToExcel(students: Student[], fileNamePrefix = 'Data_Siswa_Bekerja_SMKN1WG') {
  const headers = [
    'Nomor',
    'NISN',
    'NIS',
    'Nama Lengkap',
    'Jenis Kelamin',
    'Tempat Lahir',
    'Tanggal Lahir',
    'Alamat',
    'Nomor HP/WA',
    'Tahun Lulus',
    'Kompetensi Keahlian / Jurusan',
    'Nama Perusahaan',
    'Alamat Perusahaan',
    'Jabatan / Posisi',
    'Bidang Pekerjaan',
    'Negara Penempatan',
    'Negara Spesifik',
    'Tahun Mulai Bekerja',
    'Status Pekerjaan',
    'Catatan Khusus'
  ];

  const rows = students.map(s => [
    s.nomor,
    s.nisn,
    s.nis,
    s.namaLengkap,
    s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
    s.tempatLahir,
    s.tanggalLahir,
    s.alamat,
    s.noHp,
    s.tahunLulus,
    s.jurusan,
    s.namaPerusahaan,
    s.alamatPerusahaan,
    s.jabatan,
    s.bidangPekerjaan,
    s.negaraPenempatan,
    s.negaraSpesifik || 'Indonesia',
    s.tahunMulaiBekerja,
    s.statusPekerjaan,
    s.catatan || ''
  ]);

  const csvRows = [
    headers.map(escapeCSV).join(';'),
    ...rows.map(r => r.map(escapeCSV).join(';'))
  ];

  downloadCSV(csvRows.join('\r\n'), `${fileNamePrefix}_${Date.now()}.csv`);
}

/**
 * Export Companies to Excel-compatible CSV
 */
export function exportCompaniesToExcel(companies: Company[]) {
  const headers = [
    'No',
    'Nama Perusahaan / Instansi',
    'Bidang Usaha',
    'Alamat',
    'Pimpinan',
    'Contact Person',
    'Nomor Telepon',
    'Email',
    'Jenis Kerjasama',
    'Status Kerjasama',
    'Tahun Bermitra',
    'Total Lulusan Diterima'
  ];

  const rows = companies.map((c, i) => [
    i + 1,
    c.nama,
    c.bidangUsaha,
    c.alamat,
    c.pimpinan,
    c.contactPerson,
    c.telepon,
    c.email,
    c.jenisKerjaSama.join(', '),
    c.status,
    c.tahunBermitra,
    c.jumlahLulusanDiterima || 0
  ]);

  const csvRows = [
    headers.map(escapeCSV).join(';'),
    ...rows.map(r => r.map(escapeCSV).join(';'))
  ];

  downloadCSV(csvRows.join('\r\n'), `Data_Mitra_Industri_SMKN1WG_${Date.now()}.csv`);
}

/**
 * Parses raw text from imported Excel CSV or tab-delimited file
 */
export function parseStudentsCSV(content: string): Array<Omit<Student, 'id' | 'nomor' | 'createdAt' | 'updatedAt'>> {
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Detect delimiter: semicolon or comma or tab
  const firstLine = lines[0];
  let delimiter = ';';
  if (firstLine.includes(';') && !firstLine.includes('\t')) {
    delimiter = ';';
  } else if (firstLine.includes('\t')) {
    delimiter = '\t';
  } else if (firstLine.includes(',')) {
    delimiter = ',';
  }

  const result: Array<Omit<Student, 'id' | 'nomor' | 'createdAt' | 'updatedAt'>> = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCols = lines[i].split(delimiter).map(col => col.replace(/^"(.*)"$/, '$1').trim());
    if (rawCols.length < 5) continue;

    // Check if col 0 is number or NISN
    let nisn = rawCols[1] || '';
    let nis = rawCols[2] || '';
    let nama = rawCols[3] || rawCols[1];

    if (!rawCols[3] && rawCols[1]) {
      // Fallback alignment
      nama = rawCols[1];
    }

    const student: Omit<Student, 'id' | 'nomor' | 'createdAt' | 'updatedAt'> = {
      nisn: nisn || `00${Math.floor(10000000 + Math.random() * 90000000)}`,
      nis: nis || `${Math.floor(20211000 + Math.random() * 9000)}`,
      namaLengkap: nama || 'Alumni SMKN 1',
      jenisKelamin: rawCols[4]?.toUpperCase().startsWith('P') ? 'P' : 'L',
      tempatLahir: rawCols[5] || 'Lebak',
      tanggalLahir: rawCols[6] || '2005-01-01',
      alamat: rawCols[7] || 'Warunggunung, Lebak, Banten',
      noHp: rawCols[8] || '0812-0000-0000',
      tahunLulus: parseInt(rawCols[9]) || new Date().getFullYear(),
      jurusan: rawCols[10] || 'Teknik Komputer dan Jaringan',
      namaPerusahaan: rawCols[11] || 'PT Mitra Industri',
      alamatPerusahaan: rawCols[12] || 'Kawasan Industri Banten',
      jabatan: rawCols[13] || 'Staff Operasional',
      bidangPekerjaan: rawCols[14] || 'Teknologi & Manufaktur',
      negaraPenempatan: rawCols[15]?.toLowerCase().includes('luar') ? 'Luar Negeri' : 'Indonesia',
      negaraSpesifik: rawCols[16] || 'Indonesia',
      tahunMulaiBekerja: parseInt(rawCols[17]) || new Date().getFullYear(),
      statusPekerjaan: (rawCols[18] as any) || 'Kontrak',
      catatan: rawCols[19] || 'Diimpor dari file Excel'
    };

    result.push(student);
  }

  return result;
}
