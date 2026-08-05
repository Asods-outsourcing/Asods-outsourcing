'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('[Admin Login] Attempting login for:', email)

      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.error('[Admin Login] Auth error:', authError)
        setError('Invalid email or password')
        setLoading(false)
        return
      }

      if (!authData.user) {
        console.error('[Admin Login] No user returned from auth')
        setError('Login failed')
        setLoading(false)
        return
      }

      // Check if user is an admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, admin_access')
        .eq('id', authData.user.id)
        .maybeSingle()

      if (profileError) {
        console.error('[Admin Login] Profile fetch error:', profileError)
        setError('Failed to load profile')
        setLoading(false)
        return
      }

      if (!profile) {
        console.error('[Admin Login] No profile found')
        await supabase.auth.signOut()
        setError('Profile not found')
        setLoading(false)
        return
      }

      if (profile.role !== 'admin') {
        console.error('[Admin Login] User is not an admin, role:', profile.role)
        await supabase.auth.signOut()
        setError('Access denied. Admin account required.')
        setLoading(false)
        return
      }

      console.log('[Admin Login] Login successful, redirecting to admin home')
      router.push('/admin/home')
    } catch (err) {
      console.error('[Admin Login] Unexpected error:', err)
      console.error('[Admin Login] Error stringified:', JSON.stringify(err, null, 2))
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F1F2F6] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-[#0D1B2A] mb-2">ASODS Admin</h1>
          <p className="text-sm text-gray-600 mb-8">Staff management dashboard</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] disabled:bg-gray-100"
                placeholder="admin@asods.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] disabled:bg-gray-100"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded-lg font-medium hover:bg-[#c49d23] disabled:opacity-50 transition"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-xs text-gray-600 text-center mt-8">
            Admin access only. Contact ASODS leadership for credentials.
          </p>
        </div>
      </div>
    </div>
  )
}
