/* Data jadwal, tugas, dan materi yang bisa diubah lewat /kelola.
   Disimpan di localStorage dan dibaca lewat useSyncExternalStore (pola yang sama
   dengan preferences.ts), jadi aman untuk SSR dan tanpa hydration mismatch. */

import { useSyncExternalStore } from "react";
import { MATERI, TASKS, type Materi, type Task } from "./data";
import { SCHEDULE_SEED, type ScheduleEvent } from "./schedule";

export const DATA_KEY = "portal-akademik:data";

type Collections = { schedule: ScheduleEvent; tasks: Task; materi: Materi };
export type CollectionKey = keyof Collections;
type Data = { [K in CollectionKey]: Collections[K][] };

const DEFAULT_DATA: Data = { schedule: SCHEDULE_SEED, tasks: TASKS, materi: MATERI };

const list = <T>(value: unknown, fallback: T[]): T[] =>
  Array.isArray(value) ? (value.filter((x) => x && typeof x === "object") as T[]) : fallback;

/** Data dari localStorage tidak dipercaya begitu saja */
const sanitize = (raw: unknown): Data => {
  if (!raw || typeof raw !== "object") return DEFAULT_DATA;
  const r = raw as Partial<Record<CollectionKey, unknown>>;
  return {
    schedule: list(r.schedule, DEFAULT_DATA.schedule),
    tasks: list(r.tasks, DEFAULT_DATA.tasks),
    materi: list(r.materi, DEFAULT_DATA.materi),
  };
};

/* ---------- Store ---------- */
let current: Data = DEFAULT_DATA;
let loaded = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

const readStorage = (): Data => {
  try {
    const raw = window.localStorage.getItem(DATA_KEY);
    return raw ? sanitize(JSON.parse(raw)) : DEFAULT_DATA;
  } catch {
    return DEFAULT_DATA;
  }
};

const writeStorage = (data: Data) => {
  try {
    window.localStorage.setItem(DATA_KEY, JSON.stringify(data));
  } catch {
    /* penyimpanan penuh atau diblokir: data tetap berlaku selama sesi */
  }
};

const getDataSnapshot = (): Data => {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    current = readStorage();
  }
  return current;
};

const getDataServerSnapshot = (): Data => DEFAULT_DATA;

const subscribeData = (callback: () => void) => {
  listeners.add(callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key === DATA_KEY) {
      current = readStorage();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
};

const commit = (next: Data) => {
  current = next;
  writeStorage(next);
  emit();
};

/* ---------- Operasi CRUD ---------- */
/** Tambah (id baru) atau ganti (id sudah ada). Data baru ditaruh paling atas. */
export function saveItem<K extends CollectionKey>(key: K, item: Collections[K]) {
  const data = getDataSnapshot();
  const items = data[key] as Collections[K][];
  const exists = items.some((x) => x.id === item.id);
  const next = exists ? items.map((x) => (x.id === item.id ? item : x)) : [item, ...items];
  commit({ ...data, [key]: next } as Data);
}

/** Ubah sebagian field (dipakai drag jadwal) */
export function patchItem<K extends CollectionKey>(key: K, id: string | number, changes: Partial<Collections[K]>) {
  const data = getDataSnapshot();
  const items = data[key] as Collections[K][];
  const next = items.map((x) => (x.id === id ? ({ ...x, ...changes } as Collections[K]) : x));
  commit({ ...data, [key]: next } as Data);
}

export function removeItem(key: CollectionKey, id: string | number) {
  const data = getDataSnapshot();
  const items = data[key] as Array<{ id: string | number }>;
  commit({ ...data, [key]: items.filter((x) => x.id !== id) } as Data);
}

export const resetData = () => commit(DEFAULT_DATA);

/** Id numerik berikutnya */
export const nextId = (items: Array<{ id: number }>) => Math.max(0, ...items.map((i) => i.id)) + 1;

/* ---------- Hooks ---------- */
const useData = () => useSyncExternalStore(subscribeData, getDataSnapshot, getDataServerSnapshot);

export const useSchedule = () => useData().schedule;
export const useTasks = () => useData().tasks;
export const useMateri = () => useData().materi;

const noopSubscribe = () => () => {};

/** false di server dan saat hydrate, true setelahnya (membedakan "belum dimuat" dan "tidak ada") */
export const useHydrated = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );