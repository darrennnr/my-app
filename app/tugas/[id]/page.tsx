"use client";

import { Suspense } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";
import AppShell from "../../components/AppShell";
import {
  ArrowLeftIcon,
  CapIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  DownloadIcon,
  FilePdfIcon,
  TasksIcon,
  UploadIcon,
} from "../../components/icons";
import { Chip, DateLine, PageTitle, SectionTitle, StatusPill } from "../../components/ui";
import { CLASS_NAME, SEMESTER } from "../../lib/data";
import { useHydrated, useTasks } from "../../lib/store";
import { cx } from "../../lib/utils";

const PAPER_LINES = [100, 93, 97, 74, 100, 89, 96, 61, 100, 85, 92, 68];
const ATTACHMENT = { size: "1.2 MB", pages: 3 };

/** Halaman detail tugas (window) */
function TugasDetailContent() {
  const params = useParams<{ id: string }>();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const tasks = useTasks();
  const ready = useHydrated();
  const task = tasks.find((t) => String(t.id) === rawId);

  if (!task) {
    return (
      <AppShell>
        {ready && (
          <div className="state-page">
            <div className="state-code" aria-hidden>
              404
            </div>
            <h2>Tugas tidak ditemukan</h2>
            <p>Tugas ini mungkin sudah dihapus. Kembali ke daftar tugas untuk memilih tugas lain.</p>
            <div className="act-row">
              <Link href="/tugas" className="btn btn-solid">
                Ke daftar tugas
              </Link>
            </div>
          </div>
        )}
      </AppShell>
    );
  }

  const isDone = task.status === "ok";
  const deadline = `${task.due} 2026 · 23.59 WIB`;

  return (
    <AppShell>
      <DateLine />

      <div className="page-head">
        <Link href="/tugas" className="icon-back" aria-label="Kembali ke daftar tugas">
          <ArrowLeftIcon size={22} />
        </Link>
        <PageTitle icon={<TasksIcon size={24} />}>Detail tugas</PageTitle>
      </div>

      <div className="card win">
        <div className="win-bar">
          <div className="win-dots" aria-hidden>
            <i />
            <i />
            <i />
          </div>
          <span className="win-title">Tugas — {task.title}</span>
          <StatusPill status={task.status} small />
        </div>

        <div className="win-body">
          {/* Kolom kiri */}
          <div className="win-col">
            <div className="cp">
              <div className="ico">
                <CapIcon size={30} />
              </div>
              <div>
                <div className="name">{task.course}</div>
                <div className="sub">{task.dosen}</div>
                <div className="chips">
                  <Chip small>3 SKS</Chip>
                  <Chip small tone="blue">
                    {SEMESTER}
                  </Chip>
                  <Chip small tone="peach">
                    {CLASS_NAME}
                  </Chip>
                </div>
              </div>
            </div>

            <div>
              <SectionTitle>Informasi tugas</SectionTitle>
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
                  <span className="v">{task.opened}</span>
                </div>
                <div className="info-row">
                  <span className="k">
                    <ClockIcon size={16} />
                    Batas pengumpulan
                  </span>
                  <span className="v">{deadline}</span>
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

            <div className={cx("due", isDone && "done")}>
              <div className="ico">{isDone ? <CheckIcon size={22} /> : <ClockIcon size={22} />}</div>
              <div>
                <div className="t">{isDone ? "Sudah dikumpulkan" : `Sisa ${task.daysLeft} hari lagi`}</div>
                <div className="m">{deadline}</div>
              </div>
            </div>

            <div className="act-row">
              <button className="btn btn-solid" disabled={isDone}>
                <UploadIcon size={18} />
                {isDone ? "Sudah Dikumpulkan" : "Kumpulkan Tugas"}
              </button>
              <button className="btn btn-outline">
                <DownloadIcon size={18} />
                Unduh Lampiran
              </button>
            </div>
          </div>

          {/* Kolom kanan */}
          <div className="win-col">
            <div>
              <SectionTitle>Lampiran</SectionTitle>
              <div className="pdf">
                <div className="pdf-bar">
                  <FilePdfIcon size={20} />
                  <span className="fname">{task.file}</span>
                  <span className="sz">{ATTACHMENT.size}</span>
                  <button className="btn-ghost" aria-label="Unduh lampiran">
                    <DownloadIcon size={18} />
                  </button>
                </div>

                <div className="pdf-canvas">
                  <div className="paper" aria-hidden>
                    <div className="ln h" style={{ width: "68%" }} />
                    <div className="ln" style={{ width: "38%" }} />
                    <div className="gap" />
                    {PAPER_LINES.map((width, i) => (
                      <div key={i} className="ln" style={{ width: `${width}%` }} />
                    ))}
                  </div>
                </div>

                <div className="pdf-foot">
                  <button className="btn-ghost" aria-label="Halaman sebelumnya">
                    <ChevronLeftIcon size={18} />
                  </button>
                  <span>Halaman 1 dari {ATTACHMENT.pages}</span>
                  <button className="btn-ghost" aria-label="Halaman berikutnya">
                    <ChevronRightIcon size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <SectionTitle>Riwayat pengumpulan</SectionTitle>
              <div className="soft">
                <div className="info-row">
                  <span className="k">Status</span>
                  <span className="v">{isDone ? "Sudah dikumpulkan" : "Belum dikumpulkan"}</span>
                </div>
                <div className="info-row">
                  <span className="k">Terakhir diubah</span>
                  <span className="v">{isDone ? task.due : "—"}</span>
                </div>
              </div>
              <p className="muted" style={{ marginTop: "var(--sp-3)", fontSize: "var(--fs-md)" }}>
                {isDone
                  ? "Berkasmu sudah kami terima untuk tugas ini."
                  : "Belum ada berkas yang kamu kumpulkan untuk tugas ini."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/** useParams() needs a Suspense boundary during Next.js prerendering. */
export default function TugasDetailPage() {
  return (
    <Suspense fallback={<div className="state-page">Memuat tugas...</div>}>
      <TugasDetailContent />
    </Suspense>
  );
}
