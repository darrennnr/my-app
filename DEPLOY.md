# Panduan Deployment Portal Akademik di Linux VPS

Target: Ubuntu 22.04 / 24.04 LTS (atau Debian 12).

## 1. Persiapan Server

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx certbot python3-certbot-nginx build-essential
```

Install Node.js 20 LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # v20.x
npm -v
```

Install PM2:

```bash
sudo npm install -g pm2
```

## 2. Upload & Extract

```bash
# di server
sudo mkdir -p /var/www/portal-akademik
sudo chown $USER:$USER /var/www/portal-akademik
cd /var/www/portal-akademik

# upload ZIP lalu:
unzip portal-akademik-hosting.zip
cd portal-akademik   # atau nama folder hasil extract
```

## 3. Konfigurasi Environment

```bash
cp .env.example .env
nano .env
```

Isi minimal:

```
DATABASE_URL="file:./prod.db"
SESSION_SECRET="isi-string-acak-panjang-minimal-32-karakter-disini"
ADMIN_PASSWORD="PasswordAdminYangKuatDanUnik!"
NODE_ENV=production
```

Generate secret:

```bash
openssl rand -base64 48
```

## 4. Install Dependensi & Database

```bash
npm ci --omit=dev
# atau jika ci gagal:
npm install --omit=dev

npx prisma generate
npx prisma db push
npm run db:seed
```

Catat password admin yang muncul di output seed.

## 5. Build Production

```bash
npm run build
```

## 6. Jalankan dengan PM2

```bash
# ecosystem file sudah disertakan
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # ikuti perintah yang muncul
```

Cek:

```bash
pm2 status
pm2 logs portal-akademik
```

Aplikasi listen di `http://127.0.0.1:3000`.

## 7. Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/portal-akademik
```

Isi (ganti `domain-anda.com`):

```nginx
server {
    listen 80;
    server_name domain-anda.com www.domain-anda.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan:

```bash
sudo ln -s /etc/nginx/sites-available/portal-akademik /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 8. HTTPS (Let's Encrypt)

```bash
sudo certbot --nginx -d domain-anda.com -d www.domain-anda.com
```

## 9. Backup & Restore Database

Backup:

```bash
./scripts/backup-db.sh
# hasil di ./backups/portal-YYYYMMDD-HHMMSS.db
```

Restore:

```bash
./scripts/restore-db.sh ./backups/portal-YYYYMMDD-HHMMSS.db
pm2 restart portal-akademik
```

## 10. Update Aplikasi

```bash
cd /var/www/portal-akademik
# upload source baru / git pull
npm ci --omit=dev
npx prisma generate
npx prisma db push
npm run build
pm2 restart portal-akademik
```

## Akun Default (setelah seed)

| Role          | Email / NRP              | Password awal      |
|---------------|--------------------------|--------------------|
| Admin         | admin@portal.local       | (dari ADMIN_PASSWORD) |
| Ketua Kelas   | darren@student.local / 2411600014 | 2411600014     |
| Sekretaris    | citra@student.local / 2411600002  | 2411600002     |
| Bendahara     | salsa@student.local / 2411600015  | 2411600015     |

**Wajib ganti password setelah login pertama.**

## Troubleshooting

- `Error: SESSION_SECRET must be set` → cek `.env`
- Database locked → pastikan hanya satu proses yang akses SQLite, atau pindah ke PostgreSQL
- 502 Bad Gateway → `pm2 status` dan cek port 3000
- Build gagal memory → tambah swap: `sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile`
