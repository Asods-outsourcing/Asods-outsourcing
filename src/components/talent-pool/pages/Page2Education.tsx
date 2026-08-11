'use client'

import { FormData } from '../TalentPoolForm'

interface Props {
  formData: FormData
  handleInputChange: (field: keyof FormData, value: any) => void
}

const EDUCATION_LEVELS = [
  'Secondary School Certificate',
  'OND',
  'HND',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Doctorate',
  'Professional Qualification',
  'Other'
]

const CURRENT_YEAR = new Date().getFullYear()
const GRADUATION_YEARS = Array.from({ length: 50 }, (_, i) => CURRENT_YEAR - i).map(String)

export default function Page2Education({ formData, handleInputChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Education & Qualifications</h2>
      <p className="text-gray-600 mb-6">
        Tell us about your educational background and professional qualifications.
      </p>

      <div className="space-y-6">
        {/* Highest Level of Education */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Highest Level of Education *</label>
          <div className="space-y-2">
            {EDUCATION_LEVELS.map(level => (
              <label key={level} className="flex items-center">
                <input
                  type="radio"
                  name="highest_education"
                  value={level}
                  checked={formData.highest_education === level}
                  onChange={(e) => handleInputChange('highest_education', e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-700">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Field of Study */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Field of Study *</label>
          <input
            type="text"
            value={formData.field_of_study}
            onChange={(e) => handleInputChange('field_of_study', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Business Administration, Engineering, etc."
            required
          />
        </div>

        {/* Institution */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Institution Attended *</label>
          <input
            type="text"
            value={formData.institution}
            onChange={(e) => handleInputChange('institution', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Name of university or college"
            required
          />
        </div>

        {/* Graduation Year */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Graduation Year *</label>
          <select
            value={formData.graduation_year}
            onChange={(e) => handleInputChange('graduation_year', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">-- Select year --</option>
            {GRADUATION_YEARS.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Professional Certifications */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Do you have any professional certifications? *</label>
          <div className="space-y-2">
            {['Yes', 'No'].map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="has_certifications"
                  value={option}
                  checked={formData.has_certifications === (option === 'Yes')}
                  onChange={(e) => handleInputChange('has_certifications', e.target.value === 'Yes')}
                  className="mr-3"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
