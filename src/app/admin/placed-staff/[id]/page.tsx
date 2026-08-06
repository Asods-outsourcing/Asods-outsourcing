'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface DeployedStaffDetail {
  id: string
  start_date: string
  end_date: string | null
  status: string
  notes: string | null
  candidate_id: string
  employer_id: string
  staffing_request_id: string | null
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'needs_attention', label: 'Needs attention' },
  { value: 'ended', label: 'Ended' },
]

export default function PlacedStaffDetailPage() {
  const router = useRouter()
  const params = useParams()
  const staffId = params.id as string
  const supabase = createClient()

  const [staff, setStaff] = useState<DeployedStaffDetail | null>(null)
  const [candidateName, setCandidateName] = useState('')
  const [employerName, setEmployerName] = useState('')
  const [notes, setNotes] = useState('')
  const [notesEditing, setNotesEditing] = useState(false)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('deployed_staff')
          .select('*')
          .eq('id', staffId)
          .maybeSingle()

        if (fetchError) {
          console.error('[Placed Staff Detail] Fetch error:', fetchError)
          setError('Failed to load staff record')
          setLoading(false)
          return
        }

        if (!data) {
          console.error('[Placed Staff Detail] Record not found')
          setError('Staff record not found')
          setLoading(false)
          return
        }

        setStaff(data)
        setNotes(data.notes || '')
        setStatus(data.status)

        // Fetch candidate name
        const { data: candidate } = await supabase
          .from('candidates')
          .select('profile_id')
          .eq('id', data.candidate_id)
          .maybeSingle()

        if (candidate?.profile_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', candidate.profile_id)
            .maybeSingle()

          if (profile) {
            setCandidateName(profile.full_name)
          }
        }

        // Fetch employer name
        const { data: employer } = await supabase
          .from('employers')
          .select('company_name')
          .eq('id', data.employer_id)
          .maybeSingle()

        if (employer) {
          setEmployerName(employer.company_name)
        }

        setLoading(false)
      } catch (err) {
        console.error('[Placed Staff Detail] Error:', err)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    loadStaff()
  }, [staffId, supabase])

  const handleSaveNotes = async () => {
    if (!staff) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { error: updateError } = await supabase
        .from('deployed_staff')
        .update({ notes })
        .eq('id', staffId)

      if (updateError) {
        console.error('[Placed Staff Detail] Notes update error:', updateError)
        setError('Failed to save notes')
        setSaving(false)
        return
      }

      setStaff({ ...staff, notes })
      setSuccess('Notes saved')
      setNotesEditing(false)
      setTimeout(() => setSuccess(''), 3000)
      setSaving(false)
    } catch (err) {
      console.error('[Placed Staff Detail] Update error:', err)
      setError('An unexpected error occurred')
      setSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!staff || newStatus === staff.status) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { error: updateError } = await supabase
        .from('deployed_staff')
        .update({ status: newStatus })
        .eq('id', staffId)

      if (updateError) {
        console.error('[Placed Staff Detail] Status update error:', updateError)
        setError('Failed to update status')
        setSaving(false)
        return
      }

      setStaff({ ...staff, status: newStatus })
      setStatus(newStatus)
      const statusLabel = statusOptions.find((s) => s.value === newStatus)?.label || newStatus
      setSuccess(`Status updated to ${statusLabel}`)
      setTimeout(() => setSuccess(''), 3000)
      setSaving(false)
    } catch (err) {
      console.error('[Placed Staff Detail] Update error:', err)
      setError('An unexpected error occurred')
      setSaving(false)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading staff record...</p>
      </div>
    )
  }

  if (error && !staff) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded p-6">
        {error}
      </div>
    )
  }

  if (!staff) {
    return null
  }

  return (
    <div>
      <Link href="/admin/placed-staff" className="text-[#D4AF37] hover:text-[#c49d23] mb-6 inline-block">
        ← Back to deployed staff
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-[#0D1B2A] mb-1">{candidateName}</h1>
            <p className="text-gray-600">{employerName}</p>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
                {success}
              </div>
            )}
          </div>

          {/* Deployment Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#0D1B2A] mb-4">Deployment Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium text-[#0D1B2A]">{formatDate(staff.start_date)}</p>
              </div>
              {staff.end_date && (
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-medium text-[#0D1B2A]">{formatDate(staff.end_date)}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <div className="mt-2 flex gap-2">
                  <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={saving}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#0D1B2A]">Notes</h2>
              {!notesEditing && (
                <button
                  onClick={() => setNotesEditing(true)}
                  className="text-sm text-[#D4AF37] hover:text-[#c49d23] font-medium"
                >
                  Edit
                </button>
              )}
            </div>

            {notesEditing ? (
              <div className="space-y-3">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  rows={4}
                  disabled={saving}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNotes}
                    disabled={saving}
                    className="px-4 py-2 bg-[#0D1B2A] text-white rounded font-medium hover:bg-[#0a1420] disabled:opacity-50 transition"
                  >
                    {saving ? 'Saving...' : 'Save notes'}
                  </button>
                  <button
                    onClick={() => {
                      setNotes(staff.notes || '')
                      setNotesEditing(false)
                    }}
                    disabled={saving}
                    className="px-4 py-2 bg-gray-200 text-[#333333] rounded font-medium hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">
                {notes || 'No notes yet. Click "Edit" to add notes.'}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-[#0D1B2A] mb-4">Quick Actions</h3>
            <button
              onClick={() => handleStatusChange('needs_attention')}
              disabled={saving || status === 'needs_attention'}
              className="w-full px-4 py-3 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg font-medium hover:bg-red-100 disabled:opacity-50 transition"
            >
              🚩 Flag for Replacement
            </button>
            <p className="text-xs text-gray-600 mt-2">
              Marks this placement as needing attention / replacement
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <strong>Tip:</strong> Use the status dropdown above to mark placements as Active, Needs Attention, or Ended.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
