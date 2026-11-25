import type { CSSProperties } from "react";

/**
 * Sumber tunggal seluruh warna aplikasi.
 *
 * Setiap key menjadi CSS variable `--<key>` (lihat `themeVars`) yang disuntik
 * ke <html> di app/layout.tsx. Pakai lewat `var(--<key>)` di CSS atau lewat
 * helper `color()` di TSX. Jangan menulis kode warna langsung di file lain.
 */
export const colors = {
  /* Surface */
  surface: "#f5f7fa",
  "surface-2": "#eef2f7",
  "surface-hover": "#f8fafc",
  card: "#ffffff",

  /* Teks */
  ink: "#0f172a",
  "ink-2": "#334155",
  "ink-3": "#64748b",
  muted: "#94a3b8",

  /* Primary (aksi, penekanan) */
  primary: "#0f172a",
  "primary-2": "#1e293b",
  "primary-soft": "#e2e8f0",
  "on-primary": "#ffffff",
  "on-primary-muted": "rgba(255, 255, 255, 0.7)",
  "on-primary-faint": "rgba(255, 255, 255, 0.55)",

  /* Accent (brand, tautan, jadwal) */
  accent: "#2563eb",
  "accent-soft": "#dbeafe",
  "accent-ink": "#1d4ed8",
  "accent-wash": "rgba(37, 99, 235, 0.06)",

  /* Kategori: latar pastel + teks */
  "cat-blue": "#dbeafe",
  "cat-blue-ink": "#1d4ed8",
  "cat-peach": "#fef3c7",
  "cat-peach-ink": "#b45309",
  "cat-pink": "#fce7f3",
  "cat-pink-ink": "#9d174d",
  "cat-pink-solid": "#db2777",
  "cat-green": "#dcfce7",
  "cat-green-ink": "#15803d",

  /* Status */
  ok: "#16a34a",
  "ok-soft": "#dcfce7",
  "ok-ink": "#15803d",
  warn: "#d97706",
  "warn-soft": "#fef3c7",
  "warn-ink": "#b45309",
  bad: "#dc2626",
  "bad-soft": "#fee2e2",
  "bad-ink": "#b91c1c",

  /* Overlay & garis bantu */
  overlay: "rgba(15, 23, 42, 0.45)",
  glass: "rgba(255, 255, 255, 0.7)",
  "grid-line": "rgba(15, 23, 42, 0.08)",
  "grid-line-soft": "rgba(15, 23, 42, 0.05)",
  "drag-outline": "rgba(15, 23, 42, 0.4)",

  /* Window (halaman detail) */
  "window-close": "#fca5a5",
  "window-min": "#fcd34d",
  "window-max": "#86efac",

  /* Pratinjau PDF */
  "pdf-canvas": "#eef1f6",
  paper: "#ffffff",
  "paper-line": "#ededed",
  "paper-line-strong": "#dcdcdc",

  /* Ilustrasi brand (splash & login) */
  "brand-blob": "#e1edfd",
  "wave-1": "#f4f9ff",
  "wave-2": "#e8f2fe",
  "wave-3": "#dfeafc",
  "wave-4": "#eef6ff",
} as const;

/** Shadow memakai warna ink, jadi ikut dikelola di file ini */
export const shadows = {
  "shadow-xs": "0 1px 2px rgba(15, 23, 42, 0.04)",
  "shadow-sm": "0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)",
  shadow: "0 4px 12px rgba(15, 23, 42, 0.07), 0 1px 3px rgba(15, 23, 42, 0.04)",
  "shadow-md": "0 8px 24px rgba(15, 23, 42, 0.1), 0 2px 6px rgba(15, 23, 42, 0.04)",
  "shadow-sticky": "6px 0 8px -6px rgba(15, 23, 42, 0.1)",
} as const;

export type ColorToken = keyof typeof colors;

/** Referensi CSS variable untuk dipakai di style inline: color("accent") -> "var(--accent)" */
export const color = (token: ColorToken) => `var(--${token})`;

/** Seluruh token sebagai CSS variable, dipasang di <html style={themeVars}> */
export const themeVars = Object.fromEntries(
  Object.entries({ ...colors, ...shadows }).map(([key, value]) => [`--${key}`, value])
) as unknown as CSSProperties;