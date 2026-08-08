'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import RichTextDisplay from '@/components/RichTextDisplay'

interface Job {
  id: string
  title: string
  description: string
  location: string
  employer_id: string
  created_at: string
}

export default function JobDetailPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.jobId as string
  const supabase = createClient()

  const [job, setJob] = useState<Job | null>(null)
  const [candidateId, setCandidateId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applied, setApplied] = useState(false)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    const loadData = async () => {
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

        // Fetch job details
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .maybeSingle()

        if (jobError || !jobData) {
          setError('Job not found')
          setLoading(false)
          return
        }

        setJob(jobData)

        // Check if already applied
        const { data: application } = await supabase
          .from('applications')
          .select('id')
          .eq('candidate_id', candidate.id)
          .eq('job_id', jobId)
          .maybeSingle()

        if (application) {
          setApplied(true)
        }

        setLoading(false)
      } catch (err) {
        console.error('Error loading job:', err)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    loadData()
  }, [jobId, supabase, router])

  const handleApply = async () => {
    if (!candidateId || !job) return

    setApplying(true)
    setError('')

    try {
      const { error: applyError } = await supabase.from('applications').insert({
        candidate_id: candidateId,
        job_id: job.id,
        stage: 'applied',
      })

      if (applyError) {
        if (applyError.code === '23505') {
          setError('You have already applied to this job')
        } else {
          setError('Failed to submit application')
        }
        setApplying(false)
        return
      }

      setApplied(true)
      setApplying(false)
    } catch (err) {
      console.error('Apply error:', err)
      setError('An unexpected error occurred')
      setApplying(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F1F2F6]">
      {/* Header */}
      <header className="bg-[#0D1B2A] text-white py-4 px-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">ASODS</h1>
            <p className="text-sm text-gray-300">Job Details</p>
          </div>
          <nav className="flex gap-6">
            <Link href="/candidate/jobs" className="hover:text-[#D4AF37] transition">
              Back to Jobs
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
            <p className="text-[#333333]">Loading job details...</p>
          </div>
        ) : !job ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-[#333333] mb-4">Job not found</p>
            <Link
              href="/candidate/jobs"
              className="text-[#D4AF37] hover:underline font-medium"
            >
              Back to jobs
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-[#0D1B2A] mb-2">{job.title}</h1>
              <p className="text-gray-600 flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5"
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
                {job.location}
              </p>
              <p className="text-sm text-gray-500">
                Posted {new Date(job.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="border-t border-b border-gray-200 py-6 mb-6">
              {applied && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">You have already applied to this job</span>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#0D1B2A] mb-4">Job Description</h2>
              <RichTextDisplay 
                content={job.description} 
                className="text-[#333333]"
              />
            </div>

            <div className="flex gap-4">
              <Link
                href="/candidate/jobs"
                className="flex-1 px-4 py-3 border border-[#0D1B2A] text-[#0D1B2A] rounded-lg font-medium hover:bg-[#F1F2F6] transition text-center"
              >
                Back to Jobs
              </Link>
              {applied ? (
                <button
                  disabled
                  className="flex-1 px-4 py-3 bg-gray-300 text-gray-600 rounded-lg font-medium cursor-not-allowed"
                >
                  Already Applied
                </button>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex-1 px-4 py-3 bg-[#D4AF37] text-[#0D1B2A] rounded-lg font-medium hover:bg-[#c49d23] disabled:opacity-50 transition"
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
