"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import AppShell from "../components/AppShell";
import {
  AccessibilityIcon,
  BellIcon,
  EditIcon,
  GearIcon,
  InfoIcon,
  LogoutIcon,
  MonitorIcon,
  MoonIcon,
  PaletteIcon,
  SunIcon,
  UserOutlineIcon,
} from "../components/icons";
import { useNotifications, usePreferences } from "../components/Providers";
import { DateLine, PageTitle, SectionTitle } from "../components/ui";
import { CLASS_NAME, SEMESTER, STUDENT_NAME } from "../lib/data";
import type { FontScale, NotifyKey, ThemeMode } from "../lib/preferences";
import { STUDENT_NRP } from "../lib/profile";
import { cx } from "../lib/utils";

/* ---------- Komponen lokal ---------- */
type Option<T extends string> = { value: T; label: string; icon?: ReactNode };

function OptionGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="opt-group" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          className={cx("opt", value === option.value && "on")}
          onClick={() => onChange(option.value)}
        >
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}

function ToggleRow({
  title,
  desc,
  checked,
  onChange,
}: {
  title: string;
  desc?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="set-row">
      <div className="set-text">
        <div className="set-title" id={`${id}-t`}>
          {title}
        </div>
        {desc && (
          <p className="set-desc" id={`${id}-d`}>
            {desc}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-t`}
        aria-describedby={desc ? `${id}-d` : undefined}
        className={cx("switch", checked && "on")}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}

/* ---------- Pilihan ---------- */
const THEME_OPTIONS: Option<ThemeMode>[] = [
  { value: "system", label: "Sistem", icon: <MonitorIcon size={22} /> },
  { value: "light", label: "Terang", icon: <SunIcon size={22} /> },
  { value: "dark", label: "Gelap", icon: <MoonIcon size={22} /> },
];

const aa = (px: number) => (
  <span className="opt-aa" style={{ fontSize: px }} aria-hidden>
    Aa
  </span>
);

const FONT_OPTIONS: Option<FontScale>[] = [
  { value: "sm", label: "Kecil", icon: aa(13) },
  { value: "md", label: "Normal", icon: aa(16) },
  { value: "lg", label: "Besar", icon: aa(19) },
  { value: "xl", label: "Sangat besar", icon: aa(22) },
];

type BoolPref = "highContrast" | "reduceMotion" | "underlineLinks" | "largeTargets" | "relaxedSpacing";

const A11Y_OPTIONS: { key: BoolPref; title: string; desc: string }[] = [
  { key: "highContrast", title: "Kontras tinggi", desc: "Teks dan garis lebih tegas agar mudah dibaca." },
  { key: "reduceMotion", title: "Kurangi animasi", desc: "Matikan transisi dan gerakan di seluruh aplikasi." },
  { key: "underlineLinks", title: "Garis bawah pada tautan", desc: "Tautan teks selalu diberi garis bawah." },
  { key: "largeTargets", title: "Tombol lebih besar", desc: "Area sentuh tombol diperbesar agar mudah ditekan." },
  { key: "relaxedSpacing", title: "Jarak teks renggang", desc: "Spasi baris, huruf, dan kata dilonggarkan." },
];

const NOTIFY_OPTIONS: { key: NotifyKey; title: string; desc: string }[] = [
  { key: "tugas", title: "Tugas", desc: "Tugas baru dan pengingat tenggat." },
  { key: "jadwal", title: "Jadwal", desc: "Pengingat sebelum kuliah dan praktikum." },
  { key: "kas", title: "Kas", desc: "Pengingat iuran dan rekap kas kelas." },
  { key: "pengumuman", title: "Pengumuman", desc: "Pengumuman dari dosen dan pengurus kelas." },
  { key: "materi", title: "Materi", desc: "Materi baru yang diunggah dosen." },
];

/** Halaman Pengaturan */
export default function PengaturanPage() {
  const router = useRouter();
  const { prefs, setPref, setNotify, reset } = usePreferences();
  const { unreadCount } = useNotifications();

  const [confirmOut, setConfirmOut] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!confirmOut) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConfirmOut(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmOut]);

  return (
    <AppShell>
      <DateLine />
      <PageTitle icon={<GearIcon size={24} />}>Pengaturan</PageTitle>

      <div className="prof-grid">
        <div className="prof-col">
          {/* Tampilan */}
          <section className="card prof-card" aria-labelledby="set-tampilan">
            <SectionTitle>
              <PaletteIcon size={20} />
              <span id="set-tampilan">Tampilan</span>
            </SectionTitle>

            <div className="set-row stack">
              <div className="set-text">
                <div className="set-title">Tema</div>
                <p className="set-desc">Pilih “Sistem” untuk mengikuti pengaturan perangkat.</p>
              </div>
              <OptionGroup label="Tema" value={prefs.theme} options={THEME_OPTIONS} onChange={(v) => setPref("theme", v)} />
            </div>

            <div className="set-row stack">
              <div className="set-text">
                <div className="set-title">Ukuran teks</div>
                <p className="set-desc">Berlaku di seluruh halaman.</p>
              </div>
              <OptionGroup
                label="Ukuran teks"
                value={prefs.fontScale}
                options={FONT_OPTIONS}
                onChange={(v) => setPref("fontScale", v)}
              />
              <div className="font-preview" aria-live="polite">
                <strong>Pratinjau</strong>
                Praktikum Algoritma dan Pemrogramman dimulai pukul 09.00 di ruang SAW - 04.06.
              </div>
            </div>
          </section>

          {/* Aksesibilitas */}
          <section className="card prof-card" aria-labelledby="set-aksesibilitas">
            <SectionTitle>
              <AccessibilityIcon size={20} />
              <span id="set-aksesibilitas">Aksesibilitas</span>
            </SectionTitle>
            {A11Y_OPTIONS.map((item) => (
              <ToggleRow
                key={item.key}
                title={item.title}
                desc={item.desc}
                checked={prefs[item.key]}
                onChange={(value) => setPref(item.key, value)}
              />
            ))}
          </section>
        </div>

        <div className="prof-col">
          {/* Notifikasi */}
          <section className="card prof-card" aria-labelledby="set-notifikasi">
            <SectionTitle>
              <BellIcon size={20} />
              <span id="set-notifikasi">Notifikasi</span>
            </SectionTitle>
            {NOTIFY_OPTIONS.map((item) => (
              <ToggleRow
                key={item.key}
                title={item.title}
                desc={item.desc}
                checked={prefs.notify[item.key]}
                onChange={(value) => setNotify(item.key, value)}
              />
            ))}
            <div className="act-row" style={{ marginTop: "var(--sp-3)" }}>
              <Link href="/notifikasi" className="btn btn-outline">
                <BellIcon size={18} />
                Buka notifikasi{unreadCount > 0 ? ` (${unreadCount})` : ""}
              </Link>
            </div>
          </section>

          {/* Akun */}
          <section className="card prof-card" aria-labelledby="set-akun">
            <SectionTitle>
              <UserOutlineIcon size={20} />
              <span id="set-akun">Akun</span>
            </SectionTitle>
            <div className="info-row">
              <span className="k">Nama</span>
              <span className="v">{STUDENT_NAME}</span>
            </div>
            <div className="info-row">
              <span className="k">NRP</span>
              <span className="v">{STUDENT_NRP}</span>
            </div>
            <div className="info-row">
              <span className="k">Kelas</span>
              <span className="v">
                {CLASS_NAME} · {SEMESTER}
              </span>
            </div>
            <div className="act-row" style={{ marginTop: "var(--sp-3)" }}>
              <Link href="/profil/edit" className="btn btn-outline">
                <EditIcon size={18} />
                Edit profil
              </Link>
              <button type="button" className="btn btn-outline" onClick={() => setConfirmOut(true)}>
                <LogoutIcon size={18} />
                Keluar
              </button>
            </div>
          </section>

          {/* Tentang */}
          <section className="card prof-card" aria-labelledby="set-tentang">
            <SectionTitle>
              <InfoIcon size={20} />
              <span id="set-tentang">Tentang</span>
            </SectionTitle>
            <div className="info-row">
              <span className="k">Aplikasi</span>
              <span className="v">Portal Akademik</span>
            </div>
            <div className="info-row">
              <span className="k">Versi</span>
              <span className="v">1.0.0</span>
            </div>
            <div className="info-row">
              <span className="k">Data</span>
              <span className="v">Dummy (contoh)</span>
            </div>
            <div className="act-row" style={{ marginTop: "var(--sp-3)" }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  reset();
                  showToast("Pengaturan dikembalikan ke bawaan");
                }}
              >
                Atur ulang pengaturan
              </button>
            </div>
          </section>
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {toast}
      </div>
      {toast && (
        <div className="toast" aria-hidden>
          {toast}
        </div>
      )}

      {confirmOut && (
        <div className="modal-bg" onClick={() => setConfirmOut(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Keluar dari akun"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Keluar dari akun?</h3>
            <p className="modal-text">Kamu akan diarahkan ke halaman login. Pengaturan tampilanmu tetap tersimpan.</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setConfirmOut(false)} autoFocus>
                Batal
              </button>
              <button className="btn btn-solid" onClick={() => router.push("/login")}>
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}