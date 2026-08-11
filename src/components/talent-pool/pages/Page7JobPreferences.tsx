'use client'

import { FormData } from '../TalentPoolForm'

interface Props {
  formData: FormData
  handleInputChange: (field: keyof FormData, value: any) => void
}

const ROLES = [
  'Customer Service Representative',
  'Sales Executive',
  'Business Development Executive',
  'Administrative Assistant',
  'Data Entry Officer',
  'Operations Officer',
  'Logistics Officer',
  'Bank Teller',
  'Relationship Officer',
  'Accounts Assistant',
  'IT Support',
  'Social Media/Digital Support',
  'Other'
]

const WORK_ARRANGEMENTS = ['On-site', 'Hybrid', 'Remote']
const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Graduate Trainee']
const RELOCATION_OPTIONS = ['Yes', 'No', 'Maybe']

export default function Page7JobPreferences({ formData, handleInputChange }: Props) {
  const toggleRole = (role: string) => {
    const updated = formData.preferred_roles.includes(role)
      ? formData.preferred_roles.filter(r => r !== role)
      : [...formData.preferred_roles, role]
    handleInputChange('preferred_roles', updated)
  }

  const toggleArrangement = (arr: string) => {
    const updated = formData.work_arrangement.includes(arr)
      ? formData.work_arrangement.filter(a => a !== arr)
      : [...formData.work_arrangement, arr]
    handleInputChange('work_arrangement', updated)
  }

  const toggleEmploymentType = (type: string) => {
    const updated = formData.employment_type.includes(type)
      ? formData.employment_type.filter(t => t !== type)
      : [...formData.employment_type, type]
    handleInputChange('employment_type', updated)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Preferences</h2>
      <p className="text-gray-600 mb-6">
        Help us understand the types of opportunities that would be most suitable for you.
      </p>

      <div className="space-y-6">
        {/* Roles of Interest */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Roles of interest *</label>
          <div className="space-y-2">
            {ROLES.map(role => (
              <label key={role} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.preferred_roles.includes(role)}
                  onChange={() => toggleRole(role)}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-gray-700">{role}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Work Arrangement */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Preferred work arrangement *</label>
          <div className="space-y-2">
            {WORK_ARRANGEMENTS.map(arr => (
              <label key={arr} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.work_arrangement.includes(arr)}
                  onChange={() => toggleArrangement(arr)}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-gray-700">{arr}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Preferred employment type *</label>
          <div className="space-y-2">
            {EMPLOYMENT_TYPES.map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.employment_type.includes(type)}
                  onChange={() => toggleEmploymentType(type)}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preferred Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred work location *</label>
          <input
            type="text"
            value={formData.preferred_location}
            onChange={(e) => handleInputChange('preferred_location', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Lagos, Abuja, Remote"
            required
          />
        </div>

        {/* Willing to Relocate */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Willing to relocate? *</label>
          <div className="space-y-2">
            {RELOCATION_OPTIONS.map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="willing_to_relocate"
                  value={option}
                  checked={formData.willing_to_relocate === option}
                  onChange={(e) => handleInputChange('willing_to_relocate', e.target.value)}
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
