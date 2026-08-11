'use client'

import { FormData } from '../TalentPoolForm'

interface Props {
  formData: FormData
  handleInputChange: (field: keyof FormData, value: any) => void
}

const KPI_OPTIONS = ['Yes', 'No', 'Depends on the role']

export default function Page9CandidateScreening({ formData, handleInputChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Candidate Screening</h2>
      <p className="text-gray-600 mb-6">
        The following questions help us understand your communication, professionalism, problem-solving ability and readiness for employment.
      </p>

      <div className="space-y-6">
        {/* About yourself */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tell us briefly about yourself and your professional background. *
          </label>
          <textarea
            value={formData.about_yourself}
            onChange={(e) => handleInputChange('about_yourself', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share your background and professional journey"
            rows={4}
            required
          />
        </div>

        {/* Strongest qualities */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            What are your three strongest professional qualities? *
          </label>
          <textarea
            value={formData.strongest_qualities}
            onChange={(e) => handleInputChange('strongest_qualities', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your top 3 professional strengths"
            rows={4}
            required
          />
        </div>

        {/* Difficult situation */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Describe a difficult situation you faced at work, school or during an internship and how you handled it. *
          </label>
          <textarea
            value={formData.difficult_situation}
            onChange={(e) => handleInputChange('difficult_situation', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share a challenging situation and your solution"
            rows={4}
            required
          />
        </div>

        {/* Task prioritization */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            How do you prioritize tasks when you have several deadlines at the same time? *
          </label>
          <textarea
            value={formData.task_prioritization}
            onChange={(e) => handleInputChange('task_prioritization', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Explain your approach to managing multiple deadlines"
            rows={4}
            required
          />
        </div>

        {/* Why employer should consider */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Why should an employer consider you for the role(s) you selected? *
          </label>
          <textarea
            value={formData.why_employer_should_consider}
            onChange={(e) => handleInputChange('why_employer_should_consider', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Make your case for why you're the right candidate"
            rows={4}
            required
          />
        </div>

        {/* KPIs */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Are you comfortable working with performance targets/KPIs? *
          </label>
          <div className="space-y-2">
            {KPI_OPTIONS.map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="comfortable_with_kpis"
                  value={option}
                  checked={formData.comfortable_with_kpis === option}
                  onChange={(e) => handleInputChange('comfortable_with_kpis', e.target.value)}
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
