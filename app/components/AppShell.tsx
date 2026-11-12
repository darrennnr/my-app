// Webs\my-app\app\components\AppShell.tsx

"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import {
  BellIcon,
  CalendarIcon,
  DocIcon,
  GearIcon,
  HomeIcon,
  TasksIcon,
  UserCircleIcon,
  UserIcon,
  WalletIcon,
  MegaphoneIcon,
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

export default function AppShell({
  children,
  showSettings = true,
}: {
  children: React.ReactNode;
  showSettings?: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className="canvas">
      <div className="surface">
        <header className="topbar">
          <h1>TRI B 2026 - Semester 1</h1>
          <div className="actions">
            {showSettings && (
              <button className="icon-btn" aria-label="Pengaturan">
                <GearIcon size={26} />
              </button>
            )}
            <button className="icon-btn" aria-label="Notifikasi">
              <BellIcon size={26} />
            </button>
            <button className="icon-btn" aria-label="Akun">
              <UserCircleIcon size={28} />
            </button>
          </div>
        </header>

        <div className="layout">
          <nav className="nav" aria-label="Navigasi utama">
            {NAV.map(({ href, label, Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                title={label}
                className={pathname === href ? "active" : ""}
              >
                <Icon size={26} />
              </Link>
            ))}
          </nav>
          <main className="content">{children}</main>
        </div>
      </div>
    </div>
  );
}