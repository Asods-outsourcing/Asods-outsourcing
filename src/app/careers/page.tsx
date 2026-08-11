import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createPreview } from '@/lib/htmlUtils'

export const metadata = {
  title: 'Careers - ASODS Outsourcing Services',
  description: 'Browse open positions at ASODS. Find opportunities in recruitment, operations, and more.',
}

// Mock jobs data (fallback when DB is unavailable)
const mockJobs = [
  {
    id: 'mock-1',
    title: 'Senior Recruiter',
    employer: 'ASODS',
    location: 'Lagos, Nigeria',
    description: 'Lead recruitment initiatives for financial services clients. 5+ years HR/recruitment experience required.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Operations Manager',
    employer: 'ASODS',
    location: 'Lagos, Nigeria',
    description: 'Oversee staffing deployments and ensure client satisfaction. Strong organizational and communication skills required.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Account Executive',
    employer: 'ASODS',
    location: 'Lagos, Nigeria',
    description: 'Build and manage relationships with B2B clients. Sales background and market knowledge a plus.',
    created_at: new Date().toISOString(),
  },
]

type Job = {
  id: string
  title: string
  employer?: string
  location: string
  description: string
  created_at: string
}

async function getJobs(): Promise<Job[]> {
  try {
    // TODO: Replace with live DB query once Supabase is connected
    const supabase = await createClient()

    // Attempt to fetch from Supabase (guarded to prevent crash)
    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, location, description, created_at')
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Supabase fetch failed, using mock data:', error.message)
      return mockJobs
    }

    // If successful, return real data
    if (data && data.length > 0) {
      return data as Job[]
    }

    // If no jobs in DB, use mock data
    console.info('No jobs in database, using mock data')
    return mockJobs
  } catch (err) {
    console.warn('Error fetching jobs, using mock data:', err)
    return mockJobs
  }
}

export default async function Careers() {
  const jobs = await getJobs()

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section 
          className="bg-cover bg-center bg-fixed relative py-16"
          style={{
            backgroundImage: "url('/hero-careers.jpg')",
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
              Join the ASODS Team
            </h1>
            <p className="text-xl text-gray-100">
              Build your career with Nigeria's leading workforce solutions partner.
            </p>
          </div>
        </section>

        {/* Jobs List */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            {jobs && jobs.length > 0 ? (
              <div>
                <h2 className="text-3xl font-bold mb-8" style={{ color: '#0D1B2A' }}>
                  Open Positions
                </h2>
                <div className="space-y-6">
                  {jobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/careers/${job.id}`}
                      className="block p-8 border-2 rounded-lg hover:shadow-lg transition"
                      style={{ borderColor: '#D4AF37' }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-2" style={{ color: '#0D1B2A' }}>
                            {job.title}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            {createPreview(job.description, 120)}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span>📍 {job.location}</span>
                            <span>
                              📅 Posted{' '}
                              {new Date(job.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          className="px-6 py-3 rounded-lg font-semibold text-white transition"
                          style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
                        >
                          View Details
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No open positions at the moment. Check back soon or{' '}
                  <Link href="/contact" className="font-semibold" style={{ color: '#D4AF37' }}>
                    contact us
                  </Link>{' '}
                  if you'd like to inquire about opportunities.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Why Work Here */}
        <section style={{ backgroundColor: '#F1F2F6' }} className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#0D1B2A' }}>
              Why Join ASODS?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🌟',
                  title: 'Impact',
                  desc: 'Help thousands of professionals find meaningful work and clients scale their businesses.',
                },
                {
                  icon: '📈',
                  title: 'Growth',
                  desc: 'Work in a fast-growing company with opportunities to expand your skills and career.',
                },
                {
                  icon: '🤝',
                  title: 'Team Culture',
                  desc: 'Join a collaborative, mission-driven team that values professionalism and integrity.',
                },
              ].map((item, i) => (
                <div key={i} className="p-8 bg-white rounded-lg text-center">
                  <div className="text-4xl mb-4">{item.icon}</div>
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
              Interested in joining ASODS?
            </h2>
            <p className="text-gray-300 mb-8">
              Subscribe to our career updates or reach out to learn about future opportunities.
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
