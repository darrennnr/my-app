"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import AppShell from "../components/AppShell";
import { BookIcon, CalendarIcon, ClockIcon, PinIcon } from "../components/icons";

type Ev = {
  id: string;
  day: number; // 0 = Senin
  name: string;
  start: number; // jam desimal
  end: number;
  label: string;
  room: string;
  color: "blue" | "peach" | "pink" | "green";
  tugas?: "ok" | "bad";
};

const START_HOUR = 7;
const MAX_END = 18;
const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

const HH = 78;
const TOP = 10;
const TIME_COL = 56;
const SNAP = 1 / 12; // 5 menit

const snap5 = (t: number) => Math.round(t * 12) / 12;

const formatTime = (t: number) => {
  const total = Math.round(t * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}.${String(m).padStart(2, "0")}`;
};

const EVENTS: Ev[] = [
  { id: "e1", day: 0, name: "Matematika", start: 8, end: 9.67, label: "08.00 - 09.40", room: "D4 - B 205", color: "blue", tugas: "ok" },
  { id: "e2", day: 0, name: "Sistem Digital", start: 10.5, end: 12.3, label: "10.30 - 12.10", room: "SAW - 10.08", color: "blue" },
  { id: "e3", day: 0, name: "Konsep Teknologi", start: 13, end: 15, label: "08.00 - 09.40", room: "D4 - B 205", color: "blue", tugas: "ok" },
  { id: "e4", day: 1, name: "Agama", start: 8, end: 9.67, label: "08.00 - 09.40", room: "SAW - 05.01", color: "peach" },
  { id: "e5", day: 1, name: "Pancasila", start: 11.33, end: 13.83, label: "11.20 - 13.50", room: "SC - 02", color: "peach", tugas: "bad" },
  { id: "e6", day: 1, name: "Praktikum Sistem Digital", start: 13.9, end: 15.5, label: "13.50 - 15.30", room: "JJ - 303", color: "peach", tugas: "ok" },
  { id: "e7", day: 2, name: "Praktikum Allgoritma & Pemrogramman", start: 13, end: 14.67, label: "13.00 - 14.40", room: "SAW 04.06", color: "pink", tugas: "ok" },
  { id: "e8", day: 2, name: "Praktikum Sistem Komunikasi", start: 14.75, end: 16.33, label: "14.40 - 16.20", room: "SAW 03.08", color: "pink", tugas: "bad" },
  { id: "e9", day: 3, name: "Workshop teknologi web dan Aplikasi", start: 8.83, end: 11.4, label: "08.50 - 11.20", room: "SAW- 04.06", color: "green", tugas: "ok" },
  { id: "e10", day: 3, name: "Algoritma dan Pemrogramman", start: 13.9, end: 15.6, label: "13.50 - 15.30", room: "A - 303", color: "green", tugas: "ok" },
  { id: "e11", day: 3, name: "Sistem Komunikasi", start: 15.7, end: 17.4, label: "15.30 - 17.10", room: "SAW - 06.06", color: "green" },
];

const OTHERS = [
  { title: "Agama", when: "Selasa, 14 September 2026 - 19.30 - 20.30", place: "Zoom ETHOL" },
  { title: "Technical Meeting LKMM-Pra TD", when: "Jum’at, 18 September 2026 - 19.30 - 20.30", place: "PAS Lantai 6" },
];

type DragData = {
  id: string;
  ev: Ev;
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
  colW: number;
};

/** Halaman 4 — Jadwal Minggu ini */
export default function JadwalPage() {
  const [events, setEvents] = useState<Ev[]>(() => EVENTS.map((e) => ({ ...e })));
  const [sel, setSel] = useState<Ev | null>(null);
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

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>, ev: Ev) => {
    if (dragRef.current) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    e.preventDefault();

    const body = bodyRef.current;
    const rect = body?.getBoundingClientRect();
    const colW = rect ? (rect.width - TIME_COL) / DAYS.length : 0;

    const d: DragData = {
      id: ev.id,
      ev,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origDay: ev.day,
      origStart: ev.start,
      duration: ev.end - ev.start,
      moved: false,
      day: ev.day,
      start: ev.start,
      end: ev.end,
    };

    dragRef.current = d;

    setDrag({
      id: ev.id,
      day: ev.day,
      start: ev.start,
      end: ev.end,
      moved: false,
      colW,
    });

    const onMove = (event: PointerEvent) => {
      const cur = dragRef.current;
      if (!cur || event.pointerId !== cur.pointerId) return;

      const dx = event.clientX - cur.startX;
      const dy = event.clientY - cur.startY;

      if (!cur.moved) {
        if (Math.hypot(dx, dy) < 5) return;
        cur.moved = true;
      }

      event.preventDefault();

      const bodyEl = bodyRef.current;
      if (!bodyEl) return;

      const r = bodyEl.getBoundingClientRect();
      const w = (r.width - TIME_COL) / DAYS.length;
      if (w <= 0) return;

      const day = Math.max(0, Math.min(DAYS.length - 1, cur.origDay + Math.round(dx / w)));
      const dur = Math.min(cur.duration, MAX_END - START_HOUR);

      let start = snap5(cur.origStart + dy / HH);
      start = Math.max(START_HOUR, Math.min(MAX_END - dur, start));

      let end = snap5(start + dur);
      if (end > MAX_END) {
        end = MAX_END;
        start = snap5(end - dur);
      }
      if (end <= start) end = start + SNAP;

      cur.day = day;
      cur.start = start;
      cur.end = end;

      setDrag({ id: cur.id, day, start, end, moved: true, colW: w });
    };

    const finish = (event: PointerEvent) => {
      const cur = dragRef.current;
      if (!cur || event.pointerId !== cur.pointerId) return;

      dragRef.current = null;
      endDragListeners();

      if (cur.moved) {
        const { id, day, start, end } = cur;
        setEvents((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, day, start, end, label: `${formatTime(start)} - ${formatTime(end)}` }
              : item
          )
        );
      } else {
        setSel(cur.ev);
      }

      setDrag(null);
    };

    const cancel = (event: PointerEvent) => {
      const cur = dragRef.current;
      if (!cur || event.pointerId !== cur.pointerId) return;

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

  return (
    <AppShell>
      <p className="date-line">Kamis, 9 September 2026 - Minggu 3</p>

      <div className="jadwal-head">
        <h2 className="page-title">
          <CalendarIcon size={30} />
          Jadwal Minggu ini
        </h2>
        <span className="hint">Klik untuk detail, drag untuk memindahkan</span>
      </div>

      <div className="card tt-wrap">
        <div className="tt">
          <div className="tt-head">
            <span style={{ display: "grid", placeItems: "center" }}>
              <ClockIcon size={22} />
            </span>
            {DAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div ref={bodyRef} className={`tt-body${drag && drag.moved ? " is-dragging" : ""}`}>
            {drag && drag.moved && (
              <div className="snap-layer" aria-hidden="true">
                {Array.from({ length: (MAX_END - START_HOUR) * 2 + 1 }).map((_, i) => {
                  const t = START_HOUR + i * 0.5;
                  return (
                    <span
                      key={i}
                      className={i % 2 === 0 ? "snap-line" : "snap-line half"}
                      style={{ top: TOP + (t - START_HOUR) * HH }}
                    />
                  );
                })}
              </div>
            )}

            <div className="tt-times">
              {HOURS.map((h) => (
                <span key={h} style={{ top: TOP + (h - START_HOUR) * HH }}>
                  {String(h).padStart(2, "0")}.00
                </span>
              ))}
            </div>

            {DAYS.map((_, di) => (
              <div
                className={`tt-col${drag && drag.moved && drag.day === di ? " drop-target" : ""}`}
                key={di}
              >
                {events
                  .filter((e) => e.day === di)
                  .map((e) => {
                    const dragging = drag && drag.id === e.id && drag.moved ? drag : null;
                    const dx = dragging ? (dragging.day - e.day) * dragging.colW : 0;
                    const dy = dragging ? (dragging.start - e.start) * HH : 0;
                    const label = dragging
                      ? `${formatTime(dragging.start)} - ${formatTime(dragging.end)}`
                      : e.label;

                    return (
                      <button
                        type="button"
                        key={e.id}
                        className={`ev c-${e.color}${dragging ? " dragging" : ""}`}
                        style={{
                          top: TOP + (e.start - START_HOUR) * HH,
                          height: (e.end - e.start) * HH,
                          transform: dragging ? `translate(${dx}px, ${dy}px)` : undefined,
                        }}
                        onPointerDown={(evt) => onPointerDown(evt, e)}
                        onKeyDown={(evt) => {
                          if (evt.key === "Enter" || evt.key === " ") {
                            evt.preventDefault();
                            setSel(e);
                          }
                        }}
                      >
                        <div>
                          <div className="name">{e.name}</div>
                          <div>{label}</div>
                          <div>{e.room}</div>
                          <div>Luring</div>
                        </div>
                        {e.tugas && (
                          <div className="tug">
                            <span>1 Tugas</span>
                            <i
                              style={{
                                background:
                                  e.tugas === "ok" ? "var(--ok-light)" : "var(--bad-light)",
                              }}
                            />
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

      <h3 className="section-title">Agenda Lainnya</h3>
      {OTHERS.map((o) => (
        <div key={o.title} className="card other-card">
          <div><BookIcon size={16} />{o.title}</div>
          <div><ClockIcon size={16} />{o.when}</div>
          <div><PinIcon size={16} />{o.place}</div>
        </div>
      ))}

      {sel && (
        <div className="modal-bg" onClick={() => setSel(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{sel.name}</h3>
            <div className="row"><ClockIcon size={20} />{sel.label}</div>
            <div className="row"><PinIcon size={20} />{sel.room}</div>
            <div className="row">
              <span className="chip">Luring</span>
              {sel.tugas && <span className="chip">1 Tugas</span>}
            </div>
            <button
              className="btn-black"
              style={{ height: 52, fontSize: 18, padding: 0 }}
              onClick={() => setSel(null)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}