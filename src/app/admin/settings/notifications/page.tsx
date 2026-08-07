'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface NotificationTemplate {
  id: string
  stage: 'screening' | 'interview' | 'placed' | 'rejected' | 'offer'
  subject: string
  body: string
}

const STAGES = [
  { value: 'screening', label: 'Screening' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Job Offer' },
  { value: 'placed', label: 'Placed' },
  { value: 'rejected', label: 'Rejected' },
]

const PLACEHOLDERS: Record<string, string[]> = {
  screening: ['{{candidate_name}}', '{{job_title}}'],
  interview: ['{{candidate_name}}', '{{job_title}}'],
  offer: ['{{candidate_name}}', '{{job_title}}', '{{salary}}', '{{start_date}}', '{{custom_note}}'],
  placed: ['{{candidate_name}}', '{{job_title}}'],
  rejected: ['{{candidate_name}}', '{{job_title}}'],
}

export default function NotificationsSettingsPage() {
  const supabase = createClient()

  const [templates, setTemplates] = useState<Record<string, NotificationTemplate>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingStage, setEditingStage] = useState<string | null>(null)
  const [editSubject, setEditSubject] = useState('')
  const [editBody, setEditBody] = useState('')
  const [validationWarnings, setValidationWarnings] = useState<string[]>([])

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('notification_templates')
        .select('*')
        .order('stage', { ascending: true })

      if (fetchError) {
        console.error('[Notifications Settings] Fetch error:', fetchError)
        setError('Failed to load notification templates')
        setLoading(false)
        return
      }

      const templateMap: Record<string, NotificationTemplate> = {}
      data?.forEach((t) => {
        templateMap[t.stage] = t
      })

      setTemplates(templateMap)
      setLoading(false)
    } catch (err) {
      console.error('[Notifications Settings] Error:', err)
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  const startEditing = (stage: string) => {
    const template = templates[stage]
    if (template) {
      setEditingStage(stage)
      setEditSubject(template.subject)
      setEditBody(template.body)
      setValidationWarnings([])
    }
  }

  const checkPlaceholders = (stage: string, subject: string, body: string): string[] => {
    const warnings: string[] = []
    const requiredPlaceholders = PLACEHOLDERS[stage] || []

    // Check if critical placeholders are missing
    const criticalChecks: Record<string, string[]> = {
      offer: ['{{salary}}', '{{start_date}}'],
    }

    if (criticalChecks[stage]) {
      criticalChecks[stage].forEach((placeholder) => {
        if (!body.includes(placeholder)) {
          warnings.push(`Missing placeholder: ${placeholder}`)
        }
      })
    }

    return warnings
  }

  const handleSave = async (stage: string) => {
    setSaving(stage)
    setError('')
    setSuccess('')

    try {
      // Check for missing placeholders
      const warnings = checkPlaceholders(stage, editSubject, editBody)
      if (warnings.length > 0) {
        const proceed = confirm(
          `Warning: ${warnings.join(', ')}\n\nContinue anyway?`
        )
        if (!proceed) {
          setSaving(null)
          return
        }
      }

      const { error: updateError } = await supabase
        .from('notification_templates')
        .update({
          subject: editSubject,
          body: editBody,
          updated_at: new Date().toISOString(),
        })
        .eq('stage', stage)

      if (updateError) {
        console.error('[Notifications Settings] Update error:', updateError)
        setError('Failed to save template')
        setSaving(null)
        return
      }

      // Update local state
      setTemplates({
        ...templates,
        [stage]: {
          ...templates[stage],
          subject: editSubject,
          body: editBody,
        },
      })

      setSuccess(`${STAGES.find((s) => s.value === stage)?.label} template saved!`)
      setEditingStage(null)
      setSaving(null)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('[Notifications Settings] Unexpected error:', err)
      setError('An unexpected error occurred')
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading notification templates...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/home" className="text-[#D4AF37] hover:text-[#c49d23] font-medium text-sm mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-[#0D1B2A] mb-2">Notification Templates</h1>
        <p className="text-gray-600">Customize the emails sent to candidates at each stage of the pipeline</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="space-y-6">
        {STAGES.map((stage) => {
          const template = templates[stage.value]
          if (!template) return null

          const isEditing = editingStage === stage.value

          return (
            <div key={stage.value} className="bg-white rounded-lg shadow-md p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#0D1B2A]">{stage.label}</h2>
                {!isEditing && (
                  <button
                    onClick={() => startEditing(stage.value)}
                    className="px-4 py-2 text-sm font-medium text-[#D4AF37] hover:text-[#c49d23]"
                  >
                    Edit Template
                  </button>
                )}
              </div>

              {/* Available Placeholders */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm font-medium text-blue-900 mb-2">Available placeholders:</p>
                <div className="flex flex-wrap gap-2">
                  {PLACEHOLDERS[stage.value]?.map((placeholder) => (
                    <code key={placeholder} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {placeholder}
                    </code>
                  ))}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">Email Subject</label>
                    <input
                      type="text"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      disabled={saving === stage.value}
                    />
                  </div>

                  {/* Body */}
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">Email Body</label>
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      rows={6}
                      disabled={saving === stage.value}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleSave(stage.value)}
                      disabled={saving === stage.value}
                      className="flex-1 px-4 py-2 bg-[#0D1B2A] text-white rounded font-medium hover:bg-[#0a1420] disabled:opacity-50 transition"
                    >
                      {saving === stage.value ? 'Saving...' : 'Save Template'}
                    </button>
                    <button
                      onClick={() => setEditingStage(null)}
                      disabled={saving === stage.value}
                      className="flex-1 px-4 py-2 bg-gray-200 text-[#333333] rounded font-medium hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-[#333333]">Subject:</p>
                    <p className="text-gray-700 mt-1">{template.subject}</p>
                  </div>
                  <div>
                    <p className="font-medium text-[#333333]">Body:</p>
                    <p className="text-gray-700 mt-1 whitespace-pre-wrap">{template.body}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> These templates are sent automatically when you move candidates through the pipeline.
          The {`{{custom_note}}`} placeholder in the Offer email is filled with any additional notes you add
          when creating the offer.
        </p>
      </div>
    </div>
  )
}
