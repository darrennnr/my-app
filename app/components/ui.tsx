import Link from "next/link";
import type { ReactNode } from "react";
import { DATE_LINE, type CategoryTone, type TaskStatus } from "../lib/data";
import { cx, formatNumber } from "../lib/utils";
import { BrandBlob, CapIcon, ChevronRightIcon } from "./icons";

/** Baris tanggal di atas judul halaman */
export function DateLine() {
  return <p className="date-line">{DATE_LINE}</p>;
}

/** Judul halaman dengan ikon aksen */
export function PageTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <h2 className="page-title">
      {icon}
      {children}
    </h2>
  );
}

type SectionTitleProps = {
  children: ReactNode;
  first?: boolean;
  href?: string;
  linkLabel?: string;
};

/** Judul bagian, opsional dengan tautan "lihat semua" di kanan */
export function SectionTitle({ children, first, href, linkLabel = "Lihat semua" }: SectionTitleProps) {
  return (
    <h3 className={cx("section-title", first && "first")}>
      {children}
      {href && (
        <Link href={href} className="link-more">
          {linkLabel}
          <ChevronRightIcon size={14} />
        </Link>
      )}
    </h3>
  );
}

/** Label kecil berwarna kategori */
export function Chip({ tone, small, children }: { tone?: CategoryTone; small?: boolean; children: ReactNode }) {
  return <span className={cx("chip", small && "sm", tone && `c-${tone}`)}>{children}</span>;
}

type PillTone = "ok" | "bad" | "warn";

/** Status berbentuk pil dengan titik warna */
export function Pill({ tone, small, children }: { tone: PillTone; small?: boolean; children: ReactNode }) {
  return (
    <span className={cx("pill", tone, small && "sm")}>
      <i />
      {children}
    </span>
  );
}

/** Pil status tugas: Selesai / Belum */
export function StatusPill({ status, small }: { status: TaskStatus; small?: boolean }) {
  return (
    <Pill tone={status} small={small}>
      {status === "ok" ? "Selesai" : "Belum"}
    </Pill>
  );
}

type StatCardProps = {
  label: string;
  value: ReactNode;
  accessory?: ReactNode;
  variant?: "dark";
};

/** Kartu angka: label, nilai besar, dan aksesori kecil (ikon atau titik) */
export function StatCard({ label, value, accessory, variant }: StatCardProps) {
  return (
    <div className={cx("card stat", variant)}>
      <div className="top">
        <span>{label}</span>
        {accessory}
      </div>
      <div className="num">{value}</div>
    </div>
  );
}

/** Grid kartu angka: 2 kolom (4 di layar lebar) atau 3 kolom tetap */
export function StatGrid({ cols = 4, children }: { cols?: 2 | 3 | 4; children: ReactNode }) {
  return <div className={cx("stat-grid", `cols-${cols}`)}>{children}</div>;
}

/** Nilai rupiah dengan awalan kecil: Rp443.000 */
export function Money({ value }: { value: number }) {
  return (
    <>
      <small>{value < 0 ? "-Rp" : "Rp"}</small>
      {formatNumber(value)}
    </>
  );
}

type ProgressBarProps = { value: number; tone?: "accent" | "ok"; label?: string };

export function ProgressBar({ value, tone = "accent", label }: ProgressBarProps) {
  return (
    <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span className={cx("progress-fill", tone === "ok" && "ok")} style={{ width: `${value}%` }} />
    </div>
  );
}

/** Logo topi toga di atas blob (splash & login) */
export function BrandMark() {
  return (
    <div className="blob">
      <BrandBlob className="bg" />
      <CapIcon className="cap" size={120} />
    </div>
  );
}