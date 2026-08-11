import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import RichTextDisplay from '@/components/RichTextDisplay'

// Mock job detail (fallback)
const mockJobDetail = {
  id: 'mock-1',
  title: 'Senior Recruiter',
  location: 'Lagos, Nigeria',
  description:
    'Lead recruitment initiatives for financial services clients. We\'re looking for an experienced recruiter with a proven track record of sourcing top talent.',
  requirements: [
    '5+ years of HR or recruitment experience',
    'Proven success in financial services or similar B2B recruitment',
    'Strong communication and relationship-building skills',
    'Ability to manage multiple searches simultaneously',
    'Knowledge of Lagos job market',
  ],
  responsibilities: [
    'Lead full-cycle recruitment for client roles',
    'Build and maintain talent pipelines',
    'Conduct initial screening and interviews',
    'Manage candidate relationships and follow-ups',
    'Provide market insights and hiring recommendations',
  ],
  created_at: new Date().toISOString(),
}

type Job = {
  id: string
  title: string
  location: string
  description: string
  requirements?: string[]
  responsibilities?: string[]
  created_at: string
}

async function getJobDetail(jobId: string): Promise<Job | null> {
  try {
    // TODO: Replace with live DB query once Supabase is connected
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, location, description, created_at')
      .eq('id', jobId)
      .eq('is_public', true)
      .single()

    if (error || !data) {
      console.warn('Job not found or DB error, using mock:', error?.message)
      return jobId.startsWith('mock') ? mockJobDetail : null
    }

    return {
      ...data,
      requirements: mockJobDetail.requirements,
      responsibilities: mockJobDetail.responsibilities,
    } as Job
  } catch (err) {
    console.warn('Error fetching job, using mock:', err)
    return jobId.startsWith('mock') ? mockJobDetail : null
  }
}

export const metadata = {
  title: 'Job Details - ASODS Careers',
  description: 'Join ASODS as a talented professional.',
}

export default async function JobDetail({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  const job = await getJobDetail(jobId)

  if (!job) {
    return (
      <>
        <Header />
        <main>
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
              <p className="text-gray-600 mb-8">
                The job you're looking for doesn't exist or is no longer available.
              </p>
              <Link
                href="/careers"
                className="inline-block px-6 py-2 rounded-lg font-semibold text-white"
                style={{ backgroundColor: '#0D1B2A' }}
              >
                Back to Careers
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-50 to-blue-50 py-12">
          <div className="max-w-4xl mx-auto px-6">
            <Link href="/careers" className="text-sm font-semibold mb-4 inline-block" style={{ color: '#D4AF37' }}>
              ← Back to Careers
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
              {job.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-gray-600">
              <span>📍 {job.location}</span>
              <span>
                📅 Posted {new Date(job.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </section>

        {/* Job Details */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Overview */}
                <div>
                  <h2 className="text-3xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                    About This Role
                  </h2>
                  <RichTextDisplay 
                    content={job.description}
                    className="text-gray-700 text-lg leading-relaxed"
                  />
                </div>

                {/* Responsibilities */}
                {job.responsibilities && job.responsibilities.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6" style={{ color: '#0D1B2A' }}>
                      What You'll Do
                    </h2>
                    <ul className="space-y-4">
                      {job.responsibilities.map((resp, i) => (
                        <li key={i} className="flex gap-4">
                          <span style={{ color: '#D4AF37' }} className="text-2xl flex-shrink-0">
                            ✓
                          </span>
                          <span className="text-gray-700">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6" style={{ color: '#0D1B2A' }}>
                      What We're Looking For
                    </h2>
                    <ul className="space-y-3">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="flex gap-3 text-gray-700">
                          <span style={{ color: '#0D1B2A' }} className="font-bold">
                            •
                          </span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Why Join */}
                <div>
                  <h2 className="text-3xl font-bold mb-6" style={{ color: '#0D1B2A' }}>
                    Why Join ASODS?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Work in a fast-growing startup',
                      'Impact thousands of lives daily',
                      'Competitive compensation & benefits',
                      'Professional development opportunities',
                      'Collaborative team environment',
                      'Mission-driven company culture',
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <span style={{ color: '#D4AF37' }}>★</span>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar CTA */}
              <div className="lg:col-span-1">
                <div
                  className="p-8 rounded-lg sticky top-24"
                  style={{ backgroundColor: '#F1F2F6' }}
                >
                  <h3 className="text-2xl font-bold mb-6" style={{ color: '#0D1B2A' }}>
                    Ready to Apply?
                  </h3>
                  <button
                    className="w-full px-6 py-4 rounded-lg font-semibold text-white transition hover:shadow-lg mb-4"
                    style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
                    onClick={() => alert('TODO: Route to candidate signup/login with job pre-selected')}
                  >
                    Apply Now
                  </button>
                  <p className="text-sm text-gray-600 text-center">
                    You'll need to create a candidate account to apply.
                  </p>

                  <div className="mt-8 pt-8 border-t border-gray-300">
                    <p className="text-sm text-gray-600 mb-4">
                      <strong>Questions?</strong> Reach out to our team.
                    </p>
                    <a
                      href="/contact"
                      className="block text-center px-4 py-2 rounded-lg font-semibold transition"
                      style={{ backgroundColor: '#0D1B2A', color: '#D4AF37' }}
                    >
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* More Roles CTA */}
        <section style={{ backgroundColor: '#0D1B2A' }} className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Interested but not the right fit?
            </h2>
            <p className="text-gray-300 mb-8">
              Check out our other open positions.
            </p>
            <Link
              href="/careers"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition hover:shadow-lg"
              style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
            >
              Browse All Positions
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
