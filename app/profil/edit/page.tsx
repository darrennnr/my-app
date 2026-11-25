"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import AppShell from "../../components/AppShell";
import { ArrowLeftIcon, CameraIcon, CheckIcon, EditIcon, IdIcon } from "../../components/icons";
import { DateLine, PageTitle, SectionTitle } from "../../components/ui";
import { CLASS_NAME, STUDENT_NAME } from "../../lib/data";
import { getRole } from "../../lib/kelas";
import { STUDENT_NRP, STUDY_PROGRAM } from "../../lib/profile";

function ReadonlyField({ name, label, value, hint }: { name: string; label: string; value: string; hint?: string }) {
  const hintId = `${name}-hint`;
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        className="input"
        value={value}
        disabled
        readOnly
        aria-describedby={hint ? hintId : undefined}
      />
      {hint && (
        <p className="field-hint" id={hintId}>
          {hint}
        </p>
      )}
    </div>
  );
}

/** Halaman edit profil (data dummy: perubahan tidak disimpan permanen) */
export default function EditProfilPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const photoRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (photoRef.current) URL.revokeObjectURL(photoRef.current);
    };
  }, []);

  const onPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (photoRef.current) URL.revokeObjectURL(photoRef.current);
    const url = URL.createObjectURL(file);
    photoRef.current = url;
    setPhoto(url);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (photo) setSaved(true);
  };

  return (
    <AppShell>
      <DateLine />

      <div className="page-head">
        <Link href="/profil" className="icon-back" aria-label="Kembali ke profil">
          <ArrowLeftIcon size={22} />
        </Link>
        <PageTitle icon={<EditIcon size={24} />}>Edit profil</PageTitle>
      </div>

      <form onSubmit={submit} noValidate>
        <div className="card prof-hero" style={{ marginBottom: "var(--sp-4)" }}>
          <div className="avatar">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {photo ? <img src={photo} alt="Foto profil baru" /> : <span aria-hidden>{STUDENT_NAME.charAt(0)}</span>}
          </div>
          <div className="who">
            <h2>{STUDENT_NAME}</h2>
            <div className="sub">Pratinjau foto hanya tampil di halaman ini (data dummy).</div>
          </div>
          <div className="act-row">
            <label className="btn btn-outline file-btn">
              <CameraIcon size={18} />
              Ganti foto
              <input type="file" accept="image/*" onChange={onPhoto} aria-label="Pilih foto profil" />
            </label>
          </div>
        </div>

        <section className="card prof-card" aria-labelledby="edit-akademik">
          <SectionTitle>
            <IdIcon size={20} />
            <span id="edit-akademik">Data akademik</span>
          </SectionTitle>
          <div className="form-grid two">
            <ReadonlyField name="nama" label="Nama lengkap" value={STUDENT_NAME} hint="Diubah lewat bagian akademik." />
            <ReadonlyField name="nrp" label="NRP" value={STUDENT_NRP} />
            <ReadonlyField name="kelas" label="Kelas" value={CLASS_NAME} />
            <ReadonlyField name="peran" label="Peran di kelas" value={getRole(STUDENT_NAME)} />
            <ReadonlyField name="prodi" label="Program studi" value={STUDY_PROGRAM} />
          </div>
        </section>

        <div className="form-actions">
          <Link href="/profil" className="btn btn-outline">
            Batal
          </Link>
          <button type="submit" className="btn btn-solid" disabled={!photo}>
            <CheckIcon size={18} />
            Simpan perubahan
          </button>
        </div>
      </form>

      {saved && (
        <div className="modal-bg" onClick={() => setSaved(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-label="Profil diperbarui" onClick={(e) => e.stopPropagation()}>
            <h3>Perubahan diterima</h3>
            <p className="modal-text">
              Karena ini masih data dummy, perubahan tidak disimpan permanen dan profilmu akan tampil seperti semula.
            </p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setSaved(false)}>
                Lanjut mengedit
              </button>
              <button className="btn btn-solid" onClick={() => router.push("/profil")}>
                Ke profil
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}