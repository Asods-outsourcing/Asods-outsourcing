'use client'

import { FormData } from '../TalentPoolForm'

interface Props {
  formData: FormData
  handleInputChange: (field: keyof FormData, value: any) => void
}

export default function Page14Declaration({ formData, handleInputChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Declaration & Consent</h2>
      <p className="text-gray-600 mb-6">
        Please review the declarations before submitting your registration.
      </p>

      <div className="space-y-4">
        {/* Candidate Declaration */}
        <div className="border border-gray-300 rounded-lg p-4">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={formData.declaration_agreed}
              onChange={(e) => handleInputChange('declaration_agreed', e.target.checked)}
              className="mr-3 mt-1 w-4 h-4"
              required
            />
            <span className="text-sm text-gray-700">
              <span className="font-semibold">Candidate Declaration:</span>{' '}
              I confirm that the information provided is accurate and complete to the best of my knowledge. I understand that false or misleading information may result in disqualification. *
            </span>
          </label>
        </div>

        {/* Talent Pool Consent */}
        <div className="border border-gray-300 rounded-lg p-4">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={formData.talent_pool_consent}
              onChange={(e) => handleInputChange('talent_pool_consent', e.target.checked)}
              className="mr-3 mt-1 w-4 h-4"
              required
            />
            <span className="text-sm text-gray-700">
              <span className="font-semibold">Talent Pool Consent:</span>{' '}
              I consent to ASODS retaining my submitted information for considering me for current and future employment, outsourcing, contract, temporary and training opportunities that may match my profile. *
            </span>
          </label>
        </div>

        {/* Communication Consent */}
        <div className="border border-gray-300 rounded-lg p-4">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={formData.communication_consent}
              onChange={(e) => handleInputChange('communication_consent', e.target.checked)}
              className="mr-3 mt-1 w-4 h-4"
              required
            />
            <span className="text-sm text-gray-700">
              <span className="font-semibold">Communication Consent:</span>{' '}
              I agree that ASODS may contact me using the information provided regarding relevant employment, assessment, training or recruitment opportunities. *
            </span>
          </label>
        </div>

        <p className="text-xs text-gray-500 italic mt-4">
          * = Required. All three declarations must be checked to submit the form.
        </p>
      </div>
    </div>
  )
}
