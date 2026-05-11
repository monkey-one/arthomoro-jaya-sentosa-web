import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const PERMISSIONS_ALL = [
  'galeri:view','galeri:create','galeri:edit','galeri:delete','galeri:publish','galeri:feature',
  'artikel:view','artikel:create','artikel:edit','artikel:delete','artikel:publish','artikel:manage_category',
  'portofolio:view','portofolio:create','portofolio:edit','portofolio:delete','portofolio:feature',
  'order:view','order:edit_status','order:update_progress','order:upload_photos','order:send_notification','order:generate_quotation','order:delete',
  'pesan:view','pesan:reply','pesan:assign','pesan:delete',
  'testimoni:view','testimoni:approve','testimoni:edit','testimoni:delete',
  'booking:view','booking:edit','booking:delete',
  'user:view','user:create','user:edit','user:delete','role:manage','permission:manage',
  'setting:view','setting:edit_general','setting:edit_seo','setting:edit_integration','setting:edit_email',
  'analytics:view','analytics:export',
]

const ROLE_DEFS: Record<string,{description:string; permissions:string[]}> = {
  'Super Admin': { description: 'Akses penuh ke semua fitur termasuk pengaturan sistem dan role management', permissions: PERMISSIONS_ALL },
  'Admin': { description: 'Akses penuh kecuali pengaturan sistem dan hapus Super Admin', permissions: PERMISSIONS_ALL.filter(p => !['user:delete','role:manage','permission:manage'].includes(p)) },
  'Editor': { description: 'Kelola konten: galeri, artikel, testimoni, portofolio', permissions: PERMISSIONS_ALL.filter(p => p.startsWith('galeri:')||p.startsWith('artikel:')||p.startsWith('portofolio:')||p.startsWith('testimoni:')) },
  'Marketing': { description: 'Analitik, testimoni, sosmed, newsletter', permissions: ['analytics:view','analytics:export','testimoni:view','testimoni:approve','testimoni:edit','artikel:view','setting:view'] },
  'CS': { description: 'Customer service: pesan, order, booking', permissions: ['pesan:view','pesan:reply','pesan:assign','order:view','order:edit_status','order:update_progress','booking:view','booking:edit'] },
  'Photographer': { description: 'Upload foto ke galeri (butuh approval)', permissions: ['galeri:view','galeri:create'] },
  'Viewer': { description: 'Read-only access laporan & data', permissions: PERMISSIONS_ALL.filter(p => p.endsWith(':view')) },
}

const UNSPLASH = (q: string, w = 1200, h = 1600, sig = 1) => `https://images.unsplash.com/photo-${q}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

// Curated sculpture / craftsmanship photos from Unsplash
const SCULPTURE_IMAGES = [
  '1582461683670-69b2c1ef5e89', // marble bust
  '1577083287083-f3e2bf8f3a32', // gallery sculpture
  '1565060169187-5284992f1934', // bronze figure
  '1578926375605-b8c6b6e8a5e3', // wood carving
  '1547333590-47fae5f58d21', // hands sculpting
  '1547333590-47fae5f58d21',
  '1578307744037-fe22a7716fea',
  '1532601224476-15c79f2f7a51',
  '1583521214690-73421a1829a9',
  '1565060169123-49a5d20fcc0c',
  '1532619675605-1ede6c2ed2b0',
  '1578307744037-fe22a7716fea',
]

function img(i: number, w=1200, h=1500) {
  const id = SCULPTURE_IMAGES[i % SCULPTURE_IMAGES.length]
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`
}

async function main() {
  console.log('🌱 Seeding database…')

  // Clean tables (idempotent reseed)
  await prisma.auditLog.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.preOrder.deleteMany()
  await prisma.inquiry.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.project.deleteMany()
  await prisma.article.deleteMany()
  await prisma.artwork.deleteMany()
  await prisma.subscriber.deleteMany()
  await prisma.setting.deleteMany()
  await prisma.user.deleteMany()
  await prisma.role.deleteMany()

  // Roles
  const roles: Record<string, string> = {}
  for (const [name, def] of Object.entries(ROLE_DEFS)) {
    const r = await prisma.role.create({
      data: { name, description: def.description, permissions: JSON.stringify(def.permissions) },
    })
    roles[name] = r.id
  }

  // Users
  const hash = (p: string) => bcrypt.hashSync(p, 10)
  const users = [
    { name: 'Super Admin', email: 'superadmin@arthomoro.id', password: hash('superadmin123'), roleId: roles['Super Admin'] },
    { name: 'Pak Bambang', email: 'admin@arthomoro.id', password: hash('admin123'), roleId: roles['Admin'] },
    { name: 'Tim Konten', email: 'editor@arthomoro.id', password: hash('editor123'), roleId: roles['Editor'] },
    { name: 'Tim Pemasaran', email: 'marketing@arthomoro.id', password: hash('marketing123'), roleId: roles['Marketing'] },
    { name: 'CS Lina', email: 'cs@arthomoro.id', password: hash('cs123'), roleId: roles['CS'] },
  ]
  for (const u of users) await prisma.user.create({ data: u })

  // Settings
  const settings = [
    { key: 'site_name', value: 'Arthomoro Jaya Sentosa' },
    { key: 'tagline', value: 'Setiap Patung adalah Jiwa yang Dibekukan dalam Waktu' },
    { key: 'wa_number', value: '6281234567890' },
    { key: 'email', value: 'hello@arthomoro.id' },
    { key: 'phone', value: '+62 812 3456 7890' },
    { key: 'address', value: 'Jl. Seni Patung No. 88, Yogyakarta, Indonesia' },
    { key: 'maps_query', value: 'Yogyakarta+Indonesia' },
    { key: 'hours', value: 'Senin–Sabtu: 09.00–17.00 WIB · Minggu: dengan janji temu' },
    { key: 'instagram', value: 'https://instagram.com/arthomorojayasentosa' },
    { key: 'facebook', value: 'https://facebook.com/arthomorojayasentosa' },
    { key: 'youtube', value: 'https://youtube.com/@arthomorojayasentosa' },
    { key: 'tiktok', value: 'https://tiktok.com/@arthomorojayasentosa' },
    { key: 'pinterest', value: 'https://pinterest.com/arthomorojayasentosa' },
    { key: 'stat_works', value: '500' },
    { key: 'stat_years', value: '15' },
    { key: 'stat_cities', value: '12' },
    { key: 'stat_satisfaction', value: '98' },
    { key: 'min_dp_percent', value: '30' },
    { key: 'max_revisions', value: '3' },
  ]
  for (const s of settings) await prisma.setting.create({ data: s })

  // Artworks
  const CATEGORIES = ['Patung Wajah','Patung Figur','Patung Abstrak','Patung Monumental','Relief','Patung Hewan']
  const MATERIALS  = ['Marmer','Perunggu','Kayu','Resin','Granit','Mixed Media']
  const STYLES     = ['Realis','Abstrak','Klasik','Modern','Tradisional']
  const SIZES      = ['Miniatur','Meja','Manusia','Monumental']
  const PRICES: Record<string,[number,number]> = {
    'Patung Wajah':       [8_500_000, 65_000_000],
    'Patung Figur':       [15_000_000, 120_000_000],
    'Patung Abstrak':     [12_000_000, 95_000_000],
    'Patung Monumental':  [180_000_000, 1_500_000_000],
    'Relief':             [9_500_000, 75_000_000],
    'Patung Hewan':       [11_000_000, 88_000_000],
  }
  const TITLES = [
    'Sang Bayu','Kuda Larasati','Wajah Ibu Pertiwi','Garuda Wisesa','Relief Mahabharata',
    'Pelukan Senja','Bentuk Sunyi','Sayap Abadi','Sang Petani','Pendekar Tanah',
    'Ibu dan Anak','Resah','Tarian Hujan','Wajah Pak Soedirman','Naga Air',
    'Sangkakala','Penjaga Pintu','Kembara','Patung Garuda Pancasila','Wajah Tokoh Bangsa',
  ]
  for (let i=0;i<TITLES.length;i++) {
    const cat = CATEGORIES[i % CATEGORIES.length]
    const mat = MATERIALS[i % MATERIALS.length]
    const style = STYLES[i % STYLES.length]
    const size = SIZES[i % SIZES.length]
    const [pmin,pmax] = PRICES[cat]
    const title = TITLES[i]
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') + '-' + (i+1)
    await prisma.artwork.create({
      data: {
        slug, title,
        description: `${title} adalah karya ${style.toLowerCase()} dari material ${mat.toLowerCase()} dengan detil tinggi dan finishing tangan oleh pengrajin senior. Cocok untuk koleksi pribadi maupun ruang publik, dapat dipesan dengan ukuran serupa.`,
        artist: 'Pengrajin Arthomoro',
        material: mat, category: cat, style, sizeLabel: size,
        height: ['45 cm','120 cm','180 cm','250 cm'][i%4],
        width: ['30 cm','60 cm','90 cm','120 cm'][i%4],
        depth: ['25 cm','40 cm','60 cm','80 cm'][i%4],
        weight: ['8 kg','35 kg','110 kg','280 kg'][i%4],
        year: 2018 + (i % 7),
        status: i % 5 === 0 ? 'SOLD' : 'AVAILABLE_PREORDER',
        priceRangeMin: pmin, priceRangeMax: pmax,
        productionWeeks: 4 + (i % 8),
        tags: JSON.stringify([cat.replace('Patung ',''), mat, style]),
        coverImage: img(i),
        images: JSON.stringify([img(i), img(i+1), img(i+2)]),
        featured: i < 6,
        published: true,
        views: 50 + i*7,
        likes: 5 + i,
      },
    })
  }

  // Articles
  const ARTICLES = [
    { title: 'Panduan Memesan Patung Custom: Dari Konsultasi hingga Serah Terima', cat: 'Panduan Pre-Order' },
    { title: 'Mengenal 5 Material Utama dalam Pembuatan Patung Premium', cat: 'Material Patung' },
    { title: 'Cara Merawat Patung Marmer agar Tahan Puluhan Tahun', cat: 'Tips Merawat' },
    { title: 'Behind the Scenes: Proses Pembuatan Patung Wajah dari Foto', cat: 'Behind the Scenes' },
    { title: 'Inspirasi Dekorasi Ruang Tamu dengan Patung Abstrak', cat: 'Inspirasi Dekorasi' },
    { title: 'Memilih Patung sebagai Hadiah Pernikahan yang Berkesan', cat: 'Panduan Hadiah' },
    { title: 'Sejarah Singkat Seni Patung Indonesia: Dari Klasik ke Modern', cat: 'Sejarah Seni' },
  ]
  for (let i=0;i<ARTICLES.length;i++) {
    const a = ARTICLES[i]
    const slug = a.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
    await prisma.article.create({
      data: {
        slug,
        title: a.title,
        excerpt: 'Pelajari secara lengkap proses, pilihan material, hingga tips memilih patung yang tepat. Disusun langsung oleh tim pengrajin Arthomoro Jaya Sentosa.',
        content: `<p>${a.title} adalah panduan komprehensif yang kami susun berdasarkan pengalaman lebih dari 15 tahun di industri patung custom.</p>
<h2>Mengapa hal ini penting?</h2>
<p>Karya patung adalah investasi seni jangka panjang. Memahami proses, material, dan perawatan yang tepat memastikan karya Anda bertahan lintas generasi.</p>
<h2>Langkah-Langkah Utama</h2>
<ol><li>Tentukan kebutuhan dan tujuan karya.</li><li>Konsultasikan dengan tim pengrajin kami.</li><li>Pilih material dan finishing yang sesuai.</li><li>Pantau proses melalui dashboard klien kami.</li></ol>
<blockquote>"Setiap karya kami buat dengan keahlian tangan dan ketulusan." — Tim Arthomoro</blockquote>
<p>Untuk konsultasi gratis, silakan hubungi tim kami melalui WhatsApp atau form di halaman kontak.</p>`,
        category: a.cat,
        tags: JSON.stringify([a.cat, 'Arthomoro', 'Sculpture']),
        coverImage: img(i+3),
        author: 'Tim Arthomoro',
        readMinutes: 6 + (i % 4),
        published: true,
        publishedAt: new Date(Date.now() - i * 86400000 * 5),
        views: 120 + i*43,
      },
    })
  }

  // Projects
  const PROJECTS = [
    { title: 'Monumen Pahlawan Kemerdekaan', client: 'Pemkot Yogyakarta', clientType: 'Pemerintah', city: 'Yogyakarta', cat: 'Monumental', material: 'Perunggu', year: 2023 },
    { title: 'Patung Bust Direktur Utama', client: 'PT Bumi Sejahtera', clientType: 'Swasta', city: 'Jakarta', cat: 'Wajah', material: 'Marmer', year: 2024 },
    { title: 'Relief Sejarah Universitas', client: 'Universitas Gadjah Mada', clientType: 'Pemerintah', city: 'Yogyakarta', cat: 'Relief', material: 'Granit', year: 2023 },
    { title: 'Patung Garuda Hotel Bintang 5', client: 'Hotel Krakatau', clientType: 'Swasta', city: 'Bali', cat: 'Hewan', material: 'Perunggu', year: 2022 },
    { title: 'Patung Memorial Keluarga', client: 'Keluarga Wijaya', clientType: 'Personal', city: 'Surabaya', cat: 'Figur', material: 'Marmer', year: 2024 },
    { title: 'Instalasi Patung Abstrak Plaza', client: 'Plaza Senayan', clientType: 'Swasta', city: 'Jakarta', cat: 'Abstrak', material: 'Mixed Media', year: 2023 },
  ]
  for (let i=0;i<PROJECTS.length;i++) {
    const p = PROJECTS[i]
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
    await prisma.project.create({
      data: {
        slug, title: p.title, client: p.client, clientType: p.clientType,
        location: p.city, year: p.year, category: p.cat, material: p.material,
        dimensions: ['T 3.5m × L 1.8m','T 65cm × L 45cm','T 4m × P 12m','T 2.8m × L 1.2m','T 1.7m × L 0.9m','T 5m × L 2.5m'][i],
        description: `${p.title} merupakan proyek ${p.cat.toLowerCase()} dari ${p.material.toLowerCase()} yang dikerjakan untuk ${p.client} di ${p.city}. Proyek ini mencakup riset desain, modeling, casting, hingga instalasi on-site.`,
        challenge: 'Tantangan utamanya adalah memastikan proporsi dan ekspresi karya sesuai keinginan klien dalam waktu produksi yang ditentukan.',
        solution: 'Tim kami menggunakan pendekatan iteratif: maket 3D digital, modeling tanah liat, dan revisi terkontrol hingga klien menyetujui sebelum casting final.',
        duration: ['8 bulan','3 bulan','6 bulan','4 bulan','3 bulan','5 bulan'][i],
        coverImage: img(i+2),
        images: JSON.stringify([img(i+2), img(i+3), img(i+4), img(i+5)]),
        featured: i < 3,
        published: true,
      },
    })
  }

  // Testimonials
  const TESTI = [
    { name: 'Bapak Hartono', position: 'Direktur Utama', city: 'Jakarta', message: 'Pelayanan Arthomoro sangat profesional. Patung bust ayah saya selesai persis seperti yang saya bayangkan. Detail wajahnya luar biasa hidup.', cat: 'Patung Wajah', verified: true },
    { name: 'Ibu Sari Wijaya', position: 'Pemilik Galeri', city: 'Surabaya', message: 'Saya memesan patung memorial untuk keluarga, hasilnya sangat memuaskan. Proses komunikasi pun lancar dari awal hingga serah terima.', cat: 'Patung Figur', verified: true },
    { name: 'Pak Anwar', position: 'Kepala Bagian Umum Pemkot', city: 'Yogyakarta', message: 'Patung monumen kami selesai tepat waktu dengan kualitas yang sangat baik. Tim Arthomoro juga membantu instalasi di lokasi.', cat: 'Monumental', verified: true },
    { name: 'Ardi Pratama', position: 'Kolektor Seni', city: 'Bandung', message: 'Karya-karya Arthomoro punya jiwa. Saya sudah koleksi 3 patung dan setiap kali takjub dengan kerajinan tangannya.', cat: 'Abstrak', verified: false },
    { name: 'Ibu Lina', position: 'Interior Designer', city: 'Bali', message: 'Patung dekorasi yang saya pesan untuk klien hotel sangat eye-catching. Banyak tamu yang bertanya tentang karyanya.', cat: 'Hewan', verified: true },
  ]
  for (let i=0;i<TESTI.length;i++) {
    const t = TESTI[i]
    await prisma.testimonial.create({
      data: { name: t.name, position: t.position, city: t.city, rating: 5, message: t.message, category: t.cat, verifiedOrder: t.verified, featured: i < 3, status: 'APPROVED' },
    })
  }

  // Sample inquiries
  await prisma.inquiry.createMany({
    data: [
      { name: 'Budi Santoso', email: 'budi@example.com', whatsapp: '081234567001', purpose: 'Pesan Patung Custom', interest: 'Patung Wajah', budget: '20-50 juta', message: 'Saya ingin memesan patung bust untuk hadiah ulang tahun ayah saya yang ke-70.', status: 'NEW' },
      { name: 'Siti Aminah', email: 'siti@example.com', whatsapp: '081234567002', purpose: 'Tanya Harga', interest: 'Relief', budget: '50-100 juta', message: 'Apakah bisa dibuat relief sejarah untuk dinding lobby kantor kami?', status: 'IN_PROGRESS' },
    ]
  })

  // Sample pre-orders
  await prisma.preOrder.createMany({
    data: [
      { code: 'AJS-PO-001', customerName: 'Pak Hendro', customerEmail: 'hendro@example.com', customerWa: '081234567010', sculptureType: 'Patung Wajah', material: 'Marmer', sizeLabel: 'Meja', heightCm: 60, finishing: 'Matte', installation: false, estimateMin: 25_000_000, estimateMax: 35_000_000, estimateWeeks: 6, status: 'PRODUCTION', dpPercent: 50, paymentStatus: 'DP_PAID' },
      { code: 'AJS-PO-002', customerName: 'Hotel Ananda', customerEmail: 'order@hotelananda.id', customerWa: '081234567011', sculptureType: 'Patung Abstrak', material: 'Perunggu', sizeLabel: 'Manusia', heightCm: 180, finishing: 'Patina', installation: true, installAddress: 'Lobby Hotel Ananda, Bali', estimateMin: 150_000_000, estimateMax: 200_000_000, estimateWeeks: 12, status: 'QUOTED', dpPercent: 30, paymentStatus: 'UNPAID' },
      { code: 'AJS-PO-003', customerName: 'Ibu Diah', customerEmail: 'diah@example.com', customerWa: '081234567012', sculptureType: 'Relief', material: 'Granit', sizeLabel: 'Manusia', heightCm: 200, finishing: 'Gloss', installation: true, estimateMin: 60_000_000, estimateMax: 90_000_000, estimateWeeks: 10, status: 'CONSULT', dpPercent: 0, paymentStatus: 'UNPAID' },
    ]
  })

  // Bookings
  const nextDate = (d:number) => new Date(Date.now() + d*86400000)
  await prisma.booking.createMany({
    data: [
      { name: 'Pak Joko', email: 'joko@example.com', whatsapp: '081234567020', purpose: 'Konsultasi patung wajah custom', date: nextDate(2), timeSlot: '10:00', status: 'CONFIRMED' },
      { name: 'Ibu Maya', email: 'maya@example.com', whatsapp: '081234567021', purpose: 'Diskusi instalasi monumental', date: nextDate(5), timeSlot: '14:00', status: 'PENDING' },
    ]
  })

  // Subscribers
  await prisma.subscriber.createMany({
    data: [
      { email: 'kolektor1@example.com' },
      { email: 'art-enthusiast@example.com' },
    ]
  })

  console.log('✅ Seed selesai.')
  console.log('   Login Super Admin: superadmin@arthomoro.id / superadmin123')
  console.log('   Login Admin:       admin@arthomoro.id / admin123')
  console.log('   Login Editor:      editor@arthomoro.id / editor123')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
