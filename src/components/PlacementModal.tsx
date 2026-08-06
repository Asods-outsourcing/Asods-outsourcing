'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface PlacementModalProps {
  isOpen: boolean
  candidateId: string
  candidateName: string
  employerId: string
  applicationId: string
  onClose: () => void
  onSuccess: () => void
}

interface StaffingRequest {
  id: string
  roles_needed: string
}

export function PlacementModal({
  isOpen,
  candidateId,
  candidateName,
  employerId,
  applicationId,
  onClose,
  onSuccess,
}: PlacementModalProps) {
  const supabase = createClient()

  const [startDate, setStartDate] = useState('')
  const [staffingRequestId, setStaffingRequestId] = useState('')
  const [staffingRequests, setStaffingRequests] = useState<StaffingRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingRequests, setLoadingRequests] = useState(true)

  // Set default start date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setStartDate(today)
  }, [])

  // Load staffing requests for this employer
  useEffect(() => {
    if (!isOpen) return

    const loadRequests = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('staffing_requests')
          .select('id, roles_needed')
          .eq('employer_id', employerId)
          .in('status', ['new', 'in_progress'])
          .order('created_at', { ascending: false })

        if (fetchError) {
          console.error('[Placement Modal] Requests fetch error:', fetchError)
        } else {
          setStaffingRequests(data || [])
        }
        setLoadingRequests(false)
      } catch (err) {
        console.error('[Placement Modal] Error loading requests:', err)
        setLoadingRequests(false)
      }
    }

    loadRequests()
  }, [isOpen, employerId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate inputs
      if (!startDate) {
        setError('Start date is required')
        setLoading(false)
        return
      }

      console.log('[Placement Modal] Creating deployed staff record', {
        candidateId,
        employerId,
        startDate,
        staffingRequestId,
      })

      // Insert deployed staff record
      const { error: insertError } = await supabase.from('deployed_staff').insert({
        candidate_id: candidateId,
        employer_id: employerId,
        start_date: startDate,
        staffing_request_id: staffingRequestId || null,
        status: 'active',
      })

      if (insertError) {
        console.error('[Placement Modal] Insert error:', insertError)
        setError(insertError.message || 'Failed to create placement record')
        setLoading(false)
        return
      }

      console.log('[Placement Modal] Placement record created successfully')
      setLoading(false)
      onSuccess()
    } catch (err) {
      console.error('[Placement Modal] Unexpected error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-[#0D1B2A] mb-2">Record Placement</h3>
        <p className="text-gray-600 text-sm mb-6">
          Create a deployment record for {candidateName}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-[#333333] mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              required
              disabled={loading}
            />
          </div>

          {/* Staffing Request (Optional) */}
          <div>
            <label htmlFor="staffingRequest" className="block text-sm font-medium text-[#333333] mb-1">
              Staffing Request (optional)
            </label>
            {loadingRequests ? (
              <p className="text-gray-600 text-sm">Loading requests...</p>
            ) : (
              <select
                id="staffingRequest"
                value={staffingRequestId}
                onChange={(e) => setStaffingRequestId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                disabled={loading}
              >
                <option value="">— None —</option>
                {staffingRequests.map((req) => (
                  <option key={req.id} value={req.id}>
                    {req.roles_needed}
                  </option>
                ))}
              </select>
            )}
            {staffingRequests.length === 0 && !loadingRequests && (
              <p className="text-gray-600 text-xs mt-1">No open requests for this employer</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#0D1B2A] text-white rounded-lg font-medium hover:bg-[#0a1420] disabled:opacity-50 transition"
            >
              {loading ? 'Recording...' : 'Record Placement'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-200 text-[#333333] rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
