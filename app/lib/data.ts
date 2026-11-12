export type Status = "ok" | "bad";
export type Week = "now" | "next";

export type Task = {
  id: number;
  title: string;
  course: string;
  dosen: string;
  due: string;
  status: Status;
  week: Week;
};

const TITLE = "Mengerjakan Latihan 1 - 5 Modul Determinan dan Matriks";

export const TASKS: Task[] = [
  { id: 1, title: TITLE, course: "Matematika", dosen: "Dra. Rini Satiti, M. Si", due: "Senin, 14 September", status: "ok",  week: "now" },
  { id: 2, title: TITLE, course: "Matematika", dosen: "Dra. Rini Satiti, M. Si", due: "Senin, 14 September", status: "bad", week: "now" },
  { id: 3, title: TITLE, course: "Matematika", dosen: "Dra. Rini Satiti, M. Si", due: "Senin, 14 September", status: "ok",  week: "now" },
  { id: 4, title: TITLE, course: "Matematika", dosen: "Dra. Rini Satiti, M. Si", due: "Senin, 14 September", status: "ok",  week: "now" },
  { id: 5, title: TITLE, course: "Matematika", dosen: "Dra. Rini Satiti, M. Si", due: "Senin, 14 September", status: "bad", week: "now" },
  { id: 6, title: TITLE, course: "Matematika", dosen: "Dra. Rini Satiti, M. Si", due: "Senin, 14 September", status: "bad", week: "now" },
  { id: 7, title: TITLE, course: "Matematika", dosen: "Dra. Rini Satiti, M. Si", due: "Senin, 14 September", status: "bad", week: "next" },
];

export type Materi = { id: number; title: string; dosen: string; count: number };

export const MATERI: Materi[] = Array.from({ length: 11 }, (_, i) => ({
  id: i + 1,
  title: "Matematika - 1",
  dosen: "Dra. Rini Satiti, M. Si",
  count: 15,
}));