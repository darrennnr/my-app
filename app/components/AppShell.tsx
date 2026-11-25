"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CLASS_NAME, SEMESTER } from "../lib/data";
import { cx } from "../lib/utils";
import {
  BellIcon,
  CalendarIcon,
  DocIcon,
  GearIcon,
  HomeIcon,
  MegaphoneIcon,
  TasksIcon,
  UserCircleIcon,
  UserIcon,
  WalletIcon,
} from "./icons";
import { useNotifications } from "./Providers";

const NAV = [
  { href: "/dashboard", label: "Beranda", Icon: HomeIcon, color: "c-blue" },
  { href: "/jadwal", label: "Jadwal", Icon: CalendarIcon, color: "c-green" },
  { href: "/tugas", label: "Tugas", Icon: TasksIcon, color: "c-peach" },
  { href: "/materi", label: "Materi", Icon: DocIcon, color: "c-purple" },
  { href: "/kas", label: "Kas", Icon: WalletIcon, color: "c-teal" },
  { href: "/pengumuman", label: "Pengumuman", Icon: MegaphoneIcon, color: "c-pink" },
  { href: "/profil", label: "Profil", Icon: UserIcon, color: "c-indigo" },
];

type AppShellProps = {
  children: ReactNode;
  showSettings?: boolean;
};

export default function AppShell({ children, showSettings = true }: AppShellProps) {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="surface">
      <a href="#konten" className="skip-link">
        Lewati ke konten utama
      </a>

      <header className="topbar">
        <h1>
          {CLASS_NAME} · {SEMESTER}
        </h1>
        <div className="actions">
          {showSettings && (
            <Link
              href="/pengaturan"
              className="icon-btn"
              aria-label="Pengaturan"
              title="Pengaturan"
              aria-current={isActive("/pengaturan") ? "page" : undefined}
            >
              <GearIcon size={20} />
            </Link>
          )}
          <Link
            href="/notifikasi"
            className={cx("icon-btn", unreadCount > 0 && "has-dot")}
            aria-label={unreadCount > 0 ? `Notifikasi, ${unreadCount} belum dibaca` : "Notifikasi"}
            title="Notifikasi"
            aria-current={isActive("/notifikasi") ? "page" : undefined}
          >
            <BellIcon size={20} />
          </Link>
          <Link href="/profil" className="icon-btn" aria-label="Profil saya" title="Profil saya">
            <UserCircleIcon size={22} />
          </Link>
        </div>
      </header>

      <div className="layout">
        <nav className="nav" aria-label="Navigasi utama">
          {NAV.map(({ href, label, Icon, color }) => (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={isActive(href) ? "page" : undefined}
              title={label}
              className={cx(isActive(href) && `active ${color}`)}
            >
              <Icon size={22} />
            </Link>
          ))}
        </nav>
        <main id="konten" tabIndex={-1} className="content">
          {children}
        </main>
      </div>
    </div>
  );
}