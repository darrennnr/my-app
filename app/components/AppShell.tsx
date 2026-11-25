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

const NAV = [
  { href: "/dashboard", label: "Beranda", Icon: HomeIcon },
  { href: "/jadwal", label: "Jadwal", Icon: CalendarIcon },
  { href: "/tugas", label: "Tugas", Icon: TasksIcon },
  { href: "/materi", label: "Materi", Icon: DocIcon },
  { href: "/kas", label: "Kas", Icon: WalletIcon },
  { href: "/pengumuman", label: "Pengumuman", Icon: MegaphoneIcon },
  { href: "/profil", label: "Profil", Icon: UserIcon },
];

type AppShellProps = {
  children: ReactNode;
  showSettings?: boolean;
};

export default function AppShell({ children, showSettings = true }: AppShellProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="surface">
      <header className="topbar">
        <h1>
          {CLASS_NAME} · {SEMESTER}
        </h1>
        <div className="actions">
          {showSettings && (
            <button className="icon-btn" aria-label="Pengaturan">
              <GearIcon size={20} />
            </button>
          )}
          <button className="icon-btn has-dot" aria-label="Notifikasi">
            <BellIcon size={20} />
          </button>
          <button className="icon-btn" aria-label="Akun">
            <UserCircleIcon size={22} />
          </button>
        </div>
      </header>

      <div className="layout">
        <nav className="nav" aria-label="Navigasi utama">
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={isActive(href) ? "page" : undefined}
              title={label}
              className={cx(isActive(href) && "active")}
            >
              <Icon size={22} />
            </Link>
          ))}
        </nav>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}