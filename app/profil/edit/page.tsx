"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import AppShell from "../../components/AppShell";
import { ArrowLeftIcon, CameraIcon, CheckIcon, EditIcon, IdIcon, MailIcon } from "../../components/icons";
import { DateLine, PageTitle, SectionTitle } from "../../components/ui";
import { CLASS_NAME, STUDENT_NAME } from "../../lib/data";
import { PROFILE_DEFAULTS, STUDENT_NRP, STUDY_PROGRAM, type ProfileForm } from "../../lib/profile";
import { cx } from "../../lib/utils";

type Errors = Partial<Record<keyof ProfileForm, string>>;

type TextFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  wide?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
};

function TextField({ name, label, value, onChange, error, hint, disabled, wide, type = "text", autoComplete, inputMode }: TextFieldProps) {
  const errId = `${name}-err`;
  const hintId = `${name}-hint`;
  return (
    <div className={cx("form-field", wide && "wide")}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        className="input"
        type={type}
        value={value}
        disabled={disabled}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(e) => onChange?.(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : hint ? hintId : undefined}
      />
      {error ? (
        <p className="field-error" id={errId} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const validate = (form: ProfileForm): Errors => {
  const errors: Errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Format email tidak valid";
  if (!/^\+?[0-9\s-]{8,16}$/.test(form.phone.trim())) errors.phone = "Nomor HP tidak valid (8–16 digit)";
  if (!form.address.trim()) errors.address = "Alamat wajib diisi";
  return errors;
};

/** Halaman edit profil (data dummy: perubahan tidak disimpan permanen) */
export default function EditProfilPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>(PROFILE_DEFAULTS);
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const photoRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (photoRef.current) URL.revokeObjectURL(photoRef.current);
    };
  }, []);

  const set = (key: keyof ProfileForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

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
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length === 0) setSaved(true);
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

        <div className="prof-grid">
          <section className="card prof-card" aria-labelledby="edit-akademik">
            <SectionTitle>
              <IdIcon size={20} />
              <span id="edit-akademik">Data akademik</span>
            </SectionTitle>
            <div className="form-grid">
              <TextField name="nama" label="Nama lengkap" value={STUDENT_NAME} disabled hint="Diubah lewat bagian akademik." />
              <TextField name="nrp" label="NRP" value={STUDENT_NRP} disabled />
              <TextField name="kelas" label="Kelas" value={CLASS_NAME} disabled />
              <TextField name="prodi" label="Program studi" value={STUDY_PROGRAM} disabled />
            </div>
          </section>

          <section className="card prof-card" aria-labelledby="edit-kontak">
            <SectionTitle>
              <MailIcon size={20} />
              <span id="edit-kontak">Kontak & lainnya</span>
            </SectionTitle>
            <div className="form-grid">
              <TextField
                name="email"
                label="Email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
              />
              <TextField
                name="phone"
                label="No. HP"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={set("phone")}
                error={errors.phone}
              />
              <TextField
                name="address"
                label="Alamat"
                autoComplete="street-address"
                value={form.address}
                onChange={set("address")}
                error={errors.address}
              />
              <TextField name="hobby" label="Hobi" value={form.hobby} onChange={set("hobby")} />
              <TextField name="organization" label="Organisasi" value={form.organization} onChange={set("organization")} />
              <TextField name="languages" label="Bahasa" value={form.languages} onChange={set("languages")} />
              <TextField name="social" label="Media sosial" value={form.social} onChange={set("social")} />
            </div>
          </section>
        </div>

        <div className="form-actions">
          <Link href="/profil" className="btn btn-outline">
            Batal
          </Link>
          <button type="submit" className="btn btn-solid">
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