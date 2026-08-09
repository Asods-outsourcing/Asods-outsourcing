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
  job_summary: string
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
        console.log('[JobDetailPage] Starting load for jobId:', jobId)

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          console.log('[JobDetailPage] No authenticated user, redirecting to login')
          router.push('/candidate/login')
          return
        }

        console.log('[JobDetailPage] Authenticated user:', user.id)

        // Get candidate ID
        const { data: candidate, error: candidateError } = await supabase
          .from('candidates')
          .select('id')
          .eq('profile_id', user.id)
          .maybeSingle()

        if (candidateError) {
          console.error('[JobDetailPage] Candidate query error:', {
            code: candidateError.code,
            message: candidateError.message,
            hint: candidateError.hint,
            details: candidateError.details,
            fullError: JSON.stringify(candidateError),
          })
          setError('Failed to load candidate profile')
          setLoading(false)
          return
        }

        if (!candidate) {
          console.log('[JobDetailPage] No candidate record found for profile_id:', user.id)
          setError('Candidate profile not found. Please complete your profile first.')
          setLoading(false)
          return
        }

        console.log('[JobDetailPage] Found candidate:', candidate.id)
        setCandidateId(candidate.id)

        // Fetch job details
        console.log('[JobDetailPage] Fetching job with id:', jobId)
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .maybeSingle()

        if (jobError) {
          console.error('[JobDetailPage] Job query error:', {
            code: jobError.code,
            message: jobError.message,
            hint: jobError.hint,
            details: jobError.details,
            fullError: JSON.stringify(jobError),
          })
          setError('Failed to load job details')
          setLoading(false)
          return
        }

        if (!jobData) {
          console.log('[JobDetailPage] Job not found. jobId:', jobId)
          console.log('[JobDetailPage] This could indicate: missing job in table, job is private and not owned by employer, or RLS policy blocking access')
          setError('Job not found')
          setLoading(false)
          return
        }

        console.log('[JobDetailPage] Found job:', { id: jobData.id, title: jobData.title })
        setJob(jobData)

        // Check if already applied
        const { data: application, error: appError } = await supabase
          .from('applications')
          .select('id')
          .eq('candidate_id', candidate.id)
          .eq('job_id', jobId)
          .maybeSingle()

        if (appError) {
          console.error('[JobDetailPage] Application check error:', {
            code: appError.code,
            message: appError.message,
            fullError: JSON.stringify(appError),
          })
          // Don't fail the whole page, just log it
        } else if (application) {
          console.log('[JobDetailPage] User already applied to this job')
          setApplied(true)
        }

        setLoading(false)
      } catch (err) {
        console.error('[JobDetailPage] Unexpected error:', {
          error: err,
          errorString: String(err),
          errorJSON: err instanceof Error ? JSON.stringify({
            name: err.name,
            message: err.message,
            stack: err.stack,
          }) : 'Not an Error object',
        })
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
          console.error('[JobDetailPage] Application insert error:', {
            code: applyError.code,
            message: applyError.message,
            fullError: JSON.stringify(applyError),
          })
          setError('Failed to submit application')
        }
        setApplying(false)
        return
      }

      setApplied(true)
      setApplying(false)
    } catch (err) {
      console.error('[JobDetailPage] Apply error:', err)
      setError('An unexpected error occurred')
      setApplying(false)
    }
  }

  return (
    <main className="max-w-4xl mx-auto py-8 px-4 sm:py-12">
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
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
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B2A] mb-2 break-words">{job.title}</h1>
            <p className="text-gray-600 text-sm sm:text-base flex items-center gap-2 mb-3">
              <svg
                className="w-5 h-5 flex-shrink-0"
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
              <span>{job.location}</span>
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Posted {new Date(job.created_at).toLocaleDateString()}
            </p>
          </div>

          {job.job_summary && (
            <div className="mb-6 sm:mb-8 p-4 bg-[#F9F7F4] rounded-lg border-l-4 border-[#D4AF37]">
              <p className="text-base sm:text-lg text-[#333333] italic leading-relaxed">
                {job.job_summary}
              </p>
            </div>
          )}

          <div className="border-t border-b border-gray-200 py-4 sm:py-6 mb-6 sm:mb-8">
            {applied && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded flex items-start gap-2 text-sm">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">You have already applied to this job</span>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0D1B2A] mb-4">Job Description</h2>
            <div className="prose prose-sm sm:prose max-w-none">
              <RichTextDisplay 
                content={job.description} 
                className="text-[#333333] text-sm sm:text-base leading-relaxed"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/candidate/jobs"
              className="w-full sm:flex-1 px-4 py-3 border border-[#0D1B2A] text-[#0D1B2A] rounded-lg font-medium hover:bg-[#F1F2F6] transition text-center text-sm sm:text-base"
            >
              Back to Jobs
            </Link>
            {applied ? (
              <button
                disabled
                className="w-full sm:flex-1 px-4 py-3 bg-gray-300 text-gray-600 rounded-lg font-medium cursor-not-allowed text-sm sm:text-base"
              >
                Already Applied
              </button>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full sm:flex-1 px-4 py-3 bg-[#D4AF37] text-[#0D1B2A] rounded-lg font-medium hover:bg-[#c49d23] disabled:opacity-50 transition text-sm sm:text-base"
              >
                {applying ? 'Applying...' : 'Apply Now'}
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
