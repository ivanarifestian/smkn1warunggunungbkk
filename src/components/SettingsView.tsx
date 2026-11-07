import React, { useState, useRef } from 'react';
import { SchoolSettings, Department, User } from '../types';
import { db, DEFAULT_LOGO_URL } from '../services/db';
import { hashPassword, verifyPassword } from '../utils/crypto';
import {
  Settings,
  School,
  KeyRound,
  Database,
  Building,
  Upload,
  Download,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  ShieldCheck,
  UserCheck,
  Image as ImageIcon
} from 'lucide-react';

interface SettingsViewProps {
  settings: SchoolSettings;
  departments: Department[];
  currentUser: User | null;
  onRefreshData: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  departments,
  currentUser,
  onRefreshData,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'school' | 'officials' | 'security' | 'departments' | 'backup'>('officials');

  // School settings form
  const [schoolForm, setSchoolForm] = useState({
    namaSekolah: settings.namaSekolah,
    npsn: settings.npsn,
    alamatSekolah: settings.alamatSekolah,
    kabupatenKota: settings.kabupatenKota,
    provinsi: settings.provinsi,
    kodePos: settings.kodePos,
    telepon: settings.telepon,
    email: settings.email,
    website: settings.website,
    tagline: settings.tagline,
    tahunAjaranAktif: settings.tahunAjaranAktif,
    logoUrl: settings.logoUrl
  });

  // Officials form
  const [officialsForm, setOfficialsForm] = useState({
    namaKepalaBkk: settings.namaKepalaBkk,
    nipKepalaBkk: settings.nipKepalaBkk,
    namaKepalaSekolah: settings.namaKepalaSekolah,
    nipKepalaSekolah: settings.nipKepalaSekolah
  });

  // Security form
  const [securityForm, setSecurityForm] = useState({
    username: currentUser?.username || 'VAN64',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securityError, setSecurityError] = useState<string | null>(null);

  // Departments management
  const [newDeptForm, setNewDeptForm] = useState({
    kode: '',
    nama: '',
    singkatan: '',
    kaprog: '',
    deskripsi: ''
  });
  const [isAddingDept, setIsAddingDept] = useState(false);

  // File refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  // Save School Identity
  const handleSaveSchool = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSettings(schoolForm);
    showToast('success', 'Identitas Diperbarui', 'Informasi identitas SMKN 1 Warunggunung berhasil disimpan.');
    onRefreshData();
  };

  // Save Officials
  const handleSaveOfficials = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSettings(officialsForm);
    showToast('success', 'Pejabat Diperbarui', 'Nama Kepala BKK & Kepala Sekolah berhasil diperbarui di seluruh dashboard & laporan.');
    onRefreshData();
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);

    if (!currentUser) return;

    if (!securityForm.currentPassword) {
      setSecurityError('Masukkan password saat ini untuk konfirmasi.');
      return;
    }

    if (securityForm.newPassword.length < 6) {
      setSecurityError('Password baru minimal 6 karakter.');
      return;
    }

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setSecurityError('Konfirmasi password tidak cocok.');
      return;
    }

    // Verify current password
    const isCurrentValid = await verifyPassword(securityForm.currentPassword, currentUser.passwordHash);
    const isInitialMatch = (securityForm.currentPassword === 'VANJAZZ64');

    if (!isCurrentValid && !isInitialMatch) {
      setSecurityError('Password saat ini salah. Pastikan password awal VANJAZZ64 atau password terbaru Anda.');
      return;
    }

    // Hash new password
    const newHash = await hashPassword(securityForm.newPassword);
    db.updateUserPassword(currentUser.id, newHash, securityForm.username);

    // Update current session
    db.setSession({
      ...currentUser,
      username: securityForm.username,
      passwordHash: newHash
    });

    setSecurityForm({
      username: securityForm.username,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    showToast('success', 'Password Berhasil Diubah', 'Kredensial login Anda telah diperbarui dengan enkripsi SHA-256.');
    onRefreshData();
  };

  // Logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setSchoolForm(prev => ({ ...prev, logoUrl: dataUrl }));
      db.updateSettings({ logoUrl: dataUrl });
      showToast('success', 'Logo Diperbarui', 'Logo sekolah berhasil diganti di header dan berkas cetak.');
      onRefreshData();
    };
    reader.readAsDataURL(file);
  };

  // Reset Logo to Default
  const handleResetLogo = () => {
    setSchoolForm(prev => ({ ...prev, logoUrl: DEFAULT_LOGO_URL }));
    db.updateSettings({ logoUrl: DEFAULT_LOGO_URL });
    showToast('info', 'Logo Direset', 'Logo sekolah dikembalikan ke emblem resmi SMKN 1 Warunggunung.');
    onRefreshData();
  };

  // Add Department
  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptForm.nama.trim() || !newDeptForm.singkatan.trim()) {
      showToast('error', 'Gagal', 'Nama jurusan dan singkatan wajib diisi.');
      return;
    }
    db.addDepartment({
      ...newDeptForm,
      kode: newDeptForm.kode || newDeptForm.singkatan.toUpperCase()
    });
    setNewDeptForm({ kode: '', nama: '', singkatan: '', kaprog: '', deskripsi: '' });
    setIsAddingDept(false);
    showToast('success', 'Jurusan Ditambahkan', `Kompetensi keahlian ${newDeptForm.nama} berhasil ditambahkan.`);
    onRefreshData();
  };

  // Delete Department
  const handleDeleteDepartment = (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus jurusan ${nama}?`)) {
      db.deleteDepartment(id);
      showToast('info', 'Jurusan Dihapus', `Jurusan ${nama} telah dihapus.`);
      onRefreshData();
    }
  };

  // Database Backup (Download JSON)
  const handleDownloadBackup = () => {
    const jsonStr = db.exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BACKUP_BKK_SMKN1_WARUNGGUNUNG_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Backup Berhasil Diunduh', 'File database JSON berhasil disimpan ke komputer Anda.');
  };

  // Database Restore (Upload JSON)
  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = db.importDatabaseJSON(content);
        if (ok) {
          showToast('success', 'Database Dipulihkan', 'Seluruh data berhasil direstore dari file backup.');
          onRefreshData();
        } else {
          showToast('error', 'Format File Tidak Valid', 'Pastikan menggunakan file backup JSON BKK SMKN 1 Warunggunung.');
        }
      }
    };
    reader.readAsText(file);
  };

  // Reset to Demo Defaults
  const handleResetToDefaults = () => {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset database ke data awal standar pabrik? Seluruh perubahan terbaru akan dikembalikan.')) {
      db.resetToFactoryDefaults();
      showToast('info', 'Database Direset', 'Database berhasil dikembalikan ke data awal standar.');
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Pengaturan Sistem & Konfigurasi BKK
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900/60 text-blue-300 font-bold border border-blue-700/50">
              Administrator Panel
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Konfigurasi Kepala BKK, Kepala Sekolah, identitas resmi, akun admin, kompetensi keahlian, dan pencadangan database
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setActiveTab('officials')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'officials'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Kepala BKK & Pejabat</span>
        </button>

        <button
          onClick={() => setActiveTab('school')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'school'
              ? 'bg-blue-600 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <School className="w-4 h-4" />
          <span>Identitas & Logo Sekolah</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'security'
              ? 'bg-purple-600 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Keamanan & Password</span>
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'departments'
              ? 'bg-emerald-600 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Kompetensi Keahlian ({departments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'backup'
              ? 'bg-indigo-600 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Backup & Pemulihan Database</span>
        </button>
      </div>

      {/* TAB 1: KEPALA BKK & KEPALA SEKOLAH */}
      {activeTab === 'officials' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              Pengaturan Nama Kepala BKK dan Kepala Sekolah
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Perubahan nama di sini otomatis diperbarui pada Dashboard Utama, banner atas, dan kolom tanda tangan laporan PDF resmi.
            </p>
          </div>

          <form onSubmit={handleSaveOfficials} className="space-y-5 text-xs max-w-2xl">
            {/* Kepala BKK */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="font-bold text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Data Kepala Bursa Kerja Khusus (BKK)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Nama Kepala BKK & Gelar *</label>
                  <input
                    type="text"
                    required
                    value={officialsForm.namaKepalaBkk}
                    onChange={(e) => setOfficialsForm({ ...officialsForm, namaKepalaBkk: e.target.value })}
                    placeholder="IVAN ARIFESTIAN, S.Pd."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">NIP Kepala BKK</label>
                  <input
                    type="text"
                    value={officialsForm.nipKepalaBkk}
                    onChange={(e) => setOfficialsForm({ ...officialsForm, nipKepalaBkk: e.target.value })}
                    placeholder="19890815 201503 1 002"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Kepala Sekolah */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="font-bold text-blue-300 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Data Kepala SMK Negeri 1 Warunggunung
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Nama Kepala Sekolah & Gelar *</label>
                  <input
                    type="text"
                    required
                    value={officialsForm.namaKepalaSekolah}
                    onChange={(e) => setOfficialsForm({ ...officialsForm, namaKepalaSekolah: e.target.value })}
                    placeholder="WAHYUDI, S.Pd., M.Pd."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">NIP Kepala Sekolah</label>
                  <input
                    type="text"
                    value={officialsForm.nipKepalaSekolah}
                    onChange={(e) => setOfficialsForm({ ...officialsForm, nipKepalaSekolah: e.target.value })}
                    placeholder="19740512 200003 1 004"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Nama Pejabat</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: IDENTITAS & LOGO SEKOLAH */}
      {activeTab === 'school' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <School className="w-5 h-5 text-blue-400" />
              Identitas Sekolah & Penggantian Logo
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Logo dan identitas resmi yang tampil pada website dan kop surat berkas PDF
            </p>
          </div>

          {/* Logo preview & change section */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={schoolForm.logoUrl}
                alt="Logo SMKN 1 Warunggunung"
                className="w-20 h-20 rounded-2xl object-contain p-1.5 bg-white border-2 border-amber-400/90 shadow-md shrink-0"
              />
              <div>
                <p className="text-sm font-bold text-white">Logo Resmi Sekolah</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Digunakan untuk favicon, login, navbar, dan kop surat resmi PDF.
                </p>
                <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Siap cetak resolusi tinggi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={logoInputRef}
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Upload Logo Baru</span>
              </button>
              <button
                type="button"
                onClick={handleResetLogo}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                title="Kembalikan ke emblem default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveSchool} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Nama Satuan Pendidikan *</label>
                <input
                  type="text"
                  required
                  value={schoolForm.namaSekolah}
                  onChange={(e) => setSchoolForm({ ...schoolForm, namaSekolah: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Nomor Pokok Sekolah Nasional (NPSN) *</label>
                <input
                  type="text"
                  required
                  value={schoolForm.npsn}
                  onChange={(e) => setSchoolForm({ ...schoolForm, npsn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 mb-1 font-semibold">Alamat Lengkap Sekolah</label>
                <input
                  type="text"
                  value={schoolForm.alamatSekolah}
                  onChange={(e) => setSchoolForm({ ...schoolForm, alamatSekolah: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Kabupaten / Kota</label>
                <input
                  type="text"
                  value={schoolForm.kabupatenKota}
                  onChange={(e) => setSchoolForm({ ...schoolForm, kabupatenKota: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Provinsi & Kode Pos</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={schoolForm.provinsi}
                    onChange={(e) => setSchoolForm({ ...schoolForm, provinsi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <input
                    type="text"
                    value={schoolForm.kodePos}
                    onChange={(e) => setSchoolForm({ ...schoolForm, kodePos: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Nomor Telepon Sekolah</label>
                <input
                  type="text"
                  value={schoolForm.telepon}
                  onChange={(e) => setSchoolForm({ ...schoolForm, telepon: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Email Resmi BKK</label>
                <input
                  type="email"
                  value={schoolForm.email}
                  onChange={(e) => setSchoolForm({ ...schoolForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Website Resmi</label>
                <input
                  type="text"
                  value={schoolForm.website}
                  onChange={(e) => setSchoolForm({ ...schoolForm, website: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Tahun Ajaran Aktif</label>
                <input
                  type="text"
                  value={schoolForm.tahunAjaranAktif}
                  onChange={(e) => setSchoolForm({ ...schoolForm, tahunAjaranAktif: e.target.value })}
                  placeholder="2025/2026"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 mb-1 font-semibold">Motto / Tagline BKK SMKN 1</label>
                <input
                  type="text"
                  value={schoolForm.tagline}
                  onChange={(e) => setSchoolForm({ ...schoolForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-md shadow-blue-900/30 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Identitas Sekolah</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: KEAMANAN & PASSWORD ADMIN */}
      {activeTab === 'security' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-purple-400" />
              Keamanan Akun & Pengubahan Password
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Username awal: <strong className="text-amber-300 font-mono">VAN64</strong>, Password awal: <strong className="text-blue-300 font-mono">VANJAZZ64</strong>
            </p>
          </div>

          {securityError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{securityError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-lg">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Username Administrator</label>
              <input
                type="text"
                required
                value={securityForm.username}
                onChange={(e) => setSecurityForm({ ...securityForm, username: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Password Saat Ini *</label>
              <input
                type="password"
                required
                value={securityForm.currentPassword}
                onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                placeholder="Masukkan password saat ini (cth: VANJAZZ64)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Password Baru *</label>
                <input
                  type="password"
                  required
                  value={securityForm.newPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Ulangi Password Baru *</label>
                <input
                  type="password"
                  required
                  value={securityForm.confirmPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                  placeholder="Ketik ulang password baru"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Password otomatis di-hash dengan enkripsi SHA-256 dan salt unik SMKN 1 Warunggunung.</span>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition shadow-md shadow-purple-900/30 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Perbarui Password & Username</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: PENGATURAN KOMPETENSI KEAHLIAN / JURUSAN */}
      {activeTab === 'departments' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-400" />
                Daftar Jurusan / Kompetensi Keahlian
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelola program keahlian yang tersedia di SMKN 1 Warunggunung
              </p>
            </div>
            <button
              onClick={() => setIsAddingDept(!isAddingDept)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jurusan</span>
            </button>
          </div>

          {/* Add form */}
          {isAddingDept && (
            <form onSubmit={handleAddDepartment} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <h3 className="font-bold text-emerald-400">Formulir Tambah Jurusan Baru</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Singkatan / Kode *</label>
                  <input
                    type="text"
                    required
                    value={newDeptForm.singkatan}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, singkatan: e.target.value.toUpperCase() })}
                    placeholder="TKJ / RPL / TBSM"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 mb-1">Nama Kompetensi Keahlian *</label>
                  <input
                    type="text"
                    required
                    value={newDeptForm.nama}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, nama: e.target.value })}
                    placeholder="Teknik Komputer dan Jaringan"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Ketua Program Keahlian (Kaprog)</label>
                  <input
                    type="text"
                    value={newDeptForm.kaprog}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, kaprog: e.target.value })}
                    placeholder="Nama Kaprog & Gelar"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Deskripsi Singkat</label>
                  <input
                    type="text"
                    value={newDeptForm.deskripsi}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, deskripsi: e.target.value })}
                    placeholder="Fokus kompetensi kejuruan..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingDept(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold"
                >
                  Simpan Jurusan
                </button>
              </div>
            </form>
          )}

          {/* List of Departments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <div key={dept.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {dept.singkatan}
                    </span>
                    <button
                      onClick={() => handleDeleteDepartment(dept.id, dept.nama)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                      title="Hapus Jurusan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="font-bold text-white text-xs leading-snug">{dept.nama}</h3>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{dept.deskripsi}</p>
                </div>
                <div className="pt-2 mt-3 border-t border-slate-800/80 text-[10px] text-slate-400">
                  Kaprog: <strong className="text-slate-300">{dept.kaprog || '-'}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BACKUP & PEMULIHAN DATABASE */}
      {activeTab === 'backup' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              Cadangkan & Pulihkan Database BKK
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Seluruh data tersimpan permanen di penyimpanan browser lokal dan dapat diekspor menjadi file JSON untuk cadangan berkala.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            {/* Backup Box */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-3">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Cadangkan Database (Backup JSON)</h3>
                <p className="text-slate-400 mt-1 leading-relaxed">
                  Unduh seluruh database BKK SMKN 1 Warunggunung (data siswa, mitra industri, MOU, struktur organisasi, dan pengaturan) dalam satu file JSON terstruktur.
                </p>
              </div>

              <button
                onClick={handleDownloadBackup}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-md shadow-indigo-900/30 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File Cadangan (.JSON)</span>
              </button>
            </div>

            {/* Restore Box */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Pulihkan Database (Restore JSON)</h3>
                <p className="text-slate-400 mt-1 leading-relaxed">
                  Unggah file cadangan JSON yang sebelumnya pernah diunduh untuk memulihkan seluruh data aplikasi.
                </p>
              </div>

              <input
                type="file"
                ref={backupInputRef}
                accept=".json"
                onChange={handleRestoreBackup}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => backupInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-md shadow-emerald-900/30 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Pilih File Backup JSON</span>
              </button>
            </div>
          </div>

          {/* Reset to Factory Defaults */}
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <p className="font-bold text-rose-300">Reset ke Standar Pabrik</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Mengembalikan seluruh data ke data demo bawaan resmi SMKN 1 Warunggunung.
              </p>
            </div>
            <button
              onClick={handleResetToDefaults}
              className="px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-semibold transition shrink-0 cursor-pointer"
            >
              Reset Data Standar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
