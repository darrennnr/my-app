"use client";

import { useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import { CheckIcon, ClockIcon, CrossIcon, SearchIcon, WalletIcon } from "../components/icons";
import { Chip, DateLine, Money, PageTitle, Pill, ProgressBar, SectionTitle, StatCard, StatGrid } from "../components/ui";
import {
  CURRENT_WEEK,
  IURAN,
  SALDO_AWAL,
  STUDENTS,
  WEEKS,
  createInitialPaid,
  summarizeKas,
  withRunningBalance,
  type PaidMatrix,
} from "../lib/kas";
import { cx, formatRupiah } from "../lib/utils";

const TABS = [
  { key: "iuran", label: "Iuran Mahasiswa" },
  { key: "keluar", label: "Pengeluaran" },
] as const;

type KasTab = (typeof TABS)[number]["key"];

/** Halaman 6: Kas kelas */
export default function KasPage() {
  const [tab, setTab] = useState<KasTab>("iuran");
  const [paid, setPaid] = useState<PaidMatrix>(createInitialPaid);
  const [query, setQuery] = useState("");

  const toggleWeek = (studentIndex: number, week: number) => {
    if (week >= CURRENT_WEEK) return;
    setPaid((prev) =>
      prev.map((row, ri) => (ri === studentIndex ? row.map((value, wi) => (wi === week ? !value : value)) : row))
    );
  };

  const summary = useMemo(() => summarizeKas(paid), [paid]);
  const expenses = useMemo(() => withRunningBalance(summary.pemasukan), [summary.pemasukan]);

  const term = query.toLowerCase();
  const filteredRows = summary.rows.filter((r) => r.name.toLowerCase().includes(term) || r.nrp.includes(query));

  return (
    <AppShell>
      <DateLine />
      <PageTitle icon={<WalletIcon size={24} />}>Kas kelas</PageTitle>

      {/* Ringkasan */}
      <StatGrid>
        <StatCard label="Saldo Awal" value={<Money value={SALDO_AWAL} />} />
        <StatCard label="Pemasukan" accessory={<i className="dot ok" />} value={<Money value={summary.pemasukan} />} />
        <StatCard label="Pengeluaran" accessory={<i className="dot bad" />} value={<Money value={summary.pengeluaran} />} />
        <StatCard label="Saldo Akhir" variant="dark" value={<Money value={summary.saldo} />} />
      </StatGrid>

      {/* Tab */}
      <div className="tabs two">
        {TABS.map((t) => (
          <button key={t.key} className={cx("tab", tab === t.key && "on")} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Iuran */}
      {tab === "iuran" && (
        <>
          <div className="kas-toolbar">
            <div className="search">
              <SearchIcon size={22} />
              <input
                placeholder="Cari nama atau NRP"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Cari mahasiswa"
              />
            </div>
            <div className="kas-meta">
              <Chip>Iuran {formatRupiah(IURAN)} / minggu</Chip>
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
                    <th key={w} className="ctr">
                      M{w + 1}
                    </th>
                  ))}
                  <th className="r">Total Bayar</th>
                  <th className="r">Tunggakan</th>
                  <th className="ctr">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, n) => (
                  <tr key={row.nrp}>
                    <td className="s1">{n + 1}</td>
                    <td className="s2">{row.name}</td>
                    <td className="muted-cell">{row.nrp}</td>
                    {Array.from({ length: WEEKS }, (_, w) => {
                      const notYet = w >= CURRENT_WEEK;
                      const isPaid = paid[row.index][w];
                      const state = notYet ? "off" : isPaid ? "ok" : "bad";
                      const stateLabel = notYet ? "belum berjalan" : isPaid ? "sudah bayar" : "belum bayar";
                      return (
                        <td key={w} className="ctr">
                          <button
                            className={`wk ${state}`}
                            disabled={notYet}
                            onClick={() => toggleWeek(row.index, w)}
                            aria-label={`${row.name} minggu ${w + 1}: ${stateLabel}`}
                          >
                            {notYet ? "–" : isPaid ? <CheckIcon size={16} /> : <CrossIcon size={16} />}
                          </button>
                        </td>
                      );
                    })}
                    <td className="r">{formatRupiah(row.total)}</td>
                    <td className="r">{row.tunggakan > 0 ? formatRupiah(row.tunggakan) : "–"}</td>
                    <td className="ctr">
                      <Pill tone={row.tunggakan > 0 ? "bad" : "ok"} small>
                        {row.tunggakan > 0 ? "Menunggak" : "Lunas"}
                      </Pill>
                    </td>
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={WEEKS + 6} className="empty">
                      Mahasiswa tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td className="s1" />
                  <td className="s2">Total ({STUDENTS.length} mahasiswa)</td>
                  <td />
                  {summary.perWeek.map((count, w) => (
                    <td key={w} className="ctr">
                      {w < CURRENT_WEEK ? `${count}/${STUDENTS.length}` : "–"}
                    </td>
                  ))}
                  <td className="r">{formatRupiah(summary.totalIuran)}</td>
                  <td className="r">{formatRupiah(summary.tunggakan)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}

      {/* Pengeluaran */}
      {tab === "keluar" && (
        <>
          <div className="group-head">
            <span>Penggunaan kas</span>
            <span className="count">{expenses.length} Transaksi</span>
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
                {expenses.map((e, n) => (
                  <tr key={e.id}>
                    <td className="s1">{n + 1}</td>
                    <td className="muted-cell">{e.date}</td>
                    <td>{e.note}</td>
                    <td>
                      <Chip tone={e.tone}>{e.cat}</Chip>
                    </td>
                    <td className="r">{formatRupiah(e.amount)}</td>
                    <td className="r">{formatRupiah(e.sisa)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="s1" />
                  <td colSpan={3}>Total pengeluaran</td>
                  <td className="r">{formatRupiah(summary.pengeluaran)}</td>
                  <td className="r">{formatRupiah(summary.saldo)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Kartu (layar kecil) */}
          <div className="exp-cards">
            {expenses.map((e) => (
              <div key={e.id} className="card exp-card">
                <div className="exp-card-row">
                  <Chip tone={e.tone}>{e.cat}</Chip>
                  <strong>{formatRupiah(e.amount)}</strong>
                </div>
                <div className="t">{e.note}</div>
                <div className="exp-card-row m">
                  <span className="with-ico">
                    <ClockIcon size={16} />
                    {e.date}
                  </span>
                  <span>Sisa {formatRupiah(e.sisa)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Perhitungan saldo akhir */}
      <SectionTitle>Perhitungan saldo akhir</SectionTitle>
      <div className="recap-grid">
        <div className="card recap">
          <div className="rc-row">
            <span>Saldo awal semester</span>
            <span>{formatRupiah(SALDO_AWAL)}</span>
          </div>
          <div className="rc-row">
            <span>Iuran terkumpul (M1 - M{CURRENT_WEEK})</span>
            <span>+ {formatRupiah(summary.totalIuran)}</span>
          </div>
          <div className="rc-row strong">
            <span>Total pemasukan</span>
            <span>{formatRupiah(summary.pemasukan)}</span>
          </div>
          <div className="rc-row">
            <span>Total pengeluaran</span>
            <span>- {formatRupiah(summary.pengeluaran)}</span>
          </div>
          <div className="rc-total">
            <span>Saldo akhir</span>
            <span>{formatRupiah(summary.saldo)}</span>
          </div>
        </div>

        <div className="card recap">
          <div className="rc-row">
            <span>Iuran terkumpul</span>
            <span>{summary.persen}%</span>
          </div>
          <ProgressBar value={summary.persen} label="Iuran terkumpul" />
          <div className="rc-row">
            <span>Target sampai M{CURRENT_WEEK}</span>
            <span>{formatRupiah(summary.target)}</span>
          </div>
          <div className="rc-row">
            <span>Terkumpul</span>
            <span>{formatRupiah(summary.totalIuran)}</span>
          </div>
          <div className="rc-row">
            <span>Belum dibayar</span>
            <span>{formatRupiah(summary.tunggakan)}</span>
          </div>
          <div className="rc-row">
            <span>Mahasiswa menunggak</span>
            <span>{summary.menunggak} orang</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}