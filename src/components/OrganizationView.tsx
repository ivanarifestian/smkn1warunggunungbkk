import React, { useState, useRef } from 'react';
import { BkkMember, SchoolSettings } from '../types';
import { db } from '../services/db';
import { exportOrganizationToPDF } from '../utils/pdfGenerator';
import {
  Users2,
  Plus,
  Printer,
  Download,
  Edit2,
  Trash2,
  Phone,
  Mail,
  X,
  Upload,
  Crown,
  Network,
  Shield,
  Briefcase,
  AlertTriangle
} from 'lucide-react';

interface OrganizationViewProps {
  members: BkkMember[];
  settings: SchoolSettings;
  onRefreshData: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const OrganizationView: React.FC<OrganizationViewProps> = ({
  members,
  settings,
  onRefreshData,
  showToast
}) => {
  const [viewMode, setViewMode] = useState<'hierarchy' | 'cards'>('hierarchy');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<BkkMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<BkkMember | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);

  const initialForm = {
    nama: '',
    nip: '',
    jabatan: 'Koordinator Hubungan Industri',
    level: 4,
    foto: '',
    noHp: '',
    email: '',
    tugas: '',
    urutan: members.length + 1
  };
  const [formData, setFormData] = useState(initialForm);

  // Group members by level for the visual hierarchy tree
  const level1Members = members.filter(m => m.level === 1); // Penanggung Jawab (Kepsek)
  const level2Members = members.filter(m => m.level === 2); // Ketua BKK
  const level3Members = members.filter(m => m.level === 3); // Sekretaris & Bendahara
  const level4Members = members.filter(m => m.level === 4); // Koordinator Hubin & Alumni
  const level5Members = members.filter(m => m.level === 5); // Anggota / Tim Teknis

  const handleOpenAdd = () => {
    setSelectedMember(null);
    setFormData({
      ...initialForm,
      urutan: members.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: BkkMember) => {
    setSelectedMember(m);
    setFormData({
      nama: m.nama,
      nip: m.nip,
      jabatan: m.jabatan,
      level: m.level,
      foto: m.foto || '',
      noHp: m.noHp,
      email: m.email,
      tugas: m.tugas,
      urutan: m.urutan
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.jabatan.trim()) {
      showToast('error', 'Validasi Gagal', 'Nama lengkap dan jabatan wajib diisi.');
      return;
    }

    if (selectedMember) {
      db.updateMember(selectedMember.id, formData);
      showToast('success', 'Anggota Diperbarui', `Data ${formData.nama} berhasil diperbarui.`);
    } else {
      db.addMember(formData);
      showToast('success', 'Anggota Ditambahkan', `${formData.nama} ditambahkan ke struktur BKK.`);
    }

    setIsModalOpen(false);
    onRefreshData();
  };

  const handleDelete = () => {
    if (!memberToDelete) return;
    db.deleteMember(memberToDelete.id);
    showToast('info', 'Anggota Dihapus', `Data ${memberToDelete.nama} telah dihapus.`);
    setIsDeleteModalOpen(false);
    setMemberToDelete(null);
    onRefreshData();
  };

  const handleExportPDF = () => {
    exportOrganizationToPDF(members, settings);
    showToast('success', 'PDF Diunduh', 'Struktur organisasi resmi BKK SMKN 1 Warunggunung berhasil diunduh.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Struktur Organisasi BKK SMKN 1 Warunggunung
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
              {members.length} Pengurus
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Bagan hierarki kepengurusan dan deskripsi tupoksi Bursa Kerja Khusus
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-900/40 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Anggota BKK</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Unduh Bagan PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Cetak Bagan</span>
          </button>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('hierarchy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              viewMode === 'hierarchy' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Bagan Hierarki Visual</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              viewMode === 'cards' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>Daftar Kartu Profil</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 hidden sm:block">
          SK Penetapan Pengurus BKK SMKN 1 Warunggunung Periode {settings.tahunAjaranAktif}
        </p>
      </div>

      {/* ========================================================= */}
      {/* MODE 1: BAGAN HIERARKI VISUAL INTERAKTIF */}
      {/* ========================================================= */}
      {viewMode === 'hierarchy' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-x-auto space-y-8">
          {/* LEVEL 1: PENANGGUNG JAWAB (KEPALA SEKOLAH) */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold tracking-widest uppercase text-blue-400 bg-blue-950/80 border border-blue-800/80 px-3 py-0.5 rounded-full mb-3">
              LEVEL 1: PENANGGUNG JAWAB
            </span>
            <div className="flex justify-center gap-6">
              {level1Members.map(m => (
                <HierarchyNodeCard
                  key={m.id}
                  member={m}
                  onEdit={() => handleOpenEdit(m)}
                  onDelete={() => {
                    setMemberToDelete(m);
                    setIsDeleteModalOpen(true);
                  }}
                  isChief
                />
              ))}
            </div>

            {/* Connecting Vertical Line */}
            <div className="w-0.5 h-8 bg-gradient-to-b from-blue-500 to-amber-500 my-1" />
          </div>

          {/* LEVEL 2: KETUA BKK */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400 bg-amber-950/80 border border-amber-800/80 px-3 py-0.5 rounded-full mb-3">
              LEVEL 2: KETUA BURSA KERJA KHUSUS
            </span>
            <div className="flex justify-center gap-6">
              {level2Members.map(m => (
                <HierarchyNodeCard
                  key={m.id}
                  member={m}
                  onEdit={() => handleOpenEdit(m)}
                  onDelete={() => {
                    setMemberToDelete(m);
                    setIsDeleteModalOpen(true);
                  }}
                  isLead
                />
              ))}
            </div>

            {/* Connecting Vertical Line */}
            <div className="w-0.5 h-8 bg-slate-700 my-1" />
          </div>

          {/* LEVEL 3: SEKRETARIS & BENDAHARA */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3 py-0.5 rounded-full mb-3">
              LEVEL 3: SEKRETARIAT & KEUANGAN
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
              {level3Members.map(m => (
                <HierarchyNodeCard
                  key={m.id}
                  member={m}
                  onEdit={() => handleOpenEdit(m)}
                  onDelete={() => {
                    setMemberToDelete(m);
                    setIsDeleteModalOpen(true);
                  }}
                />
              ))}
            </div>

            {/* Connecting Vertical Line */}
            <div className="w-0.5 h-8 bg-slate-700 my-1" />
          </div>

          {/* LEVEL 4: KOORDINATOR BIDANG (HUBIN & ALUMNI) */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold tracking-widest uppercase text-purple-400 bg-purple-950/80 border border-purple-800/80 px-3 py-0.5 rounded-full mb-3">
              LEVEL 4: KOORDINATOR BIDANG KHUSUS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
              {level4Members.map(m => (
                <HierarchyNodeCard
                  key={m.id}
                  member={m}
                  onEdit={() => handleOpenEdit(m)}
                  onDelete={() => {
                    setMemberToDelete(m);
                    setIsDeleteModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>

          {/* LEVEL 5: ANGGOTA & TIM TEKNIS */}
          {level5Members.length > 0 && (
            <div className="flex flex-col items-center pt-4 border-t border-slate-800/80">
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 bg-slate-800 px-3 py-0.5 rounded-full mb-4">
                LEVEL 5: ANGGOTA PELAKSANA & TEKNOLOGI
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
                {level5Members.map(m => (
                  <HierarchyNodeCard
                    key={m.id}
                    member={m}
                    onEdit={() => handleOpenEdit(m)}
                    onDelete={() => {
                      setMemberToDelete(m);
                      setIsDeleteModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: KARTU GRID ANGGOTA LENGKAP */}
      {/* ========================================================= */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map(member => (
            <div
              key={member.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-xl flex flex-col justify-between transition group"
            >
              <div className="space-y-3.5">
                <div className="flex items-start gap-3.5">
                  <img
                    src={member.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                    alt={member.nama}
                    className="w-14 h-14 rounded-xl object-cover border border-amber-400/80 bg-slate-950 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {member.jabatan}
                    </span>
                    <h3 className="font-bold text-white text-sm mt-1 leading-snug">
                      {member.nama}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      NIP. {member.nip}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-300 pt-2 border-t border-slate-800/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-300 text-[11px]">{member.noHp}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-blue-300 text-[11px] truncate">{member.email}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                    {member.tugas}
                  </p>
                </div>
              </div>

              <div className="p-3 border-t border-slate-800 mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(member)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition"
                  title="Edit Anggota"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setMemberToDelete(member);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  title="Hapus Anggota"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TAMBAH / EDIT ANGGOTA ORGANISASI */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-100">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <h3 className="text-base font-bold text-white">
                {selectedMember ? 'Edit Anggota Pengurus BKK' : 'Tambah Anggota Pengurus BKK'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="IVAN ARIFESTIAN, S.Pd."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">NIP / NUPTK</label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="19890815 201503 1 002"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Jabatan Organisasi *</label>
                  <input
                    type="text"
                    required
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    placeholder="Ketua BKK / Koordinator Hubin"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Tingkat Hirarki (Level) *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 4 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value={1}>Level 1: Penanggung Jawab (Kepsek)</option>
                    <option value={2}>Level 2: Ketua BKK</option>
                    <option value={3}>Level 3: Sekretaris & Bendahara</option>
                    <option value={4}>Level 4: Koordinator Hubin / Alumni</option>
                    <option value={5}>Level 5: Anggota Tim / IT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Nomor WhatsApp</label>
                  <input
                    type="text"
                    value={formData.noHp}
                    onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                    placeholder="0812-..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Email Resmi</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ivan.arifestian@smkn1warunggunung.sch.id"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Tugas dan Tanggung Jawab</label>
                <textarea
                  rows={3}
                  value={formData.tugas}
                  onChange={(e) => setFormData({ ...formData, tugas: e.target.value })}
                  placeholder="Deskripsikan peran dan tanggung jawab jabatan dalam BKK..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Upload Foto */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Foto Profil Anggota</p>
                  <p className="text-[11px] text-slate-400">Format foto pasfoto resmi</p>
                </div>
                <input
                  type="file"
                  ref={photoInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData(prev => ({ ...prev, foto: reader.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih Foto</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-md shadow-blue-900/30"
                >
                  Simpan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS */}
      {isDeleteModalOpen && memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-100">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Hapus Pengurus BKK?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Hapus <strong className="text-white">{memberToDelete.nama}</strong> ({memberToDelete.jabatan}) dari struktur organisasi BKK?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition shadow-md shadow-rose-900/30"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Hierarchy Node Visual Card
interface HierarchyNodeProps {
  member: BkkMember;
  onEdit: () => void;
  onDelete: () => void;
  isChief?: boolean;
  isLead?: boolean;
}

const HierarchyNodeCard: React.FC<HierarchyNodeProps> = ({ member, onEdit, onDelete, isChief, isLead }) => {
  return (
    <div
      className={`relative w-72 rounded-2xl p-4 shadow-xl border transition group ${
        isChief
          ? 'bg-gradient-to-b from-blue-950/80 to-slate-900 border-blue-500/60 shadow-blue-950/50'
          : isLead
          ? 'bg-gradient-to-b from-amber-950/80 to-slate-900 border-amber-500/70 shadow-amber-950/50'
          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <img
            src={member.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={member.nama}
            className={`w-12 h-12 rounded-xl object-cover border-2 shadow-sm ${
              isChief ? 'border-blue-400' : isLead ? 'border-amber-400' : 'border-slate-700'
            }`}
          />
          {isChief && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] shadow">
              <Crown className="w-3 h-3" />
            </div>
          )}
          {isLead && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-[10px] shadow">
              <Crown className="w-3 h-3 font-bold" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 truncate">
            {member.jabatan}
          </p>
          <h4 className="text-xs font-extrabold text-white leading-tight truncate">
            {member.nama}
          </h4>
          <p className="text-[9px] text-slate-400 font-mono mt-0.5 truncate">
            NIP. {member.nip}
          </p>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 line-clamp-2 mt-2.5 pt-2 border-t border-slate-800/80 leading-relaxed">
        {member.tugas}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1.5 mt-2.5">
        <button
          onClick={onEdit}
          className="p-1 rounded-md text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition"
          title="Edit"
        >
          <Edit2 className="w-3 h-3" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
          title="Hapus"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
