'use client'

import { FormData } from '../TalentPoolForm'

interface Props {
  formData: FormData
  handleInputChange: (field: keyof FormData, value: any) => void
}

const ROLES_OF_INTEREST = [
  'Customer Service',
  'Sales',
  'Business Development',
  'Administration',
  'Data Entry',
  'Banking/Finance',
  'Logistics/Operations',
  'Digital/IT',
  'Other',
]

const STRONGEST_SKILLS = [
  'Communication',
  'Customer Service',
  'Sales',
  'Microsoft Excel',
  'Microsoft Word',
  'Data Entry',
  'Administration',
  'Problem Solving',
  'Teamwork',
  'Digital Skills',
  'Leadership',
  'Other',
]

export default function Page3SkillsPreferences({ formData, handleInputChange }: Props) {
  const handleCheckboxChange = (field: 'roles_of_interest' | 'strongest_skills', value: string) => {
    const currentArray = formData[field] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    handleInputChange(field, newArray)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Skills & Job Preferences</h2>
      <p className="text-gray-600 mb-6">
        Help us understand what you can do and the opportunities you're looking for.
      </p>

      <div className="space-y-6">
        {/* Roles of Interest */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Roles of Interest *</label>
          <div className="space-y-2">
            {ROLES_OF_INTEREST.map(role => (
              <label key={role} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.roles_of_interest.includes(role)}
                  onChange={() => handleCheckboxChange('roles_of_interest', role)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700">{role}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Strongest Skills */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Strongest Skills *</label>
          <div className="space-y-2">
            {STRONGEST_SKILLS.map(skill => (
              <label key={skill} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.strongest_skills.includes(skill)}
                  onChange={() => handleCheckboxChange('strongest_skills', skill)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700">{skill}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preferred Work Arrangement */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Preferred Work Arrangement *</label>
          <div className="space-y-2">
            {['On-site', 'Hybrid', 'Remote', 'Any'].map(arrangement => (
              <label key={arrangement} className="flex items-center">
                <input
                  type="radio"
                  name="preferred_work_arrangement"
                  value={arrangement}
                  checked={formData.preferred_work_arrangement === arrangement}
                  onChange={(e) => handleInputChange('preferred_work_arrangement', e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-700">{arrangement}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preferred Employment Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Preferred Employment Type *</label>
          <div className="space-y-2">
            {['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'].map(empType => (
              <label key={empType} className="flex items-center">
                <input
                  type="radio"
                  name="preferred_employment_type"
                  value={empType}
                  checked={formData.preferred_employment_type === empType}
                  onChange={(e) => handleInputChange('preferred_employment_type', e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-700">{empType}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
