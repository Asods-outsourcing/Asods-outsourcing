'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Page1PersonalInfo from './pages/Page1PersonalInfo'
import Page2EducationExperience from './pages/Page2EducationExperience'
import Page3SkillsPreferences from './pages/Page3SkillsPreferences'
import Page4AvailabilityScreening from './pages/Page4AvailabilityScreening'
import Page5CVConsent from './pages/Page5CVConsent'
import SuccessMessage from './SuccessMessage'

export interface FormData {
  // Page 1: Personal Information
  full_name: string
  email: string
  phone: string
  state_of_residence: string
  city_lga: string
  preferred_contact_method: string

  // Page 2: Education & Experience
  highest_education: string
  field_of_study: string
  employment_status: string
  years_of_experience: string
  current_job_title: string
  work_experience_description: string

  // Page 3: Skills & Job Preferences
  roles_of_interest: string[]
  strongest_skills: string[]
  preferred_work_arrangement: string
  preferred_employment_type: string

  // Page 4: Availability & Screening
  availability: string
  salary_expectation: string
  about_yourself: string
  strongest_qualities: string
  willing_to_train: string

  // Page 5: CV, Consent & Submission
  cv_url: string
  certificate_urls: string[]
  referral_source: string
  declaration_agreed: boolean
  talent_pool_consent: boolean
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
  employment_status: '',
  years_of_experience: '',
  current_job_title: '',
  work_experience_description: '',
  roles_of_interest: [],
  strongest_skills: [],
  preferred_work_arrangement: '',
  preferred_employment_type: '',
  availability: '',
  salary_expectation: '',
  about_yourself: '',
  strongest_qualities: '',
  willing_to_train: '',
  cv_url: '',
  certificate_urls: [],
  referral_source: '',
  declaration_agreed: false,
  talent_pool_consent: false,
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
          !formData.employment_status || !formData.years_of_experience || !formData.work_experience_description) {
        setSubmissionError('Please fill in all required fields on this page')
        hasError = true
      }
    } else if (currentPage === 3) {
      if (formData.roles_of_interest.length === 0 || formData.strongest_skills.length === 0 ||
          !formData.preferred_work_arrangement || !formData.preferred_employment_type) {
        setSubmissionError('Please fill in all required fields on this page')
        hasError = true
      }
    } else if (currentPage === 4) {
      if (!formData.availability || !formData.salary_expectation || !formData.about_yourself || 
          !formData.strongest_qualities || !formData.willing_to_train) {
        setSubmissionError('Please fill in all required fields on this page')
        hasError = true
      }
    } else if (currentPage === 5) {
      if (!formData.cv_url || formData.certificate_urls.length === 0 || !formData.referral_source) {
        setSubmissionError('Please fill in all required fields on this page')
        hasError = true
      }
    }

    if (hasError) return

    // No branching logic - linear progression through 5 pages
    if (currentPage < 5) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleBack = () => {
    setCurrentPage(Math.max(1, currentPage - 1))
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setSubmissionError(null)

      console.log('[FormSubmit] Full formData state:', JSON.stringify(formData, null, 2))

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
      if (!formData.employment_status) missingFields.push('Employment Status')
      if (!formData.years_of_experience) missingFields.push('Years of Experience')
      if (!formData.work_experience_description) missingFields.push('Work Experience')
      if (formData.roles_of_interest.length === 0) missingFields.push('Roles of Interest')
      if (formData.strongest_skills.length === 0) missingFields.push('Strongest Skills')
      if (!formData.preferred_work_arrangement) missingFields.push('Preferred Work Arrangement')
      if (!formData.preferred_employment_type) missingFields.push('Preferred Employment Type')
      if (!formData.availability) missingFields.push('Availability')
      if (!formData.salary_expectation) missingFields.push('Salary Expectation')
      if (!formData.about_yourself) missingFields.push('About Yourself')
      if (!formData.strongest_qualities) missingFields.push('Strongest Qualities')
      if (!formData.willing_to_train) missingFields.push('Willing to Train')
      if (!formData.cv_url) missingFields.push('CV')
      if (formData.certificate_urls.length === 0) missingFields.push('Certificates/Portfolio')
      if (!formData.referral_source) missingFields.push('Referral Source')
      if (!formData.declaration_agreed) missingFields.push('Declaration Agreement')
      if (!formData.talent_pool_consent) missingFields.push('Talent Pool Consent')

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
        employment_status: formData.employment_status,
        years_of_experience: formData.years_of_experience,
        work_experience_description: formData.work_experience_description || '',
        current_job_title: formData.current_job_title || null,
        roles_of_interest: formData.roles_of_interest,
        strongest_skills: formData.strongest_skills,
        preferred_work_arrangement: formData.preferred_work_arrangement,
        preferred_employment_type: formData.preferred_employment_type,
        availability: formData.availability,
        salary_expectation: formData.salary_expectation,
        about_yourself: formData.about_yourself || '',
        strongest_qualities: formData.strongest_qualities || '',
        willing_to_train: formData.willing_to_train,
        cv_url: formData.cv_url,
        certificate_urls: formData.certificate_urls && formData.certificate_urls.length > 0 ? formData.certificate_urls : [],
        referral_source: formData.referral_source,
        detailed_responses: {
          about_yourself: formData.about_yourself || '',
          strongest_qualities: formData.strongest_qualities || '',
        },
      }

      console.log('[FormSubmit] Prepared submission object:', JSON.stringify(submission, null, 2))

      // Insert without selecting - matches the 5-page schema
      const { error } = await supabase
        .from('talent_pool_submissions')
        .insert([submission])

      console.log('[FormSubmit] Supabase insert error:', error)

      if (error) {
        console.error('Submission error (raw):', error)
        console.error('Submission error (stringified):', JSON.stringify(error, null, 2))
        
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

      console.log('[FormSubmit] Submission successful')
      setSubmissionSuccess(true)
    } catch (err) {
      console.error('Submission error (catch block - raw):', err)
      console.error('Submission error (catch block - stringified):', JSON.stringify(err, null, 2))
      
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

  const totalPages = 5
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
          {pageNum === 2 && <Page2EducationExperience formData={formData} handleInputChange={handleInputChange} />}
          {pageNum === 3 && <Page3SkillsPreferences formData={formData} handleInputChange={handleInputChange} />}
          {pageNum === 4 && <Page4AvailabilityScreening formData={formData} handleInputChange={handleInputChange} />}
          {pageNum === 5 && <Page5CVConsent formData={formData} handleInputChange={handleInputChange} />}

          {/* Navigation buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleBack}
              disabled={pageNum === 1}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Back
            </button>
            {pageNum < 5 && (
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Next
              </button>
            )}
            {pageNum === 5 && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.declaration_agreed || !formData.talent_pool_consent}
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
