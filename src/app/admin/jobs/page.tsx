'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Job {
  id: string
  title: string
  location: string
  is_public: boolean
  status: 'open' | 'filled' | 'paused'
  category: string | null
  created_at: string
  employer_id: string
  description?: string
  job_summary?: string
  employers?: {
    company_name: string
  }
}

interface JobWithApplicationCount extends Job {
  applicationCount: number
}

export default function AdminJobsPage() {
  const supabase = createClient()

  const [jobs, setJobs] = useState<JobWithApplicationCount[]>([])
  const [filteredJobs, setFilteredJobs] = useState<JobWithApplicationCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null)
  const [showDeleteWarning, setShowDeleteWarning] = useState<{ jobId: string; appCount: number } | null>(null)
  const [updatingStatusJobId, setUpdatingStatusJobId] = useState<string | null>(null)

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('jobs')
          .select(`
            id,
            title,
            location,
            is_public,
            status,
            category,
            created_at,
            employer_id,
            description,
            job_summary
          `)
          .order('created_at', { ascending: false })

        if (fetchError) {
          console.error('[Admin Jobs] Fetch error:', fetchError)
          setError('Failed to load jobs')
          setLoading(false)
          return
        }

        // Get unique employer IDs
        const employerIds = Array.from(new Set((data || []).map((job: any) => job.employer_id)))

        // Fetch all employers
        let employerMap: Record<string, any> = {}
        if (employerIds.length > 0) {
          const { data: employers } = await supabase
            .from('employers')
            .select('id, company_name')
            .in('id', employerIds)

          if (employers) {
            employerMap = Object.fromEntries(employers.map((e: any) => [e.id, e]))
          }
        }

        // Fetch application counts for each job
        const { data: appCounts } = await supabase
          .from('applications')
          .select('job_id, count')
          .in(
            'job_id',
            (data || []).map((j: any) => j.id)
          )

        const appCountMap: Record<string, number> = {}
        if (appCounts) {
          appCounts.forEach((item: any) => {
            appCountMap[item.job_id] = item.count || 0
          })
        }

        // Enrich jobs with employer data and application count
        const enriched = (data || []).map((job: any) => ({
          ...job,
          employers: employerMap[job.employer_id] || { company_name: 'Unknown' },
          applicationCount: appCountMap[job.id] || 0,
        }))

        setJobs(enriched)
        setFilteredJobs(enriched)
        setLoading(false)
      } catch (err) {
        console.error('[Admin Jobs] Error:', err)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    loadJobs()
  }, [supabase])

  // Update filtered jobs when search query changes
  useEffect(() => {
    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredJobs(filtered)
  }, [searchQuery, jobs])

  const handleDeleteJob = async (jobId: string) => {
    setDeletingJobId(jobId)
    setError('')

    try {
      const { error: deleteError } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)

      if (deleteError) {
        console.error('[Admin Jobs] Delete error:', deleteError)
        setError('Failed to delete job')
        setDeletingJobId(null)
        return
      }

      setJobs(jobs.filter((job) => job.id !== jobId))
      setShowDeleteWarning(null)
      setDeletingJobId(null)
    } catch (err) {
      console.error('[Admin Jobs] Delete error:', err)
      setError('An unexpected error occurred')
      setDeletingJobId(null)
    }
  }

  const handleStatusChange = async (jobId: string, newStatus: 'open' | 'filled' | 'paused') => {
    setError('')
    setUpdatingStatusJobId(jobId)

    try {
      const { error: updateError } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', jobId)

      if (updateError) {
        console.error('[Admin Jobs] Status update error:', updateError)
        setError('Failed to update job status')
        setUpdatingStatusJobId(null)
        return
      }

      // Update local state
      setJobs(jobs.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      ))
      setFilteredJobs(filteredJobs.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      ))
      setUpdatingStatusJobId(null)
    } catch (err) {
      console.error('[Admin Jobs] Status update error:', err)
      setError('An unexpected error occurred')
      setUpdatingStatusJobId(null)
    }
  }

  const handleDuplicateJob = async (job: JobWithApplicationCount) => {
    setError('')

    try {
      const { error: insertError } = await supabase.from('jobs').insert({
        title: job.title,
        description: job.description || '',
        job_summary: job.job_summary || '',
        location: job.location,
        category: job.category,
        employer_id: job.employer_id,
        is_public: job.is_public,
        status: 'open', // New duplicates always start as open
      })

      if (insertError) {
        console.error('[Admin Jobs] Duplicate error:', insertError)
        setError('Failed to duplicate job')
        return
      }

      // Reload jobs
      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          location,
          is_public,
          status,
          category,
          created_at,
          employer_id
        `)
        .order('created_at', { ascending: false })

      if (!fetchError && data) {
        const employerIds = Array.from(new Set(data.map((j: any) => j.employer_id)))
        let employerMap: Record<string, any> = {}
        if (employerIds.length > 0) {
          const { data: employers } = await supabase
            .from('employers')
            .select('id, company_name')
            .in('id', employerIds)

          if (employers) {
            employerMap = Object.fromEntries(employers.map((e: any) => [e.id, e]))
          }
        }

        const enriched = data.map((j: any) => ({
          ...j,
          employers: employerMap[j.employer_id] || { company_name: 'Unknown' },
          applicationCount: 0,
        }))

        setJobs(enriched)
        setFilteredJobs(enriched)
      }
    } catch (err) {
      console.error('[Admin Jobs] Duplicate error:', err)
      setError('An unexpected error occurred')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-50 text-blue-700'
      case 'filled':
        return 'bg-green-50 text-green-700'
      case 'paused':
        return 'bg-yellow-50 text-yellow-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open - visible to candidates'
      case 'filled':
        return 'Filled - position taken'
      case 'paused':
        return 'Paused - temporarily hidden'
      default:
        return status
    }
    }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div>
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-[#0D1B2A] mb-1 md:mb-2">Job Listings</h1>
          <p className="text-sm md:text-base text-gray-600">Manage all active job postings</p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="w-full md:w-auto px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded font-medium hover:bg-[#c49d23] transition text-sm text-center"
        >
          + Create Job
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 mb-4">No job listings yet.</p>
          <Link
            href="/admin/jobs/new"
            className="text-[#D4AF37] hover:text-[#c49d23] font-medium"
          >
            Create the first job →
          </Link>
        </div>
      ) : (
        <>
          {/* Search Box */}
          <div className="mb-6 bg-white rounded-lg shadow-md p-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none text-sm"
            />
          </div>

          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">No jobs match your search.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full min-w-max md:min-w-0">
                <thead>
                  <tr className="bg-[#F1F2F6] border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                      Title & Applicants
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#0D1B2A]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job, idx) => (
                    <tr
                      key={job.id}
                      className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-[#0D1B2A]">{job.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{job.applicationCount} applicants</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {job.employers?.company_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {job.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {job.category || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job.id, e.target.value as 'open' | 'filled' | 'paused')}
                          disabled={updatingStatusJobId === job.id}
                          title={getStatusLabel(job.status)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer disabled:opacity-50 ${getStatusColor(job.status)}`}
                        >
                          <option value="open">Open</option>
                          <option value="filled">Filled</option>
                          <option value="paused">Paused</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(job.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/jobs/${job.id}`}
                            className="text-[#D4AF37] hover:text-[#c49d23] font-medium text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDuplicateJob(job)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            title="Duplicate this job"
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={() => setShowDeleteWarning({ jobId: job.id, appCount: job.applicationCount })}
                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                            title="Delete this job"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <h2 className="text-lg font-bold text-[#0D1B2A] mb-4">Delete Job?</h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this job? This action cannot be undone.
            </p>
            {showDeleteWarning.appCount > 0 && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 mb-1">⚠️ Warning</p>
                <p className="text-sm text-yellow-700">
                  This job has {showDeleteWarning.appCount} application{showDeleteWarning.appCount !== 1 ? 's' : ''} tied to it. Deleting this job will remove those application records as well.
                </p>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteWarning(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(showDeleteWarning.jobId)}
                disabled={deletingJobId === showDeleteWarning.jobId}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition text-sm"
              >
                {deletingJobId === showDeleteWarning.jobId ? 'Deleting...' : 'Delete Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
