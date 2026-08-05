'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
    id: string
    company_name: string
    contact_name: string
    contact_email: string
    contact_phone: string
  }
}

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'closed', label: 'Closed' },
]

export default function RequestDetailPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  const requestId = params.id as string

  const [request, setRequest] = useState<StaffingRequest | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadRequest = async () => {
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
          .eq('id', requestId)
          .maybeSingle()

        if (fetchError) {
          console.error('[Request Detail] Fetch error:', fetchError)
          setError('Failed to load request')
          setLoading(false)
          return
        }

        if (!data) {
          console.error('[Request Detail] Request not found')
          setError('Request not found')
          setLoading(false)
          return
        }

        // Fetch employer details
        const { data: employer, error: empError } = await supabase
          .from('employers')
          .select('id, company_name, contact_name, contact_email, contact_phone')
          .eq('id', data.employer_id)
          .maybeSingle()

        const fullData = {
          ...data,
          employers: employer,
        }

        setRequest(fullData as StaffingRequest)
        setNewStatus(data.status)
        setLoading(false)
      } catch (err) {
        console.error('[Request Detail] Error:', err)
        console.error('[Request Detail] Error stringified:', JSON.stringify(err, null, 2))
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    loadRequest()
  }, [supabase, requestId])

  const handleStatusUpdate = async () => {
    if (!request || newStatus === request.status) {
      return
    }

    setUpdating(true)
    setError('')
    setSuccess('')

    try {
      const { error: updateError } = await supabase
        .from('staffing_requests')
        .update({ status: newStatus })
        .eq('id', requestId)

      if (updateError) {
        console.error('[Request Detail] Update error:', updateError)
        setError('Failed to update status')
        setUpdating(false)
        return
      }

      setRequest({ ...request, status: newStatus })
      setSuccess('Status updated successfully')
      setTimeout(() => setSuccess(''), 3000)
      setUpdating(false)
    } catch (err) {
      console.error('[Request Detail] Update error:', err)
      setError('An unexpected error occurred')
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading request...</p>
      </div>
    )
  }

  if (error && !request) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded p-6">
        {error}
      </div>
    )
  }

  if (!request) {
    return null
  }

  return (
    <div>
      <Link href="/admin/requests" className="text-[#D4AF37] hover:text-[#c49d23] mb-6 inline-block">
        ← Back to requests
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Request Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-[#0D1B2A] mb-4">
              {request.employers.company_name}
            </h1>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Roles Needed</p>
                <p className="text-lg font-medium text-[#0D1B2A]">{request.roles_needed}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="text-lg font-medium text-[#0D1B2A]">{request.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Timeline</p>
                  <p className="text-lg font-medium text-[#0D1B2A]">
                    {request.timeline || 'Not specified'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="text-sm text-[#0D1B2A]">
                  {new Date(request.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#0D1B2A] mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Contact Name</p>
                <p className="text-[#0D1B2A]">{request.employers.contact_name || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <a
                  href={`mailto:${request.employers.contact_email}`}
                  className="text-[#D4AF37] hover:text-[#c49d23]"
                >
                  {request.employers.contact_email}
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-[#0D1B2A]">{request.employers.contact_phone || '—'}</p>
              </div>
            </div>
          </div>

          {/* Find Candidates */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-blue-900 mb-4">Next Steps</h2>
            <p className="text-blue-800 mb-4">
              Use the candidates board to find suitable matches. Mark this request as "In progress"
              when you begin screening, and "Shortlisted" once you have a shortlist ready to send.
            </p>
            <Link
              href="/admin/candidates"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition"
            >
              Browse candidates →
            </Link>
          </div>
        </div>

        {/* Sidebar - Status Management */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm">
                {success}
              </div>
            )}

            <h3 className="text-lg font-bold text-[#0D1B2A] mb-4">Request Status</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#333333] mb-2">Update Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                disabled={updating}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleStatusUpdate}
              disabled={updating || newStatus === request.status}
              className="w-full px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded font-medium hover:bg-[#c49d23] disabled:opacity-50 transition"
            >
              {updating ? 'Updating...' : 'Save status'}
            </button>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                <strong>New</strong> - Just received
                <br />
                <strong>In progress</strong> - Actively screening candidates
                <br />
                <strong>Shortlisted</strong> - Shortlist ready to send
                <br />
                <strong>Closed</strong> - Position filled or cancelled
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
