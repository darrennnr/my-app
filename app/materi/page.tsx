"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "../components/AppShell";
import {
  ChevronDown,
  ChevronRight,
  FolderOpenIcon,
  SearchIcon,
  TasksIcon,
} from "../components/icons";
import { MATERI } from "../lib/data";

/** Halaman 6 — Materi */
export default function MateriPage() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("Terbaru");

  const list = useMemo(() => {
    const f = MATERI.filter((m) =>
      `${m.title} ${m.dosen}`.toLowerCase().includes(q.toLowerCase())
    );
    if (sort === "Terlama") return [...f].reverse();
    if (sort === "A-Z") return [...f].sort((a, b) => a.title.localeCompare(b.title));
    return f;
  }, [q, sort]);

  return (
    <AppShell showSettings={false}>
      <p className="date-line">Kamis, 9 September 2026 - Minggu 3</p>
      <h2 className="page-title">
        <TasksIcon size={30} />
        Materi
      </h2>

      <label className="search">
        <SearchIcon size={24} style={{ color: "#999" }} />
        <input
          type="search"
          placeholder="Cari materi atau mata kuliah"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </label>

      <div className="list-head">
        <span>Daftar Materi</span>
        <label className="sort">
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Urutkan">
            <option>Terbaru</option>
            <option>Terlama</option>
            <option>A-Z</option>
          </select>
          <ChevronDown size={22} />
        </label>
      </div>

      <div className="materi-grid">
        {list.map((m) => (
          <Link key={m.id} href={`/materi/${m.id}`} className="card materi">
            <div className="ico">
              <FolderOpenIcon size={26} />
            </div>
            <div className="row">
              <div>
                <div className="t">
                  {m.title}
                  <br />
                  {m.dosen}
                </div>
                <div className="c">{m.count} Materi</div>
              </div>
              <ChevronRight size={22} />
            </div>
          </Link>
        ))}
      </div>
      {list.length === 0 && <p className="empty">Materi tidak ditemukan.</p>}
    </AppShell>
  );
}