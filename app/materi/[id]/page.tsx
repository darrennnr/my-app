"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
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
import { Chip, DateLine, PageTitle } from "../../components/ui";
import { MATERI } from "../../lib/data";
import { cx } from "../../lib/utils";

type FileKind = "folder" | "pdf" | "doc" | "img" | "zip";
type FileItem = { id: string; name: string; kind: FileKind; info: string; date: string };
type ViewMode = "list" | "grid";

const KIND_LABEL: Record<FileKind, string> = {
  folder: "Folder",
  pdf: "PDF",
  doc: "Dokumen",
  img: "Gambar",
  zip: "Arsip",
};

const ITEMS: FileItem[] = [
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

function KindIcon({ kind, size = 22 }: { kind: FileKind; size?: number }) {
  if (kind === "folder") return <FolderOpenIcon size={size} />;
  if (kind === "pdf") return <FilePdfIcon size={size} />;
  if (kind === "img") return <FileImageIcon size={size} />;
  if (kind === "zip") return <FileArchiveIcon size={size} />;
  return <DocIcon size={size} />;
}

/** Halaman detail folder materi (file manager) */
export default function MateriFolderPage() {
  const params = useParams<{ id: string }>();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const folder = MATERI.find((m) => String(m.id) === rawId) ?? MATERI[0];

  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("list");

  const list = useMemo(
    () => ITEMS.filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase())),
    [query]
  );

  return (
    <AppShell showSettings={false}>
      <DateLine />

      <div className="crumb">
        <Link href="/materi">Materi</Link>
        <span aria-hidden>/</span>
        <span className="cur">{folder.title}</span>
      </div>

      <PageTitle icon={<FolderOpenIcon size={24} />}>{folder.title}</PageTitle>

      <div className="card folder-head">
        <div className="ico">
          <FolderOpenIcon size={28} />
        </div>
        <div className="meta">
          <p>{folder.dosen}</p>
          <div className="meta-chips">
            <Chip small>{folder.count} Berkas</Chip>
            <Chip small tone="peach">
              3 Folder
            </Chip>
            <Chip small tone="blue">
              Semester 1
            </Chip>
            <Chip small tone="green">
              1.2 GB
            </Chip>
          </div>
        </div>
        <div className="act-row">
          <button className="btn btn-solid">
            <UploadIcon size={18} />
            Unggah Berkas
          </button>
        </div>
      </div>

      <div className="fm-toolbar">
        <label className="search">
          <SearchIcon size={20} />
          <input
            type="search"
            placeholder="Cari berkas di folder ini"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <div className="seg" role="group" aria-label="Tampilan daftar berkas">
          <button
            type="button"
            className={cx(view === "list" && "on")}
            aria-pressed={view === "list"}
            aria-label="Tampilan daftar"
            onClick={() => setView("list")}
          >
            <ListIcon size={20} />
          </button>
          <button
            type="button"
            className={cx(view === "grid" && "on")}
            aria-pressed={view === "grid"}
            aria-label="Tampilan kisi"
            onClick={() => setView("grid")}
          >
            <GridIcon size={20} />
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="empty">Berkas tidak ditemukan</p>
      ) : view === "list" ? (
        <div className="card fm-card">
          {list.map((item) => (
            <div className="fm-row" key={item.id}>
              <div className={`fm-ico ${item.kind}`}>
                <KindIcon kind={item.kind} />
              </div>
              <div className="nm">
                <div className="t">{item.name}</div>
                <div className="sub">
                  {KIND_LABEL[item.kind]} · {item.info} · Diubah {item.date}
                </div>
              </div>
              <button className="btn-ghost" aria-label={`Unduh ${item.name}`}>
                <DownloadIcon size={18} />
              </button>
              <button className="btn-ghost" aria-label={`Aksi lain untuk ${item.name}`}>
                <DotsIcon size={20} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="fm-grid">
          {list.map((item) => (
            <div className="card fm-tile" key={item.id}>
              <div className={`fm-ico ${item.kind}`}>
                <KindIcon kind={item.kind} size={24} />
              </div>
              <div>
                <div className="t">{item.name}</div>
                <div className="s">
                  {KIND_LABEL[item.kind]} · {item.info}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}