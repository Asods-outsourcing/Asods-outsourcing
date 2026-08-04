import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section with Background Image */}
        <section 
          className="bg-gradient-to-r from-blue-50 to-blue-50 py-24 bg-cover bg-center relative"
          style={{
            backgroundImage: "url('/hero-home.jpg')",
          }}
        >
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Exceptional Talent.
              <span style={{ color: '#D4AF37' }}> Predictable Results.</span>
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
              ASODS connects you with qualified professionals and manages your workforce with real-time visibility. No waiting. No surprises. Just results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/employers/request"
                className="px-8 py-4 rounded-lg font-semibold text-white transition hover:shadow-lg"
                style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
              >
                Request Staff Now
              </Link>
              <Link
                href="/candidate/signup"
                className="px-8 py-4 rounded-lg font-semibold text-white transition hover:shadow-lg"
                style={{ backgroundColor: '#0D1B2A' }}
              >
                Sign Up as Candidate
              </Link>
              <Link
                href="/candidate/jobs"
                className="px-8 py-4 rounded-lg font-semibold transition border-2"
                style={{ borderColor: '#D4AF37', color: '#D4AF37' }}
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </section>

        {/* Why ASODS Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#0D1B2A' }}>
              Why Choose ASODS?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '👁️',
                  title: 'Real-Time Visibility',
                  desc: 'Watch your staffing requests move through the pipeline in real time. Know exactly where you stand.',
                },
                {
                  icon: '⚡',
                  title: 'Fast Turnaround',
                  desc: 'We move quickly without cutting corners. Qualified candidates, screened and ready.',
                },
                {
                  icon: '🤝',
                  title: 'True Partnership',
                  desc: 'We don\'t just fill positions. We manage your workforce and support your business growth.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-8 rounded-lg border border-gray-200 hover:shadow-lg transition"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: '#0D1B2A' }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="py-20" style={{ backgroundColor: '#F1F2F6' }}>
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#0D1B2A' }}>
              Our Services
            </h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
              Complete workforce solutions tailored to your business needs
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Recruitment & Staffing', desc: 'Find qualified professionals for permanent and temporary roles' },
                { title: 'Staff Outsourcing', desc: 'ASODS-managed employees deployed to your facility' },
                { title: 'Payroll Management', desc: 'Streamlined payroll, compliance, and benefits administration' },
                { title: 'Training & Development', desc: 'Upskill your team with professional development programs' },
                { title: 'HR Consulting', desc: 'Expert guidance on HR strategy and workforce planning' },
                { title: 'Background Verification', desc: 'Thorough candidate screening and verification' },
              ].map((service, i) => (
                <div
                  key={i}
                  className="p-6 bg-white rounded-lg border border-gray-200"
                  style={{ borderLeftColor: '#D4AF37', borderLeftWidth: '4px' }}
                >
                  <h3 className="font-semibold mb-2 text-lg" style={{ color: '#0D1B2A' }}>
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{service.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/services"
                className="inline-block px-8 py-3 rounded-lg font-semibold transition"
                style={{ backgroundColor: '#0D1B2A', color: '#D4AF37' }}
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#0D1B2A' }}>
              Industries We Serve
            </h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
              Expertise across banking, fintech, telecom, manufacturing, and more
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Banking', 'Fintech', 'Telecom', 'Manufacturing', 'Logistics', 'Retail', 'Healthcare', 'Government'].map((industry) => (
                <div
                  key={industry}
                  className="p-6 rounded-lg text-center border-2 hover:shadow-lg transition"
                  style={{ borderColor: '#D4AF37' }}
                >
                  <p className="font-semibold" style={{ color: '#0D1B2A' }}>
                    {industry}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/industries"
                className="inline-block px-8 py-3 rounded-lg font-semibold transition"
                style={{ backgroundColor: '#0D1B2A', color: '#D4AF37' }}
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ backgroundColor: '#0D1B2A' }} className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Workforce?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Submit a staffing request today and see exactly how we can help.
            </p>
            <Link
              href="/employers/request"
              className="inline-block px-10 py-4 rounded-lg font-semibold text-white transition hover:shadow-lg"
              style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
