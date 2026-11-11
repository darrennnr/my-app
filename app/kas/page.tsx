"use client";

import { useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import { CheckIcon, ClockIcon, CrossIcon, SearchIcon, WalletIcon } from "../components/icons";

/* ---------- Konfigurasi kas ---------- */
const IURAN = 5000; // per minggu per mahasiswa
const WEEKS = 8; // jumlah kolom minggu pada tabel
const CURRENT_WEEK = 3; // minggu berjalan (minggu > ini belum bisa diisi)
const SALDO_AWAL = 50000;

/* ---------- Data dummy ---------- */
const NAMES = [
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

const STUDENTS = NAMES.map((nama, i) => ({
  nama,
  NRP: `24116000${String(i + 1).padStart(2, "0")}`,
}));

type Expense = {
  id: number;
  date: string;
  note: string;
  cat: string;
  color: "blue" | "peach" | "pink" | "green";
  amount: number;
};

const EXPENSES: Expense[] = [
  { id: 1, date: "2 Sep 2026", note: "Spidol & penghapus papan tulis", cat: "Perlengkapan", color: "blue", amount: 35000 },
  { id: 2, date: "3 Sep 2026", note: "Fotokopi modul Matematika", cat: "Akademik", color: "peach", amount: 48000 },
  { id: 3, date: "4 Sep 2026", note: "Isi ulang galon air kelas", cat: "Kebutuhan", color: "green", amount: 20000 },
  { id: 4, date: "6 Sep 2026", note: "Konsumsi rapat angkatan", cat: "Kegiatan", color: "pink", amount: 75000 },
  { id: 5, date: "8 Sep 2026", note: "Cetak spanduk kegiatan", cat: "Kegiatan", color: "pink", amount: 30000 },
  { id: 6, date: "9 Sep 2026", note: "Kartu ucapan & bingkisan dosen", cat: "Kebutuhan", color: "green", amount: 40000 },
];

/** Pola pembayaran awal (deterministik, tanpa random supaya aman untuk SSR) */
const initPaid = () =>
  STUDENTS.map((_, i) =>
    Array.from({ length: WEEKS }, (_, w) => {
      if (w >= CURRENT_WEEK) return false;
      if (i === 13 && w < 2) return false;
      if (i === 6 && w === 0) return false;
      return (i * 7 + w * 5 + 3) % 9 !== 0;
    })
  );

/** Format rupiah: 1250000 -> "1.250.000" */
const num = (n: number) => Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const rp = (n: number) => `${n < 0 ? "-" : ""}Rp ${num(n)}`;

type Tab = "iuran" | "keluar";
const TABS: { key: Tab; label: string }[] = [
  { key: "iuran", label: "Iuran Mahasiswa" },
  { key: "keluar", label: "Pengeluaran" },
];

function Money({ value }: { value: number }) {
  return (
    <>
      <small>{value < 0 ? "-Rp" : "Rp"}</small>
      {num(value)}
    </>
  );
}

/** Halaman 6 — Kas Kelas */
export default function KasPage() {
  const [tab, setTab] = useState<Tab>("iuran");
  const [paid, setPaid] = useState<boolean[][]>(initPaid);
  const [q, setQ] = useState("");

  const toggle = (si: number, w: number) => {
    if (w >= CURRENT_WEEK) return;
    setPaid((prev) =>
      prev.map((row, ri) => (ri === si ? row.map((v, wi) => (wi === w ? !v : v)) : row))
    );
  };

  /* ---------- Perhitungan ---------- */
  const calc = useMemo(() => {
    const rows = STUDENTS.map((s, i) => {
      const count = paid[i].filter(Boolean).length;
      return {
        ...s,
        index: i,
        count,
        total: count * IURAN,
        tunggakan: (CURRENT_WEEK - count) * IURAN,
      };
    });
    const perWeek = Array.from({ length: WEEKS }, (_, w) => paid.filter((r) => r[w]).length);
    const totalIuran = rows.reduce((a, r) => a + r.total, 0);
    const target = STUDENTS.length * CURRENT_WEEK * IURAN;
    const pemasukan = SALDO_AWAL + totalIuran;
    const pengeluaran = EXPENSES.reduce((a, e) => a + e.amount, 0);
    return {
      rows,
      perWeek,
      totalIuran,
      target,
      tunggakan: target - totalIuran,
      pemasukan,
      pengeluaran,
      saldo: pemasukan - pengeluaran,
      persen: Math.round((totalIuran / target) * 100),
    };
  }, [paid]);

  const filtered = calc.rows.filter(
    (r) => r.nama.toLowerCase().includes(q.toLowerCase()) || r.NRP.includes(q)
  );

  let running = calc.pemasukan;
  const expRows = EXPENSES.map((e) => {
    running -= e.amount;
    return { ...e, sisa: running };
  });

  return (
    <AppShell>
      <p className="date-line">Kamis, 9 September 2026 - Minggu 3</p>
      <h2 className="page-title">
        <WalletIcon size={30} />
        Kas Kelas
      </h2>

      {/* Ringkasan */}
      <div className="kas-stats">
        <div className="card stat">
          <div className="top"><span>Saldo Awal</span></div>
          <div className="num"><Money value={SALDO_AWAL} /></div>
        </div>
        <div className="card stat">
          <div className="top"><span>Pemasukan</span><i className="dot ok" /></div>
          <div className="num"><Money value={calc.pemasukan} /></div>
        </div>
        <div className="card stat">
          <div className="top"><span>Pengeluaran</span><i className="dot bad" /></div>
          <div className="num"><Money value={calc.pengeluaran} /></div>
        </div>
        <div className="card stat dark">
          <div className="top"><span>Saldo Akhir</span></div>
          <div className="num"><Money value={calc.saldo} /></div>
        </div>
      </div>

      {/* Tab */}
      <div className="tabs two kas-tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`tab ${tab === t.key ? "on" : ""}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ---------- Iuran ---------- */}
      {tab === "iuran" && (
        <>
          <div className="kas-toolbar">
            <div className="search">
              <SearchIcon size={22} />
              <input
                placeholder="Cari nama atau NRP"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Cari mahasiswa"
              />
            </div>
            <div className="kas-meta">
              <span className="chip">Iuran {rp(IURAN)} / minggu</span>
              <span className="muted">Ketuk kotak minggu untuk mengubah status bayar</span>
            </div>
          </div>

          <div className="card xl-wrap">
            <table className="xl">
              <thead>
                <tr>
                  <th className="s1">No</th>
                  <th className="s2">Nama</th>
                  <th>NRP</th>
                  {Array.from({ length: WEEKS }, (_, w) => (
                    <th key={w} className="ctr">M{w + 1}</th>
                  ))}
                  <th className="r">Total Bayar</th>
                  <th className="r">Tunggakan</th>
                  <th className="ctr">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, n) => (
                  <tr key={r.NRP}>
                    <td className="s1">{n + 1}</td>
                    <td className="s2">{r.nama}</td>
                    <td className="muted-cell">{r.NRP}</td>
                    {Array.from({ length: WEEKS }, (_, w) => {
                      const off = w >= CURRENT_WEEK;
                      const ok = paid[r.index][w];
                      return (
                        <td key={w} className="ctr">
                          <button
                            className={`wk ${off ? "off" : ok ? "ok" : "bad"}`}
                            disabled={off}
                            onClick={() => toggle(r.index, w)}
                            aria-label={`${r.nama} minggu ${w + 1}: ${off ? "belum berjalan" : ok ? "sudah bayar" : "belum bayar"}`}
                          >
                            {off ? "–" : ok ? <CheckIcon size={16} /> : <CrossIcon size={16} />}
                          </button>
                        </td>
                      );
                    })}
                    <td className="r">{rp(r.total)}</td>
                    <td className="r">{r.tunggakan > 0 ? rp(r.tunggakan) : "–"}</td>
                    <td className="ctr">
                      <span className={`pill sm ${r.tunggakan > 0 ? "bad" : "ok"}`}>
                        <i />
                        {r.tunggakan > 0 ? "Menunggak" : "Lunas"}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={WEEKS + 6} className="empty">Mahasiswa tidak ditemukan.</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td className="s1" />
                  <td className="s2">Total ({STUDENTS.length} mahasiswa)</td>
                  <td />
                  {calc.perWeek.map((c, w) => (
                    <td key={w} className="ctr">{w < CURRENT_WEEK ? `${c}/${STUDENTS.length}` : "–"}</td>
                  ))}
                  <td className="r">{rp(calc.totalIuran)}</td>
                  <td className="r">{rp(calc.tunggakan)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}

      {/* ---------- Pengeluaran ---------- */}
      {tab === "keluar" && (
        <>
          <div className="group-head">
            <span>Penggunaan Kas</span>
            <span className="count">{EXPENSES.length} Transaksi</span>
          </div>

          {/* Tabel (layar lebar) */}
          <div className="card xl-wrap exp-table">
            <table className="xl">
              <thead>
                <tr>
                  <th className="s1">No</th>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th>Kategori</th>
                  <th className="r">Nominal</th>
                  <th className="r">Sisa Kas</th>
                </tr>
              </thead>
              <tbody>
                {expRows.map((e, n) => (
                  <tr key={e.id}>
                    <td className="s1">{n + 1}</td>
                    <td className="muted-cell">{e.date}</td>
                    <td>{e.note}</td>
                    <td><span className={`chip c-${e.color}`}>{e.cat}</span></td>
                    <td className="r">{rp(e.amount)}</td>
                    <td className="r">{rp(e.sisa)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="s1" />
                  <td colSpan={3}>Total pengeluaran</td>
                  <td className="r">{rp(calc.pengeluaran)}</td>
                  <td className="r">{rp(calc.saldo)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Kartu (layar kecil) */}
          <div className="exp-cards">
            {expRows.map((e) => (
              <div key={e.id} className="card exp-card">
                <div className="row">
                  <span className={`chip c-${e.color}`}>{e.cat}</span>
                  <strong>{rp(e.amount)}</strong>
                </div>
                <div className="t">{e.note}</div>
                <div className="row m">
                  <span className="with-ico"><ClockIcon size={16} />{e.date}</span>
                  <span>Sisa {rp(e.sisa)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---------- Perhitungan saldo akhir ---------- */}
      <h3 className="section-title">Perhitungan Saldo Akhir</h3>
      <div className="recap-grid">
        <div className="card recap">
          <div className="rc-row"><span>Saldo awal semester</span><span>{rp(SALDO_AWAL)}</span></div>
          <div className="rc-row"><span>Iuran terkumpul (M1 - M{CURRENT_WEEK})</span><span>+ {rp(calc.totalIuran)}</span></div>
          <div className="rc-row strong"><span>Total pemasukan</span><span>{rp(calc.pemasukan)}</span></div>
          <div className="rc-row"><span>Total pengeluaran</span><span>- {rp(calc.pengeluaran)}</span></div>
          <div className="rc-total"><span>Saldo akhir</span><span>{rp(calc.saldo)}</span></div>
        </div>

        <div className="card recap">
          <div className="rc-row">
            <span>Iuran terkumpul</span>
            <span>{calc.persen}%</span>
          </div>
          <div className="bar" role="progressbar" aria-valuenow={calc.persen} aria-valuemin={0} aria-valuemax={100}>
            <i style={{ width: `${calc.persen}%` }} />
          </div>
          <div className="rc-row"><span>Target sampai M{CURRENT_WEEK}</span><span>{rp(calc.target)}</span></div>
          <div className="rc-row"><span>Terkumpul</span><span>{rp(calc.totalIuran)}</span></div>
          <div className="rc-row"><span>Belum dibayar</span><span>{rp(calc.tunggakan)}</span></div>
          <div className="rc-row">
            <span>Mahasiswa menunggak</span>
            <span>{calc.rows.filter((r) => r.tunggakan > 0).length} orang</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}