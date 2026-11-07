import React, { useState, useRef } from 'react';
import { Company, MouDocument, SchoolSettings, PartnershipStatus, MouStatus } from '../types';
import { db } from '../services/db';
import { exportCompaniesAndMousToPDF } from '../utils/pdfGenerator';
import { exportCompaniesToExcel } from '../utils/excelExport';
import {
  Building2,
  FileCheck2,
  Plus,
  Search,
  Download,
  Trash2,
  Edit2,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Upload,
  UserCheck
} from 'lucide-react';

interface IndustryMouViewProps {
  companies: Company[];
  mous: MouDocument[];
  settings: SchoolSettings;
  onRefreshData: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const IndustryMouView: React.FC<IndustryMouViewProps> = ({
  companies,
  mous,
  settings,
  onRefreshData,
  showToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'companies' | 'mous'>('companies');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isMouModalOpen, setIsMouModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'company' | 'mou'; id: string; name: string } | null>(null);

  // Form states
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedMou, setSelectedMou] = useState<MouDocument | null>(null);

  const initialCompanyForm = {
    nama: '',
    logo: '',
    alamat: '',
    pimpinan: '',
    contactPerson: '',
    telepon: '',
    email: '',
    bidangUsaha: '',
    jenisKerjaSama: ['Perekrutan Lulusan', 'PKL Siswa'],
    status: 'Aktif' as PartnershipStatus,
    tahunBermitra: new Date().getFullYear(),
    jumlahLulusanDiterima: 0
  };
  const [companyForm, setCompanyForm] = useState(initialCompanyForm);

  const initialMouForm = {
    noMou: '',
    namaPerusahaan: '',
    companyId: '',
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalSelesai: new Date(Date.now() + 3 * 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
    pihakSekolah: settings.namaKepalaSekolah,
    pihakPerusahaan: '',
    ringkasan: '',
    fileUrl: '',
    fileName: '',
    fotoKegiatanUrl: '',
    status: 'Aktif' as MouStatus
  };
  const [mouForm, setMouForm] = useState(initialMouForm);

  // File upload refs
  const companyLogoRef = useRef<HTMLInputElement>(null);
  const mouFileRef = useRef<HTMLInputElement>(null);
  const mouPhotoRef = useRef<HTMLInputElement>(null);

  // Filtered lists
  const filteredCompanies = companies.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchQuery = !q || c.nama.toLowerCase().includes(q) || c.bidangUsaha.toLowerCase().includes(q) || c.alamat.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchQuery && matchStatus;
  });

  const filteredMous = mous.filter(m => {
    const q = searchQuery.toLowerCase();
    const matchQuery = !q || m.noMou.toLowerCase().includes(q) || m.namaPerusahaan.toLowerCase().includes(q) || m.ringkasan.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchQuery && matchStatus;
  });

  // Open Company modal
  const handleOpenAddCompany = () => {
    setSelectedCompany(null);
    setCompanyForm(initialCompanyForm);
    setIsCompanyModalOpen(true);
  };

  const handleOpenEditCompany = (c: Company) => {
    setSelectedCompany(c);
    setCompanyForm({
      nama: c.nama,
      logo: c.logo || '',
      alamat: c.alamat,
      pimpinan: c.pimpinan,
      contactPerson: c.contactPerson,
      telepon: c.telepon,
      email: c.email,
      bidangUsaha: c.bidangUsaha,
      jenisKerjaSama: c.jenisKerjaSama || ['Perekrutan Lulusan'],
      status: c.status,
      tahunBermitra: c.tahunBermitra,
      jumlahLulusanDiterima: c.jumlahLulusanDiterima || 0
    });
    setIsCompanyModalOpen(true);
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyForm.nama.trim()) {
      showToast('error', 'Validasi Gagal', 'Nama perusahaan wajib diisi.');
      return;
    }

    if (selectedCompany) {
      db.updateCompany(selectedCompany.id, companyForm);
      showToast('success', 'Mitra Diperbarui', `Data mitra ${companyForm.nama} berhasil diperbarui.`);
    } else {
      db.addCompany(companyForm);
      showToast('success', 'Mitra Ditambahkan', `Mitra ${companyForm.nama} berhasil ditambahkan ke database.`);
    }

    setIsCompanyModalOpen(false);
    onRefreshData();
  };

  // Open MOU modal
  const handleOpenAddMou = () => {
    setSelectedMou(null);
    setMouForm({
      ...initialMouForm,
      namaPerusahaan: companies[0]?.nama || '',
      companyId: companies[0]?.id || '',
      pihakSekolah: `${settings.namaKepalaSekolah} (Kepala Sekolah)`
    });
    setIsMouModalOpen(true);
  };

  const handleOpenEditMou = (m: MouDocument) => {
    setSelectedMou(m);
    setMouForm({
      noMou: m.noMou,
      namaPerusahaan: m.namaPerusahaan,
      companyId: m.companyId || '',
      tanggalMulai: m.tanggalMulai,
      tanggalSelesai: m.tanggalSelesai,
      pihakSekolah: m.pihakSekolah,
      pihakPerusahaan: m.pihakPerusahaan,
      ringkasan: m.ringkasan,
      fileUrl: m.fileUrl || '',
      fileName: m.fileName || '',
      fotoKegiatanUrl: m.fotoKegiatanUrl || '',
      status: m.status
    });
    setIsMouModalOpen(true);
  };

  const handleSaveMou = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mouForm.noMou.trim() || !mouForm.namaPerusahaan.trim()) {
      showToast('error', 'Validasi Gagal', 'Nomor MOU dan Nama Perusahaan wajib diisi.');
      return;
    }

    if (selectedMou) {
      db.updateMou(selectedMou.id, mouForm);
      showToast('success', 'MOU Diperbarui', `Dokumen MOU ${mouForm.noMou} berhasil diperbarui.`);
    } else {
      db.addMou(mouForm);
      showToast('success', 'MOU Disimpan', `Dokumen MOU ${mouForm.noMou} berhasil ditambahkan ke database.`);
    }

    setIsMouModalOpen(false);
    onRefreshData();
  };

  // Delete Action
  const handleDeleteConfirm = (type: 'company' | 'mou', id: string, name: string) => {
    setDeleteTarget({ type, id, name });
    setIsDeleteModalOpen(true);
  };

  const executeDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'company') {
      db.deleteCompany(deleteTarget.id);
      showToast('info', 'Mitra Dihapus', `Mitra industri ${deleteTarget.name} telah dihapus.`);
    } else {
      db.deleteMou(deleteTarget.id);
      showToast('info', 'MOU Dihapus', `Dokumen MOU ${deleteTarget.name} telah dihapus.`);
    }
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
    onRefreshData();
  };

  // Export handlers
  const handleExportPDF = () => {
    exportCompaniesAndMousToPDF(companies, mous, settings);
    showToast('success', 'PDF Dibuat', 'Laporan daftar mitra dan dokumen MOU resmi berhasil diunduh.');
  };

  const handleExportExcel = () => {
    exportCompaniesToExcel(companies);
    showToast('success', 'Excel Diekspor', 'Data mitra industri berhasil diekspor.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Mitra Industri & Dokumen Kerjasama (MOU)
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
              DUDIKA Link & Match
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pengelolaan hubungan industri, rekrutmen kampus, kelas industri, dan arsip legal MOU
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeSubTab === 'companies' ? (
            <button
              onClick={handleOpenAddCompany}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-900/40 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Mitra Industri</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddMou}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-900/40 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Dokumen MOU</span>
            </button>
          )}

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Unduh Laporan PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            <span>Ekspor Excel</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 w-fit">
          <button
            onClick={() => {
              setActiveSubTab('companies');
              setStatusFilter('all');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
              activeSubTab === 'companies'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Mitra Industri ({companies.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveSubTab('mous');
              setStatusFilter('all');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
              activeSubTab === 'mous'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Dokumen MOU ({mous.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama perusahaan / nomor MOU..."
              className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif / Kedaluwarsa</option>
          </select>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: DAFTAR KARTU MITRA INDUSTRI (DUDIKA) */}
      {/* ========================================================= */}
      {activeSubTab === 'companies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompanies.map(company => (
            <div
              key={company.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-xl overflow-hidden flex flex-col justify-between transition group"
            >
              <div className="p-5 space-y-4">
                {/* Card Top: Logo & Title */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={company.logo || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=80'}
                    alt={company.nama}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-700 bg-slate-950 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        company.status === 'Aktif'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {company.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Mitra Sejak {company.tahunBermitra}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm mt-1 leading-snug line-clamp-1 group-hover:text-amber-300 transition">
                      {company.nama}
                    </h3>
                    <p className="text-[11px] text-amber-400 font-medium line-clamp-1">
                      {company.bidangUsaha}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-slate-400 line-clamp-2">{company.alamat}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px] text-slate-300">Pimpinan: <strong>{company.pimpinan}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px] font-mono text-slate-300">{company.telepon} • {company.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px] font-mono text-blue-300 truncate">{company.email}</span>
                  </div>
                </div>

                {/* Tags Kerja Sama */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {company.jenisKerjaSama?.map((tag, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Lulusan Diterima: <strong className="text-amber-300 font-mono">{company.jumlahLulusanDiterima || 0} Siswa</strong>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditCompany(company)}
                    title="Edit Mitra"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteConfirm('company', company.id, company.nama)}
                    title="Hapus Mitra"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: DOKUMEN PERJANJIAN KERJASAMA (MOU) */}
      {/* ========================================================= */}
      {activeSubTab === 'mous' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">No. MOU</th>
                  <th className="py-3 px-4">Mitra Perusahaan</th>
                  <th className="py-3 px-4">Masa Berlaku</th>
                  <th className="py-3 px-4">Pihak Sekolah</th>
                  <th className="py-3 px-4">Pihak Industri</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi & Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMous.map(mou => (
                  <tr key={mou.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-amber-300">
                      {mou.noMou}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{mou.namaPerusahaan}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{mou.ringkasan}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300 text-[11px]">
                      {mou.tanggalMulai} s.d {mou.tanggalSelesai}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {mou.pihakSekolah}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {mou.pihakPerusahaan}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                        mou.status === 'Aktif'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {mou.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            showToast('info', 'Dokumen MOU', `Membuka arsip digital: ${mou.fileName || mou.noMou}`);
                          }}
                          title="Unduh / Buka Dokumen MOU"
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-900/50 hover:bg-blue-800 text-blue-300 text-[11px] font-semibold transition"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                        <button
                          onClick={() => handleOpenEditMou(mou)}
                          title="Edit MOU"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm('mou', mou.id, mou.noMou)}
                          title="Hapus MOU"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: FORMULIR TAMBAH / EDIT MITRA INDUSTRI */}
      {/* ========================================================= */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-100">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <h3 className="text-base font-bold text-white">
                {selectedCompany ? 'Edit Profil Mitra Industri' : 'Formulir Tambah Mitra Industri (DUDIKA)'}
              </h3>
              <button
                onClick={() => setIsCompanyModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 mb-1 font-semibold">Nama Perusahaan / Instansi *</label>
                  <input
                    type="text"
                    required
                    value={companyForm.nama}
                    onChange={(e) => setCompanyForm({ ...companyForm, nama: e.target.value })}
                    placeholder="PT Astra Honda Motor / PT Krakatau Steel"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Bidang Usaha *</label>
                  <input
                    type="text"
                    required
                    value={companyForm.bidangUsaha}
                    onChange={(e) => setCompanyForm({ ...companyForm, bidangUsaha: e.target.value })}
                    placeholder="Manufaktur Otomotif / Telekomunikasi"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Status Kemitraan *</label>
                  <select
                    value={companyForm.status}
                    onChange={(e) => setCompanyForm({ ...companyForm, status: e.target.value as PartnershipStatus })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 mb-1 font-semibold">Alamat Lengkap Perusahaan</label>
                  <textarea
                    rows={2}
                    value={companyForm.alamat}
                    onChange={(e) => setCompanyForm({ ...companyForm, alamat: e.target.value })}
                    placeholder="Kawasan Industri MM2100, Cikarang, Jawa Barat"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Nama Pimpinan / Direktur</label>
                  <input
                    type="text"
                    value={companyForm.pimpinan}
                    onChange={(e) => setCompanyForm({ ...companyForm, pimpinan: e.target.value })}
                    placeholder="Nama Direktur / GM Perusahaan"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Contact Person (HRD / PIC)</label>
                  <input
                    type="text"
                    value={companyForm.contactPerson}
                    onChange={(e) => setCompanyForm({ ...companyForm, contactPerson: e.target.value })}
                    placeholder="Nama Staff Rekrutmen / Hubin"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Nomor Telepon / WhatsApp</label>
                  <input
                    type="text"
                    value={companyForm.telepon}
                    onChange={(e) => setCompanyForm({ ...companyForm, telepon: e.target.value })}
                    placeholder="(021) 6518080 / 0812-..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Email Perusahaan / HR</label>
                  <input
                    type="email"
                    value={companyForm.email}
                    onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                    placeholder="recruitment@perusahaan.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Upload Logo Perusahaan */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Logo Perusahaan</p>
                  <p className="text-[11px] text-slate-400">Format gambar persegi PNG/JPG (Maks 2MB)</p>
                </div>
                <input
                  type="file"
                  ref={companyLogoRef}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setCompanyForm(prev => ({ ...prev, logo: reader.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => companyLogoRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  Pilih Logo
                </button>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCompanyModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-md shadow-blue-900/30"
                >
                  Simpan Mitra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: FORMULIR TAMBAH / EDIT DOKUMEN MOU */}
      {/* ========================================================= */}
      {isMouModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-100">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <h3 className="text-base font-bold text-white">
                {selectedMou ? 'Edit Dokumen MOU' : 'Formulir Dokumen MOU Kerjasama'}
              </h3>
              <button
                onClick={() => setIsMouModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMou} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Nomor Surat MOU *</label>
                  <input
                    type="text"
                    required
                    value={mouForm.noMou}
                    onChange={(e) => setMouForm({ ...mouForm, noMou: e.target.value })}
                    placeholder="421.5/082/SMKN1-WG/BKK/MOU/2026"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Nama Mitra Perusahaan *</label>
                  <input
                    type="text"
                    required
                    value={mouForm.namaPerusahaan}
                    onChange={(e) => setMouForm({ ...mouForm, namaPerusahaan: e.target.value })}
                    placeholder="PT Astra Honda Motor"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Tanggal Mulai Berlaku *</label>
                  <input
                    type="date"
                    required
                    value={mouForm.tanggalMulai}
                    onChange={(e) => setMouForm({ ...mouForm, tanggalMulai: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Tanggal Berakhir MOU *</label>
                  <input
                    type="date"
                    required
                    value={mouForm.tanggalSelesai}
                    onChange={(e) => setMouForm({ ...mouForm, tanggalSelesai: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Nama Pihak Sekolah (Penandatangan) *</label>
                  <input
                    type="text"
                    required
                    value={mouForm.pihakSekolah}
                    onChange={(e) => setMouForm({ ...mouForm, pihakSekolah: e.target.value })}
                    placeholder="WAHYUDI, S.Pd., M.Pd."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Nama Pihak Perusahaan *</label>
                  <input
                    type="text"
                    required
                    value={mouForm.pihakPerusahaan}
                    onChange={(e) => setMouForm({ ...mouForm, pihakPerusahaan: e.target.value })}
                    placeholder="Nama Direktur / HR Manager Mitra"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 mb-1 font-semibold">Ringkasan Ruang Lingkup Kerjasama</label>
                  <textarea
                    rows={3}
                    value={mouForm.ringkasan}
                    onChange={(e) => setMouForm({ ...mouForm, ringkasan: e.target.value })}
                    placeholder="Penyelarasan kurikulum kejuruan, rekrutmen alumni berkala, magang guru & siswa, uji sertifikasi..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Upload Berkas Dokumen MOU & Foto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-semibold text-white mb-1">Unggah Dokumen MOU (PDF)</p>
                  <input
                    type="file"
                    ref={mouFileRef}
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setMouForm(prev => ({
                          ...prev,
                          fileName: file.name,
                          fileUrl: URL.createObjectURL(file)
                        }));
                        showToast('success', 'File Terpilih', file.name);
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => mouFileRef.current?.click()}
                    className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>{mouForm.fileName || 'Pilih Berkas PDF'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-semibold text-white mb-1">Foto Kegiatan Penandatanganan</p>
                  <input
                    type="file"
                    ref={mouPhotoRef}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setMouForm(prev => ({ ...prev, fotoKegiatanUrl: reader.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => mouPhotoRef.current?.click()}
                    className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>{mouForm.fotoKegiatanUrl ? 'Ganti Foto Dokumentasi' : 'Pilih Foto Kegiatan'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsMouModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-md shadow-amber-500/20"
                >
                  Simpan Dokumen MOU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: KONFIRMASI HAPUS */}
      {/* ========================================================= */}
      {isDeleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-100">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Hapus {deleteTarget.type === 'company' ? 'Mitra Industri' : 'Dokumen MOU'}?
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Apakah Anda yakin ingin menghapus <strong className="text-white">{deleteTarget.name}</strong>? Data akan dihapus secara permanen dari sistem.
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
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition shadow-md shadow-rose-900/30"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
