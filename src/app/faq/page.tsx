'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState } from 'react'

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null)

  const faqs = [
    {
      category: 'Staffing Requests',
      questions: [
        {
          q: 'How do I submit a staffing request?',
          a: 'Visit our Request Staff form and provide your company name, roles needed, quantity, timeline, and contact information. We\'ll review your request within 24 hours and follow up with next steps.',
        },
        {
          q: 'How long does it take to fill a position?',
          a: 'Typical timelines range from 2-4 weeks depending on the role\'s complexity and your requirements. Urgent requests may be expedited. We\'ll provide a specific timeline after reviewing your request.',
        },
        {
          q: 'Can I request multiple roles at once?',
          a: 'Absolutely. You can list multiple roles and quantities in a single request. We\'ll prioritize and manage each role separately, keeping you updated on progress.',
        },
        {
          q: 'What if I need candidates faster?',
          a: 'Contact us directly after submitting your request. We offer expedited sourcing for urgent staffing needs, depending on role complexity and market availability.',
        },
      ],
    },
    {
      category: 'Services',
      questions: [
        {
          q: 'Do you only do recruitment?',
          a: 'No. We offer recruitment, staff outsourcing (where ASODS employs and manages staff deployed to your site), payroll management, HR consulting, and background verification.',
        },
        {
          q: 'What industries do you serve?',
          a: 'We specialize in banking, fintech, telecom, manufacturing, logistics, retail, healthcare, and government sectors. We understand each industry\'s unique staffing and compliance needs.',
        },
        {
          q: 'Can you handle large-scale hiring?',
          a: 'Yes. We regularly staff companies hiring dozens of roles at once. We have the infrastructure to source, screen, and onboard at scale.',
        },
      ],
    },
    {
      category: 'Candidates & Applications',
      questions: [
        {
          q: 'How do I apply for a job?',
          a: 'Browse our open roles on the Careers page and click "Apply." You\'ll create a candidate account and submit your resume. Our team will review and follow up if you\'re a fit.',
        },
        {
          q: 'How will I hear back about my application?',
          a: 'We review applications within 3-5 business days. If selected, we\'ll contact you with next steps. You can also log in to track your application status anytime.',
        },
        {
          q: 'Can I track my application status?',
          a: 'Yes. Once you\'re logged into your candidate account, you can see your applications and where they stand in the pipeline (Applied → Screening → Interview → Offer).',
        },
      ],
    },
    {
      category: 'Pricing & Contracts',
      questions: [
        {
          q: 'How is pricing structured?',
          a: 'Pricing varies by service and role. Recruitment is typically a one-time fee. Outsourcing is a recurring monthly management fee. We\'ll provide a quote after discussing your specific needs.',
        },
        {
          q: 'Are there any hidden fees?',
          a: 'No. We believe in transparency. Any fees, terms, or conditions are discussed and agreed upon before work begins.',
        },
        {
          q: 'Do you offer contracts?',
          a: 'Yes. We provide service agreements outlining scope, timeline, fees, and terms. All contracts are reviewed and signed before engagement begins.',
        },
      ],
    },
    {
      category: 'Account & Technical',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Visit our signup page and provide your email. You\'ll receive a confirmation link. After confirming, you can set up your profile based on your role (candidate, employer, or admin).',
        },
        {
          q: 'Can I change my account information?',
          a: 'Yes. You can update your profile, email, phone, and other details anytime from your account settings.',
        },
        {
          q: 'I forgot my password. What do I do?',
          a: 'Click "Forgot Password" on the login page and follow the email instructions. If you don\'t receive an email, check your spam folder or contact support.',
        },
        {
          q: 'Is my data secure?',
          a: 'Yes. We use industry-standard encryption, secure servers, and access controls to protect your data. See our Privacy Policy for full details.',
        },
      ],
    },
    {
      category: 'General',
      questions: [
        {
          q: 'How do I contact ASODS?',
          a: 'Visit our Contact page to send a message, or reach us directly: info@asods.com or +234 (0) XXX XXX XXXX (Mon–Fri, 9am–6pm WAT).',
        },
        {
          q: 'Do you offer consultations?',
          a: 'Yes. We\'re happy to discuss your staffing challenges, explore solutions, and provide guidance. Contact us to schedule a free 30-minute consultation.',
        },
        {
          q: 'Where is ASODS located?',
          a: 'We\'re headquartered in Lagos, Nigeria, but we serve clients across West Africa and work with candidates nationwide.',
        },
      ],
    },
  ]

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section 
          className="py-16 bg-cover bg-center bg-fixed relative"
          style={{
            backgroundImage: "url('/hero-faq.jpg')",
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
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-100">
              Answers to common questions about ASODS services, staffing requests, and accounts.
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            {faqs.map((section, sectionIdx) => (
              <div key={sectionIdx} className="mb-16">
                <h2
                  className="text-3xl font-bold mb-8"
                  style={{ color: '#0D1B2A' }}
                >
                  {section.category}
                </h2>
                <div className="space-y-4">
                  {section.questions.map((item, itemIdx) => {
                    const uniqueId = `${sectionIdx}-${itemIdx}`
                    const isOpen = openId === uniqueId

                    return (
                      <div
                        key={itemIdx}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                      >
                        <button
                          onClick={() => setOpenId(isOpen ? null : uniqueId)}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                        >
                          <span
                            className="font-semibold text-left text-lg"
                            style={{ color: '#0D1B2A' }}
                          >
                            {item.q}
                          </span>
                          <span
                            className="text-2xl transition-transform"
                            style={{ color: '#D4AF37' }}
                          >
                            {isOpen ? '−' : '+'}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <p className="text-gray-700 leading-relaxed">{item.a}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ backgroundColor: '#F1F2F6' }} className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
              Didn't find your answer?
            </h2>
            <p className="text-gray-600 mb-8">
              Reach out to our team — we're here to help.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition hover:shadow-lg"
              style={{ backgroundColor: '#0D1B2A' }}
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
