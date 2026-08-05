'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface AdminProfile {
  role: string
  admin_access: string[]
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          console.log('[Admin Layout] No user, redirecting to login')
          router.push('/admin/login')
          return
        }

        // Fetch admin profile
        const { data: adminProfile, error } = await supabase
          .from('profiles')
          .select('role, admin_access')
          .eq('id', user.id)
          .maybeSingle()

        if (error) {
          console.error('[Admin Layout] Profile fetch error:', error)
          router.push('/admin/login')
          return
        }

        if (!adminProfile || adminProfile.role !== 'admin') {
          console.log('[Admin Layout] Not an admin, redirecting to login')
          router.push('/admin/login')
          return
        }

        setProfile(adminProfile)
        setLoading(false)
      } catch (err) {
        console.error('[Admin Layout] Error:', err)
        router.push('/admin/login')
      }
    }

    checkAdminAuth()
  }, [supabase, router])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/admin/login')
    } catch (err) {
      console.error('[Admin Layout] Logout error:', err)
    }
  }

  const navItems = [
    { href: '/admin/home', label: 'Today', icon: '📋' },
    { href: '/admin/requests', label: 'Requests', icon: '📝' },
    { href: '/admin/candidates', label: 'Candidates', icon: '👥' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F2F6] flex items-center justify-center">
        <p className="text-[#333333]">Loading...</p>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#F1F2F6]">
      {/* Header */}
      <header className="bg-[#0D1B2A] text-white py-4 px-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/admin/home" className="text-2xl font-bold hover:text-[#D4AF37] transition">
            ASODS Admin
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-[#D4AF37] transition text-sm font-medium"
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl hover:text-[#D4AF37] transition"
          >
            ☰
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="hidden md:block px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded font-medium hover:bg-[#c49d23] transition text-sm"
          >
            Logout
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-700 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block hover:text-[#D4AF37] transition text-sm font-medium"
              >
                {item.icon} {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded font-medium hover:bg-[#c49d23] transition text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-12 px-4">
        {children}
      </main>
    </div>
  )
}
