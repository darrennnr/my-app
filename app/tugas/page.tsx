"use client";

import Link from "next/link";
import { useState } from "react";
import AppShell from "../components/AppShell";
import { CapIcon, ChevronRightIcon, ClockIcon, TasksIcon } from "../components/icons";
import { DateLine, PageTitle, StatusPill } from "../components/ui";
import type { Task, TaskStatus } from "../lib/data";
import { useTasks } from "../lib/store";

const FILTERS = [
  { key: "all", label: "Semua" },
  { key: "ok", label: "Selesai" },
  { key: "bad", label: "Belum" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function TaskCard({ task }: { task: Task }) {
  return (
    <Link href={`/tugas/${task.id}`} className="card task">
      <div className="ico tone-accent">
        <CapIcon size={40} style={{ width: "70%", height: "auto" }} />
      </div>
      <div className="info">
        <div className="t">{task.title}</div>
        <div className="m">{task.course}</div>
        <div className="bottom">
          <span className="due-at">
            <ClockIcon size={16} />
            {task.due}
          </span>
          <StatusPill status={task.status} />
        </div>
      </div>
      <ChevronRightIcon size={22} />
    </Link>
  );
}

function TaskGroup({ title, tasks, showCount }: { title: string; tasks: Task[]; showCount?: boolean }) {
  if (tasks.length === 0) return null;
  return (
    <>
      <div className="group-head">
        <span>{title}</span>
        {showCount && <span className="count">{tasks.length} Tugas</span>}
      </div>
      <div className="task-grid">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </>
  );
}

const matchesFilter = (status: TaskStatus, filter: FilterKey) => filter === "all" || status === filter;

/** Halaman 5: Daftar tugas */
export default function TugasPage() {
  const tasks = useTasks();
  const [filter, setFilter] = useState<FilterKey>("all");

  const list = tasks.filter((t) => matchesFilter(t.status, filter));
  const thisWeek = list.filter((t) => t.week === "now");
  const nextWeek = list.filter((t) => t.week === "next");

  return (
    <AppShell>
      <DateLine />
      <PageTitle icon={<TasksIcon size={24} />}>Daftar tugas</PageTitle>

      <div className="tabs">
        {FILTERS.map((f) => (
          <button key={f.key} className={`tab ${filter === f.key ? "on" : ""}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      <TaskGroup title="Minggu ini" tasks={thisWeek} showCount />
      <TaskGroup title="Minggu depan" tasks={nextWeek} />
      {list.length === 0 && <p className="empty">Tidak ada tugas</p>}
    </AppShell>
  );
}