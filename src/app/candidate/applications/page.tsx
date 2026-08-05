'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Application {
  id: string
  job_id: string
  job_title: string
  job_location: string
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'placed' | 'rejected'
  created_at: string
}

const stageColors: Record<string, string> = {
  applied: 'bg-gray-100 text-gray-700',
  screening: 'bg-blue-100 text-blue-700',
  interview: 'bg-purple-100 text-purple-700',
  offer: 'bg-green-100 text-green-700',
  placed: 'bg-[#D4AF37] text-[#0D1B2A]',
  rejected: 'bg-red-100 text-red-700',
}

const stageLabels: Record<string, string> = {
  applied: 'Applied',
  screening: 'Under Review',
  interview: 'Interview',
  offer: 'Offer Received',
  placed: 'Placed',
  rejected: 'Not Selected',
}

export default function ApplicationsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStage, setFilterStage] = useState<string | null>(null)

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/candidate/login')
          return
        }

        // Get candidate ID
        const { data: candidate, error: candidateError } = await supabase
          .from('candidates')
          .select('id')
          .eq('profile_id', user.id)
          .maybeSingle()

        if (candidateError || !candidate) {
          setError('Failed to load candidate profile')
          setLoading(false)
          return
        }

        // Fetch applications with job details
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(
            `
            id,
            job_id,
            stage,
            created_at,
            jobs (
              title,
              location
            )
          `
          )
          .eq('candidate_id', candidate.id)
          .order('created_at', { ascending: false })

        if (applicationsError) {
          setError('Failed to load applications')
          setLoading(false)
          return
        }

        // Map the data
        const mapped: Application[] = (applicationsData || []).map((app: any) => ({
          id: app.id,
          job_id: app.job_id,
          job_title: app.jobs?.title || 'Unknown Job',
          job_location: app.jobs?.location || 'Unknown Location',
          stage: app.stage,
          created_at: app.created_at,
        }))

        setApplications(mapped)
        setLoading(false)
      } catch (err) {
        console.error('Error loading applications:', err)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    loadApplications()
  }, [supabase, router])

  const filteredApplications = filterStage
    ? applications.filter((app) => app.stage === filterStage)
    : applications

  return (
    <div className="min-h-screen bg-[#F1F2F6]">
      {/* Header */}
      <header className="bg-[#0D1B2A] text-white py-4 px-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">ASODS</h1>
            <p className="text-sm text-gray-300">Applications</p>
          </div>
          <nav className="flex gap-6">
            <Link href="/candidate/dashboard" className="hover:text-[#D4AF37] transition">
              Dashboard
            </Link>
            <Link href="/candidate/jobs" className="hover:text-[#D4AF37] transition">
              Browse Jobs
            </Link>
            <Link href="/candidate/profile" className="hover:text-[#D4AF37] transition">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#0D1B2A] mb-4">Your Applications</h2>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#333333]">Loading your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-[#333333] mb-4">You haven&rsquo;t applied to any jobs yet</p>
            <Link
              href="/candidate/jobs"
              className="inline-block bg-[#D4AF37] text-[#0D1B2A] px-6 py-2 rounded-lg font-medium hover:bg-[#c49d23] transition"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <>
            {/* Filter tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStage(null)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStage === null
                    ? 'bg-[#0D1B2A] text-white'
                    : 'bg-white text-[#0D1B2A] border border-gray-300 hover:bg-gray-50'
                }`}
              >
                All ({applications.length})
              </button>
              {Object.entries(stageLabels).map(([stage, label]) => {
                const count = applications.filter((app) => app.stage === stage).length
                if (count === 0) return null
                return (
                  <button
                    key={stage}
                    onClick={() => setFilterStage(stage)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filterStage === stage
                        ? 'bg-[#0D1B2A] text-white'
                        : 'bg-white text-[#0D1B2A] border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {label} ({count})
                  </button>
                )
              })}
            </div>

            {/* Applications list */}
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <Link
                  key={app.id}
                  href={`/candidate/applications/${app.id}`}
                  className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#0D1B2A] mb-1">{app.job_title}</h3>
                      <p className="text-gray-600 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {app.job_location}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${stageColors[app.stage]}`}>
                      {stageLabels[app.stage]}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    Applied {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
