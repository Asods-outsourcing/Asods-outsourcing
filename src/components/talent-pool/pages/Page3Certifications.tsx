'use client'

import { FormData } from '../TalentPoolForm'

interface Props {
  formData: FormData
  handleInputChange: (field: keyof FormData, value: any) => void
}

const CERTIFICATIONS = [
  'ICAN',
  'ACCA',
  'CIPM',
  'CIPS',
  'PMI/CAPM/PMP',
  'HSE',
  'Digital Marketing',
  'Microsoft Certification',
  'Google Certification',
  'Other'
]

export default function Page3Certifications({ formData, handleInputChange }: Props) {
  const toggleCertification = (cert: string) => {
    const updated = formData.certifications_list.includes(cert)
      ? formData.certifications_list.filter(c => c !== cert)
      : [...formData.certifications_list, cert]
    handleInputChange('certifications_list', updated)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Professional Certifications</h2>
      <p className="text-gray-600 mb-6">
        Only candidates who answered 'Yes' to professional certifications reach this section.
      </p>

      <div className="space-y-6">
        {/* Professional Certifications */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">What professional certifications do you hold? *</label>
          <div className="space-y-2">
            {CERTIFICATIONS.map(cert => (
              <label key={cert} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.certifications_list.includes(cert)}
                  onChange={() => toggleCertification(cert)}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-gray-700">{cert}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Certifications */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">List any additional certifications</label>
          <textarea
            value={formData.additional_certifications}
            onChange={(e) => handleInputChange('additional_certifications', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter any other certifications you have"
            rows={4}
          />
        </div>

        <p className="text-xs text-gray-500">
          Note: You can upload certificate files on a later page.
        </p>
      </div>
    </div>
  )
}
