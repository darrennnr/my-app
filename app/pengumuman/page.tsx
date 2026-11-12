"use client";

import { useState } from "react";
import AppShell from "../components/AppShell";
import {
  ChevronDown,
  ClockIcon,
  MegaphoneIcon,
  PinIcon,
  PlusIcon,
  PushPinIcon,
  SearchIcon,
  UserOutlineIcon,
} from "../components/icons";

/* ---------- Tipe & data dummy ---------- */
type Cat = "Akademik" | "Kegiatan" | "Kas" | "Umum";
type Color = "blue" | "peach" | "pink" | "green";

type Ann = {
  id: number;
  title: string;
  body: string;
  cat: Cat;
  author: string;
  day: number; // tanggal di September 2026 (dipakai untuk urutan)
  pinned: boolean;
  read: boolean;
  important?: boolean;
  when?: string;
  place?: string;
};

const TODAY = 9;
const ME = "Darren (Ketua Kelas)";

const CAT_COLOR: Record<Cat, Color> = {
  Akademik: "blue",
  Kegiatan: "pink",
  Kas: "green",
  Umum: "peach",
};
const CATS: Cat[] = ["Akademik", "Kegiatan", "Kas", "Umum"];

const DATA: Ann[] = [
  {
    id: 1,
    title: "Perubahan ruang Praktikum Sistem Digital",
    body: "Praktikum Sistem Digital minggu depan dipindah ke ruang JJ - 303 karena ruang lama dipakai ujian susulan. Mohon bawa modul praktikum dan jas lab masing-masing.",
    cat: "Akademik",
    author: "Afifah Dwi Ramadhani, S.ST., M.TR.T",
    day: 9,
    pinned: true,
    read: false,
    important: true,
    when: "Selasa, 14 September 2026 - 13.50 - 15.30",
    place: "JJ - 303",
  },
  {
    id: 2,
    title: "Technical Meeting LKMM-Pra TD",
    body: "Seluruh peserta wajib hadir tepat waktu dan mengenakan almamater. Teknis kegiatan, pembagian kelompok, dan perlengkapan yang harus dibawa akan dijelaskan pada pertemuan ini.",
    cat: "Kegiatan",
    author: "Panitia LKMM",
    day: 8,
    pinned: true,
    read: false,
    important: true,
    when: "Jum’at, 18 September 2026 - 19.30 - 20.30",
    place: "PAS Lantai 6",
  },
  {
    id: 3,
    title: "Iuran kas minggu ke-3",
    body: "Iuran kas minggu ini sebesar Rp 10.000 per orang. Pembayaran bisa langsung ke bendahara kelas atau transfer, lalu kirim bukti ke grup kelas. Rekap terbaru ada di halaman Kas.",
    cat: "Kas",
    author: "Salsabila Nurul (Bendahara)",
    day: 8,
    pinned: false,
    read: false,
    when: "Batas pembayaran: Jum’at, 11 September 2026",
  },
  {
    id: 4,
    title: "Latihan 1 - 5 Modul Determinan dan Matriks",
    body: "Kerjakan latihan 1 sampai 5 pada modul Determinan dan Matriks. Jawaban ditulis tangan, difoto dengan jelas, lalu dikumpulkan dalam satu file PDF melalui ETHOL.",
    cat: "Akademik",
    author: "Dosen Matematika",
    day: 7,
    pinned: false,
    read: false,
    important: true,
    when: "Batas pengumpulan: Senin, 14 September 2026",
    place: "ETHOL",
  },
  {
    id: 5,
    title: "Rapat angkatan akhir pekan",
    body: "Rapat membahas pembagian tugas kegiatan angkatan dan anggaran konsumsi. Konsumsi disiapkan dari kas kelas, jadi mohon konfirmasi kehadiran paling lambat Jumat.",
    cat: "Kegiatan",
    author: ME,
    day: 6,
    pinned: false,
    read: true,
    when: "Sabtu, 12 September 2026 - 10.00 - 12.00",
    place: "Ruang Diskusi Gedung D4",
  },
  {
    id: 6,
    title: "Kelas pengganti Agama via Zoom",
    body: "Kelas Agama pada Selasa malam dilaksanakan daring. Tautan Zoom dibagikan melalui ETHOL satu jam sebelum kelas dimulai.",
    cat: "Akademik",
    author: "Dosen Agama",
    day: 5,
    pinned: false,
    read: true,
    when: "Selasa, 14 September 2026 - 19.30 - 20.30",
    place: "Zoom ETHOL",
  },
  {
    id: 7,
    title: "Jadwal piket kebersihan kelas",
    body: "Piket dilakukan sebelum jam kuliah pertama. Kelompok 1 bertugas minggu ini, kelompok 2 minggu depan, dan seterusnya bergantian. Yang berhalangan wajib mencari pengganti.",
    cat: "Umum",
    author: ME,
    day: 4,
    pinned: false,
    read: true,
  },
  {
    id: 8,
    title: "Pembentukan kelompok Workshop Teknologi Web",
    body: "Kelompok Workshop terdiri dari 4 orang. Kirim nama anggota ke ketua kelas paling lambat Kamis depan. Mahasiswa yang belum punya kelompok akan dikelompokkan oleh dosen.",
    cat: "Akademik",
    author: "A. Fauzi Makarim, M.TR.KOM.",
    day: 3,
    pinned: false,
    read: true,
    when: "Batas pendaftaran: Kamis, 17 September 2026",
  },
  {
    id: 9,
    title: "Selamat datang mahasiswa baru TRI B 2026",
    body: "Selamat bergabung di kelas TRI B. Grup kelas dan informasi penting akan dibagikan di sini, jadi pastikan kamu rutin membuka halaman Pengumuman.",
    cat: "Umum",
    author: ME,
    day: 1,
    pinned: false,
    read: true,
  },
];

const TABS = [
  { key: "all", label: "Semua" },
  { key: "unread", label: "Belum Dibaca" },
  { key: "pinned", label: "Disematkan" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const rel = (d: number) => (d === TODAY ? "Hari ini" : d === TODAY - 1 ? "Kemarin" : `${d} September 2026`);

/* ---------- Kartu pengumuman ---------- */
function AnnCard({
  a,
  open,
  onToggle,
  onPin,
  onUnread,
}: {
  a: Ann;
  open: boolean;
  onToggle: () => void;
  onPin: () => void;
  onUnread: () => void;
}) {
  const color = CAT_COLOR[a.cat];
  return (
    <article className={`card ann ${open ? "open" : ""}`}>
      <button className="ann-head" onClick={onToggle} aria-expanded={open}>
        <span className={`ann-ico c-${color}`}>
          <MegaphoneIcon size={26} />
        </span>
        <span className="ann-info">
          <span className="ann-title">
            {!a.read && <i className="udot" aria-label="Belum dibaca" />}
            {a.title}
          </span>
          <span className="ann-meta">
            <span className={`chip sm c-${color}`}>{a.cat}</span>
            {a.important && (
              <span className="pill bad sm">
                <i />
                Penting
              </span>
            )}
            {a.pinned && <PushPinIcon size={16} aria-label="Disematkan" />}
            <span className="with-ico muted">
              <ClockIcon size={15} />
              {rel(a.day)}
            </span>
          </span>
        </span>
        <ChevronDown size={22} className="ann-chev" />
      </button>

      {open && (
        <div className="ann-detail">
          <p className="ann-body">{a.body}</p>
          <div className="ann-rows">
            <div><UserOutlineIcon size={18} />{a.author}</div>
            {a.when && <div><ClockIcon size={18} />{a.when}</div>}
            {a.place && <div><PinIcon size={18} />{a.place}</div>}
          </div>
          <div className="ann-actions">
            <button className="btn-sm line" onClick={onPin}>
              {a.pinned ? "Lepas sematan" : "Sematkan"}
            </button>
            <button className="btn-sm line" onClick={onUnread}>
              Tandai belum dibaca
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

/** Halaman 7 — Pengumuman */
export default function PengumumanPage() {
  const [items, setItems] = useState<Ann[]>(DATA);
  const [tab, setTab] = useState<TabKey>("all");
  const [cat, setCat] = useState<Cat | "all">("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{ title: string; body: string; cat: Cat; important: boolean }>({
    title: "",
    body: "",
    cat: "Umum",
    important: false,
  });

  const patch = (id: number, p: Partial<Ann>) =>
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const toggleOpen = (a: Ann) => {
    const next = openId === a.id ? null : a.id;
    setOpenId(next);
    if (next !== null && !a.read) patch(a.id, { read: true });
  };

  const submit = () => {
    if (!form.title.trim()) return;
    const id = Math.max(...items.map((x) => x.id)) + 1;
    setItems((prev) => [
      {
        id,
        title: form.title.trim(),
        body: form.body.trim() || "Tidak ada keterangan tambahan.",
        cat: form.cat,
        author: ME,
        day: TODAY,
        pinned: false,
        read: true,
        important: form.important,
      },
      ...prev,
    ]);
    setForm({ title: "", body: "", cat: "Umum", important: false });
    setShowForm(false);
    setTab("all");
    setCat("all");
    setOpenId(id);
  };

  /* ---------- Filter & urutan ---------- */
  const term = q.trim().toLowerCase();
  const filtered = items
    .filter((a) => (tab === "unread" ? !a.read : tab === "pinned" ? a.pinned : true))
    .filter((a) => cat === "all" || a.cat === cat)
    .filter((a) => !term || a.title.toLowerCase().includes(term) || a.body.toLowerCase().includes(term))
    .sort((a, b) => b.day - a.day || b.id - a.id);

  const pinned = filtered.filter((a) => a.pinned);
  const others = filtered.filter((a) => !a.pinned);

  const unreadCount = items.filter((a) => !a.read).length;
  const pinnedCount = items.filter((a) => a.pinned).length;

  const renderCard = (a: Ann) => (
    <AnnCard
      key={a.id}
      a={a}
      open={openId === a.id}
      onToggle={() => toggleOpen(a)}
      onPin={() => patch(a.id, { pinned: !a.pinned })}
      onUnread={() => {
        patch(a.id, { read: false });
        setOpenId(null);
      }}
    />
  );

  return (
    <AppShell>
      <p className="date-line">Kamis, 9 September 2026 - Minggu 3</p>

      <div className="jadwal-head">
        <h2 className="page-title">
          <MegaphoneIcon size={30} />
          Pengumuman
        </h2>
        <button className="btn-sm black add-btn" onClick={() => setShowForm(true)}>
          <PlusIcon size={18} />
          <span>Buat</span>
        </button>
      </div>

      {/* Ringkasan */}
      <div className="ann-stats">
        <div className="card stat">
          <div className="top"><span>Total</span></div>
          <div className="num">{String(items.length).padStart(2, "0")}</div>
        </div>
        <div className="card stat">
          <div className="top"><span>Belum Dibaca</span><i className="dot bad" /></div>
          <div className="num">{String(unreadCount).padStart(2, "0")}</div>
        </div>
        <div className="card stat">
          <div className="top"><span>Disematkan</span><i className="dot ok" /></div>
          <div className="num">{String(pinnedCount).padStart(2, "0")}</div>
        </div>
      </div>

      {/* Pencarian + filter */}
      <div className="search">
        <SearchIcon size={22} />
        <input
          placeholder="Cari pengumuman"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Cari pengumuman"
        />
      </div>

      <div className="tabs ann-tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`tab ${tab === t.key ? "on" : ""}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="cat-row" role="group" aria-label="Kategori">
        <button className={`cat ${cat === "all" ? "on" : ""}`} onClick={() => setCat("all")}>Semua kategori</button>
        {CATS.map((c) => (
          <button key={c} className={`cat ${cat === c ? "on" : ""}`} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>

      {/* Daftar */}
      {pinned.length > 0 && (
        <>
          <div className="group-head"><span>Disematkan</span><span className="count">{pinned.length} Pengumuman</span></div>
          <div className="ann-grid">{pinned.map(renderCard)}</div>
        </>
      )}
      {others.length > 0 && (
        <>
          <div className="group-head"><span>Terbaru</span><span className="count">{others.length} Pengumuman</span></div>
          <div className="ann-grid">{others.map(renderCard)}</div>
        </>
      )}
      {filtered.length === 0 && <p className="empty">Tidak ada pengumuman yang cocok.</p>}

      {/* Form buat pengumuman */}
      {showForm && (
        <div className="modal-bg" onClick={() => setShowForm(false)}>
          <div
            className="modal ann-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Buat pengumuman"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Buat Pengumuman</h3>
            <input
              className="ann-input"
              placeholder="Judul pengumuman"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              aria-label="Judul"
            />
            <select
              className="ann-input"
              value={form.cat}
              onChange={(e) => setForm({ ...form, cat: e.target.value as Cat })}
              aria-label="Kategori"
            >
              {CATS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <textarea
              className="ann-input"
              rows={4}
              placeholder="Isi pengumuman"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              aria-label="Isi pengumuman"
            />
            <label className="ann-check">
              <input
                type="checkbox"
                checked={form.important}
                onChange={(e) => setForm({ ...form, important: e.target.checked })}
              />
              Tandai sebagai penting
            </label>
            <div className="row ann-form-actions">
              <button className="btn-sm line" onClick={() => setShowForm(false)}>Batal</button>
              <button className="btn-sm black" onClick={submit} disabled={!form.title.trim()}>
                Terbitkan
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}