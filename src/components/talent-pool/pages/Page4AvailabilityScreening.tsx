'use client'

import { FormData } from '../TalentPoolForm'

interface Props {
  formData: FormData
  handleInputChange: (field: keyof FormData, value: any) => void
}

export default function Page4AvailabilityScreening({ formData, handleInputChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Availability & Screening</h2>
      <p className="text-gray-600 mb-6">
        A few quick questions to help us understand your readiness for opportunities.
      </p>

      <div className="space-y-6">
        {/* How soon can you start */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">How soon can you start? *</label>
          <div className="space-y-2">
            {['Immediately', 'Within 1 week', 'Within 2 weeks', 'Within 1 month', 'More than 1 month'].map(option => (
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

        {/* Expected Monthly Salary Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Expected Monthly Salary Range *</label>
          <div className="space-y-2">
            {[
              'Below ₦100,000',
              '₦100,000–₦150,000',
              '₦150,000–₦250,000',
              '₦250,000–₦400,000',
              '₦400,000+',
              'Negotiable'
            ].map(range => (
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

        {/* Tell us briefly about yourself and what you are looking for */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tell us briefly about yourself and what you are looking for *</label>
          <textarea
            value={formData.about_yourself}
            onChange={(e) => handleInputChange('about_yourself', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share your background, career goals, and what you're looking for in your next role..."
            rows={4}
            required
          />
        </div>

        {/* What are your three strongest professional qualities */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">What are your three strongest professional qualities? *</label>
          <textarea
            value={formData.strongest_qualities}
            onChange={(e) => handleInputChange('strongest_qualities', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Communication, Problem-solving, Attention to detail"
            rows={4}
            required
          />
        </div>

        {/* Willing to undergo ASODS training or assessment before placement */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Willing to undergo ASODS training or assessment before placement? *</label>
          <div className="space-y-2">
            {['Yes', 'No', 'Depending on the opportunity'].map(option => (
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
