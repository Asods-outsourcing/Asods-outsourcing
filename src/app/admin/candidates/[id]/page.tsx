'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { stageConfig } from '@/lib/admin/kanban'
import { PlacementModal } from '@/components/PlacementModal'

interface ApplicationDetail {
  id: string
  stage: string
  notes: string
  created_at: string
  candidates: {
    id: string
    profile_id: string
    bio: string
    skills: string[]
    cv_url: string
  }
  jobs: {
    id: string
    title: string
    description: string
  }
  profiles: {
    full_name: string
    email: string
  }
}

const stageActions = [
  { value: 'applied', label: 'New' },
  { value: 'screening', label: 'Screening' },
  { value: 'interview', label: 'Schedule interview' },
  { value: 'offer', label: 'Send offer' },
  { value: 'placed', label: 'Mark placed' },
  { value: 'rejected', label: 'Not selected' },
]

export default function CandidateDetailPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  const applicationId = params.id as string

  const [application, setApplication] = useState<ApplicationDetail | null>(null)
  const [notes, setNotes] = useState('')
  const [notesEditing, setNotesEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPlacementModal, setShowPlacementModal] = useState(false)
  const [employerId, setEmployerId] = useState('')

  useEffect(() => {
    const loadApplication = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('applications')
          .select(`
            id,
            stage,
            notes,
            created_at,
            candidate_id,
            job_id
          `)
          .eq('id', applicationId)
          .maybeSingle()

        if (fetchError) {
          console.error('[Candidate Detail] Fetch error:', fetchError)
          setError('Failed to load application')
          setLoading(false)
          return
        }

        if (!data) {
          console.error('[Candidate Detail] Application not found')
          setError('Application not found')
          setLoading(false)
          return
        }

        // Fetch candidate details
        const { data: candidate, error: candError } = await supabase
          .from('candidates')
          .select('id, profile_id, bio, skills, cv_url')
          .eq('id', data.candidate_id)
          .maybeSingle()

        // Fetch job details
        const { data: job, error: jobError } = await supabase
          .from('jobs')
          .select('id, title, description, employer_id')
          .eq('id', data.job_id)
          .maybeSingle()

        // Set employer ID from job
        if (job?.employer_id) {
          setEmployerId(job.employer_id)
        }

        // Fetch profile details
        let profile = null
        if (candidate?.profile_id) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', candidate.profile_id)
            .maybeSingle()
          profile = profileData
        }

        // Combine data
        const fullData = {
          ...data,
          candidates: candidate,
          jobs: job,
          profiles: profile,
        }

        setApplication(fullData as ApplicationDetail)
        setNotes(data.notes || '')
        setLoading(false)
      } catch (err) {
        console.error('[Candidate Detail] Error:', err)
        console.error('[Candidate Detail] Error stringified:', JSON.stringify(err, null, 2))
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    loadApplication()
  }, [supabase, applicationId])

  const handleSaveNotes = async () => {
    if (!application) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { error: updateError } = await supabase
        .from('applications')
        .update({ notes })
        .eq('id', applicationId)

      if (updateError) {
        console.error('[Candidate Detail] Notes update error:', updateError)
        setError('Failed to save notes')
        setSaving(false)
        return
      }

      setApplication({ ...application, notes })
      setSuccess('Notes saved')
      setNotesEditing(false)
      setTimeout(() => setSuccess(''), 3000)
      setSaving(false)
    } catch (err) {
      console.error('[Candidate Detail] Update error:', err)
      setError('An unexpected error occurred')
      setSaving(false)
    }
  }

  const handleStageChange = async (newStage: string) => {
    if (!application || newStage === application.stage) return

    // If moving to "placed", show the placement modal instead
    if (newStage === 'placed') {
      setShowPlacementModal(true)
      // Temporarily update stage to placed (will be saved when user confirms in modal)
      setSaving(true)
      
      try {
        const { error: updateError } = await supabase
          .from('applications')
          .update({ stage: newStage })
          .eq('id', applicationId)

        if (updateError) {
          console.error('[Candidate Detail] Stage update error:', updateError)
          setError('Failed to update status')
          setSaving(false)
          return
        }

        setApplication({ ...application, stage: newStage })
        setSaving(false)
      } catch (err) {
        console.error('[Candidate Detail] Update error:', err)
        setError('An unexpected error occurred')
        setSaving(false)
      }
      return
    }

    // For other stages, update directly
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { error: updateError } = await supabase
        .from('applications')
        .update({ stage: newStage })
        .eq('id', applicationId)

      if (updateError) {
        console.error('[Candidate Detail] Stage update error:', updateError)
        setError('Failed to update status')
        setSaving(false)
        return
      }

      setApplication({ ...application, stage: newStage })
      const stageLabel = stageActions.find((s) => s.value === newStage)?.label || newStage
      setSuccess(`Candidate moved to ${stageLabel}`)
      setTimeout(() => setSuccess(''), 3000)
      setSaving(false)
    } catch (err) {
      console.error('[Candidate Detail] Update error:', err)
      setError('An unexpected error occurred')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading application...</p>
      </div>
    )
  }

  if (error && !application) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded p-6">
        {error}
      </div>
    )
  }

  if (!application) {
    return null
  }

  return (
    <div>
      <Link href="/admin/candidates" className="text-[#D4AF37] hover:text-[#c49d23] mb-6 inline-block">
        ← Back to candidates
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Candidate Profile */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-[#0D1B2A]">
                  {application.profiles?.full_name}
                </h1>
                <p className="text-gray-600 mt-1">{application.jobs?.title}</p>
              </div>
              {application.candidates?.cv_url && (
                <a
                  href={application.candidates.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition"
                >
                  View CV
                </a>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <a
                  href={`mailto:${application.profiles?.email}`}
                  className="text-[#D4AF37] hover:text-[#c49d23]"
                >
                  {application.profiles?.email}
                </a>
              </div>

              <div>
                <p className="text-sm text-gray-600">Professional Summary</p>
                <p className="text-[#0D1B2A] mt-1">{application.candidates?.bio || 'No summary provided'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Skills</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {application.candidates?.skills && application.candidates.skills.length > 0 ? (
                    application.candidates.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600">No skills listed</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Applied For</p>
                <p className="text-lg font-medium text-[#0D1B2A]">{application.jobs?.title}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {application.jobs?.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">Applied On</p>
                <p className="text-sm text-[#0D1B2A]">
                  {new Date(application.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#0D1B2A]">Notes</h2>
              {!notesEditing && (
                <button
                  onClick={() => setNotesEditing(true)}
                  className="text-[#D4AF37] hover:text-[#c49d23] text-sm font-medium"
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
                  disabled={saving}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] disabled:bg-gray-100"
                  rows={4}
                  placeholder="Add private notes about this candidate..."
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setNotesEditing(false)
                      setNotes(application.notes || '')
                    }}
                    disabled={saving}
                    className="flex-1 px-4 py-2 border border-gray-300 text-[#0D1B2A] rounded font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded font-medium hover:bg-[#c49d23] disabled:opacity-50 transition"
                  >
                    {saving ? 'Saving...' : 'Save notes'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[#0D1B2A]">
                {notes || <span className="text-gray-500">No notes yet</span>}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar - Actions */}
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

            <h3 className="text-lg font-bold text-[#0D1B2A] mb-4">Update Status</h3>

            <div className="space-y-2">
              {stageActions.map((action) => (
                <button
                  key={action.value}
                  onClick={() => handleStageChange(action.value)}
                  disabled={saving || action.value === application.stage}
                  className={`w-full px-4 py-2 rounded font-medium transition text-sm ${
                    action.value === application.stage
                      ? 'bg-gray-100 text-gray-600 cursor-default'
                      : 'bg-[#D4AF37] text-[#0D1B2A] hover:bg-[#c49d23]'
                  } disabled:opacity-50`}
                >
                  {action.label}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-3">
                <strong>Current status:</strong> {stageConfig[application.stage as keyof typeof stageConfig]?.label || application.stage}
              </p>
              <p className="text-xs text-gray-600">
                Use the action buttons to move this candidate through the pipeline. Each update will save immediately and send notifications.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Placement Modal */}
      {application && (
        <PlacementModal
          isOpen={showPlacementModal}
          candidateId={application.candidates.id}
          candidateName={application.profiles?.full_name}
          employerId={employerId}
          applicationId={applicationId}
          onClose={() => setShowPlacementModal(false)}
          onSuccess={() => {
            setShowPlacementModal(false)
            setSuccess('Candidate marked as placed and deployment record created!')
            setTimeout(() => setSuccess(''), 3000)
            // Optionally redirect to placed-staff list
            // router.push('/admin/placed-staff')
          }}
        />
      )}
    </div>
  )
}
