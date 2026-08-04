import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'About ASODS - Nigeria\'s Workforce Solutions Partner',
  description: 'Learn about ASODS Outsourcing Limited, our mission, vision, and values. We deliver exceptional talent and drive business growth.',
}

export default function About() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section 
          className="py-16 bg-cover bg-center bg-fixed relative"
          style={{
            backgroundImage: "url('/hero-about.jpg')",
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: 'background-image',
          }}
        >
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              About ASODS
            </h1>
            <p className="text-xl text-gray-100">
              Nigeria's trusted workforce solutions partner, delivering qualified talent through technology, professionalism, and exceptional client service.
            </p>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Mission */}
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl"
                  style={{ backgroundColor: '#D4AF37' }}
                >
                  🎯
                </div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  Our Mission
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  To provide innovative, reliable, and cost-effective outsourcing and human capital solutions that empower organizations to achieve their business goals.
                </p>
              </div>

              {/* Vision */}
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl"
                  style={{ backgroundColor: '#D4AF37' }}
                >
                  ⭐
                </div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  Our Vision
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  To be the leading outsourcing partner in Nigeria, recognized for transforming businesses through people, performance, and partnership.
                </p>
              </div>

              {/* Brand Promise */}
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl"
                  style={{ backgroundColor: '#D4AF37' }}
                >
                  🤝
                </div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  Our Promise
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  People. Performance. Partnership. We value people, deliver excellence with integrity, and collaborate for your long-term success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section style={{ backgroundColor: '#F1F2F6' }} className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#0D1B2A' }}>
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: 'People First',
                  desc: 'We value our people and build meaningful relationships with clients and candidates. Your success is our success.',
                },
                {
                  title: 'Excellence',
                  desc: 'We deliver exceptional service with integrity and professionalism in everything we do.',
                },
                {
                  title: 'Partnership',
                  desc: 'We collaborate closely with our clients, viewing them as partners in their success journey.',
                },
                {
                  title: 'Integrity',
                  desc: 'Honesty, transparency, and ethical standards guide all our business decisions and interactions.',
                },
                {
                  title: 'Innovation',
                  desc: 'We embrace technology and modern solutions to deliver efficient, effective workforce management.',
                },
                {
                  title: 'Accountability',
                  desc: 'We take responsibility for our commitments and follow through with results that matter.',
                },
              ].map((value, i) => (
                <div key={i} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#0D1B2A' }}>
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why We're Different */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#0D1B2A' }}>
              Why We're Different
            </h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
              In a market where clients and candidates wait and hope, ASODS delivers real-time visibility and predictable results.
            </p>
            <div className="space-y-6">
              {[
                {
                  challenge: 'The Problem',
                  description: 'Competitors leave clients in the dark. Submit a request, and hear nothing for weeks.',
                  solution: 'Our Solution',
                  solutionDesc: 'Real-time pipeline visibility. Clients watch their staffing request move through our system step by step.',
                },
                {
                  challenge: 'Generic Services',
                  description: 'One-size-fits-all recruitment models don\'t work for diverse industries and growth stages.',
                  solution: 'Tailored Solutions',
                  solutionDesc: 'We customize our services for banking, fintech, manufacturing, and more. Your industry needs specialist attention.',
                },
                {
                  challenge: 'Hidden Costs',
                  description: 'Unclear pricing and surprise fees damage trust and budgeting.',
                  solution: 'Transparent Pricing',
                  solutionDesc: 'Fixed fees. No surprises. Know exactly what you\'re paying and why.',
                },
              ].map((item, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-lg border border-gray-200">
                  <div>
                    <h3 className="font-bold text-lg mb-2" style={{ color: '#D4AF37' }}>
                      ❌ {item.challenge}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2" style={{ color: '#0D1B2A' }}>
                      ✓ {item.solution}
                    </h3>
                    <p className="text-gray-600">{item.solutionDesc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section style={{ backgroundColor: '#0D1B2A' }} className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Have Questions?</h2>
            <p className="text-gray-300 mb-8">
              We'd love to tell you more about how ASODS can help your business.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition hover:shadow-lg"
              style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
            >
              Get in Touch
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
