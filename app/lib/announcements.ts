import type { CategoryTone } from "./data";

export type Category = "Akademik" | "Kegiatan" | "Kas" | "Umum";

export type Announcement = {
  id: number;
  title: string;
  body: string;
  cat: Category;
  author: string;
  day: number; // tanggal di September 2026 (dipakai untuk urutan)
  pinned: boolean;
  read: boolean;
  important?: boolean;
  when?: string;
  place?: string;
};

export const TODAY_DAY = 9;
export const ME = "Darren (Ketua Kelas)";

export const CATEGORIES: Category[] = ["Akademik", "Kegiatan", "Kas", "Umum"];

export const CAT_COLOR: Record<Category, CategoryTone> = {
  Akademik: "blue",
  Kegiatan: "pink",
  Kas: "green",
  Umum: "peach",
};

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: "Perubahan ruang Praktikum Sistem Digital",
    body: "Praktikum Sistem Digital minggu depan dipindah ke ruang JJ - 303 karena ruang lama dipakai ujian susulan. Mohon bawa modul praktikum dan jas lab masing-masing.",
    cat: "Akademik",
    author: "Afifah Dwi Ramadhani, S.ST., M.TR.T",
    day: 9,
    pinned: true,
    read: false,
    important: true,
    when: "Selasa, 14 September 2026 · 13.50 - 15.30",
    place: "JJ - 303",
  },
  {
    id: 2,
    title: "Technical Meeting LKMM-Pra TD",
    body: "Seluruh peserta wajib hadir tepat waktu dan mengenakan almamater. Teknis kegiatan, pembagian kelompok, dan perlengkapan yang harus dibawa akan dijelaskan pada pertemuan ini.",
    cat: "Kegiatan",
    author: "Panitia LKMM",
    day: 8,
    pinned: true,
    read: false,
    important: true,
    when: "Jum’at, 18 September 2026 · 19.30 - 20.30",
    place: "PAS Lantai 6",
  },
  {
    id: 3,
    title: "Iuran kas minggu ke-3",
    body: "Iuran kas minggu ini sebesar Rp 5.000 per orang. Pembayaran bisa langsung ke bendahara kelas atau transfer, lalu kirim bukti ke grup kelas. Rekap terbaru ada di halaman Kas.",
    cat: "Kas",
    author: "Salsabila Nurul (Bendahara)",
    day: 8,
    pinned: false,
    read: false,
    when: "Batas pembayaran: Jum’at, 11 September 2026",
  },
  {
    id: 4,
    title: "Latihan 1 - 5 Modul Determinan dan Matriks",
    body: "Kerjakan latihan 1 sampai 5 pada modul Determinan dan Matriks. Jawaban ditulis tangan, difoto dengan jelas, lalu dikumpulkan dalam satu file PDF melalui ETHOL.",
    cat: "Akademik",
    author: "Dosen Matematika",
    day: 7,
    pinned: false,
    read: false,
    important: true,
    when: "Batas pengumpulan: Senin, 14 September 2026",
    place: "ETHOL",
  },
  {
    id: 5,
    title: "Rapat angkatan akhir pekan",
    body: "Rapat membahas pembagian tugas kegiatan angkatan dan anggaran konsumsi. Konsumsi disiapkan dari kas kelas, jadi mohon konfirmasi kehadiran paling lambat Jumat.",
    cat: "Kegiatan",
    author: ME,
    day: 6,
    pinned: false,
    read: true,
    when: "Sabtu, 12 September 2026 · 10.00 - 12.00",
    place: "Ruang Diskusi Gedung D4",
  },
  {
    id: 6,
    title: "Kelas pengganti Agama via Zoom",
    body: "Kelas Agama pada Selasa malam dilaksanakan daring. Tautan Zoom dibagikan melalui ETHOL satu jam sebelum kelas dimulai.",
    cat: "Akademik",
    author: "Dosen Agama",
    day: 5,
    pinned: false,
    read: true,
    when: "Selasa, 14 September 2026 · 19.30 - 20.30",
    place: "Zoom ETHOL",
  },
  {
    id: 7,
    title: "Jadwal piket kebersihan kelas",
    body: "Piket dilakukan sebelum jam kuliah pertama. Kelompok 1 bertugas minggu ini, kelompok 2 minggu depan, dan seterusnya bergantian. Yang berhalangan wajib mencari pengganti.",
    cat: "Umum",
    author: ME,
    day: 4,
    pinned: false,
    read: true,
  },
  {
    id: 8,
    title: "Pembentukan kelompok Workshop Teknologi Web",
    body: "Kelompok Workshop terdiri dari 4 orang. Kirim nama anggota ke ketua kelas paling lambat Kamis depan. Mahasiswa yang belum punya kelompok akan dikelompokkan oleh dosen.",
    cat: "Akademik",
    author: "A. Fauzi Makarim, M.TR.KOM.",
    day: 3,
    pinned: false,
    read: true,
    when: "Batas pendaftaran: Kamis, 17 September 2026",
  },
  {
    id: 9,
    title: "Selamat datang mahasiswa baru TRI B 2026",
    body: "Selamat bergabung di kelas TRI B. Grup kelas dan informasi penting akan dibagikan di sini, jadi pastikan kamu rutin membuka halaman Pengumuman.",
    cat: "Umum",
    author: ME,
    day: 1,
    pinned: false,
    read: true,
  },
];

/** 9 -> "Hari ini", 8 -> "Kemarin", selain itu tanggal lengkap */
export const relativeDay = (day: number) =>
  day === TODAY_DAY ? "Hari ini" : day === TODAY_DAY - 1 ? "Kemarin" : `${day} September 2026`;

/** Urutan terbaru: tanggal menurun, lalu id menurun */
export const sortNewest = (a: Announcement, b: Announcement) => b.day - a.day || b.id - a.id;