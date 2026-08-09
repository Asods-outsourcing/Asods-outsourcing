'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Job {
  id: string
  title: string
  job_summary: string
  description: string
  location: string
  employer_id: string
  created_at: string
}

interface JobWithApplicationStatus extends Job {
  applied: boolean
  applicationId?: string
}

export default function JobsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [jobs, setJobs] = useState<JobWithApplicationStatus[]>([])
  const [candidateId, setCandidateId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null)

  // Check auth and load jobs
  useEffect(() => {
    const loadJobsAndApplications = async () => {
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

        setCandidateId(candidate.id)

        // Fetch public jobs
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })

        if (jobsError) {
          setError('Failed to load jobs')
          setLoading(false)
          return
        }

        // Fetch candidate's applications
        const { data: applications, error: applicationsError } = await supabase
          .from('applications')
          .select('id, job_id')
          .eq('candidate_id', candidate.id)

        if (applicationsError) {
          console.error('Failed to fetch applications:', applicationsError)
        }

        // Create a map of applied job IDs
        const appliedJobIds = new Set(applications?.map((app) => app.job_id) || [])

        // Combine jobs with application status
        const jobsWithStatus: JobWithApplicationStatus[] = jobsData.map((job) => ({
          ...job,
          applied: appliedJobIds.has(job.id),
          applicationId: applications?.find((app) => app.job_id === job.id)?.id,
        }))

        setJobs(jobsWithStatus)
        setLoading(false)
      } catch (err) {
        console.error('Error loading jobs:', err)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    loadJobsAndApplications()
  }, [supabase, router])

  const handleApply = async (jobId: string) => {
    if (!candidateId) {
      setError('Candidate profile not found')
      return
    }

    setApplyingJobId(jobId)
    setError('')

    try {
      const { error: applyError } = await supabase.from('applications').insert({
        candidate_id: candidateId,
        job_id: jobId,
        stage: 'applied',
      })

      if (applyError) {
        if (applyError.code === '23505') {
          // Unique constraint violation (duplicate application)
          setError('You have already applied to this job')
        } else {
          setError('Failed to submit application')
        }
        setApplyingJobId(null)
        return
      }

      // Update local state to mark as applied
      setJobs(jobs.map((job) => (job.id === jobId ? { ...job, applied: true } : job)))
      setApplyingJobId(null)
    } catch (err) {
      console.error('Apply error:', err)
      setError('An unexpected error occurred')
      setApplyingJobId(null)
    }
  }

  return (
    <main className="max-w-6xl mx-auto py-8 px-4 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0D1B2A] mb-2">Open Opportunities</h1>
        <p className="text-[#333333] text-sm sm:text-base">Explore positions that match your skills</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-[#333333]">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-[#333333] mb-4">No jobs available at the moment</p>
          <p className="text-gray-600 text-sm">Check back soon for new opportunities</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-md p-5 sm:p-6 hover:shadow-lg transition flex flex-col h-full"
            >
              <div className="mb-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-[#0D1B2A] line-clamp-2">{job.title}</h3>
                  {job.applied && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex-shrink-0">
                      Applied
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-2">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
                  <span className="line-clamp-1">{job.location}</span>
                </p>
              </div>

              <p className="text-[#333333] text-sm mb-6 line-clamp-3 flex-grow">{job.job_summary || job.description}</p>

              <div className="flex flex-col gap-2 mt-auto">
                <Link
                  href={`/candidate/jobs/${job.id}`}
                  className="w-full px-4 py-2 border border-[#0D1B2A] text-[#0D1B2A] rounded-lg font-medium hover:bg-[#F1F2F6] transition text-center text-sm"
                >
                  View Details
                </Link>
                {job.applied ? (
                  <button
                    disabled
                    className="w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-lg font-medium cursor-not-allowed text-sm"
                  >
                    Already Applied
                  </button>
                ) : (
                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={applyingJobId === job.id}
                    className="w-full px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded-lg font-medium hover:bg-[#c49d23] disabled:opacity-50 transition text-sm"
                  >
                    {applyingJobId === job.id ? 'Applying...' : 'Apply Now'}
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Posted {new Date(job.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
