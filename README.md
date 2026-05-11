# Arthomoro Jaya Sentosa — Studio & Galeri Patung

Full-stack website untuk **Arthomoro Jaya Sentosa**, studio dan galeri patung premium yang fokus pada pre-order custom.

> "Setiap Patung adalah Jiwa yang Dibekukan dalam Waktu"

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + custom dark-luxury theme (Playfair · Cormorant · Cinzel · Lato)
- **Framer Motion** — scroll reveals, micro-interactions
- **Radix UI** — tooltip, dialog, dropdown
- **Prisma** + **SQLite** — file-based DB, swappable to PostgreSQL
- **NextAuth.js v4** — credentials provider + JWT session
- **Zod** — validation
- **Sonner** — toast notifications

## Fitur

### Public Website
- Home (hero cinematic, stats, featured gallery, process, categories, testimonials, articles, CTA)
- Galeri (filter kategori/material/ukuran/sort/search) + detail karya
- Pre-Order Wizard 6-langkah dengan estimasi harga + durasi + WhatsApp deeplink
- Portofolio (filter tahun/kategori/tipe klien) + detail
- Artikel/Blog (filter kategori, search) + detail dengan related
- Tentang Kami (story timeline, visi-misi, tim, awards, klien, workshop map)
- Testimoni (filter kategori, badge verified)
- Kontak (form + info + map embed)
- Booking konsultasi
- Tombol WhatsApp floating
- Tooltips informatif di setiap field penting

### Admin Dashboard (`/admin`)
- Login dengan email/password (NextAuth)
- Role-based access control (Super Admin, Admin, Editor, Marketing, CS, Photographer, Viewer)
- Dashboard ringkasan + pipeline value
- CRUD Galeri, Artikel, Portofolio
- Approval & feature Testimoni
- Manajemen Pesan (inbox + status update + WA reply)
- Pipeline Pre-Order (10 status: Inquiry → Done)
- Manajemen Booking konsultasi
- Manajemen Pengguna + Roles
- Newsletter subscribers
- Analitik (top karya/artikel, funnel pesanan)
- Pengaturan sistem global

## Setup Lokal

```bash
cp .env.example .env
npm install
npm run db:push
npm run db:seed
npm run dev
```

Buka `http://localhost:3110`.

### Demo Login Admin

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `superadmin@arthomoro.id` | `superadmin123` |
| Admin | `admin@arthomoro.id` | `admin123` |
| Editor | `editor@arthomoro.id` | `editor123` |
| Marketing | `marketing@arthomoro.id` | `marketing123` |
| CS | `cs@arthomoro.id` | `cs123` |

## Deploy

Production di subpath nginx (`yourmoonkey.com/arthomoro-demo`). Lihat `scripts/deploy.sh` dan PM2 config.

## Skrip

- `npm run dev` — dev server di port 3110
- `npm run build` — production build (jalan prisma db push + next build)
- `npm start` — production server
- `npm run db:push` — push schema ke DB
- `npm run db:seed` — seed DB dengan data demo

## Lisensi

© Arthomoro Jaya Sentosa · Built by Moonkey Global Vision.
