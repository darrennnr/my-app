"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import AppShell from "../../components/AppShell";
import {
  ArrowLeftIcon,
  CapIcon,
  ChevronLeftIcon,
  ChevronRight,
  ClockIcon,
  DownloadIcon,
  FilePdfIcon,
  TasksIcon,
  UploadIcon,
} from "../../components/icons";
import { TASKS } from "../../lib/data";

const PAPER_LINES = [100, 93, 97, 74, 100, 89, 96, 61, 100, 85, 92, 68];

/** Halaman detail tugas (window) */
export default function TugasDetailPage() {
  const params = useParams<{ id: string }>();
  const raw = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const task = TASKS.find((t) => String(t.id) === raw) ?? TASKS[0];

  return (
    <AppShell>
      <p className="date-line">Kamis, 9 September 2026 - Minggu 3</p>

      <div className="page-head">
        <Link href="/tugas" className="icon-back" aria-label="Kembali ke daftar tugas">
          <ArrowLeftIcon size={22} />
        </Link>
        <h2 className="page-title">
          <TasksIcon size={30} />
          Detail Tugas
        </h2>
      </div>

      <div className="card win">
        <div className="win-bar">
          <div className="win-dots" aria-hidden>
            <i />
            <i />
            <i />
          </div>
          <span className="win-title">Tugas — {task.title}</span>
          <span className={`pill ${task.status}`}>
            <i />
            {task.status === "ok" ? "Selesai" : "Belum"}
          </span>
        </div>

        <div className="win-body">
          {/* kolom kiri */}
          <div className="win-col">
            <div className="cp">
              <div className="ico">
                <CapIcon size={38} />
              </div>
              <div>
                <div className="name">{task.course}</div>
                <div className="sub">{task.dosen}</div>
                <div className="chips">
                  <span className="chip sm">3 SKS</span>
                  <span className="chip sm c-blue">Semester 1</span>
                  <span className="chip sm c-peach">TRI B 2026</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="section-title">Informasi Tugas</h3>
              <div className="soft">
                <div className="info-row">
                  <span className="k">Tipe</span>
                  <span className="v">Individu</span>
                </div>
                <div className="info-row">
                  <span className="k">Bobot nilai</span>
                  <span className="v">10%</span>
                </div>
                <div className="info-row">
                  <span className="k">Dibuka</span>
                  <span className="v">Rabu, 9 September 2026</span>
                </div>
                <div className="info-row">
                  <span className="k">
                    <ClockIcon size={16} />
                    Batas pengumpulan
                  </span>
                  <span className="v">{task.due} 2026 · 23.59 WIB</span>
                </div>
                <div className="info-row">
                  <span className="k">Format berkas</span>
                  <span className="v">PDF (maks. 10 MB)</span>
                </div>
                <div className="info-row">
                  <span className="k">Pengumpulan</span>
                  <span className="v">Melalui halaman ini</span>
                </div>
              </div>
            </div>

            <div className="due">
              <div className="ico">
                <ClockIcon size={22} />
              </div>
              <div>
                <div className="t">Sisa 5 hari lagi</div>
                <div className="m">{task.due} 2026 · 23.59 WIB</div>
              </div>
            </div>

            <div className="act-row">
              <button className="btn-sm black">
                <UploadIcon size={18} />
                Kumpulkan Tugas
              </button>
              <button className="btn-sm line">
                <DownloadIcon size={18} />
                Unduh Lampiran
              </button>
            </div>
          </div>

          {/* kolom kanan */}
          <div className="win-col">
            <div>
              <h3 className="section-title">Lampiran</h3>
              <div className="pdf">
                <div className="pdf-bar">
                  <FilePdfIcon size={20} />
                  <span className="fname">Latihan_1-5_Determinan.pdf</span>
                  <span className="sz">1.2 MB</span>
                  <button className="btn-ghost" aria-label="Unduh lampiran">
                    <DownloadIcon size={18} />
                  </button>
                </div>

                <div className="pdf-canvas">
                  <div className="paper" aria-hidden>
                    <div className="ln h" style={{ width: "68%" }} />
                    <div className="ln" style={{ width: "38%" }} />
                    <div className="gap" />
                    {PAPER_LINES.map((w, i) => (
                      <div key={i} className="ln" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                </div>

                <div className="pdf-foot">
                  <button className="btn-ghost" aria-label="Halaman sebelumnya">
                    <ChevronLeftIcon size={18} />
                  </button>
                  <span className="muted">Halaman 1 dari 3</span>
                  <button className="btn-ghost" aria-label="Halaman berikutnya">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="section-title">Riwayat Pengumpulan</h3>
              <div className="soft">
                <div className="info-row">
                  <span className="k">Status</span>
                  <span className="v">Belum dikumpulkan</span>
                </div>
                <div className="info-row">
                  <span className="k">Terakhir diubah</span>
                  <span className="v">—</span>
                </div>
              </div>
              <p className="muted" style={{ fontSize: 14, marginTop: 10 }}>
                Belum ada berkas yang kamu kumpulkan untuk tugas ini.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}