'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [hasRecoverySession, setHasRecoverySession] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  // Check for recovery session on mount
  useEffect(() => {
    const checkRecoverySession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('[Reset Password] Session error:', sessionError)
          setError('Unable to verify reset link. Please request a new one.')
          setCheckingSession(false)
          return
        }

        // Check if this is a recovery session by looking at user metadata
        // Recovery sessions have access_token from the reset link
        if (session?.user?.id) {
          console.log('[Reset Password] Recovery session detected for user:', session.user.id)
          setHasRecoverySession(true)
        } else {
          console.log('[Reset Password] No active session found')
          setError('Reset link is invalid or expired. Please request a new password reset.')
        }

        setCheckingSession(false)
      } catch (err) {
        console.error('[Reset Password] Error checking session:', err)
        setError('An error occurred. Please try again.')
        setCheckingSession(false)
      }
    }

    checkRecoverySession()

    // Also listen for auth state changes to catch when recovery session is established
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Reset Password] Auth state changed:', event, !!session)
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session?.user?.id)) {
        setHasRecoverySession(true)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate inputs
      if (!password || !confirmPassword) {
        setError('Both password fields are required')
        setLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters')
        setLoading(false)
        return
      }

      console.log('[Reset Password] Updating password...')
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        console.error('[Reset Password] Update error:', updateError)
        setError(updateError.message || 'Failed to update password')
        setLoading(false)
        return
      }

      console.log('[Reset Password] Password updated successfully')
      setSuccess(true)
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      console.error('[Reset Password] Unexpected error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  // Show loading state while checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#F1F2F6] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <p className="text-gray-600">Verifying reset link...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error if no recovery session
  if (!hasRecoverySession && !success) {
    return (
      <div className="min-h-screen bg-[#F1F2F6] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#0D1B2A] mb-2">ASODS</h1>
            <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">Reset Password</h2>
          </div>

          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>

          <p className="text-center text-sm text-gray-600 mb-4">
            Please request a new password reset email and click the link again.
          </p>

          <div className="flex gap-4">
            <Link
              href="/candidate/login"
              className="flex-1 px-4 py-2 bg-[#0D1B2A] text-white rounded-lg font-medium hover:bg-[#0a1420] text-center transition"
            >
              Candidate Login
            </Link>
            <Link
              href="/admin/login"
              className="flex-1 px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded-lg font-medium hover:bg-[#c49d23] text-center transition"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Show success message
  if (success) {
    return (
      <div className="min-h-screen bg-[#F1F2F6] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#0D1B2A] mb-2">ASODS</h1>
            <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">Password Updated</h2>
          </div>

          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded text-center">
            Your password has been successfully updated. You can now log in with your new password.
          </div>

          <p className="text-center text-sm text-gray-600 mb-6">
            Choose your account type to continue:
          </p>

          <div className="space-y-3">
            <Link
              href="/candidate/login"
              className="block w-full px-4 py-2 bg-[#0D1B2A] text-white rounded-lg font-medium hover:bg-[#0a1420] text-center transition"
            >
              Log in as Candidate
            </Link>
            <Link
              href="/admin/login"
              className="block w-full px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded-lg font-medium hover:bg-[#c49d23] text-center transition"
            >
              Log in as Admin
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Show reset form
  return (
    <div className="min-h-screen bg-[#F1F2F6] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0D1B2A] mb-2">ASODS</h1>
          <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">Reset Password</h2>
          <p className="text-[#333333] text-sm">Enter your new password below</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4 mb-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#333333] mb-1">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="Min. 8 characters"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#333333] mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="Confirm password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0D1B2A] text-white py-2 rounded-lg font-medium hover:bg-[#0a1420] disabled:opacity-50 transition"
          >
            {loading ? 'Updating password...' : 'Update Password'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600">
          Remember your password?{' '}
          <Link href="/candidate/login" className="text-[#D4AF37] hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
