import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'For Employers - ASODS Outsourcing Services',
  description: 'Request qualified staff, manage your workforce with real-time visibility, and scale with confidence.',
}

export default function Employers() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section 
          className="py-20 bg-cover bg-center bg-fixed relative"
          style={{
            backgroundImage: "url('/hero-employers.jpg')",
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: 'background-image',
          }}
        >
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Staffing Built for Real Business.
            </h1>
            <p className="text-xl text-gray-100 mb-8">
              No forms that disappear into a void. No waiting and hoping. Submit a staffing request and see exactly where it stands, every step of the way.
            </p>
            <Link
              href="/employers/request"
              className="inline-block px-10 py-4 rounded-lg font-semibold text-white transition hover:shadow-lg"
              style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
            >
              Submit a Staffing Request
            </Link>
          </div>
        </section>

        {/* The Problem */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#0D1B2A' }}>
              The Staffing Problem You Know Too Well
            </h2>
            <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto text-lg">
              You call a recruitment agency. They promise to find someone "soon." Then... silence. You follow up. They follow up. Weeks pass. Nothing. You never know if they're actively looking, if your requirements are too strict, or if they've just moved on.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '❌', title: 'No Visibility', desc: 'You submit. Then you wait. No updates, no timeline, no clarity.' },
                { icon: '⏰', title: 'Wasted Time', desc: 'Unfilled positions cost real money. Every week of delays is business impact.' },
                { icon: '😤', title: 'Broken Trust', desc: 'Generic service, no accountability. You feel like just another ticket.' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-8 bg-gray-50 rounded-lg border border-gray-200 text-center"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section style={{ backgroundColor: '#F1F2F6' }} className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#0D1B2A' }}>
              How We're Different
            </h2>
            <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto text-lg">
              Real-time visibility. No black hole. Just progress.
            </p>

            <div className="space-y-12">
              {[
                {
                  num: '1',
                  title: 'Transparent Pipeline',
                  desc: 'You see your staffing request move through every stage. New → Screening → Shortlisted → Client Review → Placed. No guessing.',
                  icon: '👁️',
                },
                {
                  num: '2',
                  title: 'Active Sourcing',
                  desc: 'We don\'t hope candidates apply. We actively search, screen, and evaluate. You get quality candidates pre-vetted.',
                  icon: '🔍',
                },
                {
                  num: '3',
                  title: 'Regular Communication',
                  desc: 'You hear from us. Weekly updates, candidate profiles, next steps. You always know where you stand.',
                  icon: '💬',
                },
                {
                  num: '4',
                  title: 'Industry Expertise',
                  desc: 'We know banking, fintech, manufacturing, telecom. We understand your world and source talent that fits.',
                  icon: '⭐',
                },
              ].map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-8 items-start">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ backgroundColor: '#D4AF37' }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-2xl font-bold mb-3"
                      style={{ color: '#0D1B2A' }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#0D1B2A' }}>
              What We Offer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Recruitment & Permanent Placement',
                  desc: 'Need a CFO, marketing manager, or engineer? We find, screen, and place the right permanent hire.',
                },
                {
                  title: 'Staff Outsourcing',
                  desc: 'Let us manage your full team or a department. We handle payroll, benefits, compliance — you manage the work.',
                },
                {
                  title: 'Payroll Management',
                  desc: 'Accurate payroll, tax compliance, pension contributions. Scale without scaling your HR team.',
                },
                {
                  title: 'HR Consulting',
                  desc: 'Growing? Restructuring? We advise on organizational design, policy, and talent strategy.',
                },
              ].map((service, i) => (
                <div
                  key={i}
                  className="p-8 bg-gray-50 rounded-lg border-l-4"
                  style={{ borderColor: '#D4AF37' }}
                >
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#0D1B2A' }}>
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Employers Choose ASODS */}
        <section style={{ backgroundColor: '#F1F2F6' }} className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#0D1B2A' }}>
              Why Employers Choose ASODS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '✓', title: 'Real-Time Updates', desc: 'Dashboard access. See your staffing request status live.' },
                { icon: '✓', title: 'Speed', desc: 'We move fast. Quality candidates, delivered on your timeline.' },
                { icon: '✓', title: 'Quality', desc: 'Thoroughly screened. We send you candidates, not resumes.' },
                { icon: '✓', title: 'Industry Knowledge', desc: 'We know your sector. Technical fit, cultural fit, everything.' },
                { icon: '✓', title: 'Support', desc: 'A real person is your account manager. Not a ticket number.' },
                { icon: '✓', title: 'Scalability', desc: 'Hire 1 or hire 100. We scale with your business.' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4 text-lg"
                    style={{ backgroundColor: '#0D1B2A' }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#0D1B2A' }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#0D1B2A' }}>
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { num: '1', title: 'Submit Request', desc: 'Tell us what you need: roles, skills, quantity, timeline.' },
                { num: '2', title: 'We Source', desc: 'We actively search, screen, and prepare qualified candidates.' },
                { num: '3', title: 'You Review', desc: 'See our shortlist. Give feedback. We iterate with you.' },
                { num: '4', title: 'Deploy', desc: 'Offer accepted. Paperwork handled. Your team is staffed.' },
              ].map((step, i) => (
                <div key={i}>
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ backgroundColor: '#0D1B2A' }} className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to See a Real Difference?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Submit a staffing request and let us show you what transparent, professional recruitment looks like.
            </p>
            <Link
              href="/employers/request"
              className="inline-block px-10 py-4 rounded-lg font-semibold text-white transition hover:shadow-lg"
              style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
            >
              Request Staff Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
