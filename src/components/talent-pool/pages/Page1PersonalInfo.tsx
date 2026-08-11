'use client'

import { FormData } from '../TalentPoolForm'

interface Props {
  formData: FormData
  handleInputChange: (field: keyof FormData, value: any) => void
}

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
  'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
]

export default function Page1PersonalInfo({ formData, handleInputChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Personal Information</h2>
      <p className="text-gray-600 mb-6">
        Let's start with your basic information. Please ensure your contact details are accurate because ASODS may use them to communicate recruitment opportunities.
      </p>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone/WhatsApp Number *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+234 xxx xxx xxxx"
            required
          />
        </div>

        {/* State of Residence */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">State of Residence *</label>
          <select
            value={formData.state_of_residence}
            onChange={(e) => handleInputChange('state_of_residence', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">-- Select a state --</option>
            {NIGERIAN_STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        {/* City/LGA */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">City/LGA *</label>
          <input
            type="text"
            value={formData.city_lga}
            onChange={(e) => handleInputChange('city_lga', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your city or LGA"
            required
          />
        </div>

        {/* Preferred Contact Method */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Preferred Contact Method *</label>
          <div className="space-y-2">
            {['WhatsApp', 'Phone Call', 'Email', 'Any of the above'].map(method => (
              <label key={method} className="flex items-center">
                <input
                  type="radio"
                  name="preferred_contact_method"
                  value={method}
                  checked={formData.preferred_contact_method === method}
                  onChange={(e) => handleInputChange('preferred_contact_method', e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-700">{method}</span>
              </label>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4">Estimated completion time: 7–10 minutes.</p>
      </div>
    </div>
  )
}
