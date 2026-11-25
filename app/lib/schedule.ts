import type { CategoryTone, TaskStatus } from "./data";
import { pad2 } from "./utils";

export type ScheduleMode = "Luring" | "Daring";

export type ScheduleEvent = {
  id: string;
  day: number; // 0 = Senin
  name: string;
  start: number; // jam desimal
  end: number;
  room: string;
  mode: ScheduleMode;
  tone: CategoryTone;
  task?: TaskStatus;
};

export const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
export const START_HOUR = 7;
export const MAX_END = 18;

/** "08.40" -> 8.667 */
export const parseClock = (value: string) => {
  const [h, m] = value.split(".").map(Number);
  return h + m / 60;
};

/** 8.667 -> "08.40" */
export const formatTime = (t: number) => {
  const total = Math.round(t * 60);
  return `${pad2(Math.floor(total / 60))}.${pad2(total % 60)}`;
};

export const formatRange = (start: number, end: number) => `${formatTime(start)} - ${formatTime(end)}`;

type Seed = Omit<ScheduleEvent, "start" | "end" | "mode"> & { time: string };

const SEEDS: Seed[] = [
  { id: "e1", day: 0, name: "Matematika", time: "08.00 - 09.40", room: "D4 - B 205", tone: "blue", task: "ok" },
  { id: "e2", day: 0, name: "Sistem Digital", time: "10.30 - 12.10", room: "SAW - 10.08", tone: "blue" },
  { id: "e3", day: 0, name: "Konsep Teknologi", time: "13.00 - 15.00", room: "D4 - B 205", tone: "blue", task: "ok" },
  { id: "e4", day: 1, name: "Agama", time: "08.00 - 09.40", room: "SAW - 05.01", tone: "peach" },
  { id: "e5", day: 1, name: "Pancasila", time: "11.20 - 13.50", room: "SC - 02", tone: "peach", task: "bad" },
  { id: "e6", day: 1, name: "Praktikum Sistem Digital", time: "13.50 - 15.30", room: "JJ - 303", tone: "peach", task: "ok" },
  { id: "e7", day: 2, name: "Praktikum Allgoritma & Pemrogramman", time: "13.00 - 14.40", room: "SAW 04.06", tone: "pink", task: "ok" },
  { id: "e8", day: 2, name: "Praktikum Sistem Komunikasi", time: "14.40 - 16.20", room: "SAW 03.08", tone: "pink", task: "bad" },
  { id: "e9", day: 3, name: "Workshop teknologi web dan Aplikasi", time: "08.50 - 11.20", room: "SAW- 04.06", tone: "green", task: "ok" },
  { id: "e10", day: 3, name: "Algoritma dan Pemrogramman", time: "13.50 - 15.30", room: "A - 303", tone: "green", task: "ok" },
  { id: "e11", day: 3, name: "Sistem Komunikasi", time: "15.30 - 17.10", room: "SAW - 06.06", tone: "green" },
];

export const SCHEDULE_SEED: ScheduleEvent[] = SEEDS.map(({ time, ...rest }) => {
  const [start, end] = time.split(" - ");
  return { ...rest, mode: "Luring", start: parseClock(start), end: parseClock(end) };
});