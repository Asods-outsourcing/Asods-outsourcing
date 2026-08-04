'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Wire up actual form submission to backend
    console.log('Contact form submission (stub):', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' })
    }, 5000)
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-50 to-blue-50 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600">
              Questions about our services? Ready to discuss your staffing needs? We're here to help.
            </p>
          </div>
        </section>

        {/* Contact Info + Form */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Contact Info Cards */}
              {[
                {
                  icon: '📍',
                  title: 'Our Office',
                  details: ['Lagos, Nigeria', 'West Africa'],
                },
                {
                  icon: '📞',
                  title: 'Phone',
                  details: ['+234 (0) XXX XXX XXXX', 'Mon–Fri, 9am–6pm WAT'],
                },
                {
                  icon: '📧',
                  title: 'Email',
                  details: ['info@asods.com', 'We respond within 24 hours'],
                },
              ].map((item, i) => (
                <div key={i} className="text-center p-8 bg-gray-50 rounded-lg">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                    {item.title}
                  </h3>
                  {item.details.map((detail, j) => (
                    <p key={j} className="text-gray-600 text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#0D1B2A' }}>
                  Send us a Message
                </h2>

                {submitted ? (
                  <div
                    className="p-6 rounded-lg text-center"
                    style={{ backgroundColor: '#D4AF37' }}
                  >
                    <p className="text-lg font-semibold" style={{ color: '#0D1B2A' }}>
                      ✓ Thank you for reaching out!
                    </p>
                    <p className="text-gray-700 mt-2">
                      We'll review your message and get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#0D1B2A' }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#0D1B2A' }}>
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#0D1B2A' }}>
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#0D1B2A' }}>
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#0D1B2A' }}>
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      >
                        <option value="">Select a topic</option>
                        <option value="staffing-request">Staffing Request</option>
                        <option value="recruitment-services">Recruitment Services</option>
                        <option value="outsourcing">Staff Outsourcing</option>
                        <option value="payroll">Payroll Management</option>
                        <option value="hr-consulting">HR Consulting</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#0D1B2A' }}>
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-6 py-3 rounded-lg font-semibold text-white transition hover:shadow-lg"
                      style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ backgroundColor: '#0D1B2A' }} className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Need to Submit a Staffing Request Right Away?
            </h2>
            <a
              href="/employers/request"
              className="inline-block px-10 py-4 rounded-lg font-semibold text-white transition hover:shadow-lg"
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
