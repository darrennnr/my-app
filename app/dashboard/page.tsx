"use client";

import { useState } from "react";
import AppShell from "../components/AppShell";
import { ClockIcon, DotsIcon, InfoIcon } from "../components/icons";

const TODAY = [
  {
    title: "Praktikum Algoritma dan Pemrogramman (SAW - 04.06)",
    time: "09.00 - 11.00",
    dosen: "Afifah Dwi Ramadhani, S.ST., M.TR.T",
    mode: "Luring",
  },
  {
    title: "Workshop Teknologi Web dan Aplikasi (SAW - 10.06)",
    time: "13.00 - 15.00",
    dosen: "A. Fauzi Makarim, M. TR.KOM.",
    mode: "Daring",
  },
];

/** Halaman 3 — Dashboard */
export default function DashboardPage() {
  const [note, setNote] = useState("");

  return (
    <AppShell>
      <h2 className="greet">Halo, Darren!</h2>
      <p className="greet-sub">Kamis, 9 September 2026 - Minggu 3</p>
      <p className="greet-sub2">5 Minggu lagi menuju UTS</p>

      <div className="dash-grid">
        <section>
          <h3 className="section-title">Jadwal Hari ini</h3>
          <div className="sched-row">
            {TODAY.map((s) => (
              <article key={s.title} className="card sched-card">
                <h3>{s.title}</h3>
                <div className="time">
                  <ClockIcon size={22} />
                  <span>{s.time}</span>
                </div>
                <p className="dosen">{s.dosen}</p>
                <div className="foot">
                  <span className="chip">{s.mode}</span>
                  <button aria-label="Detail jadwal">
                    <InfoIcon size={24} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <h3 className="section-title" style={{ marginTop: 28 }}>Tugas</h3>
          <div className="stat-grid">
            <div className="card stat">
              <div className="top">
                <span>Selesai</span>
                <i className="dot ok" />
              </div>
              <div className="num">04</div>
            </div>
            <div className="card stat">
              <div className="top">
                <span>Belum Selesai</span>
                <i className="dot bad" />
              </div>
              <div className="num">02</div>
            </div>
          </div>
        </section>

        <section className="dash-right">
          <div className="card notes">
            <div className="head">
              <span>Catatan</span>
              <button aria-label="Menu catatan">
                <DotsIcon size={30} />
              </button>
            </div>
            <div className="notes-body">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                aria-label="Catatan"
              />
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}