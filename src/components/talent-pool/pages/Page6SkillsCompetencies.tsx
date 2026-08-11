'use client'

import { FormData } from '../TalentPoolForm'

interface Props {
  formData: FormData
  handleInputChange: (field: keyof FormData, value: any) => void
}

const SKILLS = [
  'Customer Service',
  'Sales',
  'Business Development',
  'Relationship Management',
  'Negotiation',
  'Administration',
  'Data Entry',
  'Operations',
  'Documentation',
  'Logistics',
  'Inventory Management',
  'Microsoft Word',
  'Microsoft Excel',
  'PowerPoint',
  'Google Workspace',
  'Canva',
  'Social Media Management',
  'CRM',
  'Data Analysis',
  'IT Support',
  'Accounting',
  'Bookkeeping',
  'Financial Administration',
  'Banking Operations',
  'Written Communication',
  'Verbal Communication',
  'Presentation',
  'Teamwork',
  'Problem Solving'
]

export default function Page6SkillsCompetencies({ formData, handleInputChange }: Props) {
  const toggleSkill = (skill: string) => {
    const updated = formData.strongest_skills.includes(skill)
      ? formData.strongest_skills.filter(s => s !== skill)
      : [...formData.strongest_skills, skill]
    handleInputChange('strongest_skills', updated)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Skills & Competencies</h2>
      <p className="text-gray-600 mb-6">
        Select only skills you can confidently demonstrate.
      </p>

      <div className="space-y-6">
        {/* Skills */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Strongest professional skills *</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SKILLS.map(skill => (
              <label key={skill} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.strongest_skills.includes(skill)}
                  onChange={() => toggleSkill(skill)}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-gray-700">{skill}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Skill to Improve */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Which skill would you most like to improve? *</label>
          <input
            type="text"
            value={formData.skill_to_improve}
            onChange={(e) => handleInputChange('skill_to_improve', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What skill do you want to develop?"
            required
          />
        </div>

        {/* Digital Literacy */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">Rate your overall digital literacy *</label>
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4, 5].map(rating => (
              <label key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="digital_literacy_rating"
                  value={rating}
                  checked={formData.digital_literacy_rating === rating}
                  onChange={(e) => handleInputChange('digital_literacy_rating', parseInt(e.target.value))}
                  className="mr-2"
                />
                <span className="text-gray-700 text-sm">{rating}</span>
              </label>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2">1 = Beginner | 5 = Advanced</div>
        </div>
      </div>
    </div>
  )
}
