'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Submission {
  id: string
  full_name: string
  email: string
  phone: string
  state_of_residence: string
  city_lga: string
  preferred_contact_method: string
  highest_education: string
  field_of_study: string
  employment_status: string
  years_of_experience: string
  current_job_title: string | null
  roles_of_interest: string[]
  strongest_skills: string[]
  preferred_work_arrangement: string
  preferred_employment_type: string
  availability: string
  salary_expectation: string
  willing_to_train: string
  cv_url: string
  certificate_urls: string[]
  referral_source: string
  tier: string
  status: string
  admin_notes: string | null
  last_contacted_at: string | null
  created_at: string
  updated_at: string
  detailed_responses: {
    about_yourself?: string
    strongest_qualities?: string
  }
}

export default function TalentPoolDetailPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  const id = params.id as string

  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [tier, setTier] = useState('')
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const { data, error } = await supabase
          .from('talent_pool_submissions')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error

        setSubmission(data)
        setTier(data.tier)
        setStatus(data.status)
        setNotes(data.admin_notes || '')
      } catch (err) {
        console.error('Error fetching submission:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmission()
  }, [id, supabase])

  const handleSave = async () => {
    try {
      setIsSaving(true)

      const { error } = await supabase
        .from('talent_pool_submissions')
        .update({
          tier,
          status,
          admin_notes: notes,
          last_contacted_at: status === 'contacted' ? new Date().toISOString() : undefined,
        })
        .eq('id', id)

      if (error) throw error

      if (submission) {
        setSubmission({
          ...submission,
          tier,
          status,
          admin_notes: notes,
        })
      }

      alert('Changes saved successfully!')
    } catch (err) {
      console.error('Error saving:', err)
      alert('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Loading submission...</p>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Submission not found</p>
        <Link href="/admin/talent-pool" className="text-blue-600 hover:text-blue-800 font-semibold">
          Back to Submissions
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <Link href="/admin/talent-pool" className="text-blue-600 hover:text-blue-800 mb-4 inline-block text-sm md:text-base">
            ← Back to Submissions
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{submission.full_name}</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">{submission.employment_status}</p>
        </div>
        <div className="md:text-right text-sm">
          <div className="text-gray-500 mb-1">Registered: {new Date(submission.created_at).toLocaleDateString()}</div>
          {submission.last_contacted_at && (
            <div className="text-gray-500">Last contacted: {new Date(submission.last_contacted_at).toLocaleDateString()}</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 font-semibold">Email</div>
                <div className="text-gray-900 font-semibold break-all">{submission.email}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Phone</div>
                <div className="text-gray-900 font-semibold break-all">{submission.phone}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">State</div>
                <div className="text-gray-900">{submission.state_of_residence}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">City/LGA</div>
                <div className="text-gray-900">{submission.city_lga}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs text-gray-500 font-semibold">Preferred Contact</div>
                <div className="text-gray-900">{submission.preferred_contact_method}</div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Education & Experience</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Highest Education Level</div>
                  <div className="text-gray-900">{submission.highest_education}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Field of Study</div>
                  <div className="text-gray-900">{submission.field_of_study}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Years of Experience</div>
                  <div className="text-gray-900">{submission.years_of_experience}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Current/Most Recent Job</div>
                  <div className="text-gray-900">{submission.current_job_title || '—'}</div>
                </div>
              </div>
            </div>
          </div>





          {/* Documents */}
          {(submission.cv_url || (submission.certificate_urls && submission.certificate_urls.length > 0)) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Documents</h2>
              <div className="space-y-3">
                {submission.cv_url && (
                  <a
                    href={submission.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                  >
                    <span className="text-gray-900 font-semibold">📄 CV (PDF)</span>
                    <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition min-h-10 flex items-center whitespace-nowrap sm:px-6">
                      Download
                    </span>
                  </a>
                )}
                {submission.certificate_urls?.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition"
                  >
                    <span className="text-gray-900 font-semibold">📜 Certificate {idx + 1}</span>
                    <span className="inline-block px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded hover:bg-green-700 transition min-h-10 flex items-center whitespace-nowrap sm:px-6">
                      Download
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Referral Source */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">How They Found Us</h2>
            <div>
              <div className="text-xs text-gray-500 font-semibold mb-2">Referral Source</div>
              <div className="text-gray-900">{submission.referral_source}</div>
            </div>
          </div>
        </div>

        {/* Sidebar - Admin Actions */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 space-y-6 md:sticky md:top-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="unrated">Unrated</option>
                <option value="A">A - Job Ready</option>
                <option value="B">B - Qualified</option>
                <option value="C">C - Training Required</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="contacted">Contacted</option>
                <option value="placed">Placed</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Add internal notes..."
              />
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition min-h-10 flex items-center justify-center"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>

            <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded">
              <div className="font-semibold mb-1">Quick Info:</div>
              <div>Updated: {new Date(submission.updated_at).toLocaleDateString()}</div>
              <div className="break-all">ID: {submission.id}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
