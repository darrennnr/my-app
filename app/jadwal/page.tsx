"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import AppShell from "../components/AppShell";
import { BookIcon, CalendarIcon, ClockIcon, PinIcon } from "../components/icons";
import { Chip, DateLine, PageTitle, SectionTitle } from "../components/ui";
import { AGENDA, type CategoryTone, type TaskStatus } from "../lib/data";
import { cx, pad2 } from "../lib/utils";

/* ---------- Tipe ---------- */
type ClassEvent = {
  id: string;
  day: number; // 0 = Senin
  name: string;
  start: number; // jam desimal
  end: number;
  room: string;
  tone: CategoryTone;
  task?: TaskStatus;
};

type EventSeed = Omit<ClassEvent, "start" | "end"> & { time: string };

type DragData = {
  id: string;
  event: ClassEvent;
  pointerId: number;
  startX: number;
  startY: number;
  origDay: number;
  origStart: number;
  duration: number;
  moved: boolean;
  day: number;
  start: number;
  end: number;
};

type DragPreview = {
  id: string;
  day: number;
  start: number;
  end: number;
  moved: boolean;
  colWidth: number;
};

/* ---------- Konstanta tata letak ---------- */
const START_HOUR = 7;
const MAX_END = 18;
const HOURS = Array.from({ length: MAX_END - START_HOUR + 1 }, (_, i) => START_HOUR + i);
const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

const HOUR_HEIGHT = 64;
const TOP_OFFSET = 10;
const TIME_COL = 48;
const SNAP_STEP = 1 / 12; // 5 menit
const DRAG_THRESHOLD = 5;

/* ---------- Helper waktu ---------- */
const snapToFiveMinutes = (t: number) => Math.round(t * 12) / 12;

/** "08.40" -> 8.667 */
const parseClock = (value: string) => {
  const [h, m] = value.split(".").map(Number);
  return h + m / 60;
};

/** 8.667 -> "08.40" */
const formatTime = (t: number) => {
  const total = Math.round(t * 60);
  return `${pad2(Math.floor(total / 60))}.${pad2(total % 60)}`;
};

const formatRange = (start: number, end: number) => `${formatTime(start)} - ${formatTime(end)}`;

/* ---------- Data jadwal ---------- */
const EVENT_SEEDS: EventSeed[] = [
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

const EVENTS: ClassEvent[] = EVENT_SEEDS.map(({ time, ...rest }) => {
  const [start, end] = time.split(" - ");
  return { ...rest, start: parseClock(start), end: parseClock(end) };
});

/** Halaman 4: Jadwal minggu ini */
export default function JadwalPage() {
  const [events, setEvents] = useState<ClassEvent[]>(EVENTS);
  const [selected, setSelected] = useState<ClassEvent | null>(null);
  const [drag, setDrag] = useState<DragPreview | null>(null);

  const dragRef = useRef<DragData | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const endDragListeners = () => {
    cleanupRef.current?.();
    cleanupRef.current = null;
  };

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  const handlePointerDown = (e: ReactPointerEvent<HTMLButtonElement>, event: ClassEvent) => {
    if (dragRef.current) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    e.preventDefault();

    const rect = bodyRef.current?.getBoundingClientRect();
    const colWidth = rect ? (rect.width - TIME_COL) / DAYS.length : 0;

    dragRef.current = {
      id: event.id,
      event,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origDay: event.day,
      origStart: event.start,
      duration: event.end - event.start,
      moved: false,
      day: event.day,
      start: event.start,
      end: event.end,
    };

    setDrag({ id: event.id, day: event.day, start: event.start, end: event.end, moved: false, colWidth });

    const onMove = (pe: PointerEvent) => {
      const cur = dragRef.current;
      if (!cur || pe.pointerId !== cur.pointerId) return;

      const dx = pe.clientX - cur.startX;
      const dy = pe.clientY - cur.startY;

      if (!cur.moved) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        cur.moved = true;
      }

      pe.preventDefault();

      const bodyEl = bodyRef.current;
      if (!bodyEl) return;

      const r = bodyEl.getBoundingClientRect();
      const width = (r.width - TIME_COL) / DAYS.length;
      if (width <= 0) return;

      const day = Math.max(0, Math.min(DAYS.length - 1, cur.origDay + Math.round(dx / width)));
      const duration = Math.min(cur.duration, MAX_END - START_HOUR);

      let start = snapToFiveMinutes(cur.origStart + dy / HOUR_HEIGHT);
      start = Math.max(START_HOUR, Math.min(MAX_END - duration, start));

      let end = snapToFiveMinutes(start + duration);
      if (end > MAX_END) {
        end = MAX_END;
        start = snapToFiveMinutes(end - duration);
      }
      if (end <= start) end = start + SNAP_STEP;

      cur.day = day;
      cur.start = start;
      cur.end = end;

      setDrag({ id: cur.id, day, start, end, moved: true, colWidth: width });
    };

    const finish = (pe: PointerEvent) => {
      const cur = dragRef.current;
      if (!cur || pe.pointerId !== cur.pointerId) return;

      dragRef.current = null;
      endDragListeners();

      if (cur.moved) {
        const { id, day, start, end } = cur;
        setEvents((prev) => prev.map((item) => (item.id === id ? { ...item, day, start, end } : item)));
      } else {
        setSelected(cur.event);
      }

      setDrag(null);
    };

    const cancel = (pe: PointerEvent) => {
      const cur = dragRef.current;
      if (!cur || pe.pointerId !== cur.pointerId) return;

      dragRef.current = null;
      endDragListeners();
      setDrag(null);
    };

    cleanupRef.current = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", cancel);
    };

    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", cancel);
  };

  const isDragging = Boolean(drag && drag.moved);

  return (
    <AppShell>
      <DateLine />

      <div className="page-bar">
        <PageTitle icon={<CalendarIcon size={24} />}>Jadwal minggu ini</PageTitle>
        <span className="hint">Klik untuk detail, drag untuk memindahkan</span>
      </div>

      <div className="card tt-wrap">
        <div className="tt">
          <div className="tt-head">
            <span style={{ display: "grid", placeItems: "center" }}>
              <ClockIcon size={22} />
            </span>
            {DAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div ref={bodyRef} className={cx("tt-body", isDragging && "is-dragging")}>
            {isDragging && (
              <div className="snap-layer" aria-hidden="true">
                {Array.from({ length: (MAX_END - START_HOUR) * 2 + 1 }).map((_, i) => (
                  <span
                    key={i}
                    className={cx("snap-line", i % 2 === 1 && "half")}
                    style={{ top: TOP_OFFSET + i * 0.5 * HOUR_HEIGHT }}
                  />
                ))}
              </div>
            )}

            <div className="tt-times">
              {HOURS.map((h) => (
                <span key={h} style={{ top: TOP_OFFSET + (h - START_HOUR) * HOUR_HEIGHT }}>
                  {pad2(h)}.00
                </span>
              ))}
            </div>

            {DAYS.map((day, dayIndex) => (
              <div key={day} className={cx("tt-col", isDragging && drag?.day === dayIndex && "drop-target")}>
                {events
                  .filter((e) => e.day === dayIndex)
                  .map((e) => {
                    const dragging = drag && drag.id === e.id && drag.moved ? drag : null;
                    const dx = dragging ? (dragging.day - e.day) * dragging.colWidth : 0;
                    const dy = dragging ? (dragging.start - e.start) * HOUR_HEIGHT : 0;
                    const label = dragging ? formatRange(dragging.start, dragging.end) : formatRange(e.start, e.end);

                    return (
                      <button
                        type="button"
                        key={e.id}
                        className={cx("ev", `c-${e.tone}`, dragging && "dragging")}
                        style={{
                          top: TOP_OFFSET + (e.start - START_HOUR) * HOUR_HEIGHT,
                          height: (e.end - e.start) * HOUR_HEIGHT,
                          transform: dragging ? `translate(${dx}px, ${dy}px)` : undefined,
                        }}
                        onPointerDown={(evt) => handlePointerDown(evt, e)}
                        onKeyDown={(evt) => {
                          if (evt.key === "Enter" || evt.key === " ") {
                            evt.preventDefault();
                            setSelected(e);
                          }
                        }}
                      >
                        <div>
                          <div className="name">{e.name}</div>
                          <div>{label}</div>
                          <div>{e.room}</div>
                          <div>Luring</div>
                        </div>
                        {e.task && (
                          <div className="tug">
                            <span>1 Tugas</span>
                            <i className={cx("dot", e.task)} />
                          </div>
                        )}
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <SectionTitle>Agenda lainnya</SectionTitle>
      {AGENDA.map((a) => (
        <div key={a.id} className="card agenda-card">
          <div className="meta-row title">
            <BookIcon size={16} />
            {a.title}
          </div>
          <div className="meta-row">
            <ClockIcon size={16} />
            {a.when}
          </div>
          <div className="meta-row">
            <PinIcon size={16} />
            {a.place}
          </div>
        </div>
      ))}

      {selected && (
        <div className="modal-bg" onClick={() => setSelected(null)}>
          <div className="modal" role="dialog" aria-modal="true" aria-label={selected.name} onClick={(e) => e.stopPropagation()}>
            <h3>{selected.name}</h3>
            <div className="meta-row">
              <ClockIcon size={20} />
              {formatRange(selected.start, selected.end)}
            </div>
            <div className="meta-row">
              <PinIcon size={20} />
              {selected.room}
            </div>
            <div className="meta-row">
              <Chip>Luring</Chip>
              {selected.task && <Chip>1 Tugas</Chip>}
            </div>
            <button className="btn btn-solid btn-block" onClick={() => setSelected(null)}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}