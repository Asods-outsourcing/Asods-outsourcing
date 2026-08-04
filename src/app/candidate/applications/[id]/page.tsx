'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface ApplicationDetail {
  id: string
  job_id: string
  job_title: string
  job_description: string
  job_location: string
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'placed' | 'rejected'
  created_at: string
  notes?: string
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

const stageDescriptions: Record<string, string> = {
  applied: 'Your application has been submitted and is awaiting review.',
  screening: 'Your application is being reviewed by our recruiting team.',
  interview: 'You have been invited for an interview. Our team will contact you with details.',
  offer: 'Congratulations! An offer is being prepared for you.',
  placed: 'You have been successfully placed in this position.',
  rejected:
    'Thank you for your interest. This time your application was not selected, but we encourage you to apply for other roles.',
}

export default function ApplicationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const applicationId = params.id as string
  const supabase = createClient()

  const [application, setApplication] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadApplication = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/candidate/login')
          return
        }

        // Get candidate ID to verify ownership
        const { data: candidate, error: candidateError } = await supabase
          .from('candidates')
          .select('id')
          .eq('profile_id', user.id)
          .single()

        if (candidateError || !candidate) {
          setError('Failed to verify candidate')
          setLoading(false)
          return
        }

        // Fetch application with job details
        const { data: appData, error: appError } = await supabase
          .from('applications')
          .select(
            `
            id,
            job_id,
            stage,
            notes,
            created_at,
            candidate_id,
            jobs (
              title,
              description,
              location
            )
          `
          )
          .eq('id', applicationId)
          .single()

        if (appError || !appData) {
          setError('Application not found')
          setLoading(false)
          return
        }

        // Verify ownership
        if (appData.candidate_id !== candidate.id) {
          setError('You do not have access to this application')
          setLoading(false)
          return
        }

        const jobsData = Array.isArray(appData.jobs) ? appData.jobs[0] : appData.jobs

        setApplication({
          id: appData.id,
          job_id: appData.job_id,
          job_title: jobsData?.title || 'Unknown Job',
          job_description: jobsData?.description || 'No description',
          job_location: jobsData?.location || 'Unknown Location',
          stage: appData.stage,
          created_at: appData.created_at,
          notes: appData.notes,
        })

        setLoading(false)
      } catch (err) {
        console.error('Error loading application:', err)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    loadApplication()
  }, [applicationId, supabase, router])

  return (
    <div className="min-h-screen bg-[#F1F2F6]">
      {/* Header */}
      <header className="bg-[#0D1B2A] text-white py-4 px-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">ASODS</h1>
            <p className="text-sm text-gray-300">Application Details</p>
          </div>
          <nav className="flex gap-6">
            <Link href="/candidate/applications" className="hover:text-[#D4AF37] transition">
              Back to Applications
            </Link>
            <Link href="/candidate/dashboard" className="hover:text-[#D4AF37] transition">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-12 px-4">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#333333]">Loading application details...</p>
          </div>
        ) : !application ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-[#333333] mb-4">Application not found</p>
            <Link
              href="/candidate/applications"
              className="text-[#D4AF37] hover:underline font-medium"
            >
              Back to applications
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-6">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${stageColors[application.stage]}`}>
                  {stageLabels[application.stage]}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-[#0D1B2A] mb-2">{application.job_title}</h1>
              <p className="text-gray-600 flex items-center gap-2 mb-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                {application.job_location}
              </p>

              <p className="text-sm text-gray-500">
                Applied {new Date(application.created_at).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Status Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-[#0D1B2A] mb-2">What Happens Next</h3>
              <p className="text-[#333333]">{stageDescriptions[application.stage]}</p>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">Job Description</h2>
              <p className="text-[#333333] whitespace-pre-wrap">{application.job_description}</p>
            </div>

            {/* Recruiter Notes */}
            {application.notes && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">Recruiter Notes</h2>
                <p className="text-[#333333]">{application.notes}</p>
              </div>
            )}

            {/* Timeline (simplified) */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-6">Application Timeline</h2>

              <div className="space-y-6">
                {/* Applied */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-[#D4AF37] rounded-full"></div>
                    <div className="w-1 bg-gray-300 flex-1 my-2"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0D1B2A]">Application Submitted</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(application.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Screening */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        ['screening', 'interview', 'offer', 'placed'].includes(
                          application.stage
                        )
                          ? 'bg-blue-600'
                          : 'bg-gray-300'
                      }`}
                    ></div>
                    <div className="w-1 bg-gray-300 flex-1 my-2"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0D1B2A]">Under Review</h3>
                    <p className="text-sm text-gray-600">
                      {['screening', 'interview', 'offer', 'placed'].includes(application.stage)
                        ? 'Complete'
                        : 'Pending'}
                    </p>
                  </div>
                </div>

                {/* Interview */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        ['interview', 'offer', 'placed'].includes(application.stage)
                          ? 'bg-purple-600'
                          : 'bg-gray-300'
                      }`}
                    ></div>
                    <div className="w-1 bg-gray-300 flex-1 my-2"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0D1B2A]">Interview</h3>
                    <p className="text-sm text-gray-600">
                      {['interview', 'offer', 'placed'].includes(application.stage)
                        ? 'Complete'
                        : 'Pending'}
                    </p>
                  </div>
                </div>

                {/* Offer */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        ['offer', 'placed'].includes(application.stage)
                          ? 'bg-green-600'
                          : 'bg-gray-300'
                      }`}
                    ></div>
                    <div className="w-1 bg-gray-300 flex-1 my-2"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0D1B2A]">Offer</h3>
                    <p className="text-sm text-gray-600">
                      {['offer', 'placed'].includes(application.stage)
                        ? 'Complete'
                        : 'Pending'}
                    </p>
                  </div>
                </div>

                {/* Placed */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        application.stage === 'placed' ? 'bg-[#D4AF37]' : 'bg-gray-300'
                      }`}
                    ></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0D1B2A]">Placed</h3>
                    <p className="text-sm text-gray-600">
                      {application.stage === 'placed' ? 'Complete' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="flex gap-4">
              <Link
                href="/candidate/applications"
                className="flex-1 px-4 py-3 border border-[#0D1B2A] text-[#0D1B2A] rounded-lg font-medium hover:bg-[#F1F2F6] transition text-center"
              >
                Back to Applications
              </Link>
              <Link
                href="/candidate/jobs"
                className="flex-1 px-4 py-3 bg-[#D4AF37] text-[#0D1B2A] rounded-lg font-medium hover:bg-[#c49d23] transition text-center"
              >
                Browse More Jobs
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
