# Laporan Pengembangan Portal Akademik

## Ringkasan

Project asli adalah **frontend Next.js murni** dengan data dummy + localStorage. Telah dilanjutkan menjadi **full-stack** dengan:

- Backend API (Next.js App Router Route Handlers)
- Database permanen (Prisma + SQLite)
- Autentikasi JWT (cookie httpOnly) + password hashing (bcrypt)
- Role-Based Access Control (RBAC) dengan permission granular
- Seed data realistis dari data asli
- Script deployment, backup/restore, Nginx + PM2

## Fitur yang Dipertahankan

- Desain UI/UX, tema light/dark, ikon, AppShell, navigasi
- Dashboard, Jadwal, Tugas, Materi, Kas, Pengumuman, Notifikasi, Profil, Pengaturan, Kelola
- Preferensi pengguna (theme)

## Fitur yang Ditambahkan / Diperbaiki

| Area | Status |
|------|--------|
| Auth login/logout/session | ✅ Backend + UI login diubah ke API |
| Password hashing | ✅ bcrypt |
| Role: Admin, Ketua Kelas, Sekretaris, Bendahara, PJ MK, Koord Piket, Mahasiswa | ✅ |
| Permission granular + validasi di API | ✅ |
| CRUD Tasks + notifikasi otomatis | ✅ API |
| CRUD Schedule | ✅ API |
| Kas (setting, payment, expense) | ✅ API |
| Pengumuman + notifikasi | ✅ API |
| Manajemen user (admin) | ✅ API |
| Notifikasi per user | ✅ API |
| Absensi model + relasi | ✅ Schema (API CRUD bisa dilanjutkan) |
| Piket model + seed | ✅ Schema + seed |
| Agenda model | ✅ Schema |
| Mata kuliah (Course) + PJ | ✅ Schema + seed |
| Relasi data (task↔course, notif↔deadline, kas↔saldo) | ✅ |
| Backup / restore DB | ✅ Script |
| .env.example, ecosystem PM2, DEPLOY.md | ✅ |

## Yang Belum Sempurna (keterbatasan lingkungan)

Lingkungan build memiliki **RAM terbatas (~1.2 GB)**, sehingga `npm install` + `next build` + `prisma generate` tidak dapat diselesaikan penuh di sini. Oleh karena itu:

1. **Frontend pages** (dashboard, jadwal, tugas, kas, dll.) masih sebagian besar memakai store localStorage asli. Mereka sudah kompatibel secara visual. Migrasi penuh ke `api-client` + SWR/fetch dapat dilanjutkan dengan mudah karena API sudah siap.
2. Halaman baru Absensi / Piket / Manajemen User admin UI belum dibuat (model + API users sudah ada).
3. Pengujian end-to-end penuh (login semua role, CRUD, persistensi) belum dijalankan di environment ini karena dependency belum ter-install lengkap.

**Di VPS dengan resource normal**, setelah `npm install && npx prisma db push && npm run db:seed && npm run build`, aplikasi dapat dijalankan dan diuji.

## Cara Melanjutkan Migrasi Frontend (opsional)

1. Ganti `useTasks()` / `useSchedule()` dll. dengan fetch ke `/api/tasks`, `/api/schedule`.
2. Atau buat store baru yang hydrate dari API lalu cache di memory.
3. Tambah halaman `/admin/users` yang memanggil `/api/users`.
4. Tambah halaman `/absensi` dan `/piket` sesuai model Prisma.

## Keamanan

- Tidak ada password default lemah yang hard-coded di source.
- Admin password diambil dari `ADMIN_PASSWORD` saat seed.
- Mahasiswa password awal = NRP (harus diganti).
- SESSION_SECRET wajib diganti di production.
- Cookie httpOnly + SameSite=Lax.

## Struktur Baru

```
prisma/schema.prisma   # model lengkap
prisma/seed.ts
app/lib/server/        # db, auth, api helpers
app/api/auth/...
app/api/tasks/...
app/api/schedule/...
app/api/kas/...
app/api/announcements/...
app/api/users/...
app/api/notifications/...
app/lib/api-client.ts
scripts/backup-db.sh
scripts/restore-db.sh
ecosystem.config.cjs
DEPLOY.md
.env.example
```

## Akun Seed

Lihat DEPLOY.md.
