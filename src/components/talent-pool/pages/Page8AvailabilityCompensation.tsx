'use client'

import { FormData } from '../TalentPoolForm'

interface Props {
  formData: FormData
  handleInputChange: (field: keyof FormData, value: any) => void
}

const AVAILABILITY_OPTIONS = [
  'Immediately',
  'Within 1 week',
  'Within 2 weeks',
  'Within 1 month',
  'More than 1 month'
]

const SALARY_RANGES = [
  'Below ₦100,000',
  '₦100,000–₦150,000',
  '₦150,000–₦250,000',
  '₦250,000–₦400,000',
  '₦400,000–₦600,000',
  '₦600,000+',
  'Negotiable'
]

const TRAINING_OPTIONS = ['Yes', 'No', 'Depends on the opportunity']

export default function Page8AvailabilityCompensation({ formData, handleInputChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Availability & Compensation</h2>
      <p className="text-gray-600 mb-6">
        This information helps ASODS determine whether your availability and expectations align with available opportunities.
      </p>

      <div className="space-y-6">
        {/* How soon can you start */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">How soon can you start? *</label>
          <div className="space-y-2">
            {AVAILABILITY_OPTIONS.map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="availability"
                  value={option}
                  checked={formData.availability === option}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Expected Salary */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Expected monthly salary range *</label>
          <div className="space-y-2">
            {SALARY_RANGES.map(range => (
              <label key={range} className="flex items-center">
                <input
                  type="radio"
                  name="salary_expectation"
                  value={range}
                  checked={formData.salary_expectation === range}
                  onChange={(e) => handleInputChange('salary_expectation', e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-700">{range}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Training */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Willing to undergo ASODS training before placement? *</label>
          <div className="space-y-2">
            {TRAINING_OPTIONS.map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="willing_to_train"
                  value={option}
                  checked={formData.willing_to_train === option}
                  onChange={(e) => handleInputChange('willing_to_train', e.target.value)}
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
