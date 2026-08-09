'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface CandidateProfile {
  id: string
  full_name: string
}

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const [profile, setProfile] = useState<CandidateProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  // Check if we're on the login or onboarding page
  const isLoginPage = pathname === '/candidate/login'
  const isOnboardingPage = pathname === '/candidate/onboarding'

  useEffect(() => {
    if (isLoginPage || isOnboardingPage) {
      // Don't check auth on login/onboarding pages
      setLoading(false)
      return
    }

    const checkCandidateAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          console.log('[Candidate Layout] No user, redirecting to login')
          router.push('/candidate/login')
          return
        }

        // Fetch candidate profile
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('id', user.id)
          .maybeSingle()

        if (error) {
          console.error('[Candidate Layout] Profile fetch error:', error)
          router.push('/candidate/login')
          return
        }

        if (!profileData) {
          console.log('[Candidate Layout] No profile found, redirecting to login')
          router.push('/candidate/login')
          return
        }

        setProfile(profileData)
        setLoading(false)
      } catch (error) {
        console.error('[Candidate Layout] Auth check error:', error)
        router.push('/candidate/login')
      }
    }

    checkCandidateAuth()
  }, [supabase, router, isLoginPage, isOnboardingPage])

  const navItems = [
    { href: '/candidate/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/candidate/jobs', label: 'Browse Jobs', icon: '💼' },
    { href: '/candidate/applications', label: 'Applications', icon: '📋' },
    { href: '/candidate/profile', label: 'Profile', icon: '👤' },
    { href: '/candidate/documents', label: 'Documents', icon: '📄' },
    { href: '/candidate/settings', label: 'Settings', icon: '⚙️' },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Show loading state for protected pages
  if (loading && !isLoginPage && !isOnboardingPage) {
    return (
      <div className="min-h-screen bg-[#F1F2F6] flex items-center justify-center">
        <p className="text-[#333333]">Loading...</p>
      </div>
    )
  }

  // Show just the children on login/onboarding pages (no header/nav)
  if (isLoginPage || isOnboardingPage) {
    return <>{children}</>
  }

  // Show full layout on authenticated pages
  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#F1F2F6]">
      {/* Header */}
      <header className="bg-[#0D1B2A] text-white py-4 px-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 hover:text-[#D4AF37] transition font-bold text-lg sm:text-xl">
            ASODS
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-2 lg:gap-6 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-[#D4AF37] transition text-xs sm:text-sm font-medium whitespace-nowrap"
              >
                <span className="hidden lg:inline">{item.icon} {item.label}</span>
                <span className="lg:hidden">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl hover:text-[#D4AF37] transition flex-shrink-0"
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          {/* Logout (desktop) */}
          <button
            onClick={handleLogout}
            className="hidden md:block px-3 py-1 text-xs font-medium border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-[#0D1B2A] transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-gray-700 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 hover:bg-[#1A2942] rounded hover:text-[#D4AF37] transition text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {item.icon} {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-700 pt-3">
              <button
                onClick={() => {
                  handleLogout()
                  setMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 hover:bg-[#1A2942] rounded hover:text-[#D4AF37] transition text-sm font-medium"
              >
                🚪 Logout
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      {children}
    </div>
  )
}
