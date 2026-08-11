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
  institution: string
  graduation_year: string
  has_certifications: boolean
  employment_status: string
  current_job_title: string | null
  current_company: string | null
  current_industry: string | null
  years_in_role: string | null
  digital_literacy_rating: number | null
  preferred_roles: string[]
  work_arrangement: string[]
  employment_type: string[]
  preferred_location: string
  willing_to_relocate: string
  availability: string
  salary_expectation: string
  willing_to_train: string
  assessment_track: string
  cv_url: string | null
  certificate_urls: string[]
  referral_source: string
  referral_name: string | null
  tier: string
  status: string
  admin_notes: string | null
  last_contacted_at: string | null
  created_at: string
  updated_at: string
  detailed_responses: any
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
      <div className="mb-8 flex items-start justify-between">
        <div>
          <Link href="/admin/talent-pool" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Submissions
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">{submission.full_name}</h1>
          <p className="text-gray-600 mt-2">{submission.employment_status}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-2">Registered: {new Date(submission.created_at).toLocaleDateString()}</div>
          {submission.last_contacted_at && (
            <div className="text-sm text-gray-500">Last contacted: {new Date(submission.last_contacted_at).toLocaleDateString()}</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main content */}
        <div className="col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 font-semibold">Email</div>
                <div className="text-gray-900 font-semibold">{submission.email}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Phone</div>
                <div className="text-gray-900 font-semibold">{submission.phone}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">State</div>
                <div className="text-gray-900">{submission.state_of_residence}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">City/LGA</div>
                <div className="text-gray-900">{submission.city_lga}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-gray-500 font-semibold">Preferred Contact</div>
                <div className="text-gray-900">{submission.preferred_contact_method}</div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Education</h2>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 font-semibold">Highest Education Level</div>
                <div className="text-gray-900">{submission.highest_education}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Field of Study</div>
                  <div className="text-gray-900">{submission.field_of_study}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Graduation Year</div>
                  <div className="text-gray-900">{submission.graduation_year}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Institution</div>
                <div className="text-gray-900">{submission.institution}</div>
              </div>
              {submission.has_certifications && submission.detailed_responses?.certifications_list?.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Professional Certifications</div>
                  <div className="flex flex-wrap gap-2">
                    {submission.detailed_responses.certifications_list.map((cert: string, idx: number) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {submission.detailed_responses?.additional_certifications && (
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Additional Certifications</div>
                  <div className="text-gray-900 whitespace-pre-wrap">
                    {submission.detailed_responses.additional_certifications}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Work Experience */}
          {submission.current_job_title && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Current/Recent Employment</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">Job Title</div>
                    <div className="text-gray-900">{submission.current_job_title}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">Company</div>
                    <div className="text-gray-900">{submission.current_company}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">Industry</div>
                    <div className="text-gray-900">{submission.current_industry}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">Years in Role</div>
                    <div className="text-gray-900">{submission.years_in_role}</div>
                  </div>
                </div>
                {submission.detailed_responses?.responsibilities && (
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">Responsibilities</div>
                    <div className="text-gray-900 whitespace-pre-wrap">
                      {submission.detailed_responses.responsibilities}
                    </div>
                  </div>
                )}
                {submission.detailed_responses?.achievements && (
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">Key Achievements</div>
                    <div className="text-gray-900 whitespace-pre-wrap">
                      {submission.detailed_responses.achievements}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Skills & Competencies</h2>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 font-semibold mb-2">Strongest Skills</div>
                <div className="flex flex-wrap gap-2">
                  {submission.detailed_responses?.strongest_skills?.map((skill: string, idx: number) => (
                    <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Skill to Improve</div>
                <div className="text-gray-900">{submission.detailed_responses?.skill_to_improve}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Digital Literacy Rating</div>
                <div className="text-gray-900">{submission.digital_literacy_rating}/5</div>
              </div>
            </div>
          </div>

          {/* Job Preferences */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Job Preferences</h2>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 font-semibold mb-2">Preferred Roles</div>
                <div className="flex flex-wrap gap-2">
                  {submission.preferred_roles.map((role, idx) => (
                    <span key={idx} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded text-sm">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 font-semibold mb-1">Work Arrangements</div>
                  <div className="text-gray-900">{submission.work_arrangement.join(', ')}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold mb-1">Employment Types</div>
                  <div className="text-gray-900">{submission.employment_type.join(', ')}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Preferred Location</div>
                <div className="text-gray-900">{submission.preferred_location}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Willing to Relocate</div>
                <div className="text-gray-900">{submission.willing_to_relocate}</div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Availability & Compensation</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-500 font-semibold">Can Start</div>
                <div className="text-gray-900">{submission.availability}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Salary Expectation</div>
                <div className="text-gray-900">{submission.salary_expectation}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Willing to Train</div>
                <div className="text-gray-900">{submission.willing_to_train}</div>
              </div>
            </div>
          </div>

          {/* Screening Responses */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Candidate Screening</h2>
            <div className="space-y-6">
              {submission.detailed_responses?.about_yourself && (
                <div>
                  <div className="text-xs text-gray-500 font-semibold mb-2">About Yourself</div>
                  <div className="text-gray-900 whitespace-pre-wrap">
                    {submission.detailed_responses.about_yourself}
                  </div>
                </div>
              )}
              {submission.detailed_responses?.strongest_qualities && (
                <div>
                  <div className="text-xs text-gray-500 font-semibold mb-2">Strongest Qualities</div>
                  <div className="text-gray-900 whitespace-pre-wrap">
                    {submission.detailed_responses.strongest_qualities}
                  </div>
                </div>
              )}
              {submission.detailed_responses?.difficult_situation && (
                <div>
                  <div className="text-xs text-gray-500 font-semibold mb-2">Difficult Situation Handled</div>
                  <div className="text-gray-900 whitespace-pre-wrap">
                    {submission.detailed_responses.difficult_situation}
                  </div>
                </div>
              )}
              {submission.detailed_responses?.task_prioritization && (
                <div>
                  <div className="text-xs text-gray-500 font-semibold mb-2">Task Prioritization Approach</div>
                  <div className="text-gray-900 whitespace-pre-wrap">
                    {submission.detailed_responses.task_prioritization}
                  </div>
                </div>
              )}
              {submission.detailed_responses?.why_employer_should_consider && (
                <div>
                  <div className="text-xs text-gray-500 font-semibold mb-2">Why Consider for Role</div>
                  <div className="text-gray-900 whitespace-pre-wrap">
                    {submission.detailed_responses.why_employer_should_consider}
                  </div>
                </div>
              )}
              {submission.detailed_responses?.comfortable_with_kpis && (
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Comfortable with KPIs</div>
                  <div className="text-gray-900">{submission.detailed_responses.comfortable_with_kpis}</div>
                </div>
              )}
            </div>
          </div>

          {/* Assessment Responses */}
          {submission.assessment_track && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Role-Specific Assessment ({submission.assessment_track})</h2>
              <div className="space-y-6">
                {Object.entries(submission.detailed_responses?.assessment_answers || {}).map(([key, value]) => (
                  <div key={key}>
                    <div className="text-xs text-gray-500 font-semibold mb-2">Q: {key}</div>
                    <div className="text-gray-900 whitespace-pre-wrap">{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {submission.detailed_responses?.reference_name && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Professional Reference</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Name</div>
                  <div className="text-gray-900">{submission.detailed_responses.reference_name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Relationship</div>
                  <div className="text-gray-900">{submission.detailed_responses.reference_relationship}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Contact</div>
                  <div className="text-gray-900">{submission.detailed_responses.reference_contact}</div>
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          {(submission.cv_url || (submission.certificate_urls && submission.certificate_urls.length > 0)) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Documents</h2>
              <div className="space-y-2">
                {submission.cv_url && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-900 font-semibold">CV (PDF)</span>
                    <a href={submission.cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-semibold">
                      Download
                    </a>
                  </div>
                )}
                {submission.certificate_urls?.map((url, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-900 font-semibold">Certificate {idx + 1}</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-semibold">
                      Download
                    </a>
                  </div>
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
              {submission.referral_name && (
                <div className="mt-4">
                  <div className="text-xs text-gray-500 font-semibold mb-2">Referred By</div>
                  <div className="text-gray-900">{submission.referral_name}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Admin Actions */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow p-6 space-y-6 sticky top-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
                placeholder="Add internal notes..."
              />
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>

            <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded">
              <div className="font-semibold mb-1">Quick Info:</div>
              <div>Updated: {new Date(submission.updated_at).toLocaleDateString()}</div>
              <div>ID: {submission.id}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
