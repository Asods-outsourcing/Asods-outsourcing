'use client'

import { FormData } from '../TalentPoolForm'

interface Props {
  formData: FormData
  handleInputChange: (field: keyof FormData, value: any) => void
}

export default function Page13References({ formData, handleInputChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Professional References</h2>
      <p className="text-gray-600 mb-6">
        Please provide details of a professional reference who can vouch for your work experience and character.
      </p>

      <div className="space-y-6">
        {/* Reference Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Reference Name</label>
          <input
            type="text"
            value={formData.reference_name || ''}
            onChange={(e) => handleInputChange('reference_name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Full name of reference"
          />
        </div>

        {/* Relationship */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Relationship to Candidate</label>
          <input
            type="text"
            value={formData.reference_relationship || ''}
            onChange={(e) => handleInputChange('reference_relationship', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Former Manager, Supervisor, Colleague"
          />
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone/Email</label>
          <input
            type="text"
            value={formData.reference_contact || ''}
            onChange={(e) => handleInputChange('reference_contact', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Phone number or email address"
          />
        </div>

        <p className="text-xs text-gray-500 italic">
          All fields on this page are optional.
        </p>
      </div>
    </div>
  )
}
