"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import { ChevronDownIcon, ChevronRightIcon, DocIcon, FolderOpenIcon, SearchIcon } from "../components/icons";
import { DateLine, PageTitle } from "../components/ui";
import { MATERI } from "../lib/data";

const SORT_OPTIONS = ["Terbaru", "Terlama", "A-Z"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

/** Halaman 6: Materi */
export default function MateriPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("Terbaru");

  const list = useMemo(() => {
    const filtered = MATERI.filter((m) => `${m.title} ${m.dosen}`.toLowerCase().includes(query.toLowerCase()));
    if (sort === "Terlama") return [...filtered].reverse();
    if (sort === "A-Z") {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title, "id", { numeric: true }));
    }
    return filtered;
  }, [query, sort]);

  return (
    <AppShell showSettings={false}>
      <DateLine />
      <PageTitle icon={<DocIcon size={24} />}>Materi</PageTitle>

      <label className="search">
        <SearchIcon size={20} />
        <input
          type="search"
          placeholder="Cari materi atau mata kuliah"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      <div className="list-head">
        <span>Daftar materi</span>
        <label className="sort">
          <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} aria-label="Urutkan">
            {SORT_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <ChevronDownIcon size={20} />
        </label>
      </div>

      <div className="materi-grid">
        {list.map((m) => (
          <Link key={m.id} href={`/materi/${m.id}`} className="card materi">
            <div className="ico tone-accent">
              <FolderOpenIcon size={22} />
            </div>
            <div className="materi-foot">
              <div>
                <div className="t">
                  {m.title}
                  <br />
                  {m.dosen}
                </div>
                <div className="c">{m.count} Materi</div>
              </div>
              <ChevronRightIcon size={22} />
            </div>
          </Link>
        ))}
      </div>
      {list.length === 0 && <p className="empty">Materi tidak ditemukan</p>}
    </AppShell>
  );
}