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
  { k: "Jurusan", v: "Teknik Informatika" },
  { k: "Fakultas", v: "Vokasi" },
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
          <Link href="/profil/kartu" className="btn btn-outline">
            <DownloadIcon size={18} />
            Kartu Mahasiswa
          </Link>
        </div>
      </div>

      <StatGrid>
        {ACADEMIC_STATS.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </StatGrid>

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

        {/* Data mahasiswa satu kelas */}
        <section className="card prof-card" aria-labelledby="roster-title">
          <SectionTitle>
            <UserOutlineIcon size={20} />
            <span id="roster-title">Mahasiswa kelas {CLASS_NAME}</span>
            <span className="link-more muted">{CLASS_ROSTER.length} mahasiswa</span>
          </SectionTitle>

          <ul className="roster">
            {CLASS_ROSTER.map((s, i) => {
              const isMe = s.name === STUDENT_NAME;
              return (
                <li key={s.nrp} className={cx("roster-row", isMe && "me")}>
                  <span className="roster-no">{i + 1}</span>
                  <span className="roster-info">
                    <span className="roster-name">
                      {s.name}
                      {isMe && <span className="roster-me"> (Kamu)</span>}
                    </span>
                    <span className="roster-nrp">{s.nrp}</span>
                  </span>
                  {s.role !== "Anggota" ? (
                    <Chip small tone={ROLE_TONE[s.role]}>
                      {s.role}
                    </Chip>
                  ) : (
                    <span className="roster-member">Anggota</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}