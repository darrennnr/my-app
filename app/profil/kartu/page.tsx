"use client";

import Link from "next/link";
import AppShell from "../../components/AppShell";
import { ArrowLeftIcon, CapIcon, IdIcon, PrinterIcon } from "../../components/icons";
import { DateLine, PageTitle } from "../../components/ui";
import { CLASS_NAME, SEMESTER, STUDENT_NAME } from "../../lib/data";
import { STUDENT_NRP, STUDY_PROGRAM, VALID_THRU } from "../../lib/profile";

/* ---------- Kode QR contoh (deterministik, bukan QR sungguhan) ---------- */
const QR = 21;
const FINDERS: Array<[number, number]> = [
  [0, 0],
  [QR - 7, 0],
  [0, QR - 7],
];

const cellOn = (x: number, y: number) => {
  for (const [ox, oy] of FINDERS) {
    const dx = x - ox;
    const dy = y - oy;
    if (dx >= -1 && dx <= 7 && dy >= -1 && dy <= 7) {
      if (dx < 0 || dx > 6 || dy < 0 || dy > 6) return false;
      return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
    }
  }
  return (x * 31 + y * 17 + x * y * 7) % 5 < 2;
};

const QR_CELLS = Array.from({ length: QR }, (_, y) => Array.from({ length: QR }, (_, x) => cellOn(x, y)));

function QrPattern() {
  return (
    <svg
      className="id-qr"
      viewBox={`0 0 ${QR} ${QR}`}
      fill="currentColor"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Kode QR contoh"
    >
      {QR_CELLS.flatMap((row, y) =>
        row.map((on, x) => (on ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null))
      )}
    </svg>
  );
}

const FIELDS = [
  { k: "NRP", v: STUDENT_NRP },
  { k: "Program Studi", v: STUDY_PROGRAM },
  { k: "Kelas", v: `${CLASS_NAME} · ${SEMESTER}` },
];

/** Halaman kartu mahasiswa digital */
export default function KartuMahasiswaPage() {
  return (
    <AppShell>
      <DateLine />

      <div className="page-head">
        <Link href="/profil" className="icon-back" aria-label="Kembali ke profil">
          <ArrowLeftIcon size={22} />
        </Link>
        <PageTitle icon={<IdIcon size={24} />}>Kartu mahasiswa</PageTitle>
      </div>

      <div className="idc-wrap">
        <article className="card id-card" aria-label="Kartu mahasiswa">
          <div className="id-head">
            <CapIcon size={34} />
            <div>
              <div className="t">Portal Akademik</div>
              <div className="s">Kartu Tanda Mahasiswa</div>
            </div>
          </div>

          <div className="id-body">
            <div className="id-photo" aria-hidden>
              {STUDENT_NAME.charAt(0)}
            </div>
            <div className="id-info">
              <div className="nm">{STUDENT_NAME}</div>
              {FIELDS.map((f) => (
                <div className="id-field" key={f.k}>
                  <div className="k">{f.k}</div>
                  <div className="v">{f.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="id-foot">
            <div className="id-field">
              <div className="k">Berlaku hingga</div>
              <div className="v">{VALID_THRU}</div>
            </div>
            <QrPattern />
          </div>
        </article>

        <p className="id-note no-print">Kartu ini hanya contoh (data dummy). Kode QR bukan kode sungguhan.</p>

        <div className="act-row no-print">
          <button type="button" className="btn btn-solid" onClick={() => window.print()}>
            <PrinterIcon size={18} />
            Cetak / simpan PDF
          </button>
          <Link href="/profil" className="btn btn-outline">
            Kembali ke profil
          </Link>
        </div>
      </div>
    </AppShell>
  );
}