'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Page1PersonalInfo from './pages/Page1PersonalInfo'
import Page2Education from './pages/Page2Education'
import Page3Certifications from './pages/Page3Certifications'
import Page4WorkExperience from './pages/Page4WorkExperience'
import Page5CurrentEmployment from './pages/Page5CurrentEmployment'
import Page6SkillsCompetencies from './pages/Page6SkillsCompetencies'
import Page7JobPreferences from './pages/Page7JobPreferences'
import Page8AvailabilityCompensation from './pages/Page8AvailabilityCompensation'
import Page9CandidateScreening from './pages/Page9CandidateScreening'
import Page10RoleSpecificAssessment from './pages/Page10RoleSpecificAssessment'
import Page12CVDocuments from './pages/Page12CVDocuments'
import Page13References from './pages/Page13References'
import Page14Declaration from './pages/Page14Declaration'
import Page15HowDidYouHear from './pages/Page15HowDidYouHear'
import SuccessMessage from './SuccessMessage'

export interface FormData {
  // Page 1: Personal Information
  full_name: string
  email: string
  phone: string
  state_of_residence: string
  city_lga: string
  preferred_contact_method: string

  // Page 2: Education
  highest_education: string
  field_of_study: string
  institution: string
  graduation_year: string
  has_certifications: boolean

  // Page 3: Certifications (detailed_responses.certifications_list)
  certifications_list: string[]
  additional_certifications: string

  // Page 4: Work Experience
  employment_status: string

  // Page 5: Current/Recent Employment (if applicable)
  current_job_title?: string
  current_company?: string
  current_industry?: string
  years_in_role?: string
  current_responsibilities?: string
  current_achievements?: string

  // Page 6: Skills & Competencies
  strongest_skills: string[]
  skill_to_improve: string
  digital_literacy_rating: number

  // Page 7: Job Preferences
  preferred_roles: string[]
  work_arrangement: string[]
  employment_type: string[]
  preferred_location: string
  willing_to_relocate: string

  // Page 8: Availability & Compensation
  availability: string
  salary_expectation: string
  willing_to_train: string

  // Page 9: Candidate Screening (detailed_responses)
  about_yourself: string
  strongest_qualities: string
  difficult_situation: string
  task_prioritization: string
  why_employer_should_consider: string
  comfortable_with_kpis: string

  // Page 10: Role-specific assessment
  assessment_track: string
  assessment_answers: Record<string, string>

  // Page 12: CV & Documents
  cv_url?: string
  certificate_urls?: string[]

  // Page 13: References
  reference_name?: string
  reference_relationship?: string
  reference_contact?: string

  // Page 14: Declaration & Consent
  declaration_agreed: boolean
  talent_pool_consent: boolean
  communication_consent: boolean

  // Page 15: How did you hear about us
  referral_source: string
  referral_name?: string
}

const initialFormData: FormData = {
  full_name: '',
  email: '',
  phone: '',
  state_of_residence: '',
  city_lga: '',
  preferred_contact_method: '',
  highest_education: '',
  field_of_study: '',
  institution: '',
  graduation_year: '',
  has_certifications: false,
  certifications_list: [],
  additional_certifications: '',
  employment_status: '',
  current_job_title: '',
  current_company: '',
  current_industry: '',
  years_in_role: '',
  current_responsibilities: '',
  current_achievements: '',
  strongest_skills: [],
  skill_to_improve: '',
  digital_literacy_rating: 0,
  preferred_roles: [],
  work_arrangement: [],
  employment_type: [],
  preferred_location: '',
  willing_to_relocate: '',
  availability: '',
  salary_expectation: '',
  willing_to_train: '',
  about_yourself: '',
  strongest_qualities: '',
  difficult_situation: '',
  task_prioritization: '',
  why_employer_should_consider: '',
  comfortable_with_kpis: '',
  assessment_track: '',
  assessment_answers: {},
  cv_url: '',
  certificate_urls: [],
  reference_name: '',
  reference_relationship: '',
  reference_contact: '',
  declaration_agreed: false,
  talent_pool_consent: false,
  communication_consent: false,
  referral_source: '',
  referral_name: '',
}

export default function TalentPoolForm() {
  const [currentPage, setCurrentPage] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const supabase = createClient()

  const handleInputChange = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleNext = () => {
    // Validate required fields on current page
    let hasError = false
    
    if (currentPage === 1) {
      if (!formData.full_name || !formData.email || !formData.phone || 
          !formData.state_of_residence || !formData.city_lga || !formData.preferred_contact_method) {
        setSubmissionError('Please fill in all required fields on this page')
        hasError = true
      }
    } else if (currentPage === 2) {
      if (!formData.highest_education || !formData.field_of_study || 
          !formData.institution || !formData.graduation_year) {
        setSubmissionError('Please fill in all required fields on this page')
        hasError = true
      }
    } else if (currentPage === 3) {
      if (formData.certifications_list.length === 0) {
        setSubmissionError('Please select at least one certification or go back to change your answer')
        hasError = true
      }
    } else if (currentPage === 4) {
      if (!formData.employment_status) {
        setSubmissionError('Please select your employment status')
        hasError = true
      }
    } else if (currentPage === 5) {
      if (!formData.current_job_title || !formData.current_company || 
          !formData.current_industry || !formData.years_in_role) {
        setSubmissionError('Please fill in all required fields on this page')
        hasError = true
      }
    } else if (currentPage === 6) {
      if (formData.strongest_skills.length === 0 || !formData.skill_to_improve || formData.digital_literacy_rating === 0) {
        setSubmissionError('Please fill in all required fields on this page')
        hasError = true
      }
    } else if (currentPage === 7) {
      if (formData.preferred_roles.length === 0 || formData.work_arrangement.length === 0 || 
          formData.employment_type.length === 0 || !formData.preferred_location || !formData.willing_to_relocate) {
        setSubmissionError('Please fill in all required fields on this page')
        hasError = true
      }
    } else if (currentPage === 8) {
      if (!formData.availability || !formData.salary_expectation || !formData.willing_to_train) {
        setSubmissionError('Please fill in all required fields on this page')
        hasError = true
      }
    } else if (currentPage === 9) {
      if (!formData.about_yourself || !formData.strongest_qualities || !formData.difficult_situation ||
          !formData.task_prioritization || !formData.why_employer_should_consider || !formData.comfortable_with_kpis) {
        setSubmissionError('Please fill in all required fields on this page')
        hasError = true
      }
    } else if (currentPage === 10) {
      if (!formData.assessment_track || Object.keys(formData.assessment_answers).length === 0) {
        setSubmissionError('Please select an assessment track and answer all questions')
        hasError = true
      }
    } else if (currentPage === 15) {
      if (!formData.referral_source) {
        setSubmissionError('Please select how you heard about us')
        hasError = true
      }
    }

    if (hasError) return

    // Branching logic
    if (currentPage === 2) {
      // Page 2: Education → Page 3 (Certifications) or skip to Page 4
      if (formData.has_certifications) {
        setCurrentPage(3)
      } else {
        setCurrentPage(4)
      }
    } else if (currentPage === 4) {
      // Page 4: Work Experience → Page 5 or skip to Page 6
      if (formData.employment_status === 'Employed' || formData.employment_status === 'Self-employed') {
        setCurrentPage(5)
      } else {
        setCurrentPage(6)
      }
    } else {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleBack = () => {
    // Reverse branching logic
    if (currentPage === 3) {
      // Going back from Page 3 (Certifications) goes to Page 2
      setCurrentPage(2)
    } else if (currentPage === 5) {
      // Going back from Page 5 (Current Employment) goes to Page 4
      setCurrentPage(4)
    } else if (currentPage === 6) {
      // Going back from Page 6 (Skills) - could come from Page 4 or 5
      if (formData.employment_status === 'Employed' || formData.employment_status === 'Self-employed') {
        setCurrentPage(5)
      } else {
        setCurrentPage(4)
      }
    } else {
      setCurrentPage(Math.max(1, currentPage - 1))
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setSubmissionError(null)

      // Final validation before submit
      const missingFields = []
      if (!formData.full_name) missingFields.push('Full Name')
      if (!formData.email) missingFields.push('Email')
      if (!formData.phone) missingFields.push('Phone')
      if (!formData.state_of_residence) missingFields.push('State')
      if (!formData.city_lga) missingFields.push('City/LGA')
      if (!formData.preferred_contact_method) missingFields.push('Preferred Contact')
      if (!formData.highest_education) missingFields.push('Education Level')
      if (!formData.field_of_study) missingFields.push('Field of Study')
      if (!formData.institution) missingFields.push('Institution')
      if (!formData.graduation_year) missingFields.push('Graduation Year')
      if (!formData.employment_status) missingFields.push('Employment Status')
      if (!formData.about_yourself) missingFields.push('About Yourself')
      if (!formData.strongest_qualities) missingFields.push('Strongest Qualities')
      if (!formData.difficult_situation) missingFields.push('Difficult Situation')
      if (!formData.task_prioritization) missingFields.push('Task Prioritization')
      if (!formData.why_employer_should_consider) missingFields.push('Why Employer Should Consider')
      if (!formData.comfortable_with_kpis) missingFields.push('Comfortable with KPIs')
      if (formData.preferred_roles.length === 0) missingFields.push('Preferred Roles')
      if (formData.work_arrangement.length === 0) missingFields.push('Work Arrangement')
      if (formData.employment_type.length === 0) missingFields.push('Employment Type')
      if (!formData.preferred_location) missingFields.push('Preferred Location')
      if (!formData.willing_to_relocate) missingFields.push('Willing to Relocate')
      if (!formData.availability) missingFields.push('Availability')
      if (!formData.salary_expectation) missingFields.push('Salary Expectation')
      if (!formData.willing_to_train) missingFields.push('Willing to Train')
      if (!formData.referral_source) missingFields.push('Referral Source')

      if (missingFields.length > 0) {
        const errorMsg = `Missing required fields: ${missingFields.join(', ')}`
        console.error('[FormSubmit] Validation error:', errorMsg)
        setSubmissionError(errorMsg)
        setIsSubmitting(false)
        return
      }

      // Build the submission object
      const submission = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        state_of_residence: formData.state_of_residence,
        city_lga: formData.city_lga,
        preferred_contact_method: formData.preferred_contact_method,
        highest_education: formData.highest_education,
        field_of_study: formData.field_of_study,
        institution: formData.institution,
        graduation_year: formData.graduation_year,
        has_certifications: formData.has_certifications,
        employment_status: formData.employment_status,
        current_job_title: formData.current_job_title || null,
        current_company: formData.current_company || null,
        current_industry: formData.current_industry || null,
        years_in_role: formData.years_in_role || null,
        digital_literacy_rating: formData.digital_literacy_rating || null,
        preferred_roles: formData.preferred_roles,
        work_arrangement: formData.work_arrangement,
        employment_type: formData.employment_type,
        preferred_location: formData.preferred_location,
        willing_to_relocate: formData.willing_to_relocate,
        availability: formData.availability,
        salary_expectation: formData.salary_expectation,
        willing_to_train: formData.willing_to_train,
        assessment_track: formData.assessment_track,
        cv_url: formData.cv_url || null,
        certificate_urls: formData.certificate_urls && formData.certificate_urls.length > 0 ? formData.certificate_urls : [],
        referral_source: formData.referral_source,
        referral_name: formData.referral_name || null,
        detailed_responses: {
          certifications_list: formData.certifications_list || [],
          additional_certifications: formData.additional_certifications || '',
          strongest_skills: formData.strongest_skills || [],
          skill_to_improve: formData.skill_to_improve || '',
          current_responsibilities: formData.current_responsibilities || '',
          current_achievements: formData.current_achievements || '',
          about_yourself: formData.about_yourself || '',
          strongest_qualities: formData.strongest_qualities || '',
          difficult_situation: formData.difficult_situation || '',
          task_prioritization: formData.task_prioritization || '',
          why_employer_should_consider: formData.why_employer_should_consider || '',
          comfortable_with_kpis: formData.comfortable_with_kpis || '',
          assessment_answers: formData.assessment_answers || {},
          reference_name: formData.reference_name || null,
          reference_relationship: formData.reference_relationship || null,
          reference_contact: formData.reference_contact || null,
        },
      }

      // Remove top-level columns that don't exist in table schema
      // (they're already in detailed_responses above)
      delete (submission as any).current_responsibilities
      delete (submission as any).current_achievements

      console.log('[FormSubmit] Prepared submission object:', JSON.stringify(submission, null, 2))

      const { data, error } = await supabase
        .from('talent_pool_submissions')
        .insert([submission])

      console.log('[FormSubmit] Supabase response - data:', data)
      console.log('[FormSubmit] Supabase response - error:', error)

      if (error) {
        console.error('Submission error (raw):', error)
        console.error('Submission error (stringified):', JSON.stringify(error, null, 2))
        console.error('Submission error (type):', typeof error)
        console.error('Submission error (keys):', error ? Object.keys(error) : 'no keys')
        
        // Try multiple error extraction methods
        let errorMessage = 'An error occurred during submission'
        if (error instanceof Error) {
          errorMessage = error.message
        } else if (typeof error === 'object' && error !== null) {
          if ('message' in error) {
            errorMessage = String((error as any).message)
          } else if ('error' in error) {
            errorMessage = String((error as any).error)
          } else if ('error_description' in error) {
            errorMessage = String((error as any).error_description)
          } else {
            errorMessage = JSON.stringify(error)
          }
        } else if (typeof error === 'string') {
          errorMessage = error
        }
        
        console.error('Submission error (extracted message):', errorMessage)
        throw new Error(errorMessage)
      }

      console.log('[FormSubmit] Submission successful, data:', data)
      setSubmissionSuccess(true)
    } catch (err) {
      console.error('Submission error (catch block - raw):', err)
      console.error('Submission error (catch block - stringified):', JSON.stringify(err, null, 2))
      console.error('Submission error (catch block - type):', typeof err)
      console.error('Submission error (catch block - keys):', err ? Object.keys(err) : 'no keys')
      
      let errorMessage = 'An error occurred during submission'
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'object' && err !== null) {
        errorMessage = JSON.stringify(err)
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      
      setSubmissionError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submissionSuccess) {
    return <SuccessMessage />
  }

  const totalPages = 15
  const pageNum = currentPage

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-800">ASODS Talent Pool</h1>
            <span className="text-sm text-gray-600">Page {pageNum} of {totalPages}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(pageNum / totalPages) * 100}%` }}
            />
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {submissionError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {submissionError}
            </div>
          )}

          {/* Render current page */}
          {pageNum === 1 && <Page1PersonalInfo formData={formData} handleInputChange={handleInputChange} />}
          {pageNum === 2 && <Page2Education formData={formData} handleInputChange={handleInputChange} />}
          {pageNum === 3 && <Page3Certifications formData={formData} handleInputChange={handleInputChange} />}
          {pageNum === 4 && <Page4WorkExperience formData={formData} handleInputChange={handleInputChange} />}
          {pageNum === 5 && <Page5CurrentEmployment formData={formData} handleInputChange={handleInputChange} />}
          {pageNum === 6 && <Page6SkillsCompetencies formData={formData} handleInputChange={handleInputChange} />}
          {pageNum === 7 && <Page7JobPreferences formData={formData} handleInputChange={handleInputChange} />}
          {pageNum === 8 && <Page8AvailabilityCompensation formData={formData} handleInputChange={handleInputChange} />}
          {pageNum === 9 && <Page9CandidateScreening formData={formData} handleInputChange={handleInputChange} />}
          {pageNum === 10 && <Page10RoleSpecificAssessment formData={formData} handleInputChange={handleInputChange} />}
          {pageNum === 12 && <Page12CVDocuments formData={formData} handleInputChange={handleInputChange} />}
          {pageNum === 13 && <Page13References formData={formData} handleInputChange={handleInputChange} />}
          {pageNum === 14 && <Page14Declaration formData={formData} handleInputChange={handleInputChange} />}
          {pageNum === 15 && <Page15HowDidYouHear formData={formData} handleInputChange={handleInputChange} />}

          {/* Navigation buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleBack}
              disabled={pageNum === 1}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Back
            </button>
            {pageNum < 15 && (
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Next
              </button>
            )}
            {pageNum === 15 && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.declaration_agreed || !formData.talent_pool_consent || !formData.communication_consent}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
