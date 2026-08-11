'use client'

import { FormData } from '../TalentPoolForm'

interface Props {
  formData: FormData
  handleInputChange: (field: keyof FormData, value: any) => void
}

const EMPLOYMENT_STATUSES = [
  'Employed',
  'Unemployed',
  'Self-employed',
  'Student',
  'NYSC/Graduate Trainee',
  'Recently completed NYSC',
  'Other'
]

export default function Page4WorkExperience({ formData, handleInputChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Work Experience</h2>
      <p className="text-gray-600 mb-6">
        Tell us about your professional experience. Candidates with little or no experience may still be considered for suitable opportunities.
      </p>

      <div className="space-y-6">
        {/* Employment Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Current Employment Status *</label>
          <div className="space-y-2">
            {EMPLOYMENT_STATUSES.map(status => (
              <label key={status} className="flex items-center">
                <input
                  type="radio"
                  name="employment_status"
                  value={status}
                  checked={formData.employment_status === status}
                  onChange={(e) => handleInputChange('employment_status', e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-700">{status}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
