"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import AppShell from "../components/AppShell";
import {
  CalendarIcon,
  ClockIcon,
  EditIcon,
  FolderOpenIcon,
  ManageIcon,
  PlusIcon,
  SearchIcon,
  TasksIcon,
  TrashIcon,
} from "../components/icons";
import { Chip, DateLine, PageTitle, StatusPill } from "../components/ui";
import { LECTURERS, TASKS, type CategoryTone, type Materi, type Task, type TaskStatus, type TaskWeek } from "../lib/data";
import {
  DAYS,
  MAX_END,
  SCHEDULE_SEED,
  START_HOUR,
  formatRange,
  formatTime,
  parseClock,
  type ScheduleEvent,
  type ScheduleMode,
} from "../lib/schedule";
import { nextId, removeItem, resetData, saveItem, useMateri, useSchedule, useTasks } from "../lib/store";
import { cx } from "../lib/utils";
import AdminManagement from "./AdminManagement";

/* ---------- Konstanta ---------- */
type Kind = "schedule" | "tasks" | "materi";

const TABS: { key: Kind; label: string }[] = [
  { key: "schedule", label: "Jadwal" },
  { key: "tasks", label: "Tugas" },
  { key: "materi", label: "Materi" },
];

const NOUN: Record<Kind, string> = { schedule: "jadwal", tasks: "tugas", materi: "materi" };

const TONES: { value: CategoryTone; label: string }[] = [
  { value: "blue", label: "Biru" },
  { value: "peach", label: "Oranye" },
  { value: "pink", label: "Merah muda" },
  { value: "green", label: "Hijau" },
];

const uniqueOptions = (...lists: (string | undefined)[][]) => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const list of lists) {
    for (const raw of list) {
      const val = raw?.trim();
      if (val && !seen.has(val)) {
        seen.add(val);
        out.push(val);
      }
    }
  }
  return out;
};

const BASE_COURSES = uniqueOptions(
  TASKS.map((t) => t.course),
  SCHEDULE_SEED.map((s) => s.name)
);

const BASE_LECTURERS = uniqueOptions(Object.values(LECTURERS));

type Errors<T> = Partial<Record<keyof T, string>>;

/* ---------- Komponen bantu ---------- */
function useEscape(onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
}

/** State form: nilai disimpan sebagai string, `field()` menghasilkan props input */
function useDraft<T extends Record<string, string>>(initial: T) {
  const [draft, setDraft] = useState<T>(initial);
  const field = (key: keyof T & string, error?: string) => ({
    id: `mg-${key}`,
    value: draft[key],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setDraft((prev) => ({ ...prev, [key]: e.target.value }) as T),
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `mg-${key}-err` : undefined,
  });
  return [draft, field] as const;
}

function Field({
  name,
  label,
  error,
  hint,
  wide,
  children,
}: {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cx("form-field", wide && "wide")}>
      <label htmlFor={`mg-${name}`}>{label}</label>
      {children}
      {error ? (
        <p className="field-error" id={`mg-${name}-err`} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  );
}

function FormModal({
  title,
  submitLabel,
  onClose,
  onSubmit,
  children,
}: {
  title: string;
  submitLabel: string;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  children: ReactNode;
}) {
  useEscape(onClose);
  return (
    <div className="modal-bg">
      <form className="modal ann-modal mg-modal" role="dialog" aria-modal="true" aria-label={title} onSubmit={onSubmit} noValidate>
        <h3>{title}</h3>
        <div className="form-grid two">{children}</div>
        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Batal
          </button>
          <button type="submit" className="btn btn-solid">
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

function ConfirmModal({
  title,
  text,
  label,
  danger,
  onCancel,
  onConfirm,
}: {
  title: string;
  text: string;
  label: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEscape(onCancel);
  return (
    <div className="modal-bg" onClick={onCancel}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p className="modal-text">{text}</p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onCancel} autoFocus>
            Batal
          </button>
          <button className={cx("btn", danger ? "btn-danger" : "btn-solid")} onClick={onConfirm}>
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}

type RowProps = {
  icon: ReactNode;
  iconClass: string;
  title: string;
  meta: string;
  tags?: ReactNode;
  onEdit: () => void;
  onDelete: () => void;
};

function Row({ icon, iconClass, title, meta, tags, onEdit, onDelete }: RowProps) {
  return (
    <article className="card mg-row">
      <span className={`mg-ico ${iconClass}`}>{icon}</span>
      <div className="mg-info">
        <div className="mg-title">{title}</div>
        <div className="mg-meta">{meta}</div>
        {tags && <div className="mg-tags">{tags}</div>}
      </div>
      <div className="mg-actions">
        <button type="button" className="btn-ghost" aria-label={`Ubah ${title}`} title="Ubah" onClick={onEdit}>
          <EditIcon size={18} />
        </button>
        <button type="button" className="btn-ghost danger" aria-label={`Hapus ${title}`} title="Hapus" onClick={onDelete}>
          <TrashIcon size={18} />
        </button>
      </div>
    </article>
  );
}

type FormProps<T> = { item: T | null; onClose: () => void; onDone: (isEdit: boolean) => void };

/* ---------- Form jadwal ---------- */
type ScheduleDraft = {
  name: string;
  day: string;
  mode: string;
  start: string;
  end: string;
  room: string;
  tone: string;
  task: string;
};

const toInputTime = (t: number) => formatTime(t).replace(".", ":");
const fromInputTime = (v: string) => (v ? parseClock(v.replace(":", ".")) : NaN);

function ScheduleForm({ item, onClose, onDone }: FormProps<ScheduleEvent>) {
  const events = useSchedule();
  const courseOptions = uniqueOptions(BASE_COURSES, events.map((e) => e.name), [item?.name]);
  const [draft, field] = useDraft<ScheduleDraft>({
    name: item?.name ?? "",
    day: String(item?.day ?? 0),
    mode: item?.mode ?? "Luring",
    start: toInputTime(item?.start ?? 8),
    end: toInputTime(item?.end ?? 9 + 40 / 60),
    room: item?.room ?? "",
    tone: item?.tone ?? "blue",
    task: item?.task ?? "none",
  });
  const [errors, setErrors] = useState<Errors<ScheduleDraft>>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found: Errors<ScheduleDraft> = {};
    const day = Number(draft.day);
    const start = fromInputTime(draft.start);
    const end = fromInputTime(draft.end);

    if (!draft.name.trim()) found.name = "Mata kuliah wajib dipilih";
    if (!draft.room.trim()) found.room = "Ruang wajib diisi";

    if (Number.isNaN(start)) found.start = "Jam mulai wajib diisi";
    else if (start < START_HOUR) found.start = `Paling awal ${formatTime(START_HOUR)}`;

    if (Number.isNaN(end)) found.end = "Jam selesai wajib diisi";
    else if (end > MAX_END) found.end = `Paling akhir ${formatTime(MAX_END)}`;
    else if (!Number.isNaN(start) && end <= start) found.end = "Jam selesai harus setelah jam mulai";

    if (!found.start && !found.end) {
      const clash = events.find((o) => o.id !== item?.id && o.day === day && start < o.end - 1e-6 && end > o.start + 1e-6);
      if (clash) found.end = `Bentrok dengan ${clash.name} (${formatRange(clash.start, clash.end)})`;
    }

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    saveItem("schedule", {
      id: item?.id ?? `e${Date.now().toString(36)}`,
      day,
      name: draft.name.trim(),
      start,
      end,
      room: draft.room.trim(),
      mode: draft.mode as ScheduleMode,
      tone: draft.tone as CategoryTone,
      task: draft.task === "none" ? undefined : (draft.task as TaskStatus),
    });
    onDone(Boolean(item));
  };

  return (
    <FormModal title={item ? "Ubah jadwal" : "Tambah jadwal"} submitLabel={item ? "Simpan" : "Tambah"} onClose={onClose} onSubmit={submit}>
      <Field name="name" label="Mata kuliah" error={errors.name} wide>
        <select className="input" autoFocus {...field("name", errors.name)}>
          <option value="">Pilih mata kuliah</option>
          {courseOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      <Field name="day" label="Hari">
        <select className="input" {...field("day")}>
          {DAYS.map((d, i) => (
            <option key={d} value={i}>
              {d}
            </option>
          ))}
        </select>
      </Field>
      <Field name="mode" label="Mode kuliah">
        <select className="input" {...field("mode")}>
          <option value="Luring">Luring</option>
          <option value="Daring">Daring</option>
        </select>
      </Field>
      <Field name="start" label="Jam mulai" error={errors.start}>
        <input className="input" type="time" step={300} {...field("start", errors.start)} />
      </Field>
      <Field name="end" label="Jam selesai" error={errors.end}>
        <input className="input" type="time" step={300} {...field("end", errors.end)} />
      </Field>
      <Field name="room" label="Ruang" error={errors.room}>
        <input className="input" placeholder="Contoh: SAW - 04.06" {...field("room", errors.room)} />
      </Field>
      <Field name="tone" label="Warna">
        <select className="input" {...field("tone")}>
          {TONES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>
      <Field name="task" label="Penanda tugas" wide>
        <select className="input" {...field("task")}>
          <option value="none">Tidak ada tugas</option>
          <option value="bad">1 tugas, belum selesai</option>
          <option value="ok">1 tugas, sudah selesai</option>
        </select>
      </Field>
    </FormModal>
  );
}

/* ---------- Form tugas ---------- */
type TaskDraft = {
  title: string;
  course: string;
  dosen: string;
  opened: string;
  due: string;
  daysLeft: string;
  week: string;
  status: string;
  file: string;
};

function TaskForm({ item, onClose, onDone }: FormProps<Task>) {
  const tasks = useTasks();
  const schedule = useSchedule();
  const materi = useMateri();
  const courseOptions = uniqueOptions(
    BASE_COURSES,
    schedule.map((e) => e.name),
    tasks.map((t) => t.course),
    [item?.course]
  );
  const dosenOptions = uniqueOptions(
    BASE_LECTURERS,
    tasks.map((t) => t.dosen),
    materi.map((m) => m.dosen),
    [item?.dosen]
  );
  const [draft, field] = useDraft<TaskDraft>({
    title: item?.title ?? "",
    course: item?.course ?? "",
    dosen: item?.dosen ?? "",
    opened: item?.opened ?? "9 September 2026",
    due: item?.due ?? "",
    daysLeft: String(item?.daysLeft ?? 7),
    week: item?.week ?? "now",
    status: item?.status ?? "bad",
    file: item?.file ?? "",
  });
  const [errors, setErrors] = useState<Errors<TaskDraft>>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found: Errors<TaskDraft> = {};
    if (!draft.title.trim()) found.title = "Judul tugas wajib diisi";
    if (!draft.course.trim()) found.course = "Mata kuliah wajib dipilih";
    if (!draft.dosen.trim()) found.dosen = "Dosen wajib dipilih";
    if (!draft.opened.trim()) found.opened = "Tanggal dibuka wajib diisi";
    if (!draft.due.trim()) found.due = "Batas pengumpulan wajib diisi";
    if (!/^-?\d+$/.test(draft.daysLeft.trim())) found.daysLeft = "Isi dengan bilangan bulat";

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    saveItem("tasks", {
      id: item?.id ?? nextId(tasks),
      title: draft.title.trim(),
      course: draft.course.trim(),
      dosen: draft.dosen.trim(),
      opened: draft.opened.trim(),
      due: draft.due.trim(),
      daysLeft: Number(draft.daysLeft),
      file: draft.file.trim() || "Lampiran.pdf",
      status: draft.status as TaskStatus,
      week: draft.week as TaskWeek,
    });
    onDone(Boolean(item));
  };

  return (
    <FormModal title={item ? "Ubah tugas" : "Tambah tugas"} submitLabel={item ? "Simpan" : "Tambah"} onClose={onClose} onSubmit={submit}>
      <Field name="title" label="Judul tugas" error={errors.title} wide>
        <input className="input" autoFocus placeholder="Contoh: Latihan 1 - 5 Modul Matriks" {...field("title", errors.title)} />
      </Field>
      <Field name="course" label="Mata kuliah" error={errors.course}>
        <select className="input" {...field("course", errors.course)}>
          <option value="">Pilih mata kuliah</option>
          {courseOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      <Field name="dosen" label="Dosen" error={errors.dosen}>
        <select className="input" {...field("dosen", errors.dosen)}>
          <option value="">Pilih dosen</option>
          {dosenOptions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </Field>
      <Field name="opened" label="Dibuka" error={errors.opened} hint="Contoh: 9 September 2026">
        <input className="input" {...field("opened", errors.opened)} />
      </Field>
      <Field name="due" label="Batas pengumpulan" error={errors.due} hint="Contoh: Senin, 14 September">
        <input className="input" {...field("due", errors.due)} />
      </Field>
      <Field name="daysLeft" label="Sisa hari" error={errors.daysLeft}>
        <input className="input" inputMode="numeric" {...field("daysLeft", errors.daysLeft)} />
      </Field>
      <Field name="week" label="Kelompok">
        <select className="input" {...field("week")}>
          <option value="now">Minggu ini</option>
          <option value="next">Minggu depan</option>
        </select>
      </Field>
      <Field name="status" label="Status">
        <select className="input" {...field("status")}>
          <option value="bad">Belum</option>
          <option value="ok">Selesai</option>
        </select>
      </Field>
      <Field name="file" label="Nama berkas lampiran" hint="Kosongkan untuk memakai “Lampiran.pdf”">
        <input className="input" placeholder="Contoh: Soal_Matriks.pdf" {...field("file")} />
      </Field>
    </FormModal>
  );
}

/* ---------- Form materi ---------- */
type MateriDraft = { title: string; dosen: string; count: string };

function MateriForm({ item, onClose, onDone }: FormProps<Materi>) {
  const materi = useMateri();
  const tasks = useTasks();
  const dosenOptions = uniqueOptions(
    BASE_LECTURERS,
    tasks.map((t) => t.dosen),
    materi.map((m) => m.dosen),
    [item?.dosen]
  );
  const [draft, field] = useDraft<MateriDraft>({
    title: item?.title ?? "",
    dosen: item?.dosen ?? "",
    count: String(item?.count ?? 0),
  });
  const [errors, setErrors] = useState<Errors<MateriDraft>>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found: Errors<MateriDraft> = {};
    if (!draft.title.trim()) found.title = "Judul materi wajib diisi";
    if (!draft.dosen.trim()) found.dosen = "Dosen wajib dipilih";
    if (!/^\d+$/.test(draft.count.trim())) found.count = "Isi dengan bilangan bulat 0 atau lebih";

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    saveItem("materi", {
      id: item?.id ?? nextId(materi),
      title: draft.title.trim(),
      dosen: draft.dosen.trim(),
      count: Number(draft.count),
    });
    onDone(Boolean(item));
  };

  return (
    <FormModal title={item ? "Ubah materi" : "Tambah materi"} submitLabel={item ? "Simpan" : "Tambah"} onClose={onClose} onSubmit={submit}>
      <Field name="title" label="Judul materi" error={errors.title} wide>
        <input className="input" autoFocus placeholder="Contoh: Matematika - 12" {...field("title", errors.title)} />
      </Field>
      <Field name="dosen" label="Dosen" error={errors.dosen}>
        <select className="input" {...field("dosen", errors.dosen)}>
          <option value="">Pilih dosen</option>
          {dosenOptions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </Field>
      <Field name="count" label="Jumlah materi" error={errors.count}>
        <input className="input" inputMode="numeric" {...field("count", errors.count)} />
      </Field>
    </FormModal>
  );
}

/* ---------- Halaman ---------- */
type ConfirmState = { title: string; text: string; label: string; danger?: boolean; run: () => void };

/** Halaman Kelola data: CRUD jadwal, tugas, dan materi */
export default function KelolaPage() {
  const schedule = useSchedule();
  const tasks = useTasks();
  const materi = useMateri();

  const [tab, setTab] = useState<Kind>("schedule");
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState<{ kind: Kind; id: string | number | null } | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const closeEditor = () => setEditor(null);
  const done = (isEdit: boolean) => {
    setEditor(null);
    showToast(isEdit ? "Perubahan disimpan" : "Data ditambahkan");
  };

  const askDelete = (kind: Kind, id: string | number, label: string) =>
    setConfirm({
      title: "Hapus data?",
      text: `“${label}” akan dihapus dan tidak bisa dikembalikan.`,
      label: "Hapus",
      danger: true,
      run: () => {
        removeItem(kind, id);
        showToast("Data dihapus");
      },
    });

  const askReset = () =>
    setConfirm({
      title: "Kembalikan data contoh?",
      text: "Semua jadwal, tugas, dan materi akan dikembalikan ke data awal. Perubahanmu hilang.",
      label: "Kembalikan",
      danger: true,
      run: () => {
        resetData();
        showToast("Data dikembalikan ke contoh");
      },
    });

  const changeTab = (next: Kind) => {
    setTab(next);
    setQuery("");
  };

  /* ---------- Filter ---------- */
  const term = query.trim().toLowerCase();
  const match = (text: string) => !term || text.toLowerCase().includes(term);

  const scheduleRows = schedule
    .filter((e) => match(`${e.name} ${e.room} ${DAYS[e.day]}`))
    .sort((a, b) => a.day - b.day || a.start - b.start);
  const taskRows = tasks.filter((t) => match(`${t.title} ${t.course} ${t.dosen}`));
  const materiRows = materi.filter((m) => match(`${m.title} ${m.dosen}`));

  const count = tab === "schedule" ? scheduleRows.length : tab === "tasks" ? taskRows.length : materiRows.length;

  return (
    <AppShell>
      <DateLine />
      <PageTitle icon={<ManageIcon size={24} />}>Kelola data</PageTitle>
      <p className="hint">
        Tambah, ubah, dan hapus jadwal, tugas, dan materi. Perubahan tampil di seluruh halaman dan tersimpan di perangkat ini.
      </p>

      <AdminManagement />

      <div className="tabs" role="tablist" aria-label="Jenis data">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={cx("tab", tab === t.key && "on")}
            onClick={() => changeTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mg-bar">
        <div className="search">
          <SearchIcon size={22} />
          <input
            placeholder={`Cari ${NOUN[tab]}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={`Cari ${NOUN[tab]}`}
          />
        </div>
        <button className="btn btn-solid" onClick={() => setEditor({ kind: tab, id: null })}>
          <PlusIcon size={18} />
          Tambah {NOUN[tab]}
        </button>
      </div>

      <div className="group-head">
        <span>Daftar {NOUN[tab]}</span>
        <span className="count">{count} Data</span>
      </div>

      {count === 0 ? (
        <p className="empty">{term ? "Data tidak ditemukan" : `Belum ada data ${NOUN[tab]}`}</p>
      ) : (
        <div className="mg-grid">
          {tab === "schedule" &&
            scheduleRows.map((e) => (
              <Row
                key={e.id}
                icon={<CalendarIcon size={22} />}
                iconClass={`c-${e.tone}`}
                title={e.name}
                meta={`${DAYS[e.day]} · ${formatRange(e.start, e.end)} · ${e.room}`}
                tags={
                  <>
                    <Chip small>{e.mode}</Chip>
                    {e.task && (
                      <span className="with-ico muted">
                        <i className={cx("dot", e.task)} />1 Tugas
                      </span>
                    )}
                  </>
                }
                onEdit={() => setEditor({ kind: "schedule", id: e.id })}
                onDelete={() => askDelete("schedule", e.id, e.name)}
              />
            ))}

          {tab === "tasks" &&
            taskRows.map((t) => (
              <Row
                key={t.id}
                icon={<TasksIcon size={22} />}
                iconClass="tone-accent"
                title={t.title}
                meta={`${t.course} · ${t.dosen}`}
                tags={
                  <>
                    <StatusPill status={t.status} small />
                    <Chip small>{t.week === "now" ? "Minggu ini" : "Minggu depan"}</Chip>
                    <span className="with-ico muted">
                      <ClockIcon size={16} />
                      {t.due}
                    </span>
                  </>
                }
                onEdit={() => setEditor({ kind: "tasks", id: t.id })}
                onDelete={() => askDelete("tasks", t.id, t.title)}
              />
            ))}

          {tab === "materi" &&
            materiRows.map((m) => (
              <Row
                key={m.id}
                icon={<FolderOpenIcon size={22} />}
                iconClass="tone-accent"
                title={m.title}
                meta={m.dosen}
                tags={<Chip small>{m.count} Materi</Chip>}
                onEdit={() => setEditor({ kind: "materi", id: m.id })}
                onDelete={() => askDelete("materi", m.id, m.title)}
              />
            ))}
        </div>
      )}


      <div className="card mg-reset">
        <div className="set-text">
          <div className="set-title">Data contoh</div>
          <p className="set-desc">Kembalikan jadwal, tugas, dan materi ke data awal aplikasi.</p>
        </div>
        <button className="btn btn-outline" onClick={askReset}>
          Kembalikan data contoh
        </button>
      </div>

      {/* Form */}
      {editor?.kind === "schedule" && (
        <ScheduleForm
          key={String(editor.id ?? "new")}
          item={schedule.find((e) => e.id === editor.id) ?? null}
          onClose={closeEditor}
          onDone={done}
        />
      )}
      {editor?.kind === "tasks" && (
        <TaskForm
          key={String(editor.id ?? "new")}
          item={tasks.find((t) => t.id === editor.id) ?? null}
          onClose={closeEditor}
          onDone={done}
        />
      )}
      {editor?.kind === "materi" && (
        <MateriForm
          key={String(editor.id ?? "new")}
          item={materi.find((m) => m.id === editor.id) ?? null}
          onClose={closeEditor}
          onDone={done}
        />
      )}

      {confirm && (
        <ConfirmModal
          title={confirm.title}
          text={confirm.text}
          label={confirm.label}
          danger={confirm.danger}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            confirm.run();
            setConfirm(null);
          }}
        />
      )}

      <div className="sr-only" aria-live="polite">
        {toast}
      </div>
      {toast && (
        <div className="toast" aria-hidden>
          {toast}
        </div>
      )}
    </AppShell>
  );
}