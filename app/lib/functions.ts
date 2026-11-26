import { TODAY_DAY } from "./announcements";
import type { CategoryTone } from "./data";
import type { NotifyKey } from "./preferences";

export type NotifType = NotifyKey | "sistem";

export type AppNotification = {
  id: number;
  type: NotifType;
  title: string;
  body: string;
  day: number; // tanggal di September 2026
  time: string; // "07.15"
  href: string;
  read: boolean;
  important?: boolean;
};

export const NOTIF_TYPES: NotifType[] = ["tugas", "jadwal", "kas", "pengumuman", "materi", "sistem"];

export const NOTIF_LABEL: Record<NotifType, string> = {
  tugas: "Tugas",
  jadwal: "Jadwal",
  kas: "Kas",
  pengumuman: "Pengumuman",
  materi: "Materi",
  sistem: "Sistem",
};

export const NOTIF_TONE: Record<NotifType, CategoryTone> = {
  tugas: "blue",
  jadwal: "pink",
  kas: "green",
  pengumuman: "peach",
  materi: "blue",
  sistem: "peach",
};

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    type: "pengumuman",
    title: "Perubahan ruang Praktikum Sistem Digital",
    body: "Praktikum minggu depan dipindah ke ruang JJ - 303. Mohon bawa modul praktikum dan jas lab.",
    day: 9,
    time: "07.15",
    href: "/pengumuman",
    read: false,
    important: true,
  },
  {
    id: 2,
    type: "tugas",
    title: "Tugas baru: Latihan 6 - 10 Modul Vektor",
    body: "Dosen Matematika menambahkan tugas baru. Batas pengumpulan Senin, 21 September 2026.",
    day: 9,
    time: "06.40",
    href: "/tugas/7",
    read: false,
  },
  {
    id: 3,
    type: "jadwal",
    title: "Praktikum Algoritma dimulai 30 menit lagi",
    body: "Kelas dimulai pukul 09.00 di ruang SAW - 04.06 (luring).",
    day: 9,
    time: "08.30",
    href: "/jadwal",
    read: false,
  },
  {
    id: 4,
    type: "kas",
    title: "Iuran kas minggu ke-3 belum terbayar",
    body: "Batas pembayaran Jum’at, 11 September 2026 sebesar Rp 5.000. Cek rekap terbaru di halaman Kas.",
    day: 8,
    time: "19.00",
    href: "/kas",
    read: false,
  },
  {
    id: 5,
    type: "pengumuman",
    title: "Technical Meeting LKMM-Pra TD",
    body: "Seluruh peserta wajib hadir tepat waktu dan mengenakan almamater di PAS Lantai 6.",
    day: 8,
    time: "15.20",
    href: "/pengumuman",
    read: false,
    important: true,
  },
  {
    id: 6,
    type: "tugas",
    title: "Tenggat 5 hari lagi: Latihan 1 - 5 Determinan",
    body: "Kumpulkan dalam satu file PDF sebelum Senin, 14 September 2026 pukul 23.59 WIB.",
    day: 8,
    time: "08.00",
    href: "/tugas/1",
    read: true,
  },
  {
    id: 7,
    type: "materi",
    title: "Materi baru: Matematika - 2",
    body: "Pertemuan 2 - Determinan sudah diunggah, berisi 5 berkas.",
    day: 7,
    time: "13.10",
    href: "/materi/2",
    read: true,
  },
  {
    id: 8,
    type: "sistem",
    title: "Selamat datang di Portal Akademik",
    body: "Atur tema, ukuran teks, dan notifikasi sesukamu lewat halaman Pengaturan.",
    day: 1,
    time: "08.00",
    href: "/pengaturan",
    read: true,
  },
];

export const isNotifEnabled = (type: NotifType, notify: Record<NotifyKey, boolean>) =>
  type === "sistem" || notify[type];

/** Terbaru dulu: tanggal menurun, lalu jam menurun */
export const sortNewest = (a: AppNotification, b: AppNotification) =>
  b.day - a.day || b.time.localeCompare(a.time) || b.id - a.id;

export const GROUPS = ["Hari ini", "Kemarin", "Sebelumnya"] as const;
export type GroupLabel = (typeof GROUPS)[number];

export const groupOf = (day: number): GroupLabel =>
  day === TODAY_DAY ? "Hari ini" : day === TODAY_DAY - 1 ? "Kemarin" : "Sebelumnya";