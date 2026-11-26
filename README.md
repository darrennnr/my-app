# Portal Akademik — TRI B 2026

Aplikasi manajemen kelas (jadwal, tugas, materi, kas, pengumuman, notifikasi, absensi, piket) dengan autentikasi dan RBAC.

## Stack

- Next.js 16 (App Router)
- Prisma + SQLite
- JWT session (jose) + bcrypt
- Tailwind CSS 4

## Development

```bash
cp .env.example .env
# edit SESSION_SECRET & ADMIN_PASSWORD

npm install
npx prisma db push
npm run db:seed
npm run dev
```

Buka http://localhost:3000

## Production

Lihat [DEPLOY.md](./DEPLOY.md) untuk panduan lengkap VPS (Nginx + PM2 + HTTPS).

## Laporan perubahan

Lihat [LAPORAN.md](./LAPORAN.md).
