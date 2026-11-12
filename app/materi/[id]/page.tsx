"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppShell from "../../components/AppShell";
import {
  DocIcon,
  DotsIcon,
  DownloadIcon,
  FileArchiveIcon,
  FileImageIcon,
  FilePdfIcon,
  FolderOpenIcon,
  GridIcon,
  ListIcon,
  SearchIcon,
  UploadIcon,
} from "../../components/icons";
import { MATERI } from "../../lib/data";

type Kind = "folder" | "pdf" | "doc" | "img" | "zip";
type Item = { id: string; name: string; kind: Kind; info: string; date: string };

const LABEL: Record<Kind, string> = {
  folder: "Folder",
  pdf: "PDF",
  doc: "Dokumen",
  img: "Gambar",
  zip: "Arsip",
};

const ITEMS: Item[] = [
  { id: "f1", name: "Pertemuan 1 - Matriks", kind: "folder", info: "4 berkas", date: "9 Sep 2026" },
  { id: "f2", name: "Pertemuan 2 - Determinan", kind: "folder", info: "5 berkas", date: "8 Sep 2026" },
  { id: "f3", name: "Latihan & Pembahasan", kind: "folder", info: "6 berkas", date: "2 Sep 2026" },
  { id: "x1", name: "Modul Determinan dan Matriks.pdf", kind: "pdf", info: "2.4 MB", date: "9 Sep 2026" },
  { id: "x2", name: "Slide Pertemuan 1.pptx", kind: "doc", info: "4.1 MB", date: "9 Sep 2026" },
  { id: "x3", name: "Contoh Soal Determinan.pdf", kind: "pdf", info: "820 KB", date: "8 Sep 2026" },
  { id: "x4", name: "Tabel Matriks.xlsx", kind: "doc", info: "310 KB", date: "5 Sep 2026" },
  { id: "x5", name: "Foto Papan Tulis.jpg", kind: "img", info: "1.8 MB", date: "3 Sep 2026" },
  { id: "x6", name: "Arsip Latihan.zip", kind: "zip", info: "6.2 MB", date: "2 Sep 2026" },
  { id: "x7", name: "Rangkuman Minggu 1.docx", kind: "doc", info: "96 KB", date: "1 Sep 2026" },
];

function ItemIcon({ kind, size = 22 }: { kind: Kind; size?: number }) {
  if (kind === "folder") return <FolderOpenIcon size={size} />;
  if (kind === "pdf") return <FilePdfIcon size={size} />;
  if (kind === "img") return <FileImageIcon size={size} />;
  if (kind === "zip") return <FileArchiveIcon size={size} />;
  return <DocIcon size={size} />;
}

/** Halaman detail folder materi (file manager) */
export default function MateriFolderPage() {
  const params = useParams<{ id: string }>();
  const raw = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const folder = MATERI.find((m) => String(m.id) === raw) ?? MATERI[0];

  const [q, setQ] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");

  const list = useMemo(
    () => ITEMS.filter((it) => it.name.toLowerCase().includes(q.trim().toLowerCase())),
    [q]
  );

  return (
    <AppShell showSettings={false}>
      <p className="date-line">Kamis, 9 September 2026 - Minggu 3</p>

      <div className="crumb">
        <Link href="/materi">Materi</Link>
        <span aria-hidden>/</span>
        <span className="cur">{folder.title}</span>
      </div>

      <h2 className="page-title">
        <FolderOpenIcon size={30} />
        {folder.title}
      </h2>

      <div className="card folder-head">
        <div className="ico">
          <FolderOpenIcon size={34} />
        </div>
        <div className="meta">
          <p>{folder.dosen}</p>
          <div className="chips">
            <span className="chip sm">{folder.count} Berkas</span>
            <span className="chip sm c-peach">3 Folder</span>
            <span className="chip sm c-blue">Semester 1</span>
            <span className="chip sm c-green">1.2 GB</span>
          </div>
        </div>
        <div className="act-row">
          <button className="btn-sm black">
            <UploadIcon size={18} />
            Unggah Berkas
          </button>
        </div>
      </div>

      <div className="fm-toolbar">
        <label className="search">
          <SearchIcon size={22} style={{ color: "#999" }} />
          <input
            type="search"
            placeholder="Cari berkas di folder ini"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>

        <div className="seg" role="group" aria-label="Tampilan daftar berkas">
          <button
            type="button"
            className={view === "list" ? "on" : ""}
            aria-pressed={view === "list"}
            aria-label="Tampilan daftar"
            onClick={() => setView("list")}
          >
            <ListIcon size={20} />
          </button>
          <button
            type="button"
            className={view === "grid" ? "on" : ""}
            aria-pressed={view === "grid"}
            aria-label="Tampilan kisi"
            onClick={() => setView("grid")}
          >
            <GridIcon size={20} />
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="empty">Berkas tidak ditemukan.</p>
      ) : view === "list" ? (
        <div className="card fm-card">
          {list.map((it) => (
            <div className="fm-row" key={it.id}>
              <div className={`fm-ico ${it.kind}`}>
                <ItemIcon kind={it.kind} />
              </div>
              <div className="nm">
                <div className="t">{it.name}</div>
                <div className="sub">
                  {LABEL[it.kind]} · {it.info} · Diubah {it.date}
                </div>
              </div>
              <button className="btn-ghost" aria-label={`Unduh ${it.name}`}>
                <DownloadIcon size={18} />
              </button>
              <button className="btn-ghost" aria-label={`Aksi lain untuk ${it.name}`}>
                <DotsIcon size={20} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="fm-grid">
          {list.map((it) => (
            <div className="card fm-tile" key={it.id}>
              <div className={`fm-ico ${it.kind}`}>
                <ItemIcon kind={it.kind} size={24} />
              </div>
              <div>
                <div className="t">{it.name}</div>
                <div className="s">
                  {LABEL[it.kind]} · {it.info}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}