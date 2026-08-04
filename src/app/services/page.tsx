import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Services - ASODS Outsourcing',
  description: 'Recruitment, outsourcing, payroll management, training, HR consulting, and background verification. Complete workforce solutions.',
}

export default function Services() {
  const services = [
    {
      title: 'Recruitment & Staffing',
      icon: '👥',
      shortDesc: 'Find the right talent, fast.',
      fullDesc: 'Whether you need permanent hires or temporary staff for project-based work, we match qualified professionals to your exact requirements. We handle sourcing, screening, interviews, and onboarding — you get vetted candidates ready to contribute.',
      highlights: ['Permanent placement', 'Contract/temporary staffing', 'Executive search', 'Specialist recruitment'],
    },
    {
      title: 'Staff Outsourcing',
      icon: '🏢',
      shortDesc: 'Let ASODS manage your workforce.',
      fullDesc: 'We deploy and manage skilled professionals at your facility on a recurring basis. ASODS owns the employment relationship, handles payroll, benefits, and compliance — you manage their work. It\'s a partnership that scales with your business.',
      highlights: ['Full workforce management', 'Payroll & benefits administration', 'Compliance handling', 'Performance tracking'],
    },
    {
      title: 'Payroll Management',
      icon: '💼',
      shortDesc: 'Streamlined payroll, zero headaches.',
      fullDesc: 'Accurate payroll on time, every time. We handle salary calculation, tax withholding, pension contributions, and regulatory compliance — freeing your team to focus on core business. Perfect for companies growing faster than their HR capacity.',
      highlights: ['Monthly payroll processing', 'Tax & pension compliance', 'Reports & analytics', 'Multi-currency support'],
    },
    {
      title: 'Training & Development',
      icon: '📚',
      shortDesc: 'Upskill your team for tomorrow.',
      fullDesc: 'Professional development programs tailored to your industry and roles. From technical certifications to soft skills and leadership training, we help your team grow and stay competitive.',
      highlights: ['Customized training programs', 'Soft skills development', 'Technical certifications', 'Leadership coaching'],
    },
    {
      title: 'HR Consulting',
      icon: '🎯',
      shortDesc: 'Expert guidance on workforce strategy.',
      fullDesc: 'Facing HR challenges? Need to restructure, scale, or improve talent retention? Our consultants bring deep experience across industries and help you build HR systems that support your business goals.',
      highlights: ['Workforce planning', 'Organizational design', 'Policy & compliance', 'Change management'],
    },
    {
      title: 'Background Verification',
      icon: '✓',
      shortDesc: 'Know who you\'re hiring.',
      fullDesc: 'Comprehensive candidate screening — work history, education, criminal record checks, and reference verification. We handle all the details so you hire with confidence.',
      highlights: ['Work history verification', 'Educational credential checks', 'Criminal background checks', 'Reference checks'],
    },
  ]

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-50 to-blue-50 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
              Complete Workforce Solutions
            </h1>
            <p className="text-xl text-gray-600">
              Recruitment, outsourcing, payroll, training, and consulting — all the services you need to build and manage a successful team.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, i) => (
                <div
                  key={i}
                  className="p-8 rounded-lg border-2 hover:shadow-lg transition"
                  style={{ borderColor: '#D4AF37' }}
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#0D1B2A' }}>
                    {service.title}
                  </h2>
                  <p className="text-sm font-semibold mb-4" style={{ color: '#D4AF37' }}>
                    {service.shortDesc}
                  </p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.fullDesc}
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase">What's included:</p>
                    <ul className="space-y-1">
                      {service.highlights.map((h, j) => (
                        <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                          <span style={{ color: '#D4AF37' }}>•</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section style={{ backgroundColor: '#F1F2F6' }} className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#0D1B2A' }}>
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { num: '1', title: 'You Submit a Request', desc: 'Tell us what you need — roles, skills, timeline, location.' },
                { num: '2', title: 'We Search & Screen', desc: 'Our team sources qualified candidates and conducts thorough interviews.' },
                { num: '3', title: 'You Review & Decide', desc: 'See candidates we\'ve shortlisted. Provide feedback. We adjust.' },
                { num: '4', title: 'Onboarding & Support', desc: 'We finalize documentation and stay active in ongoing management.' },
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-4"
                    style={{ backgroundColor: '#0D1B2A' }}
                  >
                    {step.num}
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: '#0D1B2A' }}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                  {i < 3 && (
                    <div
                      className="hidden md:block absolute top-6 -right-3 w-6 h-0.5"
                      style={{ backgroundColor: '#D4AF37' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#0D1B2A' }}>
              Industries We Know
            </h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
              We bring specialized expertise to every industry, understanding unique talent needs and compliance requirements.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Banking', 'Fintech', 'Telecom', 'Manufacturing', 'Logistics', 'Retail', 'Healthcare', 'Government'].map((industry) => (
                <div
                  key={industry}
                  className="p-6 rounded-lg text-center bg-gradient-to-br from-blue-50 to-blue-100"
                >
                  <p className="font-semibold" style={{ color: '#0D1B2A' }}>
                    {industry}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ backgroundColor: '#0D1B2A' }} className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Workforce?
            </h2>
            <p className="text-gray-300 mb-8">
              Submit a staffing request and let's discuss which services are right for your business.
            </p>
            <a
              href="/employers/request"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition hover:shadow-lg"
              style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
            >
              Request Staff
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
