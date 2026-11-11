"use client";

import { useState } from "react";
import AppShell from "../components/AppShell";
import { BookIcon, CalendarIcon, ClockIcon, PinIcon } from "../components/icons";

type Ev = {
  day: number; // 0 = Senin
  name: string;
  start: number; // jam desktop (desimal) untuk posisi
  end: number;
  label: string;
  room: string;
  color: "blue" | "peach" | "pink" | "green";
  tugas?: "ok" | "bad";
};

const START_HOUR = 7;
const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

const EVENTS: Ev[] = [
  { day: 0, name: "Matematika", start: 8, end: 9.67, label: "08.00 - 09.40", room: "D4 - B 205", color: "blue", tugas: "ok" },
  { day: 0, name: "Sistem Digital", start: 10.5, end: 12.3, label: "10.30 - 12.10", room: "SAW - 10.08", color: "blue" },
  { day: 0, name: "Konsep Teknologi", start: 13, end: 15, label: "08.00 - 09.40", room: "D4 - B 205", color: "blue", tugas: "ok" },
  { day: 1, name: "Agama", start: 8, end: 9.67, label: "08.00 - 09.40", room: "SAW - 05.01", color: "peach" },
  { day: 1, name: "Pancasila", start: 11.33, end: 13.83, label: "11.20 - 13.50", room: "SC - 02", color: "peach", tugas: "bad" },
  { day: 1, name: "Praktikum Sistem Digital", start: 13.9, end: 15.5, label: "13.50 - 15.30", room: "JJ - 303", color: "peach", tugas: "ok" },
  { day: 2, name: "Praktikum Allgoritma & Pemrogramman", start: 13, end: 14.67, label: "13.00 - 14.40", room: "SAW 04.06", color: "pink", tugas: "ok" },
  { day: 2, name: "Praktikum Sistem Komunikasi", start: 14.75, end: 16.33, label: "14.40 - 16.20", room: "SAW 03.08", color: "pink", tugas: "bad" },
  { day: 3, name: "Workshop teknologi web dan Aplikasi", start: 8.83, end: 11.4, label: "08.50 - 11.20", room: "SAW- 04.06", color: "green", tugas: "ok" },
  { day: 3, name: "Algoritma dan Pemrogramman", start: 13.9, end: 15.6, label: "13.50 - 15.30", room: "A - 303", color: "green", tugas: "ok" },
  { day: 3, name: "Sistem Komunikasi", start: 15.7, end: 17.4, label: "15.30 - 17.10", room: "SAW - 06.06", color: "green" },
];

const OTHERS = [
  { title: "Agama", when: "Selasa, 14 September 2026 - 19.30 - 20.30", place: "Zoom ETHOL" },
  { title: "Technical Meeting LKMM-Pra TD", when: "Jum’at, 18 September 2026 - 19.30 - 20.30", place: "PAS Lantai 6" },
];

/** Halaman 4 — Jadwal Minggu ini */
export default function JadwalPage() {
  const [sel, setSel] = useState<Ev | null>(null);
  const HH = 78;
  const TOP = 10;

  return (
    <AppShell>
      <p className="date-line">Kamis, 9 September 2026 - Minggu 3</p>

      <div className="jadwal-head">
        <h2 className="page-title">
          <CalendarIcon size={30} />
          Jadwal Minggu ini
        </h2>
        <span className="hint">Klik untuk detail</span>
      </div>

      <div className="card tt-wrap">
        <div className="tt">
          <div className="tt-head">
            <span style={{ display: "grid", placeItems: "center" }}>
              <ClockIcon size={22} />
            </span>
            {DAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="tt-body">
            <div className="tt-times">
              {HOURS.map((h) => (
                <span key={h} style={{ top: TOP + (h - START_HOUR) * HH }}>
                  {String(h).padStart(2, "0")}.00
                </span>
              ))}
            </div>

            {DAYS.map((_, di) => (
              <div className="tt-col" key={di}>
                {EVENTS.filter((e) => e.day === di).map((e) => (
                  <button
                    key={e.name + e.label}
                    className={`ev c-${e.color}`}
                    style={{ top: TOP + (e.start - START_HOUR) * HH, height: (e.end - e.start) * HH }}
                    onClick={() => setSel(e)}
                  >
                    <div>
                      <div className="name">{e.name}</div>
                      <div>{e.label}</div>
                      <div>{e.room}</div>
                      <div>Luring</div>
                    </div>
                    {e.tugas && (
                      <div className="tug">
                        <span>1 Tugas</span>
                        <i style={{ background: e.tugas === "ok" ? "var(--ok-light)" : "var(--bad-light)" }} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 className="section-title">Agenda Lainnya</h3>
      {OTHERS.map((o) => (
        <div key={o.title} className="card other-card">
          <div><BookIcon size={16} />{o.title}</div>
          <div><ClockIcon size={16} />{o.when}</div>
          <div><PinIcon size={16} />{o.place}</div>
        </div>
      ))}

      {sel && (
        <div className="modal-bg" onClick={() => setSel(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{sel.name}</h3>
            <div className="row"><ClockIcon size={20} />{sel.label}</div>
            <div className="row"><PinIcon size={20} />{sel.room}</div>
            <div className="row"><span className="chip">Luring</span>{sel.tugas && <span className="chip">1 Tugas</span>}</div>
            <button className="btn-black" style={{ height: 52, fontSize: 18, padding: 0 }} onClick={() => setSel(null)}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}