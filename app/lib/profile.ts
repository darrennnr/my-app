/* Data profil yang dipakai bersama oleh /profil, /profil/edit, /profil/kartu, dan /pengaturan */

export const STUDENT_NRP = "3124500012";
export const STUDY_PROGRAM = "Teknologi Rekayasa Informatika";
export const VALID_THRU = "31 Agustus 2030";

export type ProfileForm = {
  email: string;
  phone: string;
  address: string;
  hobby: string;
  organization: string;
  languages: string;
  social: string;
};

export const PROFILE_DEFAULTS: ProfileForm = {
  email: "darren@student.ac.id",
  phone: "+62 812 3456 7890",
  address: "Jl. Kampus No. 12, Surabaya",
  hobby: "Membaca, Badminton",
  organization: "Himpunan Mahasiswa Informatika",
  languages: "Indonesia, Inggris",
  social: "@darren.ap",
};