import Link from "next/link";
import AppShell from "./components/AppShell";
import { HomeIcon } from "./components/icons";

/** Halaman 404 */
export default function NotFound() {
  return (
    <AppShell>
      <div className="state-page">
        <div className="state-code" aria-hidden>
          404
        </div>
        <h2>Halaman tidak ditemukan</h2>
        <p>Alamat yang kamu buka tidak ada atau sudah dipindahkan. Coba kembali ke beranda dan pilih menu dari sana.</p>
        <div className="act-row">
          <Link href="/dashboard" className="btn btn-solid">
            <HomeIcon size={18} />
            Kembali ke beranda
          </Link>
        </div>
      </div>
    </AppShell>
  );
}