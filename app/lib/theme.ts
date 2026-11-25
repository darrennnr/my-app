import type { CSSProperties } from "react";

/**
 * Sumber tunggal seluruh warna aplikasi.
 *
 * Setiap key menjadi CSS variable `--<key>`. Semua palet (terang, gelap,
 * kontras tinggi) dirangkai menjadi satu stylesheet (`themeCss`) yang
 * disuntik lewat <style> di app/layout.tsx. Pakai lewat `var(--<key>)` di CSS
 * atau lewat helper `color()` di TSX. Jangan menulis kode warna di file lain.
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
export type ShadowToken = keyof typeof shadows;

/** Palet gelap: hanya token yang berbeda dari palet terang */
export const darkColors: Partial<Record<ColorToken, string>> = {
  surface: "#0b1120",
  "surface-2": "#1e293b",
  "surface-hover": "#162032",
  card: "#111a2e",

  ink: "#f1f5f9",
  "ink-2": "#cbd5e1",
  "ink-3": "#94a3b8",
  muted: "#8391a7",

  primary: "#e2e8f0",
  "primary-2": "#cbd5e1",
  "primary-soft": "#334155",
  "on-primary": "#0f172a",
  "on-primary-muted": "rgba(15, 23, 42, 0.7)",
  "on-primary-faint": "rgba(15, 23, 42, 0.55)",

  accent: "#60a5fa",
  "accent-soft": "rgba(96, 165, 250, 0.16)",
  "accent-ink": "#93c5fd",
  "accent-wash": "rgba(96, 165, 250, 0.08)",

  "cat-blue": "rgba(96, 165, 250, 0.16)",
  "cat-blue-ink": "#93c5fd",
  "cat-peach": "rgba(251, 191, 36, 0.16)",
  "cat-peach-ink": "#fcd34d",
  "cat-pink": "rgba(244, 114, 182, 0.16)",
  "cat-pink-ink": "#f9a8d4",
  "cat-pink-solid": "#ec4899",
  "cat-green": "rgba(74, 222, 128, 0.16)",
  "cat-green-ink": "#86efac",

  ok: "#4ade80",
  "ok-soft": "rgba(74, 222, 128, 0.16)",
  "ok-ink": "#86efac",
  warn: "#fbbf24",
  "warn-soft": "rgba(251, 191, 36, 0.16)",
  "warn-ink": "#fcd34d",
  bad: "#f87171",
  "bad-soft": "rgba(248, 113, 113, 0.16)",
  "bad-ink": "#fca5a5",

  overlay: "rgba(0, 0, 0, 0.6)",
  glass: "rgba(255, 255, 255, 0.08)",
  "grid-line": "rgba(255, 255, 255, 0.1)",
  "grid-line-soft": "rgba(255, 255, 255, 0.06)",
  "drag-outline": "rgba(255, 255, 255, 0.5)",

  "pdf-canvas": "#0f172a",
  paper: "#f1f5f9",
  "paper-line": "#d5dbe5",
  "paper-line-strong": "#b8c1d0",

  "brand-blob": "#1e3a5f",
  "wave-1": "#0f1a30",
  "wave-2": "#122241",
  "wave-3": "#16294d",
  "wave-4": "#0d1627",
};

export const darkShadows: Record<ShadowToken, string> = {
  "shadow-xs": "0 1px 2px rgba(0, 0, 0, 0.3)",
  "shadow-sm": "0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)",
  shadow: "0 4px 12px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3)",
  "shadow-md": "0 8px 24px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.3)",
  "shadow-sticky": "6px 0 8px -6px rgba(0, 0, 0, 0.5)",
};

/** Kontras tinggi (terang) */
const contrastLight: Partial<Record<ColorToken, string>> = {
  ink: "#000000",
  "ink-2": "#0f172a",
  "ink-3": "#334155",
  muted: "#475569",
  "surface-2": "#cbd5e1",
  accent: "#1d4ed8",
  "accent-ink": "#1e3a8a",
  "cat-blue-ink": "#1e3a8a",
  "cat-peach-ink": "#78350f",
  "cat-pink-ink": "#831843",
  "cat-green-ink": "#14532d",
  ok: "#15803d",
  "ok-ink": "#14532d",
  warn: "#b45309",
  "warn-ink": "#78350f",
  bad: "#b91c1c",
  "bad-ink": "#7f1d1d",
  "grid-line": "rgba(15, 23, 42, 0.25)",
  "grid-line-soft": "rgba(15, 23, 42, 0.15)",
};

/** Kontras tinggi (gelap) */
const contrastDark: Partial<Record<ColorToken, string>> = {
  ink: "#ffffff",
  "ink-2": "#f1f5f9",
  "ink-3": "#e2e8f0",
  muted: "#cbd5e1",
  "surface-2": "#475569",
  "surface-hover": "#1e293b",
  accent: "#93c5fd",
  "accent-ink": "#bfdbfe",
  "cat-blue-ink": "#bfdbfe",
  "cat-peach-ink": "#fde68a",
  "cat-pink-ink": "#fbcfe8",
  "cat-green-ink": "#bbf7d0",
  ok: "#86efac",
  "ok-ink": "#bbf7d0",
  warn: "#fcd34d",
  "warn-ink": "#fde68a",
  bad: "#fca5a5",
  "bad-ink": "#fecaca",
  "grid-line": "rgba(255, 255, 255, 0.3)",
  "grid-line-soft": "rgba(255, 255, 255, 0.18)",
};

/** Referensi CSS variable untuk dipakai di style inline: color("accent") -> "var(--accent)" */
export const color = (token: ColorToken) => `var(--${token})`;

const block = (selector: string, vars: Record<string, string | undefined>, extra = "") =>
  `${selector}{${Object.entries(vars)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `--${key}:${value}`)
    .join(";")};${extra}}`;

/**
 * Stylesheet seluruh palet. Urutan penting: yang belakangan menang.
 * Dipasang sebagai <style> di app/layout.tsx; tema dipilih lewat atribut
 * `data-theme` dan `data-contrast` pada <html>.
 */
export const themeCss = [
  block(":root", { ...colors, ...shadows }, "color-scheme:light"),
  block(':root[data-theme="dark"]', { ...darkColors, ...darkShadows }, "color-scheme:dark"),
  block(':root[data-contrast="high"]', contrastLight),
  block(':root[data-theme="dark"][data-contrast="high"]', contrastDark),
].join("\n");

/** @deprecated Diganti `themeCss`. Dipertahankan agar import lama tidak rusak. */
export const themeVars = Object.fromEntries(
  Object.entries({ ...colors, ...shadows }).map(([key, value]) => [`--${key}`, value])
) as unknown as CSSProperties;