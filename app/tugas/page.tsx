"use client";

import { useState } from "react";
import AppShell from "../components/AppShell";
import { CapIcon, ChevronRight, ClockIcon, TasksIcon } from "../components/icons";

type Status = "ok" | "bad";
type Task = { id: number; title: string; course: string; due: string; status: Status; week: "now" | "next" };

const T = "Mengerjakan Latihan 1 - 5 Modul Determinan dan Matriks";
const TASKS: Task[] = [
  { id: 1, title: T, course: "Matematika", due: "Senin, 14 September", status: "ok", week: "now" },
  { id: 2, title: T, course: "Matematika", due: "Senin, 14 September", status: "bad", week: "now" },
  { id: 3, title: T, course: "Matematika", due: "Senin, 14 September", status: "ok", week: "now" },
  { id: 4, title: T, course: "Matematika", due: "Senin, 14 September", status: "ok", week: "now" },
  { id: 5, title: T, course: "Matematika", due: "Senin, 14 September", status: "bad", week: "now" },
  { id: 6, title: T, course: "Matematika", due: "Senin, 14 September", status: "bad", week: "now" },
  { id: 7, title: T, course: "Matematika", due: "Senin, 14 September", status: "bad", week: "next" },
];

const FILTERS = [
  { key: "all", label: "Semua" },
  { key: "ok", label: "Selesai" },
  { key: "bad", label: "Belum" },
] as const;

function TaskCard({ t }: { t: Task }) {
  return (
    <div className="card task">
      <div className="ico"><CapIcon size={64} style={{ width: "70%", height: "auto" }} /></div>
      <div className="info">
        <div className="t">{t.title}</div>
        <div className="m">{t.course}</div>
        <div className="bottom">
          <span className="m" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <ClockIcon size={18} />{t.due}
          </span>
          <span className={`pill ${t.status}`}><i />{t.status === "ok" ? "Selesai" : "Belum"}</span>
        </div>
      </div>
      <ChevronRight size={22} />
    </div>
  );
}

/** Halaman 5 — Daftar Tugas */
export default function TugasPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const list = TASKS.filter((t) => filter === "all" || t.status === filter);
  const now = list.filter((t) => t.week === "now");
  const next = list.filter((t) => t.week === "next");

  return (
    <AppShell>
      <p className="date-line">Kamis, 9 September 2026 - Minggu 3</p>
      <h2 className="page-title"><TasksIcon size={30} />Daftar Tugas</h2>

      <div className="tabs">
        {FILTERS.map((f) => (
          <button key={f.key} className={`tab ${filter === f.key ? "on" : ""}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {now.length > 0 && (
        <>
          <div className="group-head"><span>Minggu ini</span><span className="count">{now.length} Tugas</span></div>
          <div className="task-grid">{now.map((t) => <TaskCard key={t.id} t={t} />)}</div>
        </>
      )}
      {next.length > 0 && (
        <>
          <div className="group-head"><span>Minggu depan</span></div>
          <div className="task-grid">{next.map((t) => <TaskCard key={t.id} t={t} />)}</div>
        </>
      )}
      {list.length === 0 && <p className="empty">Tidak ada tugas.</p>}
    </AppShell>
  );
}