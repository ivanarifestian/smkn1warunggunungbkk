export type Gender = 'L' | 'P';
export type EmploymentStatus = 'Kontrak' | 'Tetap' | 'Magang' | 'Wirausaha';
export type PlacementLocation = 'Indonesia' | 'Luar Negeri';
export type PartnershipStatus = 'Aktif' | 'Tidak Aktif';
export type MouStatus = 'Aktif' | 'Kedaluwarsa' | 'Segera Berakhir';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'superadmin';
  lastLogin?: string;
}

export interface Student {
  id: string;
  nomor: number;
  nisn: string;
  nis: string;
  namaLengkap: string;
  jenisKelamin: Gender;
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
  noHp: string;
  tahunLulus: number;
  jurusan: string;
  namaPerusahaan: string;
  alamatPerusahaan: string;
  jabatan: string;
  bidangPekerjaan: string;
  negaraPenempatan: PlacementLocation;
  negaraSpesifik?: string;
  tahunMulaiBekerja: number;
  statusPekerjaan: EmploymentStatus;
  fotoSiswa?: string;
  buktiBekerja?: string;
  catatan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  nama: string;
  logo?: string;
  alamat: string;
  pimpinan: string;
  contactPerson: string;
  telepon: string;
  email: string;
  bidangUsaha: string;
  jenisKerjaSama: string[];
  status: PartnershipStatus;
  tahunBermitra: number;
  jumlahLulusanDiterima?: number;
  createdAt: string;
}

export interface MouDocument {
  id: string;
  noMou: string;
  namaPerusahaan: string;
  companyId?: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  pihakSekolah: string;
  pihakPerusahaan: string;
  ringkasan: string;
  fileUrl?: string;
  fileName?: string;
  fotoKegiatanUrl?: string;
  status: MouStatus;
  createdAt: string;
}

export interface BkkMember {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  level: number; // 1: Penanggung Jawab, 2: Ketua BKK, 3: Sekretaris/Bendahara, 4: Koordinator, 5: Anggota
  foto?: string;
  noHp: string;
  email: string;
  tugas: string;
  urutan: number;
}

export interface Department {
  id: string;
  kode: string;
  nama: string;
  singkatan: string;
  kaprog: string;
  deskripsi: string;
}

export interface YearlyStatistic {
  tahun: number;
  totalLulusan: number;
  jumlahBekerja: number;
  jumlahWirausaha: number;
  jumlahMelanjutkan: number;
  jumlahMencariKerja: number;
  persentaseBekerja: number;
}

export interface SchoolSettings {
  namaSekolah: string;
  npsn: string;
  alamatSekolah: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  namaKepalaBkk: string;
  nipKepalaBkk: string;
  logoUrl: string;
  tagline: string;
  tahunAjaranAktif: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'students'
  | 'statistics'
  | 'companies'
  | 'organization'
  | 'reports'
  | 'settings';
