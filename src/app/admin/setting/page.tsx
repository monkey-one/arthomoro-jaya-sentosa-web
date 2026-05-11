import { prisma } from '@/lib/prisma'
import { requirePermissionPage } from '@/lib/auth-guard'
import { AdminPageHeader } from '@/components/admin/page-header'
import { SettingsForm } from '@/components/admin/settings-form'

export const dynamic = 'force-dynamic'

const SETTING_GROUPS = [
  { title: 'Profil Studio', items: [
    { key: 'site_name', label: 'Nama Brand', hint: 'Nama lengkap brand yang muncul di seluruh website.' },
    { key: 'tagline', label: 'Tagline', hint: 'Tagline filosofis brand.' },
    { key: 'wa_number', label: 'Nomor WhatsApp (intl)', hint: 'Format: 6281234567890 — tanpa + atau spasi.' },
    { key: 'email', label: 'Email Kontak' },
    { key: 'phone', label: 'Telepon Display' },
    { key: 'address', label: 'Alamat Lengkap', textarea: true },
    { key: 'maps_query', label: 'Query Google Maps', hint: 'Misal: Yogyakarta+Indonesia' },
    { key: 'hours', label: 'Jam Operasional' },
  ]},
  { title: 'Sosial Media', items: [
    { key: 'instagram', label: 'Instagram URL' },
    { key: 'facebook', label: 'Facebook URL' },
    { key: 'youtube', label: 'YouTube URL' },
    { key: 'tiktok', label: 'TikTok URL' },
    { key: 'pinterest', label: 'Pinterest URL' },
  ]},
  { title: 'Statistik Homepage', items: [
    { key: 'stat_works', label: 'Karya Tercipta', hint: 'Angka yang muncul di section stats homepage.' },
    { key: 'stat_years', label: 'Tahun Pengalaman' },
    { key: 'stat_cities', label: 'Kota Terinstalasi' },
    { key: 'stat_satisfaction', label: 'Kepuasan Klien (%)' },
  ]},
  { title: 'Kebijakan Pre-Order', items: [
    { key: 'min_dp_percent', label: 'Minimum DP (%)', hint: 'Persentase DP minimum untuk memulai produksi.' },
    { key: 'max_revisions', label: 'Maks Revisi Desain' },
  ]},
]

export default async function AdminSettingPage() {
  await requirePermissionPage('setting:view')
  const rows = await prisma.setting.findMany()
  const map = Object.fromEntries(rows.map(r => [r.key, r.value]))
  return (
    <div>
      <AdminPageHeader title="Pengaturan Sistem" subtitle="Konfigurasi global website Arthomoro Jaya Sentosa." />
      <SettingsForm groups={SETTING_GROUPS} initial={map} />
    </div>
  )
}
