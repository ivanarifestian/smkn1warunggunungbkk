import React, { useState, useMemo } from 'react';
import { Student, YearlyStatistic, Department, SchoolSettings } from '../types';
import { exportStatisticsToPDF } from '../utils/pdfGenerator';
import {
  BarChart3,
  PieChart as PieIcon,
  Download,
  Printer,
  Maximize2,
  Minimize2,
  TrendingUp,
  Globe2,
  Users,
  Award,
  Calendar,
  Briefcase,
  CheckCircle2
} from 'lucide-react';

interface StatisticsViewProps {
  students: Student[];
  yearlyStats: YearlyStatistic[];
  departments: Department[];
  settings: SchoolSettings;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  isFullscreenPresentation?: boolean;
  onTogglePresentationMode?: () => void;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  students,
  yearlyStats,
  departments,
  settings,
  showToast,
  isFullscreenPresentation = false,
  onTogglePresentationMode
}) => {
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterDept, setFilterDept] = useState<string>('all');

  // Filter students based on year and dept
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      if (filterYear !== 'all' && String(s.tahunLulus) !== filterYear) return false;
      if (filterDept !== 'all' && s.jurusan !== filterDept) return false;
      return true;
    });
  }, [students, filterYear, filterDept]);

  // Aggregate stats
  const total = filteredStudents.length;
  const maleCount = filteredStudents.filter(s => s.jenisKelamin === 'L').length;
  const femaleCount = filteredStudents.filter(s => s.jenisKelamin === 'P').length;

  const overseasCount = filteredStudents.filter(s => s.negaraPenempatan === 'Luar Negeri').length;
  const domesticCount = total - overseasCount;

  // Department counts
  const deptCounts: Record<string, number> = {};
  filteredStudents.forEach(s => {
    deptCounts[s.jurusan] = (deptCounts[s.jurusan] || 0) + 1;
  });

  // Top companies
  const compCounts: Record<string, number> = {};
  filteredStudents.forEach(s => {
    compCounts[s.namaPerusahaan] = (compCounts[s.namaPerusahaan] || 0) + 1;
  });
  const sortedCompanies = Object.entries(compCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Status breakdown
  const statusCounts = {
    Kontrak: filteredStudents.filter(s => s.statusPekerjaan === 'Kontrak').length,
    Tetap: filteredStudents.filter(s => s.statusPekerjaan === 'Tetap').length,
    Magang: filteredStudents.filter(s => s.statusPekerjaan === 'Magang').length,
    Wirausaha: filteredStudents.filter(s => s.statusPekerjaan === 'Wirausaha').length
  };

  // Yearly Absorption Stats
  const activeYearlyStats = useMemo(() => {
    if (filterYear === 'all') return yearlyStats;
    return yearlyStats.filter(s => String(s.tahun) === filterYear);
  }, [yearlyStats, filterYear]);

  const handleDownloadPDF = () => {
    exportStatisticsToPDF(yearlyStats, students, settings);
    showToast('success', 'Laporan Statistik Diunduh', 'Dokumen PDF statistik tahunan berhasil diunduh.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`space-y-6 pb-12 ${isFullscreenPresentation ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto' : ''}`}>
      {/* Top Banner & Mode Switch */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Pusat Statistik & Presentasi Keterserapan Kerja
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
              Tracer Study BKK
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualisasi data penempatan kerja alumni SMKN 1 Warunggunung untuk akreditasi & pelaporan dinas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onTogglePresentationMode && (
            <button
              onClick={onTogglePresentationMode}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isFullscreenPresentation
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
              }`}
            >
              {isFullscreenPresentation ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>Keluar Presentasi</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span>Mode Presentasi Layar Penuh</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-md shadow-blue-900/30 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Laporan PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Cetak Grafik</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-300">Tahun Lulus:</span>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">Semua Tahun (2021 - 2026)</option>
              {yearlyStats.map(y => (
                <option key={y.tahun} value={String(y.tahun)}>Tahun {y.tahun}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-slate-300">Jurusan:</span>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">Semua Kompetensi Keahlian</option>
              {departments.map(d => (
                <option key={d.id} value={d.nama}>{d.singkatan} - {d.nama}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-slate-400 text-xs">
          Sampel Analisis: <strong className="text-white font-mono">{filteredStudents.length} Siswa</strong>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <p className="text-xs text-slate-400 font-semibold">Tingkat Keterserapan Rata-rata</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
              97.5%
            </span>
            <span className="text-xs text-emerald-400 font-semibold">+2.8%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Target Dinas Banten: 85%</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <p className="text-xs text-slate-400 font-semibold">Rasio Penempatan Kerja</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {total}
            </span>
            <span className="text-xs text-blue-400">Terserap</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Industri & Lembaga Resmi</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <p className="text-xs text-slate-400 font-semibold">Rasio Gender (L / P)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-extrabold text-blue-300 font-mono">
              {maleCount} L
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xl sm:text-2xl font-extrabold text-pink-300 font-mono">
              {femaleCount} P
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {((maleCount / (total || 1)) * 100).toFixed(0)}% Laki-laki • {((femaleCount / (total || 1)) * 100).toFixed(0)}% Perempuan
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <p className="text-xs text-slate-400 font-semibold">Penempatan Luar Negeri</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
              {overseasCount}
            </span>
            <span className="text-xs text-amber-400">Jepang/LN</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Program Ginou Jisshusei</p>
        </div>
      </div>

      {/* Row 1: Perbandingan Jumlah Lulusan vs Siswa Bekerja Setiap Tahun */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Perbandingan Jumlah Lulusan vs Siswa Telah Bekerja per Tahun
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Grafik batang pertumbuhan lulusan, serapan kerja, wirausaha, dan yang melanjutkan studi
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {activeYearlyStats.map(stat => {
            const pctBekerja = ((stat.jumlahBekerja / stat.totalLulusan) * 100).toFixed(1);
            const pctWirausaha = ((stat.jumlahWirausaha / stat.totalLulusan) * 100).toFixed(1);
            const pctKuliah = ((stat.jumlahMelanjutkan / stat.totalLulusan) * 100).toFixed(1);
            const maxVal = Math.max(...yearlyStats.map(s => s.totalLulusan));

            return (
              <div key={stat.tahun} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-white font-mono">Tahun {stat.tahun}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold">
                      {stat.persentaseBekerja}% Keterserapan
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 font-mono">
                    <span>Lulusan: <strong className="text-white">{stat.totalLulusan}</strong></span>
                    <span>Bekerja: <strong className="text-amber-400">{stat.jumlahBekerja}</strong></span>
                    <span>Wirausaha: <strong className="text-purple-400">{stat.jumlahWirausaha}</strong></span>
                    <span>Kuliah: <strong className="text-blue-400">{stat.jumlahMelanjutkan}</strong></span>
                  </div>
                </div>

                {/* Stacked Multi-Segment Bar */}
                <div className="h-5 bg-slate-800 rounded-full overflow-hidden flex">
                  {/* Bekerja */}
                  <div
                    className="bg-amber-400 h-full flex items-center justify-center text-[10px] text-slate-950 font-bold"
                    style={{ width: `${(stat.jumlahBekerja / maxVal) * 100}%` }}
                    title={`Bekerja: ${stat.jumlahBekerja} (${pctBekerja}%)`}
                  >
                    {stat.jumlahBekerja}
                  </div>
                  {/* Wirausaha */}
                  <div
                    className="bg-purple-500 h-full flex items-center justify-center text-[10px] text-white font-bold"
                    style={{ width: `${(stat.jumlahWirausaha / maxVal) * 100}%` }}
                    title={`Wirausaha: ${stat.jumlahWirausaha} (${pctWirausaha}%)`}
                  >
                    {stat.jumlahWirausaha}
                  </div>
                  {/* Kuliah */}
                  <div
                    className="bg-blue-500 h-full flex items-center justify-center text-[10px] text-white font-bold"
                    style={{ width: `${(stat.jumlahMelanjutkan / maxVal) * 100}%` }}
                    title={`Melanjutkan: ${stat.jumlahMelanjutkan} (${pctKuliah}%)`}
                  >
                    {stat.jumlahMelanjutkan}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span>Bekerja di Industri / DUDIKA</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500" />
            <span>Wirausaha Mandiri</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Melanjutkan Pendidikan Tinggi / Kuliah</span>
          </div>
        </div>
      </div>

      {/* Row 2: Distribusi Jurusan & Distribusi Perusahaan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jurusan Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-blue-400" />
                Distribusi Keterserapan per Jurusan
              </h2>
              <p className="text-xs text-slate-400">Proporsi lulusan bekerja tiap kompetensi keahlian</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {Object.entries(deptCounts).map(([dept, count]) => {
              const pct = ((count / (total || 1)) * 100).toFixed(1);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-semibold">{dept}</span>
                    <span className="font-mono text-amber-300 font-bold">{count} Siswa ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Perusahaan */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                Sebaran Siswa Berdasarkan Perusahaan Mitra
              </h2>
              <p className="text-xs text-slate-400">Perusahaan dengan penyerapan lulusan paling intensif</p>
            </div>
          </div>

          <div className="space-y-3">
            {sortedCompanies.map(([comp, count], i) => {
              const pct = ((count / (total || 1)) * 100).toFixed(1);
              return (
                <div key={comp} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-xs">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{comp}</p>
                      <p className="text-[10px] text-slate-400">Mitra Industri Terakreditasi BKK</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-amber-300 font-bold text-xs">{count} Siswa</span>
                    <p className="text-[10px] text-slate-400 font-mono">({pct}%)</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Gender, Status Kontrak & Wilayah Penempatan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gender */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            Distribusi Gender
          </h3>
          <p className="text-xs text-slate-400 mb-4">Perbandingan penempatan putra & putri</p>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300">Laki-laki</span>
                <span className="font-mono font-bold text-blue-300">{maleCount} Siswa ({((maleCount / (total || 1)) * 100).toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(maleCount / (total || 1)) * 100}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300">Perempuan</span>
                <span className="font-mono font-bold text-pink-300">{femaleCount} Siswi ({((femaleCount / (total || 1)) * 100).toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-pink-500 h-full rounded-full" style={{ width: `${(femaleCount / (total || 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Status Kontrak */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Status Hubungan Kerja
          </h3>
          <p className="text-xs text-slate-400 mb-4">Jenis ikatan kerja dengan instansi</p>

          <div className="space-y-2 text-xs">
            {Object.entries(statusCounts).map(([status, count]) => {
              const pct = ((count / (total || 1)) * 100).toFixed(1);
              return (
                <div key={status} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-300">{status}</span>
                  <span className="font-mono text-amber-300 font-bold">{count} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Luar Negeri vs Indonesia */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-amber-400" />
            Penempatan Wilayah
          </h3>
          <p className="text-xs text-slate-400 mb-4">Dalam negeri vs Luar Negeri (Jepang/LN)</p>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300">Indonesia (Nasional)</span>
                <span className="font-mono font-bold text-emerald-300">{domesticCount} ({((domesticCount / (total || 1)) * 100).toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(domesticCount / (total || 1)) * 100}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-amber-400">Luar Negeri (Jepang)</span>
                <span className="font-mono font-bold text-amber-300">{overseasCount} ({((overseasCount / (total || 1)) * 100).toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(overseasCount / (total || 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
