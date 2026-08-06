'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface DeployedStaff {
  id: string
  start_date: string
  status: string
  candidates: {
    profile_id: string
  }
  profiles: {
    full_name: string
  }
  employers: {
    company_name: string
  }
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-green-50', text: 'text-green-700', label: 'Active' },
  needs_attention: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Needs attention' },
  ended: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Ended' },
}

export default function PlacedStaffPage() {
  const supabase = createClient()

  const [staff, setStaff] = useState<DeployedStaff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('deployed_staff')
          .select(`
            id,
            start_date,
            status,
            candidate_id,
            employer_id
          `)
          .order('start_date', { ascending: false })

        if (fetchError) {
          console.error('[Placed Staff] Fetch error:', fetchError)
          setError('Failed to load staff')
          setLoading(false)
          return
        }

        // Get unique candidate and employer IDs
        const candidateIds = Array.from(new Set((data || []).map((s: any) => s.candidate_id)))
        const employerIds = Array.from(new Set((data || []).map((s: any) => s.employer_id)))

        // Fetch all candidates and their profiles
        let candidateMap: Record<string, any> = {}
        let profileMap: Record<string, any> = {}

        if (candidateIds.length > 0) {
          const { data: candidates } = await supabase
            .from('candidates')
            .select('id, profile_id')
            .in('id', candidateIds)

          if (candidates) {
            candidateMap = Object.fromEntries(candidates.map((c: any) => [c.id, c]))

            // Get unique profile IDs
            const profileIds = Array.from(
              new Set(candidates.map((c: any) => c.profile_id).filter(Boolean))
            )

            if (profileIds.length > 0) {
              const { data: profiles } = await supabase
                .from('profiles')
                .select('id, full_name')
                .in('id', profileIds)

              if (profiles) {
                profileMap = Object.fromEntries(profiles.map((p: any) => [p.id, p]))
              }
            }
          }
        }

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

        // Enrich staff with candidate and employer data
        const enriched = (data || []).map((s: any) => {
          const candidate = candidateMap[s.candidate_id]
          const profile = candidate ? profileMap[candidate.profile_id] : null
          const employer = employerMap[s.employer_id]

          return {
            ...s,
            candidates: candidate || { profile_id: null },
            profiles: profile || { full_name: 'Unknown' },
            employers: employer || { company_name: 'Unknown' },
          }
        })

        setStaff(enriched)
        setLoading(false)
      } catch (err) {
        console.error('[Placed Staff] Error:', err)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    loadStaff()
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#0D1B2A] mb-2">Deployed Staff</h1>
        <p className="text-gray-600">Track all currently deployed candidates</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading staff...</p>
        </div>
      ) : staff.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">No deployed staff yet. Placements will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F1F2F6] border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                  Candidate
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                  Employer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                  Start Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D1B2A]">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[#0D1B2A]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s, idx) => {
                const colors = statusColors[s.status] || statusColors.active
                return (
                  <tr
                    key={s.id}
                    className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#0D1B2A]">
                      {s.profiles?.full_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {s.employers?.company_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(s.start_date)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {colors.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/placed-staff/${s.id}`}
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
