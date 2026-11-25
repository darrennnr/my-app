"use client";

import Link from "next/link";
import AppShell from "../components/AppShell";
import {
  BookIcon,
  DownloadIcon,
  EditIcon,
  IdIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "../components/icons";
import { Chip, DateLine, PageTitle, SectionTitle, StatCard, StatGrid } from "../components/ui";
import { ACADEMIC_STATS, CLASS_NAME, LECTURERS, SEMESTER, STUDENT_NAME } from "../lib/data";
import { PROFILE_DEFAULTS, STUDENT_NRP, STUDY_PROGRAM } from "../lib/profile";

type InfoItem = { k: string; v: string };

const DATA: InfoItem[] = [
  { k: "NRP", v: STUDENT_NRP },
  { k: "Nama Lengkap", v: STUDENT_NAME },
  { k: "Kelas", v: CLASS_NAME },
  { k: "Program Studi", v: STUDY_PROGRAM },
  { k: "Jurusan", v: "Teknik Informatika" },
  { k: "Fakultas", v: "Vokasi" },
  { k: "Angkatan", v: "2026" },
  { k: "Semester", v: "1 (Satu)" },
  { k: "Dosen Wali", v: LECTURERS.math },
];

const CONTACTS = [
  { k: "Email", v: PROFILE_DEFAULTS.email, Icon: MailIcon },
  { k: "No. HP", v: PROFILE_DEFAULTS.phone, Icon: PhoneIcon },
  { k: "Alamat", v: PROFILE_DEFAULTS.address, Icon: MapPinIcon },
];

const OTHERS: InfoItem[] = [
  { k: "Hobi", v: PROFILE_DEFAULTS.hobby },
  { k: "Organisasi", v: PROFILE_DEFAULTS.organization },
  { k: "Bahasa", v: PROFILE_DEFAULTS.languages },
  { k: "Media Sosial", v: PROFILE_DEFAULTS.social },
];

function InfoCard({ title, icon, items }: { title: string; icon: React.ReactNode; items: InfoItem[] }) {
  return (
    <div className="card prof-card">
      <SectionTitle>
        {icon}
        {title}
      </SectionTitle>
      {items.map((row) => (
        <div className="info-row" key={row.k}>
          <span className="k">{row.k}</span>
          <span className="v">{row.v}</span>
        </div>
      ))}
    </div>
  );
}

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
        <InfoCard title="Data mahasiswa" icon={<IdIcon size={20} />} items={DATA} />

        <div className="prof-col">
          <div className="card prof-card">
            <SectionTitle>
              <MailIcon size={20} />
              Kontak
            </SectionTitle>
            {CONTACTS.map(({ k, v, Icon }) => (
              <div className="info-row" key={k}>
                <span className="k">
                  <Icon size={16} />
                  {k}
                </span>
                <span className="v">{v}</span>
              </div>
            ))}
          </div>

          <InfoCard title="Lainnya" icon={<BookIcon size={20} />} items={OTHERS} />
        </div>
      </div>
    </AppShell>
  );
}