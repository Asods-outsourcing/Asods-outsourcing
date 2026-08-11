'use client'

import { FormData } from '../TalentPoolForm'

interface Props {
  formData: FormData
  handleInputChange: (field: keyof FormData, value: any) => void
}

const REFERRAL_SOURCES = [
  'ASODS Website',
  'WhatsApp',
  'Instagram',
  'LinkedIn',
  'Facebook',
  'X',
  'TikTok',
  'Friend/Referral',
  'Job Platform',
  'Other'
]

export default function Page15HowDidYouHear({ formData, handleInputChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">How Did You Hear About Us?</h2>
      <p className="text-gray-600 mb-6">
        Help us understand how you discovered ASODS.
      </p>

      <div className="space-y-6">
        {/* How did you hear about us */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">How did you hear about ASODS? *</label>
          <div className="space-y-2">
            {REFERRAL_SOURCES.map(source => (
              <label key={source} className="flex items-center">
                <input
                  type="radio"
                  name="referral_source"
                  value={source}
                  checked={formData.referral_source === source}
                  onChange={(e) => handleInputChange('referral_source', e.target.value)}
                  className="mr-3"
                  required
                />
                <span className="text-gray-700">{source}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Referral name (conditional) */}
        {formData.referral_source === 'Friend/Referral' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              If Referral, provide the name of the person who referred you
            </label>
            <input
              type="text"
              value={formData.referral_name || ''}
              onChange={(e) => handleInputChange('referral_name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Name of the person who referred you"
            />
          </div>
        )}
      </div>
    </div>
  )
}
