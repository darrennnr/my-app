import type { CategoryTone } from "./data";
import { pad2 } from "./utils";

/* ---------- Konfigurasi ---------- */
export const IURAN = 5000; // per minggu per mahasiswa
export const WEEKS = 8; // jumlah kolom minggu pada tabel
export const CURRENT_WEEK = 3; // minggu berjalan (minggu setelahnya belum bisa diisi)
export const SALDO_AWAL = 50000;

/* ---------- Data dummy ---------- */
const STUDENT_NAMES = [
  "Ahmad Fauzan Ramadhan",
  "Aisyah Putri Maharani",
  "Bagas Prasetyo",
  "Citra Dewi Lestari",
  "Darren Alvaro",
  "Dimas Ardiansyah",
  "Eka Nur Fadilah",
  "Farhan Maulana",
  "Gita Safitri",
  "Hafidz Rizqullah",
  "Indah Permatasari",
  "Joko Santoso",
  "Kirana Salsabila",
  "Lukman Hakim",
  "Mutiara Azzahra",
  "Naufal Rizky",
  "Okta Viana Putri",
  "Putra Wijaya",
  "Rina Marlina",
  "Salsabila Nurul",
];

export const STUDENTS = STUDENT_NAMES.map((name, i) => ({
  name,
  nrp: `24116000${pad2(i + 1)}`,
}));

export type Expense = {
  id: number;
  date: string;
  note: string;
  cat: string;
  tone: CategoryTone;
  amount: number;
};

export const EXPENSES: Expense[] = [
  { id: 1, date: "2 Sep 2026", note: "Spidol & penghapus papan tulis", cat: "Perlengkapan", tone: "blue", amount: 35000 },
  { id: 2, date: "3 Sep 2026", note: "Fotokopi modul Matematika", cat: "Akademik", tone: "peach", amount: 48000 },
  { id: 3, date: "4 Sep 2026", note: "Isi ulang galon air kelas", cat: "Kebutuhan", tone: "green", amount: 20000 },
  { id: 4, date: "6 Sep 2026", note: "Konsumsi rapat angkatan", cat: "Kegiatan", tone: "pink", amount: 75000 },
  { id: 5, date: "8 Sep 2026", note: "Cetak spanduk kegiatan", cat: "Kegiatan", tone: "pink", amount: 30000 },
  { id: 6, date: "9 Sep 2026", note: "Kartu ucapan & bingkisan dosen", cat: "Kebutuhan", tone: "green", amount: 40000 },
];

/* ---------- Status pembayaran ---------- */
/** paid[indexMahasiswa][indexMinggu] */
export type PaidMatrix = boolean[][];

/** Pola awal deterministik (tanpa random supaya aman untuk SSR) */
export const createInitialPaid = (): PaidMatrix =>
  STUDENTS.map((_, i) =>
    Array.from({ length: WEEKS }, (_, w) => {
      if (w >= CURRENT_WEEK) return false;
      if (i === 13 && w < 2) return false;
      if (i === 6 && w === 0) return false;
      return (i * 7 + w * 5 + 3) % 9 !== 0;
    })
  );

/* ---------- Perhitungan ---------- */
export function summarizeKas(paid: PaidMatrix) {
  const rows = STUDENTS.map((student, index) => {
    const count = paid[index].filter(Boolean).length;
    return {
      ...student,
      index,
      count,
      total: count * IURAN,
      tunggakan: (CURRENT_WEEK - count) * IURAN,
    };
  });

  const perWeek = Array.from({ length: WEEKS }, (_, w) => paid.filter((row) => row[w]).length);
  const totalIuran = rows.reduce((sum, r) => sum + r.total, 0);
  const target = STUDENTS.length * CURRENT_WEEK * IURAN;
  const pemasukan = SALDO_AWAL + totalIuran;
  const pengeluaran = EXPENSES.reduce((sum, e) => sum + e.amount, 0);

  return {
    rows,
    perWeek,
    totalIuran,
    target,
    tunggakan: target - totalIuran,
    menunggak: rows.filter((r) => r.tunggakan > 0).length,
    pemasukan,
    pengeluaran,
    saldo: pemasukan - pengeluaran,
    persen: Math.round((totalIuran / target) * 100),
  };
}

export type KasSummary = ReturnType<typeof summarizeKas>;

/** Pengeluaran beserta sisa kas setelah tiap transaksi */
export function withRunningBalance(pemasukan: number) {
  let running = pemasukan;
  return EXPENSES.map((expense) => {
    running -= expense.amount;
    return { ...expense, sisa: running };
  });
}