import { STUDENT_NAME } from "./data";
import { STUDENTS } from "./kas";
import type { CategoryTone } from "./data";

export type ClassRole = "Komting" | "Sekretaris" | "Bendahara" | "Anggota";

/** Peran pengurus kelas; nama yang tidak tercantum otomatis "Anggota" */
export const ROLE_BY_NAME: Record<string, ClassRole> = {
  [STUDENT_NAME]: "Komting",
  "Citra Dewi Lestari": "Sekretaris",
  "Salsabila Nurul": "Bendahara",
};

export const ROLE_TONE: Record<ClassRole, CategoryTone | undefined> = {
  Komting: "blue",
  Sekretaris: "peach",
  Bendahara: "green",
  Anggota: undefined,
};

const ROLE_ORDER: ClassRole[] = ["Komting", "Sekretaris", "Bendahara", "Anggota"];

export const getRole = (name: string): ClassRole => ROLE_BY_NAME[name] ?? "Anggota";

/** Seluruh mahasiswa satu kelas: pengurus di atas, sisanya urut abjad */
export const CLASS_ROSTER = STUDENTS.map((s) => ({ ...s, role: getRole(s.name) })).sort(
  (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role) || a.name.localeCompare(b.name, "id")
);