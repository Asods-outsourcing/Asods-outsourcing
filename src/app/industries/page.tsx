import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Industries - ASODS Outsourcing',
  description: 'Workforce solutions for banking, fintech, telecom, manufacturing, logistics, retail, and healthcare.',
}

export default function Industries() {
  const industries = [
    {
      name: 'Banking & Financial Services',
      icon: '🏦',
      challenges: ['High compliance requirements', 'Rapid hiring during expansion', 'Need for specialized skills (risk, compliance, audit)'],
      solution: 'We understand banking operations and compliance needs. We source screened professionals who fit your culture and regulatory requirements.',
    },
    {
      name: 'Fintech',
      icon: '💳',
      challenges: ['Fast-growing, unpredictable hiring needs', 'Shortage of skilled tech talent', 'Need for innovation-driven teams'],
      solution: 'We work with fast-growing fintech companies. We source engineers, product managers, and operations staff who thrive in agile environments.',
    },
    {
      name: 'Telecommunications',
      icon: '📡',
      challenges: ['Technical skill shortage', 'High turnover in customer-facing roles', 'Need for 24/7 operations coverage'],
      solution: 'We staff telecom companies with field technicians, customer service teams, and operations support. We understand shift requirements and technical needs.',
    },
    {
      name: 'Manufacturing',
      icon: '🏭',
      challenges: ['Safety and compliance critical', 'Seasonal production fluctuations', 'Need for skilled machine operators and supervisors'],
      solution: 'We supply manufacturing companies with trained operators, supervisors, and support staff. We help manage seasonal staffing surges.',
    },
    {
      name: 'Logistics & Supply Chain',
      icon: '📦',
      challenges: ['Warehouse and operations scaling', 'High-volume hiring needs', 'Training staff on inventory systems'],
      solution: 'We handle rapid scaling for logistics companies — from warehouse staff to supervisors. We understand logistics operations and training needs.',
    },
    {
      name: 'Retail & E-Commerce',
      icon: '🛍️',
      challenges: ['Seasonal peaks (holiday hiring)', 'High turnover', 'Need for customer-focused staff'],
      solution: 'We source retail and customer service teams quickly. We help manage seasonal surges and provide stable, reliable staffing.',
    },
    {
      name: 'Healthcare',
      icon: '⚕️',
      challenges: ['Critical staffing needs', 'Specialized certifications required', 'High burnout and turnover'],
      solution: 'We connect healthcare facilities with qualified nurses, support staff, and administrative professionals. We understand healthcare compliance.',
    },
    {
      name: 'Government & Public Sector',
      icon: '🏛️',
      challenges: ['Contractor staff needs', 'Compliance and security clearances', 'Project-based hiring'],
      solution: 'We staff government projects and public sector organizations. We handle compliance, clearances, and project-based hiring.',
    },
  ]

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section 
          className="py-16 bg-cover bg-center relative"
          style={{
            backgroundImage: "url('/hero-industries.jpg')",
          }}
        >
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Industry Expertise
            </h1>
            <p className="text-xl text-gray-100">
              Specialized talent solutions for every sector. We understand your industry's unique staffing challenges and compliance needs.
            </p>
          </div>
        </section>

        {/* Industries Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {industries.map((industry, i) => (
                <div
                  key={i}
                  className="p-8 rounded-lg border-2 hover:shadow-lg transition"
                  style={{ borderColor: '#D4AF37' }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="text-4xl">{industry.icon}</div>
                    <h2 className="text-2xl font-bold" style={{ color: '#0D1B2A' }}>
                      {industry.name}
                    </h2>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold text-sm mb-3 uppercase" style={{ color: '#0D1B2A' }}>
                      Challenges in this industry:
                    </h3>
                    <ul className="space-y-1">
                      {industry.challenges.map((challenge, j) => (
                        <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                          <span style={{ color: '#D4AF37' }}>•</span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm mb-2 uppercase" style={{ color: '#D4AF37' }}>
                      How we help:
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{industry.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Industry Expertise Matters */}
        <section style={{ backgroundColor: '#F1F2F6' }} className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#0D1B2A' }}>
              Why Industry Expertise Matters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'We Know Your Challenges',
                  desc: 'Banking compliance looks different from telecom operations. We understand each industry\'s specific needs.',
                },
                {
                  title: 'Faster Matching',
                  desc: 'Industry expertise means we know what skills matter most for your roles and can source the right fit quickly.',
                },
                {
                  title: 'Long-Term Partnership',
                  desc: 'We learn your business over time and become a trusted extension of your HR team.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-8 bg-white rounded-lg border border-gray-200 text-center"
                >
                  <div className="text-3xl mb-4">
                    {i === 0 ? '🎯' : i === 1 ? '⚡' : '🤝'}
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#0D1B2A' }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ backgroundColor: '#0D1B2A' }} className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Don't See Your Industry?
            </h2>
            <p className="text-gray-300 mb-8">
              We work across all sectors. Reach out and let's talk about your specific needs.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition hover:shadow-lg"
              style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
