'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [authProvider, setAuthProvider] = useState<'email' | 'google' | 'unknown'>('unknown')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/candidate/login')
          return
        }

        setEmail(user.email || '')

        // Determine auth provider
        const identities = user.identities || []
        if (identities.some((id) => id.provider === 'google')) {
          setAuthProvider('google')
        } else if (identities.some((id) => id.provider === 'email')) {
          setAuthProvider('email')
        } else {
          // Default based on whether password is set (can only detect if email provider)
          setAuthProvider('email')
        }

        setLoading(false)
      } catch (err) {
        console.error('Error loading settings:', err)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    loadSettings()
  }, [supabase, router])

  const handleChangePassword = async () => {
    setError('')
    setSuccess('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      return
    }

    setChangingPassword(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        setError(updateError.message)
        setChangingPassword(false)
        return
      }

      setSuccess('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordForm(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/candidate/login')
    } catch (err) {
      console.error('Logout error:', err)
      setError('Failed to logout')
    }
  }

  return (
    <div className="min-h-screen bg-[#F1F2F6]">
      {/* Header */}
      <header className="bg-[#0D1B2A] text-white py-4 px-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">ASODS</h1>
            <p className="text-sm text-gray-300">Settings</p>
          </div>
          <nav className="flex gap-6">
            <Link href="/candidate/profile" className="hover:text-[#D4AF37] transition">
              Profile
            </Link>
            <Link href="/candidate/dashboard" className="hover:text-[#D4AF37] transition">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-[#0D1B2A] mb-8">Account Settings</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#333333]">Loading settings...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Email */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold text-[#0D1B2A] mb-4">Email Address</h3>
              <p className="text-[#333333] mb-4">{email}</p>
              <p className="text-sm text-gray-600">
                {authProvider === 'google'
                  ? 'Your email is managed through your Google account. To change your email, update it in your Google settings.'
                  : 'To change your email address, please contact our support team.'}
              </p>
            </div>

            {/* Password */}
            {authProvider === 'email' && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-bold text-[#0D1B2A] mb-4">Password</h3>

                {!showPasswordForm ? (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded-lg font-medium hover:bg-[#c49d23] transition"
                  >
                    Change Password
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        disabled={changingPassword}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        disabled={changingPassword}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        disabled={changingPassword}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setShowPasswordForm(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-[#0D1B2A] rounded-lg font-medium hover:bg-gray-50 transition"
                        disabled={changingPassword}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleChangePassword}
                        className="flex-1 px-4 py-2 bg-[#0D1B2A] text-white rounded-lg font-medium hover:bg-[#0a1420] disabled:opacity-50 transition"
                        disabled={changingPassword}
                      >
                        {changingPassword ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Auth Provider Info */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold text-[#0D1B2A] mb-4">Authentication Method</h3>
              {authProvider === 'google' ? (
                <p className="text-[#333333]">
                  You are signed in with <span className="font-bold">Google</span>. Your account is secured by Google's authentication.
                </p>
              ) : (
                <p className="text-[#333333]">
                  You are signed in with <span className="font-bold">Email & Password</span>.
                </p>
              )}
            </div>

            {/* Logout */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold text-[#0D1B2A] mb-4">Sign Out</h3>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </div>

            {/* Account Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-bold text-[#0D1B2A] mb-3">Account Information</h4>
              <ul className="space-y-2 text-sm text-[#333333]">
                <li>• Your data is protected by Supabase's enterprise-grade security</li>
                <li>• All communications are encrypted</li>
                <li>• For security issues, contact: support@asods.com</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
