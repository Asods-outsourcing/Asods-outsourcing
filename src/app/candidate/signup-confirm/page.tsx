'use client'

import Link from 'next/link'

export default function SignupConfirmPage() {
  return (
    <div className="min-h-screen bg-[#F1F2F6] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#0D1B2A] mb-4">Check Your Email</h1>
        <p className="text-[#333333] mb-6">
          We&rsquo;ve sent a confirmation link to your email address. Click the link to verify your account and continue to your onboarding.
        </p>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 text-sm text-[#333333]">
          <p className="font-medium mb-2">What happens next:</p>
          <ul className="text-left space-y-1">
            <li>• Check your email (including spam folder)</li>
            <li>• Click the verification link</li>
            <li>• Complete your profile on the next page</li>
            <li>• Start browsing jobs</li>
          </ul>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Didn&rsquo;t receive the email? Check your spam folder or{' '}
          <Link href="/candidate/signup" className="text-[#D4AF37] hover:underline font-medium">
            try again
          </Link>
          .
        </p>

        <Link
          href="/candidate/login"
          className="inline-block bg-[#0D1B2A] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0a1420] transition"
        >
          Back to Login
        </Link>
      </div>
    </div>
  )
}
