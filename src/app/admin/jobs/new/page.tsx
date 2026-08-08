'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import RichTextEditor from '@/components/RichTextEditor'

interface Employer {
  id: string
  company_name: string
}

export default function CreateJobPage() {
  const router = useRouter()
  const supabase = createClient()

  const [employers, setEmployers] = useState<Employer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingEmployers, setLoadingEmployers] = useState(true)

  // Form state
  const [title, setTitle] = useState('')
  const [jobSummary, setJobSummary] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [employerId, setEmployerId] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  // Load employers on mount
  useEffect(() => {
    const loadEmployers = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('employers')
          .select('id, company_name')
          .order('company_name', { ascending: true })

        if (fetchError) {
          console.error('[Create Job] Employers fetch error:', fetchError)
          setError('Failed to load employers')
          setLoadingEmployers(false)
          return
        }

        setEmployers(data || [])
        if (data && data.length > 0) {
          setEmployerId(data[0].id)
        } else {
          setEmployerId('')
        }
        setLoadingEmployers(false)
      } catch (err) {
        console.error('[Create Job] Error loading employers:', err)
        setError('Failed to load employers')
        setLoadingEmployers(false)
      }
    }

    loadEmployers()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate inputs (employer is optional)
      if (!title || !jobSummary || !description || !location) {
        setError('Title, job summary, description, and location are required')
        setLoading(false)
        return
      }

      console.log('[Create Job] Creating job:', { title, location, employerId })

      const { error: insertError } = await supabase.from('jobs').insert({
        title,
        job_summary: jobSummary,
        description,
        location,
        employer_id: employerId || null,
        is_public: isPublic,
      })

      if (insertError) {
        console.error('[Create Job] Insert error:', insertError)
        setError(insertError.message || 'Failed to create job')
        setLoading(false)
        return
      }

      console.log('[Create Job] Job created successfully')
      router.push('/admin/jobs')
    } catch (err) {
      console.error('[Create Job] Unexpected error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <Link href="/admin/jobs" className="text-[#D4AF37] hover:text-[#c49d23] font-medium text-sm">
          ← Back to Jobs
        </Link>
        <h1 className="text-2xl md:text-4xl font-bold text-[#0D1B2A] mt-4 mb-1 md:mb-2">Create Job Listing</h1>
        <p className="text-sm md:text-base text-gray-600">Add a new job posting for candidates to apply to</p>
      </div>


      <div className="bg-white rounded-lg shadow-md p-4 md:p-8 max-w-2xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
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

          {/* Job Summary */}
          <div>
            <label htmlFor="jobSummary" className="block text-sm font-medium text-[#333333] mb-2">
              Job Summary
              <span className="text-gray-500 font-normal text-xs ml-2">(1-2 sentences, shown on job listing cards)</span>
            </label>
            <textarea
              id="jobSummary"
              value={jobSummary}
              onChange={(e) => setJobSummary(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="Brief summary of the role..."
              rows={2}
              disabled={loading}
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{jobSummary.length}/200 characters</p>
          </div>

          {/* Description - Rich Text Editor */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#333333] mb-2">
              Job Description
              <span className="text-gray-500 font-normal text-xs ml-2">(Rich text format - use Bold, Italics, Lists)</span>
            </label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Enter full job description, responsibilities, requirements..."
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
            {loadingEmployers ? (
              <p className="text-gray-600 text-sm">Loading employers...</p>
            ) : (
              <select
                id="employer"
                value={employerId}
                onChange={(e) => setEmployerId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                disabled={loading}
              >
                <option value="">— No employer assigned —</option>
                {employers.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.company_name}
                  </option>
                ))}
              </select>
            )}
            {employers.length === 0 && !loadingEmployers && (
              <p className="text-gray-600 text-sm mt-2">
                No employers available. You can add one later via{' '}
                <Link href="/employers/request" className="text-[#D4AF37] hover:underline">
                  /employers/request
                </Link>
                .
              </p>
            )}
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
              {loading ? 'Creating...' : 'Create Job'}
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
