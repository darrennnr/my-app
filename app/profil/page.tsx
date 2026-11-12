"use client";

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

const DATA = [
  { k: "NRP", v: "3124500012" },
  { k: "Nama Lengkap", v: "Darren Aditya Pratama" },
  { k: "Kelas", v: "TRI B 2026" },
  { k: "Program Studi", v: "Teknologi Rekayasa Informatika" },
  { k: "Jurusan", v: "Teknik Informatika" },
  { k: "Fakultas", v: "Vokasi" },
  { k: "Angkatan", v: "2026" },
  { k: "Semester", v: "1 (Satu)" },
  { k: "Dosen Wali", v: "Dra. Rini Satiti, M. Si" },
];

const KONTAK = [
  { k: "Email", v: "darren@student.ac.id" },
  { k: "No. HP", v: "+62 812 3456 7890" },
  { k: "Alamat", v: "Jl. Kampus No. 12, Surabaya" },
];

const LAINNYA = [
  { k: "Hobi", v: "Membaca, Badminton" },
  { k: "Organisasi", v: "Himpunan Mahasiswa Informatika" },
  { k: "Bahasa", v: "Indonesia, Inggris" },
  { k: "Media Sosial", v: "@darren.ap" },
];

const STATS = [
  { label: "IPK", value: "3.72" },
  { label: "SKS Lulus", value: "21" },
  { label: "Kehadiran", value: "96%" },
  { label: "Tugas Selesai", value: "24" },
];

/** Halaman profil mahasiswa */
export default function ProfilPage() {
  return (
    <AppShell>
      <p className="date-line">Kamis, 9 September 2026 - Minggu 3</p>
      <h2 className="page-title">
        <UserIcon size={30} />
        Profil
      </h2>

      <div className="card prof-hero">
        <div className="avatar" aria-hidden>
          D
        </div>
        <div className="who">
          <h2>Darren Aditya Pratama</h2>
          <div className="sub">3124500012 · TRI B 2026</div>
          <div className="chips">
            <span className="chip sm c-blue">Semester 1</span>
            <span className="chip sm c-green">Status: Aktif</span>
            <span className="chip sm">Teknologi Rekayasa Informatika</span>
          </div>
        </div>
        <div className="act-row">
          <button className="btn-sm black">
            <EditIcon size={18} />
            Edit Profil
          </button>
          <button className="btn-sm line">
            <DownloadIcon size={18} />
            Kartu Mahasiswa
          </button>
        </div>
      </div>

      <div className="prof-stats">
        {STATS.map((s) => (
          <div className="card stat" key={s.label}>
            <div className="top">
              <span>{s.label}</span>
            </div>
            <div className="num">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="prof-grid">
        <div className="card prof-card">
          <h3 className="section-title">
            <IdIcon size={20} />
            Data Mahasiswa
          </h3>
          {DATA.map((r) => (
            <div className="info-row" key={r.k}>
              <span className="k">{r.k}</span>
              <span className="v">{r.v}</span>
            </div>
          ))}
        </div>

        <div className="prof-col">
          <div className="card prof-card">
            <h3 className="section-title">
              <MailIcon size={20} />
              Kontak
            </h3>
            {KONTAK.map((r) => (
              <div className="info-row" key={r.k}>
                <span className="k">
                  {r.k === "Email" ? (
                    <MailIcon size={16} />
                  ) : r.k === "No. HP" ? (
                    <PhoneIcon size={16} />
                  ) : (
                    <MapPinIcon size={16} />
                  )}
                  {r.k}
                </span>
                <span className="v">{r.v}</span>
              </div>
            ))}
          </div>

          <div className="card prof-card">
            <h3 className="section-title">
              <BookIcon size={20} />
              Lainnya
            </h3>
            {LAINNYA.map((r) => (
              <div className="info-row" key={r.k}>
                <span className="k">{r.k}</span>
                <span className="v">{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}