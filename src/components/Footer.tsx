import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/careers', label: 'Careers' },
  ]

  const employerLinks = [
    { href: '/employers', label: 'Our Services' },
    { href: '/employers/request', label: 'Request Staff' },
    { href: '/contact', label: 'Contact Us' },
  ]

  const legalLinks = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-of-service', label: 'Terms of Service' },
    { href: '/faq', label: 'FAQ' },
  ]

  const renderLinkList = (links: typeof quickLinks) => (
    <ul className="space-y-2 text-sm text-gray-300">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="transition hover:text-yellow-400" style={{ color: 'inherit' }}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )

  return (
    <footer style={{ backgroundColor: '#0D1B2A' }} className="text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-xl font-bold" style={{ color: '#D4AF37' }}>
                ASODS
              </span>
              <span className="text-xs font-semibold text-gray-400 tracking-wide">
                OUTSOURCING SERVICES
              </span>
            </div>
            <p className="text-sm text-gray-300">
              Nigeria's trusted workforce solutions partner, delivering qualified talent through technology, professionalism, and exceptional client service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            {renderLinkList(quickLinks)}
          </div>

          {/* For Employers */}
          <div>
            <h3 className="font-semibold mb-4">For Employers</h3>
            {renderLinkList(employerLinks)}
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            {renderLinkList(legalLinks)}
          </div>
        </div>

        <div className="border-t pt-8" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <p className="text-center text-sm text-gray-400">
            © {currentYear} ASODS Outsourcing Services. All rights reserved. | Lagos, Nigeria
          </p>
        </div>
      </div>
    </footer>
  )
}
