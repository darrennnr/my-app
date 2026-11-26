"use client";

import { useState } from "react";
import AppShell from "../components/AppShell";
import {
  ChevronDownIcon,
  ClockIcon,
  MegaphoneIcon,
  PinIcon,
  PlusIcon,
  PushPinIcon,
  SearchIcon,
  UserOutlineIcon,
} from "../components/icons";
import { Chip, DateLine, PageTitle, Pill, StatCard, StatGrid } from "../components/ui";
import {
  ANNOUNCEMENTS,
  CAT_COLOR,
  CATEGORIES,
  ME,
  TODAY_DAY,
  relativeDay,
  sortNewest,
  type Announcement,
  type Category,
} from "../lib/announcements";
import { cx, pad2 } from "../lib/utils";

const TABS = [
  { key: "all", label: "Semua" },
  { key: "unread", label: "Belum Dibaca" },
  { key: "pinned", label: "Disematkan" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

type AnnouncementForm = { title: string; body: string; cat: Category; important: boolean };

const EMPTY_FORM: AnnouncementForm = { title: "", body: "", cat: "Umum", important: false };

type AnnCardProps = {
  item: Announcement;
  open: boolean;
  onToggle: () => void;
  onPin: () => void;
  onUnread: () => void;
};

/* ---------- Kartu pengumuman ---------- */
function AnnCard({ item, open, onToggle, onPin, onUnread }: AnnCardProps) {
  const tone = CAT_COLOR[item.cat];

  return (
    <article className={cx("card ann", open && "open")}>
      <button className="ann-head" onClick={onToggle} aria-expanded={open}>
        <span className={`ann-ico c-${tone}`}>
          <MegaphoneIcon size={26} />
        </span>
        <span className="ann-info">
          <span className="ann-title">
            {!item.read && <i className="udot" aria-label="Belum dibaca" />}
            {item.title}
          </span>
          <span className="ann-meta">
            <Chip small tone={tone}>
              {item.cat}
            </Chip>
            {item.important && (
              <Pill tone="bad" small>
                Penting
              </Pill>
            )}
            {item.pinned && <PushPinIcon size={16} aria-label="Disematkan" />}
            <span className="with-ico muted">
              <ClockIcon size={16} />
              {relativeDay(item.day)}
            </span>
          </span>
        </span>
        <ChevronDownIcon size={22} className="ann-chev" />
      </button>

      {open && (
        <div className="ann-detail">
          <p className="ann-body">{item.body}</p>
          <div className="ann-rows">
            <div>
              <UserOutlineIcon size={18} />
              {item.author}
            </div>
            {item.when && (
              <div>
                <ClockIcon size={18} />
                {item.when}
              </div>
            )}
            {item.place && (
              <div>
                <PinIcon size={18} />
                {item.place}
              </div>
            )}
          </div>
          <div className="ann-actions">
            <button className="btn btn-outline" onClick={onPin}>
              {item.pinned ? "Lepas sematan" : "Sematkan"}
            </button>
            <button className="btn btn-outline" onClick={onUnread}>
              Tandai belum dibaca
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

/** Halaman 7: Pengumuman */
export default function PengumumanPage() {
  const [items, setItems] = useState<Announcement[]>(ANNOUNCEMENTS);
  const [tab, setTab] = useState<TabKey>("all");
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AnnouncementForm>(EMPTY_FORM);

  const patch = (id: number, changes: Partial<Announcement>) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...changes } : item)));

  const toggleOpen = (item: Announcement) => {
    const nextId = openId === item.id ? null : item.id;
    setOpenId(nextId);
    if (nextId !== null && !item.read) patch(item.id, { read: true });
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
        day: TODAY_DAY,
        pinned: false,
        read: true,
        important: form.important,
      },
      ...prev,
    ]);
    setForm(EMPTY_FORM);
    setShowForm(false);
    setTab("all");
    setCategory("all");
    setOpenId(id);
  };

  /* ---------- Filter & urutan ---------- */
  const term = query.trim().toLowerCase();
  const filtered = items
    .filter((a) => (tab === "unread" ? !a.read : tab === "pinned" ? a.pinned : true))
    .filter((a) => category === "all" || a.cat === category)
    .filter((a) => !term || a.title.toLowerCase().includes(term) || a.body.toLowerCase().includes(term))
    .sort(sortNewest);

  const pinned = filtered.filter((a) => a.pinned);
  const others = filtered.filter((a) => !a.pinned);

  const unreadCount = items.filter((a) => !a.read).length;
  const pinnedCount = items.filter((a) => a.pinned).length;

  const renderCard = (item: Announcement) => (
    <AnnCard
      key={item.id}
      item={item}
      open={openId === item.id}
      onToggle={() => toggleOpen(item)}
      onPin={() => patch(item.id, { pinned: !item.pinned })}
      onUnread={() => {
        patch(item.id, { read: false });
        setOpenId(null);
      }}
    />
  );

  return (
    <AppShell>
      <DateLine />

      <div className="page-bar">
        <PageTitle icon={<MegaphoneIcon size={24} />}>Pengumuman</PageTitle>
        <button className="btn btn-solid btn-add" onClick={() => setShowForm(true)}>
          <PlusIcon size={18} />
          <span>Buat</span>
        </button>
      </div>

      {/* Ringkasan */}
      <StatGrid cols={3}>
        <StatCard label="Total" value={pad2(items.length)} />
        <StatCard label="Belum Dibaca" accessory={<i className="dot bad" />} value={pad2(unreadCount)} />
        <StatCard label="Disematkan" accessory={<i className="dot ok" />} value={pad2(pinnedCount)} />
      </StatGrid>

      {/* Pencarian + filter */}
      <div className="search">
        <SearchIcon size={22} />
        <input
          placeholder="Cari pengumuman"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Cari pengumuman"
        />
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.key} className={cx("tab", tab === t.key && "on")} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="cat-row" role="group" aria-label="Kategori">
        <button className={cx("cat", category === "all" && "on")} onClick={() => setCategory("all")}>
          Semua kategori
        </button>
        {CATEGORIES.map((c) => (
          <button key={c} className={cx("cat", category === c && "on")} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {/* Daftar */}
      {pinned.length > 0 && (
        <>
          <div className="group-head">
            <span>Disematkan</span>
            <span className="count">{pinned.length} Pengumuman</span>
          </div>
          <div className="ann-grid">{pinned.map(renderCard)}</div>
        </>
      )}
      {others.length > 0 && (
        <>
          <div className="group-head">
            <span>Terbaru</span>
            <span className="count">{others.length} Pengumuman</span>
          </div>
          <div className="ann-grid">{others.map(renderCard)}</div>
        </>
      )}
      {filtered.length === 0 && <p className="empty">Tidak ada pengumuman yang cocok</p>}

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
            <h3>Buat pengumuman</h3>
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
              onChange={(e) => setForm({ ...form, cat: e.target.value as Category })}
              aria-label="Kategori"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
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
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>
                Batal
              </button>
              <button className="btn btn-solid" onClick={submit} disabled={!form.title.trim()}>
                Terbitkan
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}