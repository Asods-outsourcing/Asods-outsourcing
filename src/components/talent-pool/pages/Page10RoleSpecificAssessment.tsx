'use client'

import { FormData } from '../TalentPoolForm'

interface Props {
  formData: FormData
  handleInputChange: (field: keyof FormData, value: any) => void
}

const ASSESSMENT_TRACKS = [
  'Customer Service',
  'Sales / Business Development',
  'Administration / Data Entry',
  'Finance / Banking',
  'Logistics / Operations',
  'Digital / IT'
]

const ASSESSMENT_QUESTIONS: Record<string, string[]> = {
  'Customer Service': [
    'A customer is angry because their issue has not been resolved. What would you do?',
    'What does excellent customer service mean to you?',
    'How would you handle a customer who is being rude to you?'
  ],
  'Sales / Business Development': [
    'How would you approach a potential customer who is not interested in your product?',
    'What is the difference between selling a product and solving a customer\'s problem?',
    'How would you respond after a customer rejects your offer?'
  ],
  'Administration / Data Entry': [
    'How comfortable are you with Microsoft Excel? (1-5 scale)',
    'What steps would you take to ensure accurate data entry?',
    'How do you organize multiple administrative tasks?'
  ],
  'Finance / Banking': [
    'Why is accuracy important when handling financial information?',
    'How would you handle a discrepancy in financial records?',
    'What financial/accounting software or tools have you used?'
  ],
  'Logistics / Operations': [
    'What factors should be considered when planning a delivery or logistics operation?',
    'How would you respond if a delivery was unexpectedly delayed?',
    'What tools or systems have you used for tracking operations?'
  ],
  'Digital / IT': [
    'What digital tools or software are you most comfortable using?',
    'Describe a digital/technical problem you have solved.',
    'Which area of technology would you like to develop further?'
  ]
}

export default function Page10RoleSpecificAssessment({ formData, handleInputChange }: Props) {
  const track = formData.assessment_track
  const questions = track ? ASSESSMENT_QUESTIONS[track] : []

  const updateAnswer = (questionIndex: number, value: string) => {
    const answers = { ...formData.assessment_answers }
    answers[`q${questionIndex + 1}`] = value
    handleInputChange('assessment_answers', answers)
  }

  const handleExcelRating = (value: string) => {
    const answers = { ...formData.assessment_answers }
    answers['excel_rating'] = value
    handleInputChange('assessment_answers', answers)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Role-Specific Assessment</h2>
      <p className="text-gray-600 mb-6">
        Please select your primary area of interest to complete the relevant assessment.
      </p>

      <div className="space-y-6">
        {/* Select track */}
        {!track && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Primary area of interest *</label>
            <div className="space-y-2">
              {ASSESSMENT_TRACKS.map(t => (
                <label key={t} className="flex items-center">
                  <input
                    type="radio"
                    name="assessment_track"
                    value={t}
                    checked={formData.assessment_track === t}
                    onChange={(e) => handleInputChange('assessment_track', e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-gray-700">{t}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Show assessment questions */}
        {track && questions.length > 0 && (
          <div>
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800 font-semibold">
                Selected: <span className="font-bold">{track}</span>
              </p>
              <button
                onClick={() => {
                  handleInputChange('assessment_track', '')
                  handleInputChange('assessment_answers', {})
                }}
                className="text-sm text-blue-600 hover:text-blue-800 mt-2 underline"
              >
                Change selection
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((question, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {idx + 1}. {question} *
                  </label>
                  {track === 'Administration / Data Entry' && idx === 0 ? (
                    // Excel rating - linear scale 1-5
                    <div className="flex items-center gap-4">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <label key={rating} className="flex items-center">
                          <input
                            type="radio"
                            name="excel_rating"
                            value={rating}
                            checked={formData.assessment_answers['excel_rating'] === String(rating)}
                            onChange={(e) => handleExcelRating(e.target.value)}
                            className="mr-2"
                          />
                          <span className="text-gray-700">{rating}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      value={formData.assessment_answers[`q${idx + 1}`] || ''}
                      onChange={(e) => updateAnswer(idx, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Your answer to question ${idx + 1}`}
                      rows={3}
                      required
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
