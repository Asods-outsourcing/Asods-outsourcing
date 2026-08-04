'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState } from 'react'
import { submitStaffingRequest } from './actions'

export default function RequestStaff() {
  const [formData, setFormData] = useState({
    companyName: '',
    rolesNeeded: '',
    quantity: '1',
    timeline: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [requestId, setRequestId] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required'
    if (!formData.rolesNeeded.trim()) newErrors.rolesNeeded = 'Roles needed is required'
    if (!formData.quantity || parseInt(formData.quantity) < 1) newErrors.quantity = 'Quantity must be at least 1'
    if (!formData.timeline.trim()) newErrors.timeline = 'Timeline is required'
    if (!formData.contactName.trim()) newErrors.contactName = 'Name is required'
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email is required'
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email'
    }
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const result = await submitStaffingRequest({
        companyName: formData.companyName,
        rolesNeeded: formData.rolesNeeded,
        quantity: parseInt(formData.quantity),
        timeline: formData.timeline,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
      })

      if (result.success) {
        setRequestId(result.requestId || null)
        setSubmitted(true)
      } else {
        setErrors({ submit: result.message })
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-50 to-blue-50 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
              Request Staff
            </h1>
            <p className="text-xl text-gray-600">
              Tell us what you need. We'll get back to you within 24 hours with a plan.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-20 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            {submitted ? (
              // Success Screen
              <div
                className="p-12 rounded-lg text-center"
                style={{ backgroundColor: '#F1F2F6' }}
              >
                <div className="text-6xl mb-6" style={{ color: '#D4AF37' }}>
                  ✓
                </div>
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  Request Received!
                </h2>
                <p className="text-gray-600 mb-6">
                  Thank you for submitting your staffing request. We've received your information and will review it right away.
                </p>
                <div
                  className="p-6 bg-white rounded-lg border-2 mb-8"
                  style={{ borderColor: '#D4AF37' }}
                >
                  <p className="text-sm text-gray-500 mb-2">Request ID</p>
                  <p className="text-lg font-mono font-bold" style={{ color: '#0D1B2A' }}>
                    {requestId}
                  </p>
                </div>
                <div className="space-y-4 text-left bg-blue-50 p-6 rounded-lg mb-8">
                  <h3 className="font-bold text-lg mb-3" style={{ color: '#0D1B2A' }}>
                    What Happens Next:
                  </h3>
                  <ol className="space-y-3">
                    <li className="flex gap-3">
                      <span style={{ color: '#D4AF37' }} className="font-bold">
                        1.
                      </span>
                      <span className="text-gray-700">
                        Our team reviews your requirements within 24 hours.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span style={{ color: '#D4AF37' }} className="font-bold">
                        2.
                      </span>
                      <span className="text-gray-700">
                        We'll contact you to clarify details and set expectations.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span style={{ color: '#D4AF37' }} className="font-bold">
                        3.
                      </span>
                      <span className="text-gray-700">
                        We actively source candidates and update you on progress.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span style={{ color: '#D4AF37' }} className="font-bold">
                        4.
                      </span>
                      <span className="text-gray-700">
                        You review our shortlist and schedule interviews.
                      </span>
                    </li>
                  </ol>
                </div>
                <p className="text-gray-600 mb-8">
                  Check your email ({formData.contactEmail}) for our follow-up message.
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition hover:shadow-lg"
                  style={{ backgroundColor: '#0D1B2A' }}
                >
                  Back to Home
                </button>
              </div>
            ) : (
              // Form
              <div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: '#0D1B2A' }}>
                  Tell Us About Your Needs
                </h2>
                <p className="text-gray-600 mb-8">
                  This should take just 2 minutes. The more detail you provide, the faster we can find the right candidates.
                </p>

                {errors.submit && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 mb-6 rounded">
                    <p className="text-red-700 font-semibold">{errors.submit}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Info */}
                  <div>
                    <h3 className="font-bold text-lg mb-4" style={{ color: '#0D1B2A' }}>
                      About Your Company
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#0D1B2A' }}>
                          Company Name *
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="e.g., ABC Bank Limited"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition ${
                            errors.companyName ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.companyName && (
                          <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Staffing Needs */}
                  <div>
                    <h3 className="font-bold text-lg mb-4" style={{ color: '#0D1B2A' }}>
                      What You Need
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#0D1B2A' }}>
                          Roles You're Looking For *
                        </label>
                        <textarea
                          name="rolesNeeded"
                          value={formData.rolesNeeded}
                          onChange={handleChange}
                          placeholder="e.g., 2 Customer Service Reps, 1 Sales Manager"
                          rows={3}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition ${
                            errors.rolesNeeded ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.rolesNeeded && (
                          <p className="text-red-500 text-sm mt-1">{errors.rolesNeeded}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#0D1B2A' }}>
                          Total Quantity Needed *
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          min="1"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition ${
                            errors.quantity ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.quantity && (
                          <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#0D1B2A' }}>
                          When Do You Need Them? *
                        </label>
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition ${
                            errors.timeline ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select timeline</option>
                          <option value="within-1-week">Within 1 week (urgent)</option>
                          <option value="within-2-weeks">Within 2 weeks</option>
                          <option value="within-1-month">Within 1 month</option>
                          <option value="flexible">Flexible</option>
                        </select>
                        {errors.timeline && (
                          <p className="text-red-500 text-sm mt-1">{errors.timeline}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="font-bold text-lg mb-4" style={{ color: '#0D1B2A' }}>
                      Your Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#0D1B2A' }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleChange}
                          placeholder="Your name"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition ${
                            errors.contactName ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.contactName && (
                          <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: '#0D1B2A' }}>
                            Email *
                          </label>
                          <input
                            type="email"
                            name="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition ${
                              errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.contactEmail && (
                            <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: '#0D1B2A' }}>
                            Phone *
                          </label>
                          <input
                            type="tel"
                            name="contactPhone"
                            value={formData.contactPhone}
                            onChange={handleChange}
                            placeholder="+234..."
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition ${
                              errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.contactPhone && (
                            <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 rounded-lg font-semibold text-white transition hover:shadow-lg disabled:opacity-50"
                    style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </button>

                  <p className="text-center text-sm text-gray-500">
                    We respect your privacy. Your information will only be used to process your staffing request.
                  </p>
                </form>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section style={{ backgroundColor: '#F1F2F6' }} className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#0D1B2A' }}>
              Why Choose ASODS?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '⏱️',
                  title: 'Fast Response',
                  desc: '24-hour turnaround on your request. We understand every day of vacancy costs you money.',
                },
                {
                  icon: '👥',
                  title: 'Quality Candidates',
                  desc: 'Pre-screened, qualified professionals. Not a list of resumes—actual vetted candidates.',
                },
                {
                  icon: '📊',
                  title: 'Transparent Pipeline',
                  desc: 'See your staffing request status in real time. No guessing. No black hole.',
                },
              ].map((item, i) => (
                <div key={i} className="text-center p-8 bg-white rounded-lg border border-gray-200">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#0D1B2A' }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
