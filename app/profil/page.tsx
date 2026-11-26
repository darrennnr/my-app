"use client";

import Link from "next/link";
import AppShell from "../components/AppShell";
import { DownloadIcon, EditIcon, IdIcon, UserIcon, UserOutlineIcon } from "../components/icons";
import { Chip, DateLine, PageTitle, SectionTitle, StatCard, StatGrid } from "../components/ui";
import { ACADEMIC_STATS, CLASS_NAME, LECTURERS, SEMESTER, STUDENT_NAME } from "../lib/data";
import { CLASS_ROSTER, ROLE_TONE, getRole } from "../lib/kelas";
import { STUDENT_NRP, STUDY_PROGRAM } from "../lib/profile";
import { cx } from "../lib/utils";

type InfoItem = { k: string; v: string };

const DATA: InfoItem[] = [
  { k: "NRP", v: STUDENT_NRP },
  { k: "Nama Lengkap", v: STUDENT_NAME },
  { k: "Kelas", v: CLASS_NAME },
  { k: "Peran di Kelas", v: getRole(STUDENT_NAME) },
  { k: "Program Studi", v: STUDY_PROGRAM },
  { k: "Angkatan", v: "2026" },
  { k: "Semester", v: "1 (Satu)" },
  { k: "Dosen Wali", v: LECTURERS.math },
];

/** Halaman profil mahasiswa */
export default function ProfilPage() {
  return (
    <AppShell>
      <DateLine />
      <PageTitle icon={<UserIcon size={24} />}>Profil</PageTitle>

      <div className="card prof-hero">
        <div className="avatar" aria-hidden>
          {STUDENT_NAME.charAt(0)}
        </div>
        <div className="who">
          <h2>{STUDENT_NAME}</h2>
          <div className="sub">
            {STUDENT_NRP} · {CLASS_NAME}
          </div>
          <div className="meta-chips">
            <Chip small tone="blue">
              {SEMESTER}
            </Chip>
            <Chip small tone="green">
              Status: Aktif
            </Chip>
            <Chip small>{STUDY_PROGRAM}</Chip>
          </div>
        </div>
        <div className="act-row">
          <Link href="/profil/edit" className="btn btn-solid">
            <EditIcon size={18} />
            Edit Profil
          </Link>
        </div>
      </div>
      
      <div className="prof-grid">
        {/* Data mahasiswa */}
        <div className="card prof-card">
          <SectionTitle>
            <IdIcon size={20} />
            Data mahasiswa
          </SectionTitle>
          {DATA.map((row) => (
            <div className="info-row" key={row.k}>
              <span className="k">{row.k}</span>
              <span className="v">{row.v}</span>
            </div>
          ))}
        </div>


      </div>
    </AppShell>
  );
}