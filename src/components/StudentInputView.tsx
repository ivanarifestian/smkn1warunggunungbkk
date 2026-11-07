import React, { useState, useMemo, useRef } from 'react';
import { Student, Department, SchoolSettings, Gender, EmploymentStatus, PlacementLocation } from '../types';
import { db } from '../services/db';
import { exportStudentsToPDF } from '../utils/pdfGenerator';
import { exportStudentsToExcel, parseStudentsCSV } from '../utils/excelExport';
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Printer,
  Trash2,
  Edit2,
  Eye,
  X,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  Image as ImageIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface StudentInputViewProps {
  students: Student[];
  departments: Department[];
  settings: SchoolSettings;
  onRefreshData: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  initialAddModalOpen?: boolean;
}

export const StudentInputView: React.FC<StudentInputViewProps> = ({
  students,
  departments,
  settings,
  onRefreshData,
  showToast,
  initialAddModalOpen = false
}) => {
  // Filter and Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJurusan, setFilterJurusan] = useState('all');
  const [filterTahun, setFilterTahun] = useState('all');
  const [filterPerusahaan, setFilterPerusahaan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterNegara, setFilterNegara] = useState('all');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(initialAddModalOpen);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Selected student for edit / detail / delete
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form State
  const initialFormData = {
    nisn: '',
    nis: '',
    namaLengkap: '',
    jenisKelamin: 'L' as Gender,
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    noHp: '',
    tahunLulus: new Date().getFullYear(),
    jurusan: departments[0]?.nama || 'Teknik Komputer dan Jaringan',
    namaPerusahaan: '',
    alamatPerusahaan: '',
    jabatan: '',
    bidangPekerjaan: '',
    negaraPenempatan: 'Indonesia' as PlacementLocation,
    negaraSpesifik: 'Indonesia',
    tahunMulaiBekerja: new Date().getFullYear(),
    statusPekerjaan: 'Kontrak' as EmploymentStatus,
    fotoSiswa: '',
    buktiBekerja: '',
    catatan: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // File upload refs
  const fotoInputRef = useRef<HTMLInputElement>(null);
  const buktiInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);
  const [importText, setImportText] = useState('');

  // Extract unique options for filters
  const uniqueYears = useMemo(() => {
    const years = Array.from(new Set(students.map(s => s.tahunLulus))).sort((a, b) => b - a);
    return years;
  }, [students]);

  const uniqueCompanies = useMemo(() => {
    const comps = Array.from(new Set(students.map(s => s.namaPerusahaan))).sort();
    return comps;
  }, [students]);

  // Filtered and searched data
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        student.namaLengkap.toLowerCase().includes(q) ||
        student.nisn.includes(q) ||
        student.nis.includes(q) ||
        student.namaPerusahaan.toLowerCase().includes(q) ||
        student.jabatan.toLowerCase().includes(q);

      if (!matchSearch) return false;

      // Filter Jurusan
      if (filterJurusan !== 'all' && student.jurusan !== filterJurusan) return false;

      // Filter Tahun
      if (filterTahun !== 'all' && String(student.tahunLulus) !== filterTahun) return false;

      // Filter Perusahaan
      if (filterPerusahaan !== 'all' && student.namaPerusahaan !== filterPerusahaan) return false;

      // Filter Status
      if (filterStatus !== 'all' && student.statusPekerjaan !== filterStatus) return false;

      // Filter Negara
      if (filterNegara !== 'all' && student.negaraPenempatan !== filterNegara) return false;

      return true;
    });
  }, [students, searchQuery, filterJurusan, filterTahun, filterPerusahaan, filterStatus, filterNegara]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  // Reset page when filter changes
  const handleFilterChange = (setter: (val: string) => void, val: string) => {
    setter(val);
    setCurrentPage(1);
  };

  // Open Add modal
  const handleOpenAdd = () => {
    setSelectedStudent(null);
    setFormData(initialFormData);
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      nisn: student.nisn,
      nis: student.nis,
      namaLengkap: student.namaLengkap,
      jenisKelamin: student.jenisKelamin,
      tempatLahir: student.tempatLahir,
      tanggalLahir: student.tanggalLahir,
      alamat: student.alamat,
      noHp: student.noHp,
      tahunLulus: student.tahunLulus,
      jurusan: student.jurusan,
      namaPerusahaan: student.namaPerusahaan,
      alamatPerusahaan: student.alamatPerusahaan,
      jabatan: student.jabatan,
      bidangPekerjaan: student.bidangPekerjaan,
      negaraPenempatan: student.negaraPenempatan,
      negaraSpesifik: student.negaraSpesifik || 'Indonesia',
      tahunMulaiBekerja: student.tahunMulaiBekerja,
      statusPekerjaan: student.statusPekerjaan,
      fotoSiswa: student.fotoSiswa || '',
      buktiBekerja: student.buktiBekerja || '',
      catatan: student.catatan || ''
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Handle Form Submit
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.namaLengkap.trim()) errors.namaLengkap = 'Nama lengkap wajib diisi';
    if (!formData.nisn.trim()) errors.nisn = 'NISN wajib diisi';
    if (!formData.namaPerusahaan.trim()) errors.namaPerusahaan = 'Nama perusahaan wajib diisi';
    if (!formData.jabatan.trim()) errors.jabatan = 'Jabatan / posisi wajib diisi';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('error', 'Validasi Formulir Gagal', 'Lengkapi seluruh data wajib dengan benar.');
      return;
    }

    if (selectedStudent) {
      // Update
      db.updateStudent(selectedStudent.id, formData);
      showToast('success', 'Data Diperbarui', `Data alumni ${formData.namaLengkap} berhasil diperbarui.`);
    } else {
      // Add
      db.addStudent(formData);
      showToast('success', 'Data Disimpan', `Alumni ${formData.namaLengkap} berhasil ditambahkan ke database.`);
    }

    setIsFormModalOpen(false);
    onRefreshData();
  };

  // Open Delete confirmation
  const handleConfirmDelete = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = () => {
    if (!studentToDelete) return;
    db.deleteStudent(studentToDelete.id);
    showToast('info', 'Data Terhapus', `Data alumni ${studentToDelete.namaLengkap} telah dihapus.`);
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
    onRefreshData();
  };

  // Handle file uploads to Base64 data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'fotoSiswa' | 'buktiBekerja') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      showToast('error', 'Ukuran File Terlalu Besar', 'Maksimal ukuran file foto/bukti adalah 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        [field]: reader.result as string
      }));
      showToast('success', 'File Terunggah', `${field === 'fotoSiswa' ? 'Foto siswa' : 'Bukti bekerja'} berhasil dimuat.`);
    };
    reader.readAsDataURL(file);
  };

  // Import from CSV / Excel file
  const handleExcelImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleProcessImport = () => {
    if (!importText.trim()) {
      showToast('error', 'Data Kosong', 'Pilih file CSV atau tempel teks tabel Excel terlebih dahulu.');
      return;
    }

    const parsed = parseStudentsCSV(importText);
    if (parsed.length === 0) {
      showToast('error', 'Format Tidak Sesuai', 'Tidak ada data valid yang dapat diimpor. Pastikan format tabel sesuai.');
      return;
    }

    const addedCount = db.batchAddStudents(parsed);
    showToast('success', 'Impor Berhasil', `Berhasil mengimpor ${addedCount} data siswa ke database.`);
    setIsImportModalOpen(false);
    setImportText('');
    onRefreshData();
  };

  // Export handlers
  const handleExportPDFAll = () => {
    exportStudentsToPDF(students, settings);
    showToast('success', 'PDF Sedang Diunduh', 'Laporan seluruh siswa bekerja berhasil dibuat.');
  };

  const handleExportPDFFiltered = () => {
    exportStudentsToPDF(filteredStudents, settings, {
      tahun: filterTahun,
      jurusan: filterJurusan,
      perusahaan: filterPerusahaan
    });
    showToast('success', 'PDF Filter Sedang Diunduh', `Laporan ${filteredStudents.length} siswa hasil filter berhasil dibuat.`);
  };

  const handleExportExcel = () => {
    exportStudentsToExcel(filteredStudents);
    showToast('success', 'Excel Diekspor', 'Data berhasil diekspor ke file CSV/Excel.');
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Data Alumni & Siswa Telah Bekerja
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900/60 text-blue-300 font-mono font-bold border border-blue-700/50">
              {filteredStudents.length} Data
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pengelolaan pencatatan penelusuran lulusan (Tracer Study) BKK SMKN 1 Warunggunung
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-900/40 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Data Siswa</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
            title="Impor dari Excel"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Impor Excel</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
            title="Download Excel / CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ekspor Excel</span>
          </button>

          <div className="flex items-center rounded-xl bg-slate-800 border border-slate-700 p-0.5">
            <button
              onClick={handleExportPDFAll}
              className="px-2.5 py-1.5 text-xs text-amber-300 hover:text-amber-200 font-semibold transition"
              title="Unduh Seluruh Data dalam format PDF"
            >
              PDF Semua
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={handleExportPDFFiltered}
              className="px-2.5 py-1.5 text-xs text-blue-300 hover:text-blue-200 font-semibold transition"
              title="Unduh Data Berdasarkan Filter Aktif"
            >
              PDF Filter
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari nama siswa, NISN, atau perusahaan..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Filter Jurusan */}
          <div>
            <select
              value={filterJurusan}
              onChange={(e) => handleFilterChange(setFilterJurusan, e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">Semua Jurusan</option>
              {departments.map(d => (
                <option key={d.id} value={d.nama}>{d.singkatan} - {d.nama}</option>
              ))}
            </select>
          </div>

          {/* Filter Tahun */}
          <div>
            <select
              value={filterTahun}
              onChange={(e) => handleFilterChange(setFilterTahun, e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">Semua Tahun Lulus</option>
              {uniqueYears.map(yr => (
                <option key={yr} value={String(yr)}>Tahun {yr}</option>
              ))}
            </select>
          </div>

          {/* Filter Status Pekerjaan */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange(setFilterStatus, e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">Semua Status</option>
              <option value="Tetap">Tetap</option>
              <option value="Kontrak">Kontrak</option>
              <option value="Magang">Magang</option>
              <option value="Wirausaha">Wirausaha</option>
            </select>
          </div>

          {/* Filter Penempatan */}
          <div>
            <select
              value={filterNegara}
              onChange={(e) => handleFilterChange(setFilterNegara, e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">Semua Penempatan</option>
              <option value="Indonesia">Dalam Negeri (Indonesia)</option>
              <option value="Luar Negeri">Luar Negeri (Jepang/LN)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicator */}
        {(filterJurusan !== 'all' || filterTahun !== 'all' || filterStatus !== 'all' || filterNegara !== 'all' || searchQuery) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400">
              Menampilkan {filteredStudents.length} dari {students.length} total siswa
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterJurusan('all');
                setFilterTahun('all');
                setFilterPerusahaan('all');
                setFilterStatus('all');
                setFilterNegara('all');
                setCurrentPage(1);
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* Main Data Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3 text-center">No</th>
                <th className="py-3 px-4">Nama Siswa & NISN</th>
                <th className="py-3 px-3">Jurusan</th>
                <th className="py-3 px-3 text-center">Tahun</th>
                <th className="py-3 px-4">Perusahaan & Jabatan</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Penempatan</th>
                <th className="py-3 px-3">Kontak WA</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-300">Tidak ada data siswa yang cocok.</p>
                    <p className="text-xs text-slate-500 mt-1">Coba ubah kata kunci pencarian atau reset filter.</p>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 text-center font-mono text-slate-400">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.fotoSiswa || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={student.namaLengkap}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0 bg-slate-800"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">{student.namaLengkap}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                            <span>NISN: {student.nisn}</span>
                            <span>•</span>
                            <span>{student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-300 font-medium">{student.jurusan}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-amber-300">
                      {student.tahunLulus}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-white font-semibold">{student.namaPerusahaan}</p>
                      <p className="text-[10px] text-amber-400/90">{student.jabatan}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-xs">{student.bidangPekerjaan}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                        student.statusPekerjaan === 'Tetap'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : student.statusPekerjaan === 'Wirausaha'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : student.statusPekerjaan === 'Magang'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}>
                        {student.statusPekerjaan}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {student.negaraPenempatan === 'Luar Negeri' ? (
                        <span className="text-[11px] font-semibold text-amber-300">
                          {student.negaraSpesifik || 'Luar Negeri'}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-300">Indonesia</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300 text-[11px]">
                      {student.noHp}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsDetailModalOpen(true);
                          }}
                          title="Lihat Detail Siswa & Bukti Bekerja"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-300 hover:bg-slate-800 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(student)}
                          title="Edit Data Siswa"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleConfirmDelete(student)}
                          title="Hapus Data Siswa"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Menampilkan baris {(currentPage - 1) * itemsPerPage + 1} hingga{' '}
            {Math.min(currentPage * itemsPerPage, filteredStudents.length)} dari {filteredStudents.length} siswa
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-slate-200">
              Hal {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: TAMBAH / EDIT DATA SISWA (19 Mandatory Fields) */}
      {/* ========================================================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedStudent ? 'Edit Data Siswa Bekerja' : 'Formulir Input Data Siswa Bekerja'}
                </h3>
                <p className="text-xs text-slate-400">
                  Lengkapi 19 field biodata siswa, kompetensi keahlian, dan instansi penempatan kerja.
                </p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveStudent} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* Section 1: Data Identitas Siswa */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                  1. Identitas Alumni / Siswa
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">NISN (10 Digit) *</label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={formData.nisn}
                      onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                      placeholder="0061234567"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    {formErrors.nisn && <p className="text-rose-400 text-[10px] mt-0.5">{formErrors.nisn}</p>}
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">NIS Sekolah</label>
                    <input
                      type="text"
                      value={formData.nis}
                      onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                      placeholder="212210045"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Jenis Kelamin *</label>
                    <select
                      value={formData.jenisKelamin}
                      onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as Gender })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Nama Lengkap Siswa *</label>
                    <input
                      type="text"
                      required
                      value={formData.namaLengkap}
                      onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                      placeholder="Nama lengkap sesuai ijazah"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    {formErrors.namaLengkap && <p className="text-rose-400 text-[10px] mt-0.5">{formErrors.namaLengkap}</p>}
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Nomor HP / WhatsApp *</label>
                    <input
                      type="text"
                      required
                      value={formData.noHp}
                      onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                      placeholder="0812-3456-7890"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Tempat Lahir</label>
                    <input
                      type="text"
                      value={formData.tempatLahir}
                      onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                      placeholder="Lebak / Pandeglang / Serang"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Tanggal Lahir</label>
                    <input
                      type="date"
                      value={formData.tanggalLahir}
                      onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Alamat Domisili Siswa</label>
                  <textarea
                    rows={2}
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    placeholder="Kp. Cempaka, Kec. Warunggunung, Kab. Lebak, Banten"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Section 2: Kompetensi Keahlian & Kelulusan */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                  2. Jurusan & Tahun Kelulusan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Kompetensi Keahlian / Jurusan *</label>
                    <select
                      value={formData.jurusan}
                      onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      {departments.map(d => (
                        <option key={d.id} value={d.nama}>{d.singkatan} - {d.nama}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Tahun Kelulusan *</label>
                    <input
                      type="number"
                      required
                      min={2015}
                      max={2030}
                      value={formData.tahunLulus}
                      onChange={(e) => setFormData({ ...formData, tahunLulus: parseInt(e.target.value) || new Date().getFullYear() })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Data Pekerjaan & Perusahaan */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                  3. Informasi Pekerjaan & Perusahaan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Nama Perusahaan / Instansi *</label>
                    <input
                      type="text"
                      required
                      value={formData.namaPerusahaan}
                      onChange={(e) => setFormData({ ...formData, namaPerusahaan: e.target.value })}
                      placeholder="PT Astra Honda Motor / PT Telkom"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    {formErrors.namaPerusahaan && <p className="text-rose-400 text-[10px] mt-0.5">{formErrors.namaPerusahaan}</p>}
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Jabatan / Posisi Pekerjaan *</label>
                    <input
                      type="text"
                      required
                      value={formData.jabatan}
                      onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                      placeholder="Junior Network Engineer / QC Operator"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    {formErrors.jabatan && <p className="text-rose-400 text-[10px] mt-0.5">{formErrors.jabatan}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Bidang Pekerjaan</label>
                    <input
                      type="text"
                      value={formData.bidangPekerjaan}
                      onChange={(e) => setFormData({ ...formData, bidangPekerjaan: e.target.value })}
                      placeholder="Teknologi Informasi / Otomotif / Manufaktur"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Alamat Perusahaan</label>
                    <input
                      type="text"
                      value={formData.alamatPerusahaan}
                      onChange={(e) => setFormData({ ...formData, alamatPerusahaan: e.target.value })}
                      placeholder="Cikarang, Bekasi / Serang, Banten"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Negara Penempatan *</label>
                    <select
                      value={formData.negaraPenempatan}
                      onChange={(e) => setFormData({ ...formData, negaraPenempatan: e.target.value as PlacementLocation })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="Indonesia">Indonesia</option>
                      <option value="Luar Negeri">Luar Negeri</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Nama Negara</label>
                    <input
                      type="text"
                      value={formData.negaraSpesifik}
                      onChange={(e) => setFormData({ ...formData, negaraSpesifik: e.target.value })}
                      placeholder="Indonesia / Jepang / Korsel"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Tahun Mulai Bekerja *</label>
                    <input
                      type="number"
                      required
                      min={2015}
                      max={2030}
                      value={formData.tahunMulaiBekerja}
                      onChange={(e) => setFormData({ ...formData, tahunMulaiBekerja: parseInt(e.target.value) || new Date().getFullYear() })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Status Pekerjaan *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Kontrak', 'Tetap', 'Magang', 'Wirausaha'] as EmploymentStatus[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFormData({ ...formData, statusPekerjaan: st })}
                        className={`py-2 px-3 rounded-xl border text-center font-semibold transition ${
                          formData.statusPekerjaan === st
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 4: Upload Foto & Bukti Bekerja */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                  4. Berkas Foto & Bukti Bekerja
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Upload Foto Siswa */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-white mb-1">Foto Siswa</p>
                      <p className="text-[11px] text-slate-400 mb-3">Foto resmi siswa berformat JPG/PNG (Maks 3MB)</p>
                      {formData.fotoSiswa && (
                        <div className="mb-3 flex items-center gap-3">
                          <img
                            src={formData.fotoSiswa}
                            alt="Preview Siswa"
                            className="w-12 h-12 rounded-lg object-cover border border-slate-700"
                          />
                          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Foto terpasang
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fotoInputRef}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'fotoSiswa')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fotoInputRef.current?.click()}
                      className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{formData.fotoSiswa ? 'Ganti Foto' : 'Pilih Foto Siswa'}</span>
                    </button>
                  </div>

                  {/* Upload Bukti Bekerja */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-white mb-1">Bukti Bekerja (Opsional)</p>
                      <p className="text-[11px] text-slate-400 mb-3">SK Kerja / ID Card / Surat Keterangan Perusahaan</p>
                      {formData.buktiBekerja && (
                        <div className="mb-3 flex items-center gap-3">
                          <img
                            src={formData.buktiBekerja}
                            alt="Bukti Bekerja"
                            className="w-12 h-12 rounded-lg object-cover border border-slate-700"
                          />
                          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Bukti terverifikasi
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={buktiInputRef}
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e, 'buktiBekerja')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => buktiInputRef.current?.click()}
                      className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{formData.buktiBekerja ? 'Ganti Bukti' : 'Unggah Bukti Kerja'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Catatan Khusus Verifikasi</label>
                  <input
                    type="text"
                    value={formData.catatan}
                    onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                    placeholder="Contoh: Lolos seleksi BKK tahap 1 / Rekomendasi Industri"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-500 hover:to-amber-500 text-white font-semibold shadow-lg shadow-blue-900/30 transition cursor-pointer"
                >
                  {selectedStudent ? 'Simpan Perubahan' : 'Tambahkan ke Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: DETAIL DATA SISWA & CETAK KARTU RESMI */}
      {/* ========================================================= */}
      {isDetailModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudent.fotoSiswa || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={selectedStudent.namaLengkap}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 shrink-0"
                />
                <div>
                  <h3 className="text-base font-bold text-white">{selectedStudent.namaLengkap}</h3>
                  <p className="text-xs text-amber-300 font-mono">NISN: {selectedStudent.nisn} • NIS: {selectedStudent.nis}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <p className="text-slate-400 text-[10px]">Jurusan / Keahlian</p>
                  <p className="font-semibold text-white mt-0.5">{selectedStudent.jurusan}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px]">Tahun Lulus</p>
                  <p className="font-semibold text-amber-300 font-mono mt-0.5">{selectedStudent.tahunLulus}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px]">Tempat, Tanggal Lahir</p>
                  <p className="text-slate-200 mt-0.5">{selectedStudent.tempatLahir}, {selectedStudent.tanggalLahir}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px]">Nomor WhatsApp</p>
                  <p className="text-slate-200 font-mono mt-0.5">{selectedStudent.noHp}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 text-[10px]">Alamat Domisili</p>
                  <p className="text-slate-200 mt-0.5">{selectedStudent.alamat}</p>
                </div>
              </div>

              {/* Penempatan Kerja */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <p className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">
                  Data Penempatan Industri
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-slate-400 text-[10px]">Nama Perusahaan</p>
                    <p className="font-bold text-white text-sm mt-0.5">{selectedStudent.namaPerusahaan}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Jabatan / Posisi</p>
                    <p className="font-semibold text-amber-300 mt-0.5">{selectedStudent.jabatan}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Bidang Usaha</p>
                    <p className="text-slate-200 mt-0.5">{selectedStudent.bidangPekerjaan}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Negara Penempatan</p>
                    <p className="text-slate-200 mt-0.5">
                      {selectedStudent.negaraPenempatan} ({selectedStudent.negaraSpesifik || 'Indonesia'})
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Status Hubungan Kerja</p>
                    <p className="font-semibold text-emerald-400 mt-0.5">{selectedStudent.statusPekerjaan}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Tahun Mulai Bekerja</p>
                    <p className="font-mono text-slate-200 mt-0.5">{selectedStudent.tahunMulaiBekerja}</p>
                  </div>
                </div>
              </div>

              {/* Bukti Bekerja */}
              {selectedStudent.buktiBekerja && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-slate-300 text-[11px] mb-2">Dokumen / Bukti Kerja:</p>
                  <img
                    src={selectedStudent.buktiBekerja}
                    alt="Bukti Kerja"
                    className="max-h-48 rounded-lg object-contain border border-slate-800"
                  />
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">ID: {selectedStudent.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintCard}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cetak Biodata</span>
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: KONFIRMASI HAPUS SISWA */}
      {/* ========================================================= */}
      {isDeleteModalOpen && studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-100">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Konfirmasi Hapus Data Siswa</h3>
            <p className="text-xs text-slate-400 mb-6">
              Apakah Anda yakin ingin menghapus data siswa <strong className="text-white">{studentToDelete.namaLengkap}</strong> (NISN: {studentToDelete.nisn})? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Batal
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition shadow-md shadow-rose-900/30 cursor-pointer"
              >
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: IMPOR DATA DARI EXCEL */}
      {/* ========================================================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  Impor Data Siswa dari Excel / CSV
                </h3>
                <p className="text-xs text-slate-400">
                  Unggah file CSV hasil ekspor Excel atau tempel langsung data tabel.
                </p>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <p className="font-semibold text-slate-200">1. Unggah File CSV / Excel:</p>
                <input
                  type="file"
                  ref={excelInputRef}
                  accept=".csv,.txt"
                  onChange={handleExcelImportFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => excelInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
                >
                  Pilih Berkas CSV
                </button>
                <p className="text-[11px] text-slate-500">
                  File CSV dapat diekspor langsung dari Microsoft Excel atau Google Spreadsheet.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200">2. Atau Tempel Data Teks / CSV:</label>
                <textarea
                  rows={6}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Tempel baris data CSV di sini (kolom dipisah titik koma ; atau koma)..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleProcessImport}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer shadow-md shadow-emerald-900/30"
              >
                Proses & Simpan ke Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
