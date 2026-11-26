/** Gabungkan class name, nilai falsy diabaikan */
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

/** 5 -> "05" */
export const pad2 = (n: number) => String(n).padStart(2, "0");

/** 1250000 -> "1.250.000" */
export const formatNumber = (n: number) =>
  Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/** 1250000 -> "Rp 1.250.000", negatif -> "-Rp 1.250.000" */
export const formatRupiah = (n: number) => `${n < 0 ? "-" : ""}Rp ${formatNumber(n)}`;