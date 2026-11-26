"use client";

import Link from "next/link";
import { useState } from "react";
import AppShell from "../components/AppShell";
import {
  BookIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  DotsIcon,
  FolderOpenIcon,
  MegaphoneIcon,
  TasksIcon,
  WalletIcon,
} from "../components/icons";
import { Chip, Money, Pill, ProgressBar, SectionTitle, StatCard, StatGrid, StatusPill } from "../components/ui";
import { ANNOUNCEMENTS, CAT_COLOR, relativeDay, sortNewest } from "../lib/announcements";
import { AGENDA, DATE_LINE, STUDENT_NICKNAME, TODAY_CLASSES } from "../lib/data";
import { createInitialPaid, summarizeKas } from "../lib/kas";
import { useMateri, useTasks } from "../lib/store";
import { formatRupiah, pad2 } from "../lib/utils";

/* ---------- Data turunan yang tidak berubah lewat CRUD ---------- */
const kas = summarizeKas(createInitialPaid());

const unreadAnnouncements = ANNOUNCEMENTS.filter((a) => !a.read);
const latestAnnouncements = [...unreadAnnouncements].sort(sortNewest).slice(0, 3);

/** Halaman 3: Dashboard */
export default function DashboardPage() {
  const [note, setNote] = useState("");
  const tasks = useTasks();
  const materi = useMateri();

  const tasksDone = tasks.filter((t) => t.status === "ok").length;
  const tasksTotal = tasks.length;
  const tasksPercent = tasksTotal ? Math.round((tasksDone / tasksTotal) * 100) : 0;
  const upcomingTasks = tasks.filter((t) => t.status === "bad").slice(0, 3);
  const latestMateri = materi.slice(0, 3);

  return (
    <AppShell>
      <div className="dash-head">
        <h2 className="greet">Halo, {STUDENT_NICKNAME}</h2>
        <p className="greet-sub">{DATE_LINE}</p>
        <span className="countdown">
          <ClockIcon size={14} />5 minggu lagi menuju UTS
        </span>
      </div>

      {/* Ringkasan cepat */}
      <StatGrid>
        <StatCard
          label="Tugas Selesai"
          accessory={
            <span className="ico tone-ok">
              <CheckIcon size={18} />
            </span>
          }
          value={
            <>
              {pad2(tasksDone)}
              <small>/{tasksTotal}</small>
            </>
          }
        />
        <StatCard
          label="Belum Dibaca"
          accessory={
            <span className="ico tone-bad">
              <MegaphoneIcon size={18} />
            </span>
          }
          value={pad2(unreadAnnouncements.length)}
        />
        <StatCard
          label="Saldo Kas"
          accessory={
            <span className="ico tone-accent">
              <WalletIcon size={18} />
            </span>
          }
          value={<Money value={kas.saldo} />}
        />
        <StatCard
          label="Kuliah Hari Ini"
          accessory={
            <span className="ico tone-warn">
              <BookIcon size={18} />
            </span>
          }
          value={pad2(TODAY_CLASSES.length)}
        />
      </StatGrid>

      <div className="dash-grid">
        <section>
          {/* Jadwal hari ini */}
          <SectionTitle first href="/jadwal">
            Jadwal hari ini
          </SectionTitle>
          <div className="sched-row">
            {TODAY_CLASSES.map((c) => (
              <article key={c.title} className="card sched-card">
                <span className={`sched-tag ${c.tone}`} />
                <h3>{c.title}</h3>
                <div className="time">
                  <ClockIcon size={16} />
                  <span>{c.time}</span>
                </div>
                <p className="dosen">{c.dosen}</p>
                <div className="foot">
                  <Chip small>{c.mode}</Chip>
                  <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>
                    {c.room}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Tugas mendatang */}
          <SectionTitle href="/tugas">Tugas mendatang</SectionTitle>
          <div className="card card-inset">
            <div className="mini-list">
              {upcomingTasks.length === 0 && <p className="empty">Tidak ada tugas mendatang</p>}
              {upcomingTasks.map((t) => (
                <Link key={t.id} href={`/tugas/${t.id}`} className="mini-row">
                  <span className="ico tone-accent">
                    <TasksIcon size={18} />
                  </span>
                  <span className="info">
                    <span className="t">{t.title}</span>
                    <span className="m">{t.due}</span>
                  </span>
                  <StatusPill status={t.status} small />
                </Link>
              ))}
            </div>
          </div>

          {/* Progres tugas */}
          <SectionTitle>Progres tugas</SectionTitle>
          <div className="card progress-card">
            <div className="progress-head">
              <span>
                {tasksDone} dari {tasksTotal} tugas selesai
              </span>
              <strong>{tasksPercent}%</strong>
            </div>
            <ProgressBar value={tasksPercent} tone="ok" label="Progres tugas" />
          </div>

          {/* Materi terbaru */}
          <SectionTitle href="/materi">Materi terbaru</SectionTitle>
          <div className="card card-inset">
            <div className="mini-list">
              {latestMateri.length === 0 && <p className="empty">Belum ada materi</p>}
              {latestMateri.map((m) => (
                <Link key={m.id} href={`/materi/${m.id}`} className="mini-row">
                  <span className="ico tone-accent">
                    <FolderOpenIcon size={18} />
                  </span>
                  <span className="info">
                    <span className="t">{m.title}</span>
                    <span className="m">{m.dosen}</span>
                  </span>
                  <span className="end">{m.count} materi</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section>
          {/* Ringkasan kas */}
          <SectionTitle first href="/kas" linkLabel="Detail">
            Ringkasan kas
          </SectionTitle>
          <StatGrid cols={2}>
            <StatCard label="Pemasukan" accessory={<i className="dot ok" />} value={<Money value={kas.pemasukan} />} />
            <StatCard label="Pengeluaran" accessory={<i className="dot bad" />} value={<Money value={kas.pengeluaran} />} />
          </StatGrid>
          <div className="card progress-card" style={{ marginTop: "calc(-1 * var(--sp-2))" }}>
            <div className="progress-head">
              <span>Iuran terkumpul</span>
              <strong>{kas.persen}%</strong>
            </div>
            <ProgressBar value={kas.persen} label="Iuran terkumpul" />
            <div className="progress-foot">
              <span>
                {formatRupiah(kas.totalIuran)} dari {formatRupiah(kas.target)}
              </span>
              <span>{kas.menunggak} menunggak</span>
            </div>
          </div>

          {/* Pengumuman terbaru */}
          <SectionTitle href="/pengumuman">Pengumuman terbaru</SectionTitle>
          <div className="card card-inset">
            <div className="mini-list">
              {latestAnnouncements.map((a) => (
                <Link key={a.id} href="/pengumuman" className="mini-row">
                  <span className={`ico c-${CAT_COLOR[a.cat]}`}>
                    <MegaphoneIcon size={18} />
                  </span>
                  <span className="info">
                    <span className="t">{a.title}</span>
                    <span className="m">
                      {a.cat} · {relativeDay(a.day)}
                    </span>
                  </span>
                  {a.important && (
                    <Pill tone="bad" small>
                      Penting
                    </Pill>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Agenda mendatang */}
          <SectionTitle href="/jadwal">Agenda mendatang</SectionTitle>
          <div className="card card-inset">
            <div className="mini-list">
              {AGENDA.map((a) => (
                <div key={a.id} className="mini-row">
                  <span className="ico tone-warn">
                    <CalendarIcon size={18} />
                  </span>
                  <span className="info">
                    <span className="t">{a.title}</span>
                    <span className="m">{a.when}</span>
                  </span>
                  <span className="end">{a.place}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Catatan */}
          <div className="card notes">
            <div className="head">
              <span className="lbl">Catatan</span>
              <button className="btn-ghost" aria-label="Menu catatan">
                <DotsIcon size={18} />
              </button>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              aria-label="Catatan"
              placeholder="Tulis catatan singkat"
            />
          </div>
        </section>
      </div>
    </AppShell>
  );
}