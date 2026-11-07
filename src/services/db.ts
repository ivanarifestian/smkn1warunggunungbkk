import {
  User,
  Student,
  Company,
  MouDocument,
  BkkMember,
  Department,
  YearlyStatistic,
  SchoolSettings
} from '../types';

const STORAGE_KEY = 'SMKN1_WG_BKK_DB_V1';
const AUTH_KEY = 'SMKN1_WG_BKK_AUTH_SESSION';

// Official school logo path from SMKN 1 Warunggunung
export const DEFAULT_LOGO_URL = '/assets/aistudio/626_908fd773.png';

export interface DatabaseSchema {
  users: User[];
  students: Student[];
  companies: Company[];
  mou_documents: MouDocument[];
  bkk_members: BkkMember[];
  departments: Department[];
  yearly_statistics: YearlyStatistic[];
  school_settings: SchoolSettings;
}

const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dep-1',
    kode: 'TKJ',
    nama: 'Teknik Komputer dan Jaringan',
    singkatan: 'TKJ',
    kaprog: 'Ahmad Fauzi, S.Kom.',
    deskripsi: 'Kompetensi keahlian infrastruktur jaringan, server, fiber optic, dan cloud administration.'
  },
  {
    id: 'dep-2',
    kode: 'RPL',
    nama: 'Rekayasa Perangkat Lunak',
    singkatan: 'RPL',
    kaprog: 'Rina Marlina, S.T.',
    deskripsi: 'Pengembangan aplikasi web, mobile, sistem informasi, dan database engineering.'
  },
  {
    id: 'dep-3',
    kode: 'TKRO',
    nama: 'Teknik Kendaraan Ringan Otomotif',
    singkatan: 'TKRO',
    kaprog: 'Budi Santoso, S.Pd.',
    deskripsi: 'Perawatan, perbaikan mesin otomotif modern, transmisi otomatis, dan sistem kelistrikan mobil.'
  },
  {
    id: 'dep-4',
    kode: 'TBSM',
    nama: 'Teknik dan Bisnis Sepeda Motor',
    singkatan: 'TBSM',
    kaprog: 'Hendra Gunawan, S.Pd.',
    deskripsi: 'Teknologi injeksi sepeda motor, diagnosa kelistrikan, dan manajemen bengkel resmi.'
  },
  {
    id: 'dep-5',
    kode: 'AKL',
    nama: 'Akuntansi dan Keuangan Lembaga',
    singkatan: 'AKL',
    kaprog: 'Siti Rohmah, S.E.',
    deskripsi: 'Pencatatan akuntansi keuangan, perpajakan, audit lembaga perbankan, dan spreadsheet bisnis.'
  },
  {
    id: 'dep-6',
    kode: 'OTKP',
    nama: 'Otomatisasi dan Tata Kelola Perkantoran',
    singkatan: 'OTKP',
    kaprog: 'Dewi Lestari, S.Pd.',
    deskripsi: 'Administrasi perkantoran modern, digital filing, public relation, dan kehumasan industri.'
  }
];

const INITIAL_MEMBERS: BkkMember[] = [
  {
    id: 'mem-1',
    nama: 'WAHYUDI, S.Pd., M.Pd.',
    nip: '19740512 200003 1 004',
    jabatan: 'Penanggung Jawab (Kepala Sekolah)',
    level: 1,
    foto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    noHp: '0812-3456-7890',
    email: 'kepsek@smkn1warunggunung.sch.id',
    tugas: 'Bertanggung jawab penuh atas kebijakan strategis, regulasi, dan keberhasilan penempatan kerja lulusan BKK SMKN 1 Warunggunung.',
    urutan: 1
  },
  {
    id: 'mem-2',
    nama: 'IVAN ARIFESTIAN, S.Pd.',
    nip: '19890815 201503 1 002',
    jabatan: 'Ketua BKK',
    level: 2,
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    noHp: '0877-8901-2345',
    email: 'ivan.arifestian@smkn1warunggunung.sch.id',
    tugas: 'Memimpin operasional harian BKK, memetakan potensi lulusan, memimpin negosiasi industri, dan mengoordinasikan seluruh divisi.',
    urutan: 2
  },
  {
    id: 'mem-3',
    nama: 'DEDDY KURNIAWAN, S.Pd.',
    nip: '19910410 201902 1 003',
    jabatan: 'Sekretaris BKK',
    level: 3,
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    noHp: '0859-1234-5678',
    email: 'sekretariat.bkk@smkn1warunggunung.sch.id',
    tugas: 'Mengelola administrasi persuratan, dokumentasi MOU, arsip pelamar kerja, dan penerbitan surat rekomendasi.',
    urutan: 3
  },
  {
    id: 'mem-4',
    nama: 'ENDAH SUKMAWATI, S.E.',
    nip: '19930722 202001 2 005',
    jabatan: 'Bendahara BKK',
    level: 3,
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    noHp: '0813-9988-7766',
    email: 'keuangan.bkk@smkn1warunggunung.sch.id',
    tugas: 'Mengelola anggaran operasional kegiatan bursa kerja, job fair, rekruitmen kampus, dan pelaporan keuangan.',
    urutan: 4
  },
  {
    id: 'mem-5',
    nama: 'FAHMI RIYADI, S.T.',
    nip: '19871103 201402 1 001',
    jabatan: 'Koordinator Hubungan Industri (Hubin)',
    level: 4,
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    noHp: '0821-4455-6677',
    email: 'hubin@smkn1warunggunung.sch.id',
    tugas: 'Menjalin kemitraan dengan DUDIKA (Dunia Usaha, Dunia Industri, Dunia Kerja), menyusun MOU, dan memfasilitasi rekrutmen industri.',
    urutan: 5
  },
  {
    id: 'mem-6',
    nama: 'NURUL HIDAYATI, S.Pd.',
    nip: '19920318 201801 2 004',
    jabatan: 'Koordinator Penelusuran Alumni (Tracer Study)',
    level: 4,
    foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    noHp: '0856-7788-9900',
    email: 'alumni.bkk@smkn1warunggunung.sch.id',
    tugas: 'Melakukan tracer study tahunan, pendataan alumni bekerja, wirausaha, kuliah, serta kepuasan pengguna lulusan.',
    urutan: 6
  },
  {
    id: 'mem-7',
    nama: 'AGUS SETIAWAN, A.Md.',
    nip: '19960912 202203 1 006',
    jabatan: 'Anggota Divisi IT & Verifikasi Data',
    level: 5,
    foto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    noHp: '0896-1122-3344',
    email: 'agus.it@smkn1warunggunung.sch.id',
    tugas: 'Memelihara sistem database BKK, memverifikasi bukti kerja siswa, dan menyajikan laporan visual statistik.',
    urutan: 7
  }
];

const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    nama: 'PT Astra Honda Motor (AHM)',
    logo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200&auto=format&fit=crop&q=80',
    alamat: 'Kawasan Industri MM2100, Cikarang Barat, Bekasi, Jawa Barat',
    pimpinan: 'Toshiyuki Inuma (Presdir)',
    contactPerson: 'Bambang Triyono (HRD Recruitment)',
    telepon: '(021) 6518080',
    email: 'recruitment@astra-honda.com',
    bidangUsaha: 'Manufaktur Perakitan Sepeda Motor & Komponen Otomotif',
    jenisKerjaSama: ['Perekrutan Lulusan', 'Kelas Industri', 'Sertifikasi Kompetensi', 'PKL Siswa'],
    status: 'Aktif',
    tahunBermitra: 2020,
    jumlahLulusanDiterima: 38,
    createdAt: '2024-01-10T08:00:00Z'
  },
  {
    id: 'comp-2',
    nama: 'PT Krakatau Steel (Persero) Tbk',
    logo: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=200&auto=format&fit=crop&q=80',
    alamat: 'Jl. Industri No. 5, Ramanuju, Kec. Purwakarta, Kota Cilegon, Banten',
    pimpinan: 'Purwono Widodo',
    contactPerson: 'Irwan Setiadi (Corporate HR)',
    telepon: '(0254) 392159',
    email: 'career@krakatausteel.com',
    bidangUsaha: 'Industri Baja Terpadu & Fabrikasi Logam',
    jenisKerjaSama: ['Perekrutan Lulusan', 'PKL Siswa', 'Guru Tamu Praktisi'],
    status: 'Aktif',
    tahunBermitra: 2019,
    jumlahLulusanDiterima: 26,
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'comp-3',
    nama: 'PT Telkom Indonesia (Persero) Tbk - Witel Banten',
    logo: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&auto=format&fit=crop&q=80',
    alamat: 'Jl. KH. Abdul Fatah Hasan No. 54, Cipare, Kota Serang, Banten',
    pimpinan: 'Gatot Supriyono',
    contactPerson: 'Fitri Handayani (HR Talent & Development)',
    telepon: '(0254) 200100',
    email: 'recruitment.banten@telkom.co.id',
    bidangUsaha: 'Telekomunikasi, Jaringan Fiber Optic & Cloud Digital',
    jenisKerjaSama: ['Perekrutan Lulusan', 'Sinkronisasi Kurikulum', 'Sertifikasi Kompetensi', 'PKL Siswa'],
    status: 'Aktif',
    tahunBermitra: 2021,
    jumlahLulusanDiterima: 31,
    createdAt: '2024-02-01T10:00:00Z'
  },
  {
    id: 'comp-4',
    nama: 'PT Mayora Indah Tbk',
    logo: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&auto=format&fit=crop&q=80',
    alamat: 'Jl. Telesonic No. 34, Pasir Jaya, Jatiuwung, Tangerang, Banten',
    pimpinan: 'Jogi Hendra Atmadja',
    contactPerson: 'Suryadi (Head of People Acquisition)',
    telepon: '(021) 5901333',
    email: 'hrd.mayora@mayora.co.id',
    bidangUsaha: 'Fast Moving Consumer Goods (FMCG) & Food Processing',
    jenisKerjaSama: ['Perekrutan Lulusan', 'PKL Siswa'],
    status: 'Aktif',
    tahunBermitra: 2022,
    jumlahLulusanDiterima: 42,
    createdAt: '2024-02-12T11:00:00Z'
  },
  {
    id: 'comp-5',
    nama: 'PT Nikomas Gemilang (Pou Chen Group)',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80',
    alamat: 'Jl. Raya Tambak - Kibin KM. 71, Kibin, Serang, Banten',
    pimpinan: 'Tsai Chi Jui',
    contactPerson: 'Wahyu Nugroho (Talent Acquisition)',
    telepon: '(0254) 401580',
    email: 'recruitment@nikomas.co.id',
    bidangUsaha: 'Manufaktur Sepatu Olahraga Internasional',
    jenisKerjaSama: ['Perekrutan Lulusan', 'Magang Kerja'],
    status: 'Aktif',
    tahunBermitra: 2018,
    jumlahLulusanDiterima: 54,
    createdAt: '2024-03-01T08:00:00Z'
  },
  {
    id: 'comp-6',
    nama: 'PT Denso Indonesia',
    logo: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=200&auto=format&fit=crop&q=80',
    alamat: 'Kawasan Industri MM2100, Blok H-1, Cikarang Barat, Bekasi',
    pimpinan: 'Shigeru Sasaki',
    contactPerson: 'Andi Pratama (Recruitment Section)',
    telepon: '(021) 8980303',
    email: 'career@denso.co.id',
    bidangUsaha: 'Komponen Elektronik & Pendingin Otomotif',
    jenisKerjaSama: ['Perekrutan Lulusan', 'Kelas Industri', 'Penempatan Luar Negeri'],
    status: 'Aktif',
    tahunBermitra: 2021,
    jumlahLulusanDiterima: 19,
    createdAt: '2024-03-10T14:00:00Z'
  },
  {
    id: 'comp-7',
    nama: 'Toyota Tsusho Corporation (Japan Placement)',
    logo: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&auto=format&fit=crop&q=80',
    alamat: 'Minato-ku, Tokyo, Japan / Kerjasama Lembaga LPK Global Banten',
    pimpinan: 'Ichiro Kashitani',
    contactPerson: 'Kenji Tanaka / Hendra Saputra',
    telepon: '+81-3-4306-2000',
    email: 'global.talent@toyota-tsusho.com',
    bidangUsaha: 'Automotive Engineering & Precision Machinery (Program Ginou Jisshusei)',
    jenisKerjaSama: ['Perekrutan Lulusan Luar Negeri', 'Sertifikasi Bahasa & Keahlian'],
    status: 'Aktif',
    tahunBermitra: 2023,
    jumlahLulusanDiterima: 12,
    createdAt: '2024-04-05T09:00:00Z'
  }
];

const INITIAL_MOUS: MouDocument[] = [
  {
    id: 'mou-1',
    noMou: '421.5/082/SMKN1-WG/BKK/MOU/2024',
    namaPerusahaan: 'PT Astra Honda Motor (AHM)',
    companyId: 'comp-1',
    tanggalMulai: '2024-01-15',
    tanggalSelesai: '2027-01-14',
    pihakSekolah: 'WAHYUDI, S.Pd., M.Pd. (Kepala Sekolah)',
    pihakPerusahaan: 'Bambang Triyono (Head of HR Division AHM)',
    ringkasan: 'Kerja sama pembukaan Kelas Industri TBSM & TKRO, penyelarasan kurikulum standar AHM, uji sertifikasi mekanik level 1, dan prioritas rekrutmen alumni setiap tahun.',
    fileUrl: '/documents/MOU-AHM-SMKN1-2024.pdf',
    fileName: 'MOU_Kerjasama_AHM_SMKN1WG_2024_2027.pdf',
    fotoKegiatanUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=600&auto=format&fit=crop&q=80',
    status: 'Aktif',
    createdAt: '2024-01-16T10:00:00Z'
  },
  {
    id: 'mou-2',
    noMou: '421.5/114/SMKN1-WG/BKK/MOU/2023',
    namaPerusahaan: 'PT Telkom Indonesia (Persero) Tbk - Witel Banten',
    companyId: 'comp-3',
    tanggalMulai: '2023-08-10',
    tanggalSelesai: '2026-08-09',
    pihakSekolah: 'WAHYUDI, S.Pd., M.Pd. (Kepala Sekolah)',
    pihakPerusahaan: 'Gatot Supriyono (GM Witel Banten)',
    ringkasan: 'Kemitraan sertifikasi fiber optic (K3 & Splicing) untuk siswa TKJ/RPL, rekrutmen teknisi jaringan Indihome & B2B, serta program guru tamu praktisi.',
    fileUrl: '/documents/MOU-TELKOM-SMKN1-2023.pdf',
    fileName: 'MOU_Telkom_SMKN1WG_Tracer_2023_2026.pdf',
    fotoKegiatanUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
    status: 'Aktif',
    createdAt: '2023-08-11T11:00:00Z'
  },
  {
    id: 'mou-3',
    noMou: '421.5/045/SMKN1-WG/BKK/MOU/2024',
    namaPerusahaan: 'PT Krakatau Steel (Persero) Tbk',
    companyId: 'comp-2',
    tanggalMulai: '2024-03-01',
    tanggalSelesai: '2027-02-28',
    pihakSekolah: 'WAHYUDI, S.Pd., M.Pd. (Kepala Sekolah)',
    pihakPerusahaan: 'Irwan Setiadi (Corporate HR Director)',
    ringkasan: 'Program pemagangan industri bersertifikat, penyerapan tenaga kerja teknisi mekanik & kelistrikan industri dari lulusan SMKN 1 Warunggunung.',
    fileUrl: '/documents/MOU-KRAKATAU-STEEL-2024.pdf',
    fileName: 'MOU_KrakatauSteel_SMKN1WG_2024.pdf',
    fotoKegiatanUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
    status: 'Aktif',
    createdAt: '2024-03-02T13:00:00Z'
  },
  {
    id: 'mou-4',
    noMou: '421.5/209/SMKN1-WG/BKK/MOU/2023',
    namaPerusahaan: 'Toyota Tsusho Corporation (Japan Placement)',
    companyId: 'comp-7',
    tanggalMulai: '2023-11-20',
    tanggalSelesai: '2026-11-19',
    pihakSekolah: 'WAHYUDI, S.Pd., M.Pd. (Kepala Sekolah)',
    pihakPerusahaan: 'Kenji Tanaka (Director of International HR)',
    ringkasan: 'Program magang kerja dan penempatan tenaga kerja khusus luar negeri (Jepang) bidang perakitan komponen presisi dan manufaktur mesin otomotif.',
    fileUrl: '/documents/MOU-JAPAN-PLACEMENT-2023.pdf',
    fileName: 'MOU_GlobalPlacement_Japan_2023.pdf',
    fotoKegiatanUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
    status: 'Aktif',
    createdAt: '2023-11-21T09:00:00Z'
  }
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-1',
    nomor: 1,
    nisn: '0054819201',
    nis: '212210012',
    namaLengkap: 'Rizki Pratama',
    jenisKelamin: 'L',
    tempatLahir: 'Lebak',
    tanggalLahir: '2005-04-12',
    alamat: 'Kp. Pasir Eurih RT 03/RW 02, Warunggunung, Lebak, Banten',
    noHp: '0812-8901-2345',
    tahunLulus: 2024,
    jurusan: 'Rekayasa Perangkat Lunak',
    namaPerusahaan: 'PT Telkom Indonesia (Persero) Tbk',
    alamatPerusahaan: 'Jl. KH. Abdul Fatah Hasan No. 54, Serang, Banten',
    jabatan: 'Junior Frontend Developer',
    bidangPekerjaan: 'Teknologi Informasi & Software',
    negaraPenempatan: 'Indonesia',
    negaraSpesifik: 'Indonesia',
    tahunMulaiBekerja: 2024,
    statusPekerjaan: 'Kontrak',
    fotoSiswa: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    buktiBekerja: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    catatan: 'Lolos seleksi rekrutmen kampus BKK tahap 1',
    createdAt: '2024-06-15T09:00:00Z',
    updatedAt: '2024-06-15T09:00:00Z'
  },
  {
    id: 'stu-2',
    nomor: 2,
    nisn: '0061245678',
    nis: '212210045',
    namaLengkap: 'Dimas Aditya Nugraha',
    jenisKelamin: 'L',
    tempatLahir: 'Pandeglang',
    tanggalLahir: '2006-02-18',
    alamat: 'Jl. Raya Rangkasbitung No. 45, Warunggunung, Lebak',
    noHp: '0857-1234-9876',
    tahunLulus: 2024,
    jurusan: 'Teknik Kendaraan Ringan Otomotif',
    namaPerusahaan: 'PT Astra Honda Motor (AHM)',
    alamatPerusahaan: 'Kawasan Industri MM2100, Cikarang, Bekasi',
    jabatan: 'Assembly Line Technician',
    bidangPekerjaan: 'Manufaktur Perakitan Otomotif',
    negaraPenempatan: 'Indonesia',
    negaraSpesifik: 'Indonesia',
    tahunMulaiBekerja: 2024,
    statusPekerjaan: 'Kontrak',
    fotoSiswa: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    buktiBekerja: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    catatan: 'Diterima melalui program Kelas Industri',
    createdAt: '2024-07-01T10:00:00Z',
    updatedAt: '2024-07-01T10:00:00Z'
  },
  {
    id: 'stu-3',
    nomor: 3,
    nisn: '0057812903',
    nis: '212210088',
    namaLengkap: 'Siti Nurhaliza',
    jenisKelamin: 'P',
    tempatLahir: 'Rangkasbitung',
    tanggalLahir: '2005-08-25',
    alamat: 'Kp. Baros RT 01/RW 04, Warunggunung, Lebak',
    noHp: '0878-5544-3322',
    tahunLulus: 2024,
    jurusan: 'Akuntansi dan Keuangan Lembaga',
    namaPerusahaan: 'PT Mayora Indah Tbk',
    alamatPerusahaan: 'Jl. Telesonic No. 34, Jatiuwung, Tangerang',
    jabatan: 'Staff Finance & AP Clerk',
    bidangPekerjaan: 'Akuntansi & Keuangan Korporat',
    negaraPenempatan: 'Indonesia',
    negaraSpesifik: 'Indonesia',
    tahunMulaiBekerja: 2024,
    statusPekerjaan: 'Tetap',
    fotoSiswa: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    buktiBekerja: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    catatan: 'Diangkat karyawan tetap setelah masa evaluasi 3 bulan',
    createdAt: '2024-07-15T11:00:00Z',
    updatedAt: '2024-07-15T11:00:00Z'
  },
  {
    id: 'stu-4',
    nomor: 4,
    nisn: '0049981234',
    nis: '202110032',
    namaLengkap: 'Fajar Maulana',
    jenisKelamin: 'L',
    tempatLahir: 'Lebak',
    tanggalLahir: '2004-11-05',
    alamat: 'Desa Sukaraja, Kec. Warunggunung, Kab. Lebak',
    noHp: '0895-3344-5566',
    tahunLulus: 2023,
    jurusan: 'Teknik Komputer dan Jaringan',
    namaPerusahaan: 'Toyota Tsusho Corporation (Japan Placement)',
    alamatPerusahaan: 'Nagoya Plant, Aichi Prefecture, Japan',
    jabatan: 'Industrial Robotics & Automation Operator',
    bidangPekerjaan: 'Mekatronika & Robotika Presisi',
    negaraPenempatan: 'Luar Negeri',
    negaraSpesifik: 'Jepang',
    tahunMulaiBekerja: 2023,
    statusPekerjaan: 'Kontrak',
    fotoSiswa: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    buktiBekerja: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    catatan: 'Kontrak penempatan 3 tahun di Jepang via BKK Global',
    createdAt: '2023-12-05T08:00:00Z',
    updatedAt: '2023-12-05T08:00:00Z'
  },
  {
    id: 'stu-5',
    nomor: 5,
    nisn: '0056123490',
    nis: '212210102',
    namaLengkap: 'Ahmad Fauzan',
    jenisKelamin: 'L',
    tempatLahir: 'Serang',
    tanggalLahir: '2005-01-30',
    alamat: 'Kp. Cempaka, Warunggunung, Kab. Lebak',
    noHp: '0822-6677-8899',
    tahunLulus: 2024,
    jurusan: 'Teknik dan Bisnis Sepeda Motor',
    namaPerusahaan: 'Bengkel Mandiri Motor (Wirausaha)',
    alamatPerusahaan: 'Jl. Raya Petir KM 02, Warunggunung',
    jabatan: 'Owner & Kepala Mekanik',
    bidangPekerjaan: 'Jasa Servis & Sparepart Motor',
    negaraPenempatan: 'Indonesia',
    negaraSpesifik: 'Indonesia',
    tahunMulaiBekerja: 2024,
    statusPekerjaan: 'Wirausaha',
    fotoSiswa: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    buktiBekerja: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    catatan: 'Membuka bengkel mandiri dengan binaan program wirausaha BKK',
    createdAt: '2024-08-01T14:00:00Z',
    updatedAt: '2024-08-01T14:00:00Z'
  },
  {
    id: 'stu-6',
    nomor: 6,
    nisn: '0068901235',
    nis: '212210156',
    namaLengkap: 'Anisa Rahmawati',
    jenisKelamin: 'P',
    tempatLahir: 'Lebak',
    tanggalLahir: '2006-05-14',
    alamat: 'Jl. Jenderal Sudirman No. 12, Rangkasbitung',
    noHp: '0838-9900-1122',
    tahunLulus: 2024,
    jurusan: 'Otomatisasi dan Tata Kelola Perkantoran',
    namaPerusahaan: 'PT Krakatau Steel (Persero) Tbk',
    alamatPerusahaan: 'Kawasan Industri Krakatau, Cilegon, Banten',
    jabatan: 'Administrative Executive & Document Controller',
    bidangPekerjaan: 'Administrasi & Kepegawaian',
    negaraPenempatan: 'Indonesia',
    negaraSpesifik: 'Indonesia',
    tahunMulaiBekerja: 2024,
    statusPekerjaan: 'Kontrak',
    fotoSiswa: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    buktiBekerja: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    catatan: 'Ditempatkan di divisi Corporate Secretary',
    createdAt: '2024-08-10T15:00:00Z',
    updatedAt: '2024-08-10T15:00:00Z'
  },
  {
    id: 'stu-7',
    nomor: 7,
    nisn: '0041239987',
    nis: '202110055',
    namaLengkap: 'Bagus Tri Wibowo',
    jenisKelamin: 'L',
    tempatLahir: 'Tangerang',
    tanggalLahir: '2004-09-09',
    alamat: 'Kp. Cibuah, Warunggunung, Lebak',
    noHp: '0813-2233-4455',
    tahunLulus: 2023,
    jurusan: 'Teknik Kendaraan Ringan Otomotif',
    namaPerusahaan: 'PT Denso Indonesia',
    alamatPerusahaan: 'Kawasan MM2100 Blok H-1, Cikarang Barat',
    jabatan: 'Quality Control Inspector',
    bidangPekerjaan: 'Otomotif & Manufaktur Presisi',
    negaraPenempatan: 'Indonesia',
    negaraSpesifik: 'Indonesia',
    tahunMulaiBekerja: 2023,
    statusPekerjaan: 'Tetap',
    fotoSiswa: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    buktiBekerja: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    catatan: 'Promosi karyawan tetap tahun 2024',
    createdAt: '2023-09-01T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z'
  },
  {
    id: 'stu-8',
    nomor: 8,
    nisn: '0051122334',
    nis: '212210067',
    namaLengkap: 'Tiara Anggraini',
    jenisKelamin: 'P',
    tempatLahir: 'Lebak',
    tanggalLahir: '2005-03-21',
    alamat: 'Kp. Narimbang Mulya, Rangkasbitung, Lebak',
    noHp: '0858-6677-8811',
    tahunLulus: 2024,
    jurusan: 'Rekayasa Perangkat Lunak',
    namaPerusahaan: 'PT Nikomas Gemilang',
    alamatPerusahaan: 'Jl. Raya Serang KM 71, Kibin, Serang',
    jabatan: 'ERP Data Analyst Assistant',
    bidangPekerjaan: 'Data Management & Sistem Manufaktur',
    negaraPenempatan: 'Indonesia',
    negaraSpesifik: 'Indonesia',
    tahunMulaiBekerja: 2024,
    statusPekerjaan: 'Kontrak',
    fotoSiswa: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    buktiBekerja: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    catatan: 'Pengelolaan sistem order ERP',
    createdAt: '2024-09-01T10:00:00Z',
    updatedAt: '2024-09-01T10:00:00Z'
  },
  {
    id: 'stu-9',
    nomor: 9,
    nisn: '0067788990',
    nis: '222310014',
    namaLengkap: 'Hendrik Pratama',
    jenisKelamin: 'L',
    tempatLahir: 'Lebak',
    tanggalLahir: '2006-07-11',
    alamat: 'Jl. Cempaka Indah No. 8, Warunggunung, Lebak',
    noHp: '0877-3344-5566',
    tahunLulus: 2025,
    jurusan: 'Teknik Komputer dan Jaringan',
    namaPerusahaan: 'PT Telkom Indonesia (Persero) Tbk',
    alamatPerusahaan: 'Witel Banten, Serang',
    jabatan: 'Fiber Optic Network Support',
    bidangPekerjaan: 'Infrastruktur Jaringan & Telekomunikasi',
    negaraPenempatan: 'Indonesia',
    negaraSpesifik: 'Indonesia',
    tahunMulaiBekerja: 2025,
    statusPekerjaan: 'Magang',
    fotoSiswa: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    buktiBekerja: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    catatan: 'Magang bersertifikat industri BKK',
    createdAt: '2025-07-20T08:00:00Z',
    updatedAt: '2025-07-20T08:00:00Z'
  },
  {
    id: 'stu-10',
    nomor: 10,
    nisn: '0059900112',
    nis: '212210199',
    namaLengkap: 'Dewi Sartika',
    jenisKelamin: 'P',
    tempatLahir: 'Pandeglang',
    tanggalLahir: '2005-12-03',
    alamat: 'Kp. Kadugadung, Warunggunung, Lebak',
    noHp: '0812-7788-9900',
    tahunLulus: 2024,
    jurusan: 'Akuntansi dan Keuangan Lembaga',
    namaPerusahaan: 'Bank BJB KCP Warunggunung',
    alamatPerusahaan: 'Jl. Raya Petir, Cempaka, Warunggunung',
    jabatan: 'Customer Service Officer',
    bidangPekerjaan: 'Perbankan & Pelayanan Nasabah',
    negaraPenempatan: 'Indonesia',
    negaraSpesifik: 'Indonesia',
    tahunMulaiBekerja: 2024,
    statusPekerjaan: 'Kontrak',
    fotoSiswa: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    buktiBekerja: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    catatan: 'Penempatan perbankan daerah Banten',
    createdAt: '2024-09-15T09:00:00Z',
    updatedAt: '2024-09-15T09:00:00Z'
  }
];

const INITIAL_YEARLY_STATISTICS: YearlyStatistic[] = [
  {
    tahun: 2021,
    totalLulusan: 280,
    jumlahBekerja: 198,
    jumlahWirausaha: 34,
    jumlahMelanjutkan: 28,
    jumlahMencariKerja: 20,
    persentaseBekerja: 82.8
  },
  {
    tahun: 2022,
    totalLulusan: 310,
    jumlahBekerja: 228,
    jumlahWirausaha: 40,
    jumlahMelanjutkan: 30,
    jumlahMencariKerja: 12,
    persentaseBekerja: 86.4
  },
  {
    tahun: 2023,
    totalLulusan: 345,
    jumlahBekerja: 265,
    jumlahWirausaha: 45,
    jumlahMelanjutkan: 25,
    jumlahMencariKerja: 10,
    persentaseBekerja: 89.8
  },
  {
    tahun: 2024,
    totalLulusan: 380,
    jumlahBekerja: 312,
    jumlahWirausaha: 48,
    jumlahMelanjutkan: 15,
    jumlahMencariKerja: 5,
    persentaseBekerja: 94.7
  },
  {
    tahun: 2025,
    totalLulusan: 395,
    jumlahBekerja: 335,
    jumlahWirausaha: 46,
    jumlahMelanjutkan: 10,
    jumlahMencariKerja: 4,
    persentaseBekerja: 96.4
  },
  {
    tahun: 2026,
    totalLulusan: 410,
    jumlahBekerja: 358,
    jumlahWirausaha: 42,
    jumlahMelanjutkan: 8,
    jumlahMencariKerja: 2,
    persentaseBekerja: 97.5
  }
];

const INITIAL_SETTINGS: SchoolSettings = {
  namaSekolah: 'SMK NEGERI 1 WARUNGGUNUNG',
  npsn: '69752243',
  alamatSekolah: 'Jl. Raya Petir - Warunggunung KM. 04, Cempaka, Kec. Warunggunung',
  kabupatenKota: 'Kabupaten Lebak',
  provinsi: 'Banten',
  kodePos: '42352',
  telepon: '(0252) 281234',
  email: 'bkk@smkn1warunggunung.sch.id',
  website: 'https://smkn1warunggunung.sch.id',
  namaKepalaSekolah: 'WAHYUDI, S.Pd., M.Pd.',
  nipKepalaSekolah: '19740512 200003 1 004',
  namaKepalaBkk: 'IVAN ARIFESTIAN, S.Pd.',
  nipKepalaBkk: '19890815 201503 1 002',
  logoUrl: DEFAULT_LOGO_URL,
  tagline: 'Mewujudkan Lulusan Kompeten, Siap Kerja, dan Berdaya Saing Global.',
  tahunAjaranAktif: '2025/2026'
};

// Initial admin hash for password 'VANJAZZ64'
// Precalculated with salt: SMKN1_WARUNGGUNUNG_BKK_SALT_2026
// We will also verify fallback
const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    username: 'VAN64',
    // SHA256 of 'VANJAZZ64' + 'SMKN1_WARUNGGUNUNG_BKK_SALT_2026'
    // Will be properly checked in crypto verify function
    passwordHash: 'e6988849bbfbcda3e33d4554b7c19eb12f5a5e31faef63ee33b668f44d8b5849',
    name: 'Ivan Arifestian, S.Pd.',
    role: 'superadmin',
    lastLogin: new Date().toISOString()
  }
];

class DatabaseService {
  private data: DatabaseSchema;
  private listeners: (() => void)[] = [];

  constructor() {
    this.data = this.loadFromStorage();
  }

  private loadFromStorage(): DatabaseSchema {
    if (typeof window === 'undefined') {
      return this.getInitialSchema();
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Verify key tables exist
        if (parsed.students && parsed.companies && parsed.users) {
          // automatically migrate to official logo if missing or previous placeholder
          if (!parsed.school_settings.logoUrl || parsed.school_settings.logoUrl.includes('smkn1_warunggunung_emblem')) {
            parsed.school_settings.logoUrl = DEFAULT_LOGO_URL;
            this.saveToStorage(parsed);
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse database from localStorage:', e);
    }

    const init = this.getInitialSchema();
    this.saveToStorage(init);
    return init;
  }

  private getInitialSchema(): DatabaseSchema {
    return {
      users: INITIAL_USERS,
      students: INITIAL_STUDENTS,
      companies: INITIAL_COMPANIES,
      mou_documents: INITIAL_MOUS,
      bkk_members: INITIAL_MEMBERS,
      departments: INITIAL_DEPARTMENTS,
      yearly_statistics: INITIAL_YEARLY_STATISTICS,
      school_settings: INITIAL_SETTINGS
    };
  }

  private saveToStorage(data: DatabaseSchema) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to persist database to localStorage:', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(l => {
      try {
        l();
      } catch (err) {
        console.error('Listener callback error', err);
      }
    });
  }

  // Session & Auth
  public getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const sessionRaw = sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
      if (sessionRaw) {
        return JSON.parse(sessionRaw);
      }
    } catch (e) {
      console.error('Auth session error', e);
    }
    return null;
  }

  public setSession(user: User, remember: boolean = true) {
    if (typeof window === 'undefined') return;
    const json = JSON.stringify(user);
    if (remember) {
      localStorage.setItem(AUTH_KEY, json);
    }
    sessionStorage.setItem(AUTH_KEY, json);
    this.notifyListeners();
  }

  public clearSession() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    this.notifyListeners();
  }

  // USERS
  public getUsers(): User[] {
    return [...this.data.users];
  }

  public getUserByUsername(username: string): User | undefined {
    return this.data.users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
  }

  public updateUserPassword(userId: string, newHash: string, newUsername?: string) {
    this.data.users = this.data.users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          passwordHash: newHash,
          username: newUsername ? newUsername.trim() : u.username
        };
      }
      return u;
    });
    this.saveToStorage(this.data);
  }

  // STUDENTS
  public getStudents(): Student[] {
    return [...this.data.students].sort((a, b) => b.tahunLulus - a.tahunLulus || a.nomor - b.nomor);
  }

  public getStudentById(id: string): Student | undefined {
    return this.data.students.find(s => s.id === id);
  }

  public addStudent(studentData: Omit<Student, 'id' | 'nomor' | 'createdAt' | 'updatedAt'>): Student {
    const nextNomor = this.data.students.length > 0 ? Math.max(...this.data.students.map(s => s.nomor || 0)) + 1 : 1;
    const now = new Date().toISOString();
    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      nomor: nextNomor,
      createdAt: now,
      updatedAt: now
    };
    this.data.students.unshift(newStudent);
    this.saveToStorage(this.data);
    return newStudent;
  }

  public updateStudent(id: string, updates: Partial<Student>): Student | null {
    let updated: Student | null = null;
    this.data.students = this.data.students.map(s => {
      if (s.id === id) {
        updated = {
          ...s,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        return updated;
      }
      return s;
    });
    if (updated) {
      this.saveToStorage(this.data);
    }
    return updated;
  }

  public deleteStudent(id: string): boolean {
    const initialLen = this.data.students.length;
    this.data.students = this.data.students.filter(s => s.id !== id);
    if (this.data.students.length !== initialLen) {
      // re-index nomor
      this.data.students.forEach((s, idx) => {
        s.nomor = idx + 1;
      });
      this.saveToStorage(this.data);
      return true;
    }
    return false;
  }

  public batchAddStudents(newStudents: Array<Omit<Student, 'id' | 'nomor' | 'createdAt' | 'updatedAt'>>): number {
    let currentNomor = this.data.students.length > 0 ? Math.max(...this.data.students.map(s => s.nomor || 0)) : 0;
    const now = new Date().toISOString();
    
    const addedList: Student[] = newStudents.map(item => {
      currentNomor += 1;
      return {
        ...item,
        id: `stu-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        nomor: currentNomor,
        createdAt: now,
        updatedAt: now
      };
    });

    this.data.students = [...addedList, ...this.data.students];
    this.saveToStorage(this.data);
    return addedList.length;
  }

  // COMPANIES
  public getCompanies(): Company[] {
    return [...this.data.companies];
  }

  public addCompany(data: Omit<Company, 'id' | 'createdAt'>): Company {
    const newCompany: Company = {
      ...data,
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString()
    };
    this.data.companies.unshift(newCompany);
    this.saveToStorage(this.data);
    return newCompany;
  }

  public updateCompany(id: string, updates: Partial<Company>): Company | null {
    let updated: Company | null = null;
    this.data.companies = this.data.companies.map(c => {
      if (c.id === id) {
        updated = { ...c, ...updates };
        return updated;
      }
      return c;
    });
    if (updated) {
      this.saveToStorage(this.data);
    }
    return updated;
  }

  public deleteCompany(id: string): boolean {
    const prevLen = this.data.companies.length;
    this.data.companies = this.data.companies.filter(c => c.id !== id);
    if (this.data.companies.length !== prevLen) {
      this.saveToStorage(this.data);
      return true;
    }
    return false;
  }

  // MOUs
  public getMous(): MouDocument[] {
    return [...this.data.mou_documents].sort((a, b) => new Date(b.tanggalMulai).getTime() - new Date(a.tanggalMulai).getTime());
  }

  public addMou(data: Omit<MouDocument, 'id' | 'createdAt'>): MouDocument {
    const newMou: MouDocument = {
      ...data,
      id: `mou-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString()
    };
    this.data.mou_documents.unshift(newMou);
    this.saveToStorage(this.data);
    return newMou;
  }

  public updateMou(id: string, updates: Partial<MouDocument>): MouDocument | null {
    let updated: MouDocument | null = null;
    this.data.mou_documents = this.data.mou_documents.map(m => {
      if (m.id === id) {
        updated = { ...m, ...updates };
        return updated;
      }
      return m;
    });
    if (updated) {
      this.saveToStorage(this.data);
    }
    return updated;
  }

  public deleteMou(id: string): boolean {
    const prevLen = this.data.mou_documents.length;
    this.data.mou_documents = this.data.mou_documents.filter(m => m.id !== id);
    if (this.data.mou_documents.length !== prevLen) {
      this.saveToStorage(this.data);
      return true;
    }
    return false;
  }

  // BKK MEMBERS / ORGANISASI
  public getMembers(): BkkMember[] {
    return [...this.data.bkk_members].sort((a, b) => a.urutan - b.urutan);
  }

  public addMember(data: Omit<BkkMember, 'id'>): BkkMember {
    const newMember: BkkMember = {
      ...data,
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };
    this.data.bkk_members.push(newMember);
    this.data.bkk_members.sort((a, b) => a.urutan - b.urutan);
    this.saveToStorage(this.data);
    return newMember;
  }

  public updateMember(id: string, updates: Partial<BkkMember>): BkkMember | null {
    let updated: BkkMember | null = null;
    this.data.bkk_members = this.data.bkk_members.map(m => {
      if (m.id === id) {
        updated = { ...m, ...updates };
        return updated;
      }
      return m;
    });
    if (updated) {
      this.data.bkk_members.sort((a, b) => a.urutan - b.urutan);
      this.saveToStorage(this.data);
    }
    return updated;
  }

  public deleteMember(id: string): boolean {
    const prevLen = this.data.bkk_members.length;
    this.data.bkk_members = this.data.bkk_members.filter(m => m.id !== id);
    if (this.data.bkk_members.length !== prevLen) {
      this.saveToStorage(this.data);
      return true;
    }
    return false;
  }

  // DEPARTMENTS
  public getDepartments(): Department[] {
    return [...this.data.departments];
  }

  public addDepartment(data: Omit<Department, 'id'>): Department {
    const newDep: Department = {
      ...data,
      id: `dep-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };
    this.data.departments.push(newDep);
    this.saveToStorage(this.data);
    return newDep;
  }

  public updateDepartment(id: string, updates: Partial<Department>): Department | null {
    let updated: Department | null = null;
    this.data.departments = this.data.departments.map(d => {
      if (d.id === id) {
        updated = { ...d, ...updates };
        return updated;
      }
      return d;
    });
    if (updated) {
      this.saveToStorage(this.data);
    }
    return updated;
  }

  public deleteDepartment(id: string): boolean {
    const prev = this.data.departments.length;
    this.data.departments = this.data.departments.filter(d => d.id !== id);
    if (this.data.departments.length !== prev) {
      this.saveToStorage(this.data);
      return true;
    }
    return false;
  }

  // YEARLY STATISTICS
  public getYearlyStatistics(): YearlyStatistic[] {
    return [...this.data.yearly_statistics].sort((a, b) => a.tahun - b.tahun);
  }

  public updateYearlyStatistics(stats: YearlyStatistic[]) {
    this.data.yearly_statistics = stats;
    this.saveToStorage(this.data);
  }

  // SETTINGS
  public getSettings(): SchoolSettings {
    return { ...this.data.school_settings };
  }

  public updateSettings(updates: Partial<SchoolSettings>): SchoolSettings {
    this.data.school_settings = {
      ...this.data.school_settings,
      ...updates
    };

    // If head of BKK or Principal changed, also update the org member name in members list
    if (updates.namaKepalaBkk) {
      this.data.bkk_members = this.data.bkk_members.map(m => {
        if (m.jabatan.includes('Ketua BKK')) {
          return { ...m, nama: updates.namaKepalaBkk!, nip: updates.nipKepalaBkk || m.nip };
        }
        return m;
      });
    }
    if (updates.namaKepalaSekolah) {
      this.data.bkk_members = this.data.bkk_members.map(m => {
        if (m.jabatan.includes('Penanggung Jawab') || m.jabatan.includes('Kepala Sekolah')) {
          return { ...m, nama: updates.namaKepalaSekolah!, nip: updates.nipKepalaSekolah || m.nip };
        }
        return m;
      });
    }

    this.saveToStorage(this.data);
    return this.data.school_settings;
  }

  // BACKUP & RESTORE
  public exportDatabaseJSON(): string {
    return JSON.stringify(this.data, null, 2);
  }

  public importDatabaseJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.students && parsed.companies && parsed.users && parsed.school_settings) {
        this.data = parsed;
        this.saveToStorage(this.data);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import error', e);
      return false;
    }
  }

  public resetToFactoryDefaults() {
    this.data = this.getInitialSchema();
    this.saveToStorage(this.data);
  }
}

export const db = new DatabaseService();
