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
    <main className="max-w-4xl mx-auto py-8 px-4 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#0D1B2A] mb-8">Account Settings</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-[#333333]">Loading settings...</p>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {/* Email */}
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#0D1B2A] mb-4">Email Address</h2>
            <p className="text-[#333333] mb-4 text-sm sm:text-base">{email}</p>
            <p className="text-xs sm:text-sm text-gray-600">
              {authProvider === 'google'
                ? 'Your email is managed through your Google account. To change your email, update it in your Google settings.'
                : 'To change your email address, please contact our support team.'}
            </p>
          </div>

          {/* Password */}
          {authProvider === 'email' && (
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-bold text-[#0D1B2A] mb-4">Password</h2>

              {!showPasswordForm ? (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded-lg font-medium hover:bg-[#c49d23] transition text-sm"
                >
                  Change Password
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#333333] mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
                      disabled={changingPassword}
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#333333] mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
                      disabled={changingPassword}
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#333333] mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
                      disabled={changingPassword}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={() => setShowPasswordForm(false)}
                      className="w-full sm:flex-1 px-4 py-2 border border-gray-300 text-[#0D1B2A] rounded-lg font-medium hover:bg-gray-50 transition text-sm"
                      disabled={changingPassword}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleChangePassword}
                      className="w-full sm:flex-1 px-4 py-2 bg-[#0D1B2A] text-white rounded-lg font-medium hover:bg-[#0a1420] disabled:opacity-50 transition text-sm"
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
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#0D1B2A] mb-4">Authentication Method</h2>
            <p className="text-[#333333] text-sm sm:text-base">
              You are signed in with <span className="font-bold">{authProvider === 'google' ? 'Google' : 'Email & Password'}</span>
              {authProvider === 'google' ? '. Your account is secured by Google\'s authentication.' : '.'}
            </p>
          </div>

          {/* Logout */}
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#0D1B2A] mb-4">Sign Out</h2>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-sm"
            >
              Sign Out
            </button>
          </div>

          {/* Account Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-[#0D1B2A] mb-3">Account Information</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#333333]">
              <li>• Your data is protected by Supabase's enterprise-grade security</li>
              <li>• All communications are encrypted</li>
              <li>• For security issues, contact: support@asods.com</li>
            </ul>
          </div>
        </div>
      )}
    </main>
  )
}
