'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Employer {
  id: string
  company_name: string
}

interface Job {
  id: string
  title: string
  description: string
  location: string
  employer_id: string
  is_public: boolean
  created_at: string
}

export default function EditJobPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string
  const supabase = createClient()

  const [job, setJob] = useState<Job | null>(null)
  const [employers, setEmployers] = useState<Employer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingData, setLoadingData] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [employerId, setEmployerId] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  // Load job and employers on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load job
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .maybeSingle()

        if (jobError) {
          console.error('[Edit Job] Job fetch error:', jobError)
          setError('Failed to load job')
          setLoadingData(false)
          return
        }

        if (!jobData) {
          console.error('[Edit Job] Job not found')
          setError('Job not found')
          setLoadingData(false)
          return
        }

        setJob(jobData)
        setTitle(jobData.title)
        setDescription(jobData.description)
        setLocation(jobData.location)
        setEmployerId(jobData.employer_id)
        setIsPublic(jobData.is_public)

        // Load employers
        const { data: employersData, error: employersError } = await supabase
          .from('employers')
          .select('id, company_name')
          .order('company_name', { ascending: true })

        if (employersError) {
          console.error('[Edit Job] Employers fetch error:', employersError)
        } else {
          setEmployers(employersData || [])
        }

        setLoadingData(false)
      } catch (err) {
        console.error('[Edit Job] Error loading data:', err)
        setError('Failed to load data')
        setLoadingData(false)
      }
    }

    loadData()
  }, [jobId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaveSuccess(false)
    setLoading(true)

    try {
      // Validate inputs (employer is optional)
      if (!title || !description || !location) {
        setError('Title, description, and location are required')
        setLoading(false)
        return
      }

      console.log('[Edit Job] Updating job:', jobId)

      const { error: updateError } = await supabase
        .from('jobs')
        .update({
          title,
          description,
          location,
          employer_id: employerId,
          is_public: isPublic,
        })
        .eq('id', jobId)

      if (updateError) {
        console.error('[Edit Job] Update error:', updateError)
        setError(updateError.message || 'Failed to update job')
        setLoading(false)
        return
      }

      console.log('[Edit Job] Job updated successfully')
      setSaveSuccess(true)
      setLoading(false)

      // Auto-redirect after 2 seconds
      setTimeout(() => {
        router.push('/admin/jobs')
      }, 2000)
    } catch (err) {
      console.error('[Edit Job] Unexpected error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading job...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <Link href="/admin/jobs" className="text-[#D4AF37] hover:text-[#c49d23] font-medium text-sm">
          ← Back to Jobs
        </Link>
        <h1 className="text-2xl md:text-4xl font-bold text-[#0D1B2A] mt-4 mb-1 md:mb-2">Edit Job Listing</h1>
        <p className="text-sm md:text-base text-gray-600">Update job details</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-8 max-w-2xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
            Job updated successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#333333] mb-2">
              Job Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="e.g. Senior Software Engineer"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#333333] mb-2">
              Job Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="Full job description, responsibilities, requirements..."
              rows={6}
              disabled={loading}
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-[#333333] mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="e.g. New York, NY or Remote"
              disabled={loading}
            />
          </div>

          {/* Employer */}
          <div>
            <label htmlFor="employer" className="block text-sm font-medium text-[#333333] mb-2">
              Employer (optional)
            </label>
            <select
              id="employer"
              value={employerId}
              onChange={(e) => setEmployerId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              disabled={loading || employers.length === 0}
            >
              <option value="">— No employer assigned —</option>
              {employers.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.company_name}
                </option>
              ))}
            </select>
          </div>

          {/* Is Public Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 border-gray-300 rounded cursor-pointer"
              disabled={loading}
            />
            <label htmlFor="isPublic" className="text-sm font-medium text-[#333333] cursor-pointer">
              Make this job public (visible to candidates)
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-[#0D1B2A] text-white rounded-lg font-medium hover:bg-[#0a1420] disabled:opacity-50 transition text-sm md:text-base"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/admin/jobs"
              className="w-full px-4 py-2 bg-gray-200 text-[#333333] rounded-lg font-medium hover:bg-gray-300 transition text-center text-sm md:text-base"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
