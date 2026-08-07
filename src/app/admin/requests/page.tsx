'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface StaffingRequest {
  id: string
  roles_needed: string
  quantity: number
  timeline: string
  status: string
  created_at: string
  employers: {
    company_name: string
  }
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'New' },
  in_progress: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'In progress' },
  shortlisted: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Shortlisted' },
  closed: { bg: 'bg-green-50', text: 'text-green-700', label: 'Closed' },
}

export default function AdminRequestsPage() {
  const supabase = createClient()

  const [requests, setRequests] = useState<StaffingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('staffing_requests')
          .select(`
            id,
            roles_needed,
            quantity,
            timeline,
            status,
            created_at,
            employer_id
          `)
          .order('created_at', { ascending: false })

        if (fetchError) {
          console.error('[Admin Requests] Fetch error:', fetchError)
          setError('Failed to load requests')
          setLoading(false)
          return
        }

        // Get unique employer IDs
        const employerIds = Array.from(new Set((data || []).map((req: any) => req.employer_id)))

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

        // Enrich requests with employer data
        const enriched = (data || []).map((req: any) => ({
          ...req,
          employers: employerMap[req.employer_id] || { company_name: 'Unknown' },
        }))

        setRequests(enriched)
        setLoading(false)
      } catch (err) {
        console.error('[Admin Requests] Error:', err)
        console.error('[Admin Requests] Error stringified:', JSON.stringify(err, null, 2))
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    loadRequests()
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
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-[#0D1B2A] mb-1 md:mb-2">Staffing Requests</h1>
        <p className="text-sm md:text-base text-gray-600">Manage all client staffing requests</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">No staffing requests yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full min-w-max md:min-w-0">
            <thead>
              <tr className="bg-[#F1F2F6] border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                  Roles Needed
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                  Qty
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                  Timeline
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                  Submitted
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[#0D1B2A]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, idx) => {
                const colors = statusColors[req.status] || statusColors.new
                return (
                  <tr
                    key={req.id}
                    className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#0D1B2A]">
                      {req.employers?.company_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{req.roles_needed}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{req.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{req.timeline || '—'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {colors.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(req.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/requests/${req.id}`}
                        className="text-[#D4AF37] hover:text-[#c49d23] font-medium text-sm"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
