import React from 'react';
import { Student, Company, MouDocument, BkkMember, YearlyStatistic, SchoolSettings, ActiveTab } from '../types';
import {
  Users,
  Building2,
  FileCheck2,
  Users2,
  TrendingUp,
  Award,
  Globe2,
  PlusCircle,
  Download,
  School,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Edit3
} from 'lucide-react';
import { exportStudentsToPDF } from '../utils/pdfGenerator';

interface DashboardViewProps {
  students: Student[];
  companies: Company[];
  mous: MouDocument[];
  members: BkkMember[];
  yearlyStats: YearlyStatistic[];
  settings: SchoolSettings;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddStudentModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  companies,
  mous,
  members,
  yearlyStats,
  settings,
  setActiveTab,
  onOpenAddStudentModal
}) => {
  // Aggregate statistics
  const totalStudents = students.length;
  const totalCompanies = companies.length;
  const activeMous = mous.filter(m => m.status === 'Aktif').length;
  const totalMembers = members.length;

  const overseasCount = students.filter(s => s.negaraPenempatan === 'Luar Negeri').length;
  const domesticCount = totalStudents - overseasCount;

  // Department counts
  const deptCounts: Record<string, number> = {};
  students.forEach(s => {
    deptCounts[s.jurusan] = (deptCounts[s.jurusan] || 0) + 1;
  });

  // Top companies
  const compCounts: Record<string, number> = {};
  students.forEach(s => {
    compCounts[s.namaPerusahaan] = (compCounts[s.namaPerusahaan] || 0) + 1;
  });
  const topCompanies = Object.entries(compCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Status counts
  const statusCounts = {
    Kontrak: students.filter(s => s.statusPekerjaan === 'Kontrak').length,
    Tetap: students.filter(s => s.statusPekerjaan === 'Tetap').length,
    Magang: students.filter(s => s.statusPekerjaan === 'Magang').length,
    Wirausaha: students.filter(s => s.statusPekerjaan === 'Wirausaha').length
  };

  const currentYearStat = yearlyStats[yearlyStats.length - 1] || {
    totalLulusan: 410,
    jumlahBekerja: 358,
    persentaseBekerja: 97.5
  };

  const handleQuickDownloadPDF = () => {
    exportStudentsToPDF(students, settings);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Hero Banner with School Officials Lockup */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950/70 to-slate-900 border border-slate-800 p-6 lg:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={settings.logoUrl}
              alt="Logo SMKN 1 Warunggunung"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain p-1.5 bg-white border-2 border-amber-400/90 shadow-lg shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/70 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
                  SISTEM RESMI BKK
                </span>
                <span className="text-xs text-slate-400 font-mono">NPSN: {settings.npsn}</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
                BURSA KERJA KHUSUS SMKN 1 WARUNGGUNUNG
              </h1>
              <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-2xl font-medium">
                "{settings.tagline}"
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenAddStudentModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-900/40 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Input Data Siswa</span>
            </button>
            <button
              onClick={handleQuickDownloadPDF}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Unduh Laporan PDF</span>
            </button>
          </div>
        </div>

        {/* Officials Bar Required by User Brief */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Kepala Bursa Kerja Khusus (BKK)</p>
                <p className="text-xs sm:text-sm font-bold text-amber-300">{settings.namaKepalaBkk}</p>
                <p className="text-[10px] text-slate-400 font-mono">NIP. {settings.nipKepalaBkk}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              title="Edit Nama Kepala BKK"
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
                <School className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Kepala SMK Negeri 1 Warunggunung</p>
                <p className="text-xs sm:text-sm font-bold text-white">{settings.namaKepalaSekolah}</p>
                <p className="text-[10px] text-slate-400 font-mono">NIP. {settings.nipKepalaSekolah}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              title="Edit Nama Kepala Sekolah"
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-300 hover:bg-slate-800 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Siswa Bekerja */}
        <div
          onClick={() => setActiveTab('students')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Siswa Bekerja</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-105 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {totalStudents}
            </span>
            <span className="text-xs text-emerald-400 font-medium">Terverifikasi</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 group-hover:text-blue-300 transition">
            Lihat daftar siswa lengkap <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Card 2: Mitra Industri */}
        <div
          onClick={() => setActiveTab('companies')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Mitra Industri</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-105 transition">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {totalCompanies}
            </span>
            <span className="text-xs text-amber-400 font-medium">DUDIKA</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 group-hover:text-amber-300 transition">
            Lihat profil perusahaan <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Card 3: Dokumen MOU */}
        <div
          onClick={() => setActiveTab('companies')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Dokumen MOU Kerja Sama</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {activeMous}
            </span>
            <span className="text-xs text-emerald-400 font-medium">Dokumen Aktif</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 group-hover:text-emerald-300 transition">
            Lihat arsip MOU legal <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Card 4: Anggota Organisasi BKK */}
        <div
          onClick={() => setActiveTab('organization')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Pengurus Organisasi BKK</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-105 transition">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {totalMembers}
            </span>
            <span className="text-xs text-purple-400 font-medium">Personel</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 group-hover:text-purple-300 transition">
            Bagan struktur hierarki <ChevronRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* Row 2: Charts and Placement Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Penempatan Kerja per Tahun (Bar Chart) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Statistik Penempatan Kerja Siswa per Tahun
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Perbandingan jumlah total lulusan dan yang terserap kerja
              </p>
            </div>
            <button
              onClick={() => setActiveTab('statistics')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
            >
              Detail Statistik <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bar Chart Visualization */}
          <div className="space-y-4">
            {yearlyStats.map((stat) => {
              const maxLulusan = Math.max(...yearlyStats.map(s => s.totalLulusan));
              const percentBekerja = ((stat.jumlahBekerja / stat.totalLulusan) * 100).toFixed(1);
              return (
                <div key={stat.tahun} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 font-mono">{stat.tahun}</span>
                    <div className="flex items-center gap-3 text-slate-400">
                      <span>Bekerja: <strong className="text-amber-400 font-mono">{stat.jumlahBekerja}</strong></span>
                      <span className="text-slate-600">/</span>
                      <span>Total: <strong className="text-slate-300 font-mono">{stat.totalLulusan}</strong></span>
                      <span className="font-semibold text-emerald-400 font-mono">({percentBekerja}%)</span>
                    </div>
                  </div>

                  {/* Dual Bar Representation */}
                  <div className="h-4 bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-l-full transition-all duration-500"
                      style={{ width: `${(stat.jumlahBekerja / maxLulusan) * 100}%` }}
                      title={`Bekerja: ${stat.jumlahBekerja}`}
                    />
                    <div
                      className="bg-blue-600/60 h-full transition-all duration-500"
                      style={{ width: `${((stat.totalLulusan - stat.jumlahBekerja) / maxLulusan) * 100}%` }}
                      title={`Lainnya: ${stat.totalLulusan - stat.jumlahBekerja}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span>Siswa Telah Bekerja</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600/60" />
              <span>Wirausaha / Kuliah / Lainnya</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Status Pekerjaan & Penempatan LN/DN */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 mb-1">
              <Globe2 className="w-4 h-4 text-blue-400" />
              Wilayah & Status Penempatan
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Jangkauan kerja alumni dalam dan luar negeri
            </p>

            {/* Indonesia vs Luar Negeri Card */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[11px] text-slate-400">Indonesia</p>
                <p className="text-xl font-bold text-white font-mono mt-1">{domesticCount}</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{ width: `${(domesticCount / (totalStudents || 1)) * 100}%` }}
                  />
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[11px] text-amber-400">Luar Negeri (Jepang/LN)</p>
                <p className="text-xl font-bold text-amber-300 font-mono mt-1">{overseasCount}</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2">
                  <div
                    className="bg-amber-400 h-1.5 rounded-full"
                    style={{ width: `${(overseasCount / (totalStudents || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Employment Status Distribution */}
            <p className="text-xs font-semibold text-slate-300 mb-2.5">Distribusi Status Kontrak</p>
            <div className="space-y-2">
              {Object.entries(statusCounts).map(([status, count]) => {
                const pct = ((count / (totalStudents || 1)) * 100).toFixed(0);
                return (
                  <div key={status} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{status}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-400 to-blue-500 h-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-mono text-slate-200 w-8 text-right font-medium">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/40 flex items-center gap-3">
              <Award className="w-6 h-6 text-amber-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-white">Akreditasi BKK: Unggul</p>
                <p className="text-slate-400 text-[11px]">Tingkat keterserapan rata-rata {currentYearStat.persentaseBekerja}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Grafik Jurusan & Top Perusahaan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribusi berdasarkan Jurusan */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Penempatan Siswa Berdasarkan Jurusan
              </h2>
              <p className="text-xs text-slate-400">Kompetensi keahlian SMKN 1 Warunggunung</p>
            </div>
            <button
              onClick={() => setActiveTab('students')}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Filter Jurusan
            </button>
          </div>

          <div className="space-y-3">
            {Object.entries(deptCounts).map(([jurusan, count]) => {
              const pct = ((count / (totalStudents || 1)) * 100).toFixed(1);
              return (
                <div key={jurusan} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-200">{jurusan}</span>
                    <span className="font-mono text-amber-300 font-bold">{count} Siswa ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-amber-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Perusahaan Tempat Bekerja */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Top Perusahaan Perekrut Terbanyak
              </h2>
              <p className="text-xs text-slate-400">Mitra industri penerima alumni terbanyak</p>
            </div>
            <button
              onClick={() => setActiveTab('companies')}
              className="text-xs text-amber-400 hover:text-amber-300"
            >
              Lihat Mitra
            </button>
          </div>

          <div className="space-y-3">
            {topCompanies.map(([namaComp, count], idx) => (
              <div
                key={namaComp}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{namaComp}</p>
                    <p className="text-[11px] text-slate-400">Mitra Industri Terverifikasi</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-300 font-mono">{count} Siswa</span>
                  <p className="text-[10px] text-emerald-400">Penempatan Aktif</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Siswa Terbaru yang Bekerja */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Data Penempatan Siswa Terbaru
            </h2>
            <p className="text-xs text-slate-400">Daftar alumni yang baru selesai diverifikasi bekerja</p>
          </div>
          <button
            onClick={() => setActiveTab('students')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            Buka Kelola Data Siswa <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Siswa</th>
                <th className="py-2.5 px-3">Jurusan</th>
                <th className="py-2.5 px-3">Perusahaan & Posisi</th>
                <th className="py-2.5 px-3">Penempatan</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Tahun Lulus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {students.slice(0, 5).map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={s.fotoSiswa || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={s.namaLengkap}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-white">{s.namaLengkap}</p>
                        <p className="text-[10px] text-slate-400 font-mono">NISN: {s.nisn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{s.jurusan}</td>
                  <td className="py-3 px-3">
                    <p className="text-slate-200 font-medium">{s.namaPerusahaan}</p>
                    <p className="text-[10px] text-amber-400/90">{s.jabatan}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[11px] text-slate-300">
                      {s.negaraPenempatan === 'Luar Negeri' ? `Luar Negeri (${s.negaraSpesifik || 'LN'})` : 'Indonesia'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      s.statusPekerjaan === 'Tetap'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : s.statusPekerjaan === 'Wirausaha'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                        : 'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}>
                      {s.statusPekerjaan}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300 font-semibold">
                    {s.tahunLulus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
