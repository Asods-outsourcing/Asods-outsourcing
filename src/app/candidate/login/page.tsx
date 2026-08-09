'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function CandidateLoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotMessage, setForgotMessage] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email || !password) {
        setError('Email and password are required')
        setLoading(false)
        return
      }

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        setError(loginError.message)
        setLoading(false)
        return
      }

      if (!data.user) {
        setError('Login failed')
        setLoading(false)
        return
      }

      // Check if candidate has completed onboarding
      console.log('[Login] Checking onboarding status for user:', data.user.id)
      const { data: candidate, error: candidateError } = await supabase
        .from('candidates')
        .select('cv_url, bio, skills')
        .eq('profile_id', data.user.id)
        .maybeSingle()

      if (candidateError) {
        console.error('[Login] Error fetching candidate:', {
          message: candidateError.message,
          code: candidateError.code,
          details: (candidateError as any).details,
          hint: (candidateError as any).hint,
        })
        console.log('[Login] Redirecting to onboarding due to error')
        router.push('/candidate/onboarding')
      } else if (candidate) {
        // Onboarding complete only if: has cv_url AND has bio AND has skills (all required)
        const isOnboardingComplete = 
          !!(candidate.cv_url) && 
          !!(candidate.bio) && 
          candidate.skills && 
          candidate.skills.length > 0

        console.log('[Login] Onboarding status check:', {
          has_cv_url: !!candidate.cv_url,
          has_bio: !!candidate.bio,
          has_skills: candidate.skills ? candidate.skills.length > 0 : false,
          isOnboardingComplete,
        })

        if (isOnboardingComplete) {
          console.log('[Login] ✓ Onboarding complete - redirecting to dashboard')
          router.push('/candidate/dashboard')
        } else {
          console.log('[Login] ✗ Onboarding incomplete - redirecting to onboarding')
          router.push('/candidate/onboarding')
        }
      } else {
        // No candidate record found - first-time user
        console.log('[Login] No candidate record found - first-time user, redirecting to onboarding')
        router.push('/candidate/onboarding')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotMessage('')
    setForgotLoading(true)

    try {
      if (!forgotEmail) {
        setForgotMessage('Please enter your email address')
        setForgotLoading(false)
        return
      }

      console.log('[Forgot Password] Sending reset email to:', forgotEmail)
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
      })

      if (error) {
        console.error('[Forgot Password] Error:', error)
        setForgotMessage('Failed to send reset email. Please try again.')
        setForgotLoading(false)
        return
      }

      console.log('[Forgot Password] Reset email sent successfully')
      setForgotMessage('Password reset email sent! Check your inbox and click the link to reset your password.')
      setForgotEmail('')
      setForgotLoading(false)
      
      // Auto-close forgot password modal after 5 seconds
      setTimeout(() => {
        setShowForgotPassword(false)
      }, 5000)
    } catch (err) {
      console.error('[Forgot Password] Unexpected error:', err)
      setForgotMessage(err instanceof Error ? err.message : 'An error occurred')
      setForgotLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F1F2F6] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0D1B2A] mb-2">ASODS</h1>
          <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">Candidate Login</h2>
          <p className="text-[#333333] text-sm">Sign in to view opportunities and track applications</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#333333] mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#333333] mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="Your password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0D1B2A] text-white py-2 rounded-lg font-medium hover:bg-[#0a1420] disabled:opacity-50 transition"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            disabled={loading}
            className="w-full mt-2 text-sm text-[#D4AF37] hover:underline font-medium"
          >
            Forgot password?
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="text-gray-700 font-medium">Google</span>
        </button>

        <p className="text-center text-sm text-[#333333] mt-6">
          Don&rsquo;t have an account?{' '}
          <Link href="/candidate/signup" className="inline-block text-[#D4AF37] hover:underline font-medium px-2 py-1 rounded transition touch-target">
            Sign up
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-[#0D1B2A] mb-4">Reset Password</h3>
            <p className="text-gray-600 text-sm mb-6">
              Enter your email address and we&rsquo;ll send you a link to reset your password.
            </p>

            {forgotMessage && (
              <div className={`mb-6 p-4 rounded ${
                forgotMessage.includes('sent') 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {forgotMessage}
              </div>
            )}

            {!forgotMessage.includes('sent') && (
              <form onSubmit={handleForgotPassword} className="space-y-4 mb-6">
                <div>
                  <label htmlFor="forgotEmail" className="block text-sm font-medium text-[#333333] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="forgotEmail"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="your@email.com"
                    disabled={forgotLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-[#0D1B2A] text-white py-2 rounded-lg font-medium hover:bg-[#0a1420] disabled:opacity-50 transition"
                >
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setShowForgotPassword(false)
                setForgotMessage('')
                setForgotEmail('')
              }}
              className="w-full text-sm text-gray-600 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
