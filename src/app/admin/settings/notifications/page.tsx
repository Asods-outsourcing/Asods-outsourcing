'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Template {
  id: string
  stage: string
  subject: string
  body: string
  updated_at: string
}

const PLACEHOLDERS_BY_STAGE: Record<string, string[]> = {
  screening: ['{{candidate_name}}', '{{job_title}}'],
  interview: ['{{candidate_name}}', '{{job_title}}'],
  offer: ['{{candidate_name}}', '{{job_title}}', '{{salary}}', '{{start_date}}', '{{custom_note}}'],
  placed: ['{{candidate_name}}', '{{job_title}}'],
  rejected: ['{{candidate_name}}', '{{job_title}}'],
}

const EXPECTED_PLACEHOLDERS: Record<string, string[]> = {
  screening: ['{{candidate_name}}', '{{job_title}}'],
  interview: ['{{candidate_name}}', '{{job_title}}'],
  offer: ['{{salary}}', '{{start_date}}'], // Offer should always have these
  placed: ['{{candidate_name}}', '{{job_title}}'],
  rejected: ['{{candidate_name}}', '{{job_title}}'],
}

export default function NotificationsSettingsPage() {
  const supabase = createClient()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editSubject, setEditSubject] = useState('')
  const [editBody, setEditBody] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*')
        .order('stage', { ascending: true })

      if (error) {
        console.error('[Notifications] Fetch error:', error)
        setMessage({ type: 'error', text: 'Failed to load templates' })
        setLoading(false)
        return
      }

      setTemplates(data || [])
      setLoading(false)
    } catch (err) {
      console.error('[Notifications] Unexpected error:', err)
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
      setLoading(false)
    }
  }

  const handleEdit = (template: Template) => {
    setEditingId(template.id)
    setEditSubject(template.subject)
    setEditBody(template.body)
    setMessage(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditSubject('')
    setEditBody('')
    setMessage(null)
  }

  const validateTemplate = (stage: string, subject: string, body: string): string | null => {
    const expectedPlaceholders = EXPECTED_PLACEHOLDERS[stage] || []
    const combined = (subject + ' ' + body).toLowerCase()

    for (const placeholder of expectedPlaceholders) {
      const lowerPlaceholder = placeholder.toLowerCase()
      if (!combined.includes(lowerPlaceholder)) {
        return `Missing expected placeholder: ${placeholder}`
      }
    }

    return null
  }

  const handleSave = async (template: Template) => {
    setSaving(true)
    setMessage(null)

    // Validate template
    const validationWarning = validateTemplate(template.stage, editSubject, editBody)
    if (validationWarning) {
      setMessage({ type: 'warning', text: `Warning: ${validationWarning}. Save anyway?` })
      // Continue with save - warning only
    }

    try {
      const { error } = await supabase
        .from('notification_templates')
        .update({
          subject: editSubject,
          body: editBody,
          updated_at: new Date().toISOString(),
        })
        .eq('id', template.id)

      if (error) {
        console.error('[Notifications] Update error:', error)
        setMessage({ type: 'error', text: 'Failed to save template' })
        setSaving(false)
        return
      }

      // Update local state
      setTemplates(
        templates.map((t) =>
          t.id === template.id
            ? {
                ...t,
                subject: editSubject,
                body: editBody,
                updated_at: new Date().toISOString(),
              }
            : t
        )
      )

      setMessage({
        type: 'success',
        text: `${template.stage.charAt(0).toUpperCase() + template.stage.slice(1)} template saved successfully`,
      })
      setEditingId(null)
      setSaving(false)
    } catch (err) {
      console.error('[Notifications] Unexpected error:', err)
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading templates...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/home" className="text-[#D4AF37] hover:text-[#c49d23] mb-6 inline-block text-sm md:text-base">
          ← Back to admin
        </Link>
        <h1 className="text-3xl font-bold text-[#0D1B2A] mt-4">Email Notification Templates</h1>
        <p className="text-gray-600 mt-2">
          Customize the email messages sent to candidates as they move through the pipeline. Each template supports
          placeholders that will be replaced with real candidate and job data.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : message.type === 'warning'
                ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#0D1B2A] capitalize">{template.stage} Stage</h2>
              {!editingId || editingId !== template.id ? (
                <button
                  onClick={() => handleEdit(template)}
                  className="px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded font-medium hover:bg-[#c49d23] transition text-sm"
                >
                  Edit Template
                </button>
              ) : null}
            </div>

            {editingId === template.id ? (
              <div className="space-y-4">
                {/* Available Placeholders Reference */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm font-medium text-blue-900 mb-2">Available placeholders for this stage:</p>
                  <div className="flex flex-wrap gap-2">
                    {PLACEHOLDERS_BY_STAGE[template.stage]?.map((placeholder) => (
                      <code
                        key={placeholder}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono"
                      >
                        {placeholder}
                      </code>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-2">Email Subject</label>
                  <input
                    type="text"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    disabled={saving}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] disabled:bg-gray-100 font-mono text-sm"
                    placeholder="Enter email subject..."
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-2">Email Body</label>
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    disabled={saving}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] disabled:bg-gray-100 font-mono text-sm"
                    rows={8}
                    placeholder="Enter email body. Use placeholders like {{candidate_name}}, {{job_title}}, etc..."
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    💡 Tip: Use line breaks and markdown-like formatting. Placeholders are case-sensitive.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleSave(template)}
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded font-medium hover:bg-[#c49d23] disabled:opacity-50 transition"
                  >
                    {saving ? 'Saving...' : 'Save Template'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 px-4 py-2 border border-gray-300 text-[#0D1B2A] rounded font-medium hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Subject Preview */}
                <div>
                  <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">Subject</p>
                  <p className="text-sm text-[#0D1B2A] font-mono bg-gray-50 p-3 rounded border border-gray-200">
                    {template.subject}
                  </p>
                </div>

                {/* Body Preview */}
                <div>
                  <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">Body</p>
                  <div className="text-sm text-[#0D1B2A] font-mono bg-gray-50 p-3 rounded border border-gray-200 whitespace-pre-wrap break-words">
                    {template.body}
                  </div>
                </div>

                {/* Last Updated */}
                <div className="text-xs text-gray-600 pt-2 border-t">
                  Last updated: {new Date(template.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded">
        <p className="text-sm text-gray-600">
          <strong>How it works:</strong> These templates are sent automatically when you move candidates through the pipeline.
          The {`{{custom_note}}`} placeholder in the Offer email is filled with any additional notes you add when creating
          the offer. All placeholders are case-sensitive and must match exactly.
        </p>
      </div>
    </div>
  )
}
