'use client'

import { FormData } from '../TalentPoolForm'

interface Props {
  formData: FormData
  handleInputChange: (field: keyof FormData, value: any) => void
}

const INDUSTRIES = [
  'Accounting/Finance', 'Agriculture', 'Automotive', 'Banking', 'Construction', 'Consulting',
  'E-commerce', 'Education', 'Energy', 'Engineering', 'Entertainment', 'Fast Moving Consumer Goods',
  'Financial Services', 'Healthcare', 'Hospitality', 'Insurance', 'IT/Software', 'Legal',
  'Logistics', 'Manufacturing', 'Media', 'Oil & Gas', 'Real Estate', 'Retail', 'Telecommunications',
  'Tourism', 'Transportation', 'Utilities', 'Other'
]

const YEARS_IN_ROLE = [
  'Less than 6 months',
  '6 months–1 year',
  '1–2 years',
  '3–5 years',
  '6+ years'
]

export default function Page5CurrentEmployment({ formData, handleInputChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Current/Recent Employment</h2>
      <p className="text-gray-600 mb-6">
        Provide details about your current or most recent employment.
      </p>

      <div className="space-y-6">
        {/* Job Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
          <input
            type="text"
            value={formData.current_job_title || ''}
            onChange={(e) => handleInputChange('current_job_title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Sales Executive, Accountant"
            required
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Company/Organization *</label>
          <input
            type="text"
            value={formData.current_company || ''}
            onChange={(e) => handleInputChange('current_company', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Name of company or organization"
            required
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Industry *</label>
          <select
            value={formData.current_industry || ''}
            onChange={(e) => handleInputChange('current_industry', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">-- Select industry --</option>
            {INDUSTRIES.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        {/* Years in Role */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">How long have you worked in this role? *</label>
          <div className="space-y-2">
            {YEARS_IN_ROLE.map(years => (
              <label key={years} className="flex items-center">
                <input
                  type="radio"
                  name="years_in_role"
                  value={years}
                  checked={formData.years_in_role === years}
                  onChange={(e) => handleInputChange('years_in_role', e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-700">{years}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Responsibilities */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Briefly describe your responsibilities *</label>
          <textarea
            value={formData.current_responsibilities || ''}
            onChange={(e) => handleInputChange('current_responsibilities', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What are your main job responsibilities?"
            rows={4}
            required
          />
        </div>

        {/* Achievements */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">What are your key achievements in this role?</label>
          <textarea
            value={formData.current_achievements || ''}
            onChange={(e) => handleInputChange('current_achievements', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your key achievements"
            rows={4}
          />
        </div>
      </div>
    </div>
  )
}
