/* ---------- Konteks aplikasi ---------- */
export const DATE_LINE = "Kamis, 9 September 2026 · Minggu 3";
export const CLASS_NAME = "TRI B 2026";
export const SEMESTER = "Semester 1";
export const STUDENT_NAME = "Darren Aditya Pratama";
export const STUDENT_NICKNAME = "Darren";

export const LECTURERS = {
  math: "Dra. Rini Satiti, M. Si",
  algorithm: "Afifah Dwi Ramadhani, S.ST., M.TR.T",
  web: "A. Fauzi Makarim, M.TR.KOM.",
} as const;

export type CategoryTone = "blue" | "peach" | "pink" | "green";

/* ---------- Tugas ---------- */
export type TaskStatus = "ok" | "bad";
export type TaskWeek = "now" | "next";

export type Task = {
  id: number;
  title: string;
  course: string;
  dosen: string;
  opened: string;
  due: string;
  daysLeft: number;
  file: string;
  status: TaskStatus;
  week: TaskWeek;
};

export const TASKS: Task[] = [
  {
    id: 1,
    title: "Latihan 1 - 5 Modul Determinan dan Matriks",
    course: "Matematika",
    dosen: LECTURERS.math,
    opened: "9 September 2026",
    due: "Senin, 14 September",
    daysLeft: 5,
    file: "Latihan_1-5_Determinan.pdf",
    status: "bad",
    week: "now",
  },
  {
    id: 2,
    title: "Laporan Praktikum Algoritma dan Pemrogramman",
    course: "Praktikum Algoritma",
    dosen: LECTURERS.algorithm,
    opened: "8 September 2026",
    due: "Rabu, 16 September",
    daysLeft: 7,
    file: "Panduan_Laporan_Praktikum.pdf",
    status: "bad",
    week: "now",
  },
  {
    id: 3,
    title: "Rancangan Halaman Web Sederhana",
    course: "Workshop Teknologi Web",
    dosen: LECTURERS.web,
    opened: "9 September 2026",
    due: "Kamis, 17 September",
    daysLeft: 8,
    file: "Brief_Rancangan_Halaman_Web.pdf",
    status: "bad",
    week: "now",
  },
  {
    id: 4,
    title: "Latihan Soal Matriks Invers",
    course: "Matematika",
    dosen: LECTURERS.math,
    opened: "4 September 2026",
    due: "Jum’at, 11 September",
    daysLeft: 2,
    file: "Latihan_Matriks_Invers.pdf",
    status: "ok",
    week: "now",
  },
  {
    id: 5,
    title: "Latihan Dasar Pemrogramman",
    course: "Praktikum Algoritma",
    dosen: LECTURERS.algorithm,
    opened: "3 September 2026",
    due: "Selasa, 8 September",
    daysLeft: -1,
    file: "Soal_Dasar_Pemrogramman.pdf",
    status: "ok",
    week: "now",
  },
  {
    id: 6,
    title: "Tugas Pengenalan HTML dan CSS",
    course: "Workshop Teknologi Web",
    dosen: LECTURERS.web,
    opened: "2 September 2026",
    due: "Rabu, 9 September",
    daysLeft: 0,
    file: "Instruksi_HTML_CSS.pdf",
    status: "ok",
    week: "now",
  },
  {
    id: 7,
    title: "Latihan 6 - 10 Modul Vektor",
    course: "Matematika",
    dosen: LECTURERS.math,
    opened: "9 September 2026",
    due: "Senin, 21 September",
    daysLeft: 12,
    file: "Latihan_6-10_Vektor.pdf",
    status: "bad",
    week: "next",
  },
];

/* ---------- Jadwal hari ini (dashboard) ---------- */
export type TodayClass = {
  title: string;
  time: string;
  dosen: string;
  mode: "Luring" | "Daring";
  room: string;
  tone: CategoryTone;
};

export const TODAY_CLASSES: TodayClass[] = [
  {
    title: "Praktikum Algoritma dan Pemrogramman",
    time: "09.00 - 11.00",
    dosen: LECTURERS.algorithm,
    mode: "Luring",
    room: "SAW - 04.06",
    tone: "blue",
  },
  {
    title: "Workshop Teknologi Web dan Aplikasi",
    time: "13.00 - 15.00",
    dosen: LECTURERS.web,
    mode: "Daring",
    room: "Zoom ETHOL",
    tone: "green",
  },
];

/* ---------- Agenda lain ---------- */
export type AgendaItem = { id: number; title: string; when: string; place: string };

export const AGENDA: AgendaItem[] = [
  { id: 1, title: "Agama", when: "Selasa, 14 September 2026 · 19.30 - 20.30", place: "Zoom ETHOL" },
  {
    id: 2,
    title: "Technical Meeting LKMM-Pra TD",
    when: "Jum’at, 18 September 2026 · 19.30 - 20.30",
    place: "PAS Lantai 6",
  },
];

/* ---------- Materi ---------- */
export type Materi = { id: number; title: string; dosen: string; count: number };

export const MATERI: Materi[] = Array.from({ length: 11 }, (_, i) => ({
  id: i + 1,
  title: `Matematika - ${i + 1}`,
  dosen: LECTURERS.math,
  count: 15,
}));

/* ---------- Statistik akademik (profil & dashboard) ---------- */
export const ACADEMIC_STATS = [
  { label: "IPK", value: "3.72" },
  { label: "SKS Lulus", value: "21" },
  { label: "Kehadiran", value: "96%" },
  { label: "Tugas Selesai", value: "24" },
] as const;