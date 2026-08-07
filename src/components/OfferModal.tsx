'use client'

import { useState, useEffect } from 'react'
import { sendNotificationEmail } from '@/lib/notifications/sendNotification'

interface OfferModalProps {
  isOpen: boolean
  candidateId: string
  candidateName: string
  candidateEmail: string
  jobTitle: string
  applicationId: string
  onClose: () => void
  onSuccess: (message: string) => void
  onError: (error: string) => void
}

export function OfferModal({
  isOpen,
  candidateId,
  candidateName,
  candidateEmail,
  jobTitle,
  applicationId,
  onClose,
  onSuccess,
  onError,
}: OfferModalProps) {
  const [salary, setSalary] = useState('')
  const [startDate, setStartDate] = useState('')
  const [customNote, setCustomNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Set default start date to today
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0]
      setStartDate(today)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!salary) {
        setError('Salary/compensation is required')
        setLoading(false)
        return
      }

      if (!startDate) {
        setError('Start date is required')
        setLoading(false)
        return
      }

      console.log('[Offer Modal] Sending offer notification', {
        candidateId,
        candidateName,
        candidateEmail,
        jobTitle,
        salary,
        startDate,
        customNote,
      })

      // Send offer notification email
      const result = await sendNotificationEmail({
        candidateId: candidateId,
        stage: 'offer',
        candidateName: candidateName,
        candidateEmail: candidateEmail,
        jobTitle: jobTitle,
        salary: salary,
        startDate: startDate,
        customNote: customNote,
      })

      if (!result.success) {
        console.error('[Offer Modal] Email send failed:', result.error)
        setError(`Email failed to send: ${result.error}. Changes may not be saved.`)
        setLoading(false)
        return
      }

      console.log('[Offer Modal] Offer email sent successfully')
      setLoading(false)
      onSuccess(`Offer sent to ${candidateEmail} with start date ${startDate}`)
      onClose()
    } catch (err) {
      console.error('[Offer Modal] Unexpected error:', err)
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      onError(errorMessage)
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-[#0D1B2A] mb-2">Send Job Offer</h3>
        <p className="text-gray-600 text-sm mb-6">
          Prepare and send the offer to {candidateName}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Salary/Compensation */}
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-[#333333] mb-1">
              Salary / Compensation *
            </label>
            <input
              type="text"
              id="salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g., $50,000/year or $25/hour"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              required
              disabled={loading}
            />
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-[#333333] mb-1">
              Start Date *
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

          {/* Custom Note */}
          <div>
            <label htmlFor="customNote" className="block text-sm font-medium text-[#333333] mb-1">
              Additional Notes (optional)
            </label>
            <textarea
              id="customNote"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Add any additional information for the offer email..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              rows={4}
              disabled={loading}
            />
            <p className="text-xs text-gray-600 mt-1">
              This will be included in the email as {`{{custom_note}}`}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#0D1B2A] text-white rounded-lg font-medium hover:bg-[#0a1420] disabled:opacity-50 transition"
            >
              {loading ? 'Sending...' : 'Send Offer'}
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
