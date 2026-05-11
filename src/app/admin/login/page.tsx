'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Input, Label } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const callback = params.get('callbackUrl') || (`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/admin`)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setErr(null)
    const fd = new FormData(e.currentTarget)
    const res = await signIn('credentials', {
      email: String(fd.get('email')||''),
      password: String(fd.get('password')||''),
      redirect: false,
      callbackUrl: callback,
    })
    setLoading(false)
    if (res?.error) { setErr('Email atau password salah'); toast.error('Login gagal') }
    else { toast.success('Berhasil masuk'); router.push(callback) }
  }

  return (
    <main className="bg-marble grain relative flex min-h-screen items-center justify-center px-6 py-12">
      <div className="absolute inset-0 bg-gold-radial opacity-50" />
      <div className="relative w-full max-w-md rounded-lg border border-line bg-bg-card p-8 shadow-soft">
        <Link href="/" className="mb-6 inline-flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-accent-gold/40 bg-bg-secondary/80">
            <span className="font-cinzel text-base text-accent-gold">A</span>
          </div>
          <div className="leading-tight">
            <p className="font-cinzel text-xs tracking-[0.32em] text-accent-gold">ARTHOMORO</p>
            <p className="font-cinzel text-[10px] tracking-[0.3em] text-ink-secondary">JAYA SENTOSA</p>
          </div>
        </Link>
        <h1 className="font-display text-2xl">Masuk Admin</h1>
        <p className="mt-1 text-sm text-ink-secondary">Akses dashboard manajemen Arthomoro.</p>

        {err && (
          <div className="mt-4 flex items-center gap-2 rounded-md border border-red-700/40 bg-red-700/10 p-3 text-sm text-red-300">
            <AlertCircle className="h-4 w-4" /> {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label required>Email</Label>
            <Input type="email" name="email" required placeholder="admin@arthomoro.id" autoFocus />
          </div>
          <div>
            <Label required>Password</Label>
            <Input type="password" name="password" required placeholder="••••••••" />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Masuk
          </Button>
        </form>

        <div className="mt-6 rounded-md border border-line bg-bg-secondary/50 p-3 text-[11px] leading-relaxed text-ink-secondary">
          <p className="font-medium text-ink-primary">Demo credentials:</p>
          <p>• Super Admin: <code>superadmin@arthomoro.id</code> / <code>superadmin123</code></p>
          <p>• Admin: <code>admin@arthomoro.id</code> / <code>admin123</code></p>
          <p>• Editor: <code>editor@arthomoro.id</code> / <code>editor123</code></p>
        </div>
      </div>
    </main>
  )
}
