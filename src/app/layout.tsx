import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ASODS Outsourcing Limited - Nigeria\'s Trusted Workforce Solutions Partner',
  description: 'Providing exceptional talent. Driving business growth. Recruitment, staff outsourcing, payroll management, and HR consulting for banking, fintech, telecom, and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
