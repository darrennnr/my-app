"use client";

import Link from "next/link";
import { useState, type ComponentType } from "react";
import AppShell from "../components/AppShell";
import {
  BellIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  CrossIcon,
  FolderOpenIcon,
  InfoIcon,
  MegaphoneIcon,
  TasksIcon,
  WalletIcon,
} from "../components/icons";
import { useNotifications } from "../components/Providers";
import { Chip, DateLine, PageTitle, Pill, StatCard, StatGrid } from "../components/ui";
import { relativeDay } from "../lib/announcements";
import {
  GROUPS,
  NOTIF_LABEL,
  NOTIF_TONE,
  NOTIF_TYPES,
  groupOf,
  sortNewest,
  type AppNotification,
  type NotifType,
} from "../lib/notifications";
import { cx, pad2 } from "../lib/utils";

const TABS = [
  { key: "all", label: "Semua" },
  { key: "unread", label: "Belum Dibaca" },
  { key: "important", label: "Penting" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const ICONS: Record<NotifType, ComponentType<{ size?: number }>> = {
  tugas: TasksIcon,
  jadwal: CalendarIcon,
  kas: WalletIcon,
  pengumuman: MegaphoneIcon,
  materi: FolderOpenIcon,
  sistem: InfoIcon,
};

type NotifCardProps = {
  item: AppNotification;
  onOpen: () => void;
  onToggle: () => void;
  onRemove: () => void;
};

/* ---------- Kartu notifikasi ---------- */
function NotifCard({ item, onOpen, onToggle, onRemove }: NotifCardProps) {
  const tone = NOTIF_TONE[item.type];
  const Icon = ICONS[item.type];

  return (
    <article className={cx("card notif", !item.read && "unread")}>
      <Link href={item.href} className="notif-main" onClick={onOpen}>
        <span className={`ann-ico c-${tone}`}>
          <Icon size={24} />
        </span>
        <span className="ann-info">
          <span className="ann-title">
            {!item.read && <i className="udot" aria-label="Belum dibaca" />}
            {item.title}
          </span>
          <span className="notif-body">{item.body}</span>
          <span className="ann-meta">
            <Chip small tone={tone}>
              {NOTIF_LABEL[item.type]}
            </Chip>
            {item.important && (
              <Pill tone="bad" small>
                Penting
              </Pill>
            )}
            <span className="with-ico muted">
              <ClockIcon size={16} />
              {relativeDay(item.day)} · {item.time}
            </span>
          </span>
        </span>
      </Link>

      <div className="notif-actions">
        <button
          type="button"
          className="btn-ghost"
          aria-pressed={item.read}
          aria-label={item.read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
          title={item.read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
          onClick={onToggle}
        >
          <CheckIcon size={18} />
        </button>
        <button type="button" className="btn-ghost" aria-label="Hapus notifikasi" title="Hapus" onClick={onRemove}>
          <CrossIcon size={18} />
        </button>
      </div>
    </article>
  );
}

/** Halaman Notifikasi */
export default function NotifikasiPage() {
  const { items, hiddenCount, unreadCount, markRead, toggleRead, markAllRead, remove, restore } = useNotifications();
  const [tab, setTab] = useState<TabKey>("all");
  const [type, setType] = useState<NotifType | "all">("all");

  const filtered = items
    .filter((n) => (tab === "unread" ? !n.read : tab === "important" ? n.important : true))
    .filter((n) => type === "all" || n.type === type)
    .sort(sortNewest);

  const importantCount = items.filter((n) => n.important).length;

  return (
    <AppShell>
      <DateLine />

      <div className="page-bar">
        <PageTitle icon={<BellIcon size={24} />}>Notifikasi</PageTitle>
        <button
          className="btn btn-outline btn-add"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          aria-label="Tandai semua sudah dibaca"
        >
          <CheckIcon size={18} />
          <span>Tandai semua dibaca</span>
        </button>
      </div>

      {/* Ringkasan */}
      <StatGrid cols={3}>
        <StatCard label="Total" value={pad2(items.length)} />
        <StatCard label="Belum Dibaca" accessory={<i className="dot bad" />} value={pad2(unreadCount)} />
        <StatCard label="Penting" accessory={<i className="dot warn" />} value={pad2(importantCount)} />
      </StatGrid>

      {/* Filter */}
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.key} className={cx("tab", tab === t.key && "on")} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="cat-row" role="group" aria-label="Kategori notifikasi">
        <button className={cx("cat", type === "all" && "on")} onClick={() => setType("all")}>
          Semua kategori
        </button>
        {NOTIF_TYPES.map((t) => (
          <button key={t} className={cx("cat", type === t && "on")} onClick={() => setType(t)}>
            {NOTIF_LABEL[t]}
          </button>
        ))}
      </div>

      {hiddenCount > 0 && (
        <p className="hint" style={{ marginTop: "var(--sp-3)" }}>
          {hiddenCount} notifikasi disembunyikan karena kategorinya dimatikan.{" "}
          <Link href="/pengaturan" className="inline-link">
            Atur di Pengaturan
          </Link>
        </p>
      )}

      {/* Daftar per hari */}
      {GROUPS.map((group) => {
        const list = filtered.filter((n) => groupOf(n.day) === group);
        if (list.length === 0) return null;
        return (
          <section key={group} aria-label={group}>
            <div className="group-head">
              <span>{group}</span>
              <span className="count">{list.length} Notifikasi</span>
            </div>
            <div className="notif-grid">
              {list.map((item) => (
                <NotifCard
                  key={item.id}
                  item={item}
                  onOpen={() => markRead(item.id)}
                  onToggle={() => toggleRead(item.id)}
                  onRemove={() => remove(item.id)}
                />
              ))}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <div className="empty">
          <p>{items.length === 0 ? "Belum ada notifikasi" : "Tidak ada notifikasi yang cocok"}</p>
          {items.length === 0 && (
            <button className="btn btn-outline" style={{ marginTop: "var(--sp-3)" }} onClick={restore}>
              Muat ulang contoh notifikasi
            </button>
          )}
        </div>
      )}
    </AppShell>
  );
}