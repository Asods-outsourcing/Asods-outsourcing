'use client'

import { FormData } from '../TalentPoolForm'

interface Props {
  formData: FormData
  handleInputChange: (field: keyof FormData, value: any) => void
}

export default function Page2EducationExperience({ formData, handleInputChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Education & Experience</h2>
      <p className="text-gray-600 mb-6">
        Give us a quick overview of your educational and professional background.
      </p>

      <div className="space-y-6">
        {/* Highest Level of Education */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Highest Level of Education *</label>
          <select
            value={formData.highest_education}
            onChange={(e) => handleInputChange('highest_education', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">-- Select education level --</option>
            <option value="SSCE">SSCE</option>
            <option value="OND">OND</option>
            <option value="HND">HND</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="Professional Qualification">Professional Qualification</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Field of Study */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Field of Study *</label>
          <input
            type="text"
            value={formData.field_of_study}
            onChange={(e) => handleInputChange('field_of_study', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Business Administration, Computer Science"
            required
          />
        </div>

        {/* Current Employment Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Current Employment Status *</label>
          <select
            value={formData.employment_status}
            onChange={(e) => handleInputChange('employment_status', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">-- Select employment status --</option>
            <option value="Employed">Employed</option>
            <option value="Unemployed">Unemployed</option>
            <option value="Self-employed">Self-employed</option>
            <option value="Student">Student</option>
            <option value="NYSC/Graduate Trainee">NYSC/Graduate Trainee</option>
            <option value="Recently completed NYSC">Recently completed NYSC</option>
          </select>
        </div>

        {/* Years of Work Experience */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Work Experience *</label>
          <select
            value={formData.years_of_experience}
            onChange={(e) => handleInputChange('years_of_experience', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">-- Select experience level --</option>
            <option value="No experience">No experience</option>
            <option value="Less than 1 year">Less than 1 year</option>
            <option value="1–2 years">1–2 years</option>
            <option value="3–5 years">3–5 years</option>
            <option value="6+ years">6+ years</option>
          </select>
        </div>

        {/* Current/Most Recent Job Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Current/Most Recent Job Title</label>
          <input
            type="text"
            value={formData.current_job_title}
            onChange={(e) => handleInputChange('current_job_title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Customer Service Representative"
          />
          <p className="text-xs text-gray-500 mt-1">Optional</p>
        </div>

        {/* Briefly describe your work experience */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Briefly describe your work experience *</label>
          <textarea
            value={formData.work_experience_description}
            onChange={(e) => handleInputChange('work_experience_description', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell us about your professional background..."
            rows={4}
            required
          />
        </div>
      </div>
    </div>
  )
}
