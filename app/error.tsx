"use client";

import Link from "next/link";
import AppShell from "./components/AppShell";

/** Batas error untuk seluruh halaman */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <AppShell>
      <div className="state-page">
        <div className="state-code" aria-hidden>
          !
        </div>
        <h2>Terjadi kesalahan</h2>
        <p>Halaman ini gagal dimuat. Coba muat ulang, atau kembali ke beranda jika masalah berlanjut.</p>
        <div className="act-row">
          <button type="button" className="btn btn-solid" onClick={reset}>
            Coba lagi
          </button>
          <Link href="/dashboard" className="btn btn-outline">
            Ke beranda
          </Link>
        </div>
      </div>
    </AppShell>
  );
}