import React, { useState } from 'react';
import { Student, Company, MouDocument, BkkMember, YearlyStatistic, Department, SchoolSettings } from '../types';
import {
  exportStudentsToPDF,
  exportStatisticsToPDF,
  exportCompaniesAndMousToPDF,
  exportOrganizationToPDF
} from '../utils/pdfGenerator';
import { exportStudentsToExcel, exportCompaniesToExcel } from '../utils/excelExport';
import {
  FileText,
  FileSpreadsheet,
  Download,
  Calendar,
  Building2,
  Users,
  Award,
  Users2,
  CheckCircle2,
  Printer,
  Sparkles
} from 'lucide-react';

interface ReportsCenterViewProps {
  students: Student[];
  companies: Company[];
  mous: MouDocument[];
  members: BkkMember[];
  yearlyStats: YearlyStatistic[];
  departments: Department[];
  settings: SchoolSettings;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const ReportsCenterView: React.FC<ReportsCenterViewProps> = ({
  students,
  companies,
  mous,
  members,
  yearlyStats,
  departments,
  settings,
  showToast
}) => {
  const [selectedTahun, setSelectedTahun] = useState<string>('all');
  const [selectedJurusan, setSelectedJurusan] = useState<string>('all');
  const [selectedPerusahaan, setSelectedPerusahaan] = useState<string>('all');

  const uniqueYears = Array.from(new Set(students.map(s => s.tahunLulus))).sort((a, b) => b - a);
  const uniqueCompanies = Array.from(new Set(students.map(s => s.namaPerusahaan))).sort();

  // Filter students based on current selection
  const filteredStudents = students.filter(s => {
    if (selectedTahun !== 'all' && String(s.tahunLulus) !== selectedTahun) return false;
    if (selectedJurusan !== 'all' && s.jurusan !== selectedJurusan) return false;
    if (selectedPerusahaan !== 'all' && s.namaPerusahaan !== selectedPerusahaan) return false;
    return true;
  });

  const handleDownloadAllStudentsPDF = () => {
    exportStudentsToPDF(students, settings);
    showToast('success', 'PDF Sedang Diunduh', 'Laporan seluruh siswa bekerja berhasil dibuat.');
  };

  const handleDownloadFilteredStudentsPDF = () => {
    exportStudentsToPDF(filteredStudents, settings, {
      tahun: selectedTahun,
      jurusan: selectedJurusan,
      perusahaan: selectedPerusahaan
    });
    showToast('success', 'PDF Filter Diunduh', `Laporan ${filteredStudents.length} siswa hasil filter berhasil diunduh.`);
  };

  const handleDownloadStatsPDF = () => {
    exportStatisticsToPDF(yearlyStats, students, settings);
    showToast('success', 'Laporan Statistik Diunduh', 'Laporan keterserapan & statistik lulusan berhasil dibuat.');
  };

  const handleDownloadMitraMouPDF = () => {
    exportCompaniesAndMousToPDF(companies, mous, settings);
    showToast('success', 'Laporan Mitra & MOU Diunduh', 'Dokumen rekapitulasi DUDIKA dan MOU berhasil dibuat.');
  };

  const handleDownloadOrgPDF = () => {
    exportOrganizationToPDF(members, settings);
    showToast('success', 'Struktur Organisasi Diunduh', 'SK & bagan struktur BKK resmi berhasil dibuat.');
  };

  const handleDownloadStudentsExcel = () => {
    exportStudentsToExcel(filteredStudents);
    showToast('success', 'Excel Siswa Berhasil Diunduh', 'File format CSV/Excel siap dibuka.');
  };

  const handleDownloadCompaniesExcel = () => {
    exportCompaniesToExcel(companies);
    showToast('success', 'Excel Mitra Berhasil Diunduh', 'File format CSV/Excel siap dibuka.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950/60 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/70 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
            PUSAT PENGUNDUHAN DOKUMEN RESMI
          </span>
          <span className="text-xs text-slate-400 font-mono">STANDAR KOP RESMI SMKN 1 WARUNGGUNUNG</span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          Laporan Cetak & Berkas PDF / Excel
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Seluruh berkas laporan otomatis dilengkapi dengan Kop Surat Resmi Pemerintah Provinsi Banten, Dinas Pendidikan & Kebudayaan, Logo Sekolah, dan Kolom Tanda Tangan Kepala BKK serta Kepala Sekolah.
        </p>
      </div>

      {/* Filter Generator Box */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Filter Parameter Laporan Siswa Bekerja
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Tahun Lulus</label>
            <select
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">Semua Tahun</option>
              {uniqueYears.map(yr => (
                <option key={yr} value={String(yr)}>Tahun {yr}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Kompetensi Keahlian / Jurusan</label>
            <select
              value={selectedJurusan}
              onChange={(e) => setSelectedJurusan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">Semua Jurusan</option>
              {departments.map(d => (
                <option key={d.id} value={d.nama}>{d.singkatan} - {d.nama}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Perusahaan Tempat Bekerja</label>
            <select
              value={selectedPerusahaan}
              onChange={(e) => setSelectedPerusahaan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">Semua Perusahaan Mitra</option>
              {uniqueCompanies.map(comp => (
                <option key={comp} value={comp}>{comp}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400">
            Hasil kriteria filter: <strong className="text-amber-300 font-mono">{filteredStudents.length} Siswa</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFilteredStudentsPDF}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-md shadow-blue-900/30 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Unduh PDF Sesuai Filter ({filteredStudents.length})</span>
            </button>
            <button
              onClick={handleDownloadStudentsExcel}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-md shadow-emerald-900/30 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reports Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Report 1: Seluruh Data Siswa Bekerja */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                1. Laporan Lengkap Seluruh Siswa Bekerja
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Format landscape memuat tabel 11 kolom: nomor, NISN, nama lengkap, gender, jurusan, tahun lulus, perusahaan, jabatan, status ikatan kerja, penempatan (Indonesia/Jepang), dan kontak WA.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Kop Surat & Tanda Tangan Resmi Terpasang</span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">{students.length} Total Data</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadAllStudentsPDF}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF</span>
              </button>
              <button
                onClick={() => exportStudentsToExcel(students)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Report 2: Statistik & Keterserapan Lulusan */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                2. Laporan Statistik & Keterserapan Tahunan
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Laporan penyerapan kerja tahun 2021 hingga 2026, breakdown total lulusan, persentase bekerja di industri, wirausaha, kuliah, serta tabel distribusi per kompetensi keahlian.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Dokumen Akreditasi & Verifikasi Pengawas</span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">{yearlyStats.length} Periode Tahun</span>
            <button
              onClick={handleDownloadStatsPDF}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PDF Statistik</span>
            </button>
          </div>
        </div>

        {/* Report 3: Daftar Mitra Industri & MOU */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                3. Laporan Kemitraan Industri & Dokumen MOU
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Rekapitulasi resmi seluruh Dunia Usaha & Dunia Industri (DUDIKA), masa berlaku surat perjanjian kerja sama, pimpinan, nomor kontak dan pihak penandatangan.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Arsip Legal Kerjasama BKK SMKN 1</span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">{companies.length} Mitra • {mous.length} MOU</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadMitraMouPDF}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF MOU</span>
              </button>
              <button
                onClick={handleDownloadCompaniesExcel}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Report 4: Struktur Organisasi BKK */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                4. Surat Keputusan & Bagan Struktur Organisasi
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Dokumen resmi susunan kepengurusan BKK SMKN 1 Warunggunung lengkap dengan NIP, nomor kontak WhatsApp, alamat email resmi, serta uraian tugas pokok dan fungsi (Tupoksi).
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Format Lampiran SK Kepala Sekolah</span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">{members.length} Pengurus BKK</span>
            <button
              onClick={handleDownloadOrgPDF}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition shadow-md shadow-purple-900/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh SK & Bagan PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
