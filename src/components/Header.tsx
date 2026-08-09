'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/industries', label: 'Industries' },
    { href: '/careers', label: 'Careers' },
    { href: '/employers', label: 'For Employers' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {/* Logo Image */}
            <div className="w-10 h-10 rounded flex items-center justify-center">
              <Image
                src="/logo.jpg"
                alt="ASODS Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover rounded"
                priority
              />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold" style={{ color: '#0D1B2A' }}>
                ASODS
              </span>
              <span className="text-xs font-semibold text-gray-500 tracking-wide">
                OUTSOURCING SERVICES
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition relative pb-2"
                style={{ 
                  color: '#333333',
                }}
              >
                {link.label}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: '#D4AF37' }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/employers/request"
            className="px-6 py-2 rounded font-semibold text-white transition"
            style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
          >
            Request Staff
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 text-sm font-medium transition ${
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
                }`}
                style={isActive ? { color: '#D4AF37' } : {}}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/employers/request"
            className="block mt-4 px-4 py-2 text-center rounded font-semibold text-white"
            style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
            onClick={() => setIsMenuOpen(false)}
          >
            Request Staff
          </Link>
        </div>
      )}
    </header>
  )
}
