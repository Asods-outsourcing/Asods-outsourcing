'use client'

import Link from 'next/link'

export default function SuccessMessage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6 text-5xl">✅</div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">You're officially in the ASODS Talent Pool!</h1>
        
        <div className="text-gray-700 space-y-4 mb-8 text-left">
          <p>Thank you for registering with ASODS Outsourcing Services.</p>
          
          <p>
            Your profile has been received and will be reviewed by our Talent Acquisition team. If your skills and experience match an available opportunity, we may contact you for further screening, assessment or an interview.
          </p>
          
          <p className="font-semibold text-blue-700">
            Please keep your phone number, WhatsApp and email active and check them regularly for updates.
          </p>
        </div>

        <div className="mb-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600 font-semibold">ASODS Outsourcing Services</p>
          <p className="text-gray-500 italic">Connecting Businesses with the Right Talent.</p>
        </div>

        <Link
          href="/"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}
