'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Job {
  id: string
  title: string
  location: string
  is_public: boolean
  created_at: string
  employers: {
    company_name: string
  }
}

export default function AdminJobsPage() {
  const supabase = createClient()

  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
            created_at,
            employer_id
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

        // Enrich jobs with employer data
        const enriched = (data || []).map((job: any) => ({
          ...job,
          employers: employerMap[job.employer_id] || { company_name: 'Unknown' },
        }))

        setJobs(enriched)
        setLoading(false)
      } catch (err) {
        console.error('[Admin Jobs] Error:', err)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    loadJobs()
  }, [supabase])

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
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full min-w-max md:min-w-0">
            <thead>
              <tr className="bg-[#F1F2F6] border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                  Created
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[#0D1B2A]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, idx) => (
                <tr
                  key={job.id}
                  className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-[#0D1B2A]">
                    {job.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {job.employers?.company_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {job.location}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.is_public
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {job.is_public ? 'Public' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(job.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/jobs/${job.id}`}
                      className="text-[#D4AF37] hover:text-[#c49d23] font-medium text-sm"
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
