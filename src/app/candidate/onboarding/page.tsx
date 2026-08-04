'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const MAX_CV_SIZE = 10 * 1024 * 1024 // 10MB

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [candidateId, setCandidateId] = useState<string | null>(null)

  // Form state
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [skills, setSkills] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvFileName, setCvFileName] = useState('')
  const [uploading, setUploading] = useState(false)

  // Load current user and candidate data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/candidate/login')
          return
        }

        setUserId(user.id)

        // Fetch profile and candidate data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()

        if (!profileError && profile?.full_name) {
          setFullName(profile.full_name)
        }

        const { data: candidate, error: candidateError } = await supabase
          .from('candidates')
          .select('id, bio, skills, cv_url')
          .eq('profile_id', user.id)
          .single()

        if (!candidateError && candidate) {
          setCandidateId(candidate.id)
          if (candidate.bio) setBio(candidate.bio)
          if (candidate.skills) setSkills(candidate.skills.join(', '))
          if (candidate.cv_url) setCvFileName('CV uploaded ✓')
        }
      } catch (err) {
        console.error('Failed to load user:', err)
        router.push('/candidate/login')
      }
    }

    loadUser()
  }, [supabase, router])

  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')

    // Check file type
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are accepted. Please upload a PDF resume.')
      setCvFile(null)
      return
    }

    // Check file size
    if (file.size > MAX_CV_SIZE) {
      setError(`File is too large. Maximum size is 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`)
      setCvFile(null)
      return
    }

    setCvFile(file)
    setCvFileName(file.name)
  }

  const uploadCv = async () => {
    if (!cvFile || !userId) return

    setUploading(true)
    setError('')

    try {
      const fileExt = 'pdf'
      const fileName = `${userId}-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(fileName, cvFile, { upsert: false })

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`)
        setUploading(false)
        return
      }

      // Get public URL
      const { data } = supabase.storage.from('cvs').getPublicUrl(fileName)

      if (!candidateId) {
        setError('Candidate ID not found')
        setUploading(false)
        return
      }

      // Update candidate record with CV URL
      const { error: updateError } = await supabase
        .from('candidates')
        .update({ cv_url: data.publicUrl })
        .eq('id', candidateId)

      if (updateError) {
        console.error('CV update error:', updateError)
        setError(`Failed to save CV: ${updateError.message}`)
        setUploading(false)
        return
      }

      setCvFileName(cvFile.name + ' ✓')
      setStep(4)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload CV')
      setUploading(false)
    }
  }

  const handleStep1 = async () => {
    if (!fullName) {
      setError('Full name is required')
      return
    }

    if (!userId) return

    setLoading(true)
    setError('')

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', userId)

      if (profileError) {
        console.error('Profile update error:', profileError)
        setError(`Failed to save name: ${profileError.message}`)
        setLoading(false)
        return
      }

      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleStep2 = async () => {
    if (!bio) {
      setError('Bio is required')
      return
    }

    if (!candidateId) return

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('candidates')
        .update({ bio })
        .eq('id', candidateId)

      if (error) {
        console.error('Candidate bio update error:', error)
        setError(`Failed to save bio: ${error.message}`)
        setLoading(false)
        return
      }

      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleStep3 = async () => {
    if (!skills) {
      setError('Please add at least one skill')
      return
    }

    if (!candidateId) return

    setLoading(true)
    setError('')

    try {
      // Parse comma-separated skills
      const skillList = skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      const { error } = await supabase
        .from('candidates')
        .update({ skills: skillList })
        .eq('id', candidateId)

      if (error) {
        console.error('Candidate skills update error:', error)
        setError(`Failed to save skills: ${error.message}`)
        setLoading(false)
        return
      }

      setStep(3.5)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const completeOnboarding = () => {
    router.push('/candidate/jobs')
  }

  return (
    <div className="min-h-screen bg-[#F1F2F6] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#0D1B2A] mb-4">Welcome to ASODS</h1>
          <p className="text-[#333333] mb-6">Complete your profile in just a few steps</p>

          {/* Progress bar */}
          <div className="flex justify-between items-center mb-8">
            {[1, 2, 3, 3.5, 4].map((s) => (
              <div key={s} className="flex-1">
                <div
                  className={`h-2 rounded-full ${
                    step >= s ? 'bg-[#D4AF37]' : 'bg-gray-300'
                  }`}
                ></div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600">Step {Math.ceil(step)} of 5</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-6">What&rsquo;s your full name?</h2>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] mb-6"
                placeholder="Enter your full name"
                disabled={loading}
              />
              <button
                onClick={handleStep1}
                disabled={loading || !fullName}
                className="w-full bg-[#0D1B2A] text-white py-2 rounded-lg font-medium hover:bg-[#0a1420] disabled:opacity-50 transition"
              >
                {loading ? 'Saving...' : 'Continue'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-6">Tell us about yourself</h2>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] mb-6"
                placeholder="A brief bio about your background, experience, and career goals (200 words or less)"
                rows={5}
                disabled={loading}
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleStep2}
                  disabled={loading || !bio}
                  className="flex-1 bg-[#0D1B2A] text-white py-2 rounded-lg font-medium hover:bg-[#0a1420] disabled:opacity-50 transition"
                >
                  {loading ? 'Saving...' : 'Continue'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-6">What are your key skills?</h2>
              <p className="text-gray-600 mb-4">Enter skills separated by commas (e.g. Python, Project Management, Communication)</p>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] mb-6"
                placeholder="e.g. JavaScript, React, Project Management, Communication"
                rows={3}
                disabled={loading}
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleStep3}
                  disabled={loading || !skills}
                  className="flex-1 bg-[#0D1B2A] text-white py-2 rounded-lg font-medium hover:bg-[#0a1420] disabled:opacity-50 transition"
                >
                  {loading ? 'Saving...' : 'Continue'}
                </button>
              </div>
            </div>
          )}

          {step === 3.5 && (
            <div>
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-6">Upload your CV (Resume)</h2>
              <p className="text-gray-600 mb-2">PDF only • Max 10MB</p>
              <p className="text-sm text-red-600 font-medium mb-6">Required to complete onboarding</p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-[#D4AF37] transition">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>

                <label className="cursor-pointer">
                  <p className="text-sm font-medium text-[#0D1B2A]">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PDF (PDF only)</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleCvFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {cvFileName && (
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-[#333333]">
                  Selected: {cvFileName}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={uploadCv}
                  disabled={!cvFile || uploading}
                  className="flex-1 bg-[#D4AF37] text-[#0D1B2A] py-2 rounded-lg font-medium hover:bg-[#c49d23] disabled:opacity-50 transition"
                >
                  {uploading ? 'Uploading...' : 'Upload CV'}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">You&rsquo;re all set!</h2>
              <p className="text-[#333333] mb-8">Your profile is complete. Now explore opportunities that match your skills.</p>

              <button
                onClick={completeOnboarding}
                className="w-full bg-[#0D1B2A] text-white py-2 rounded-lg font-medium hover:bg-[#0a1420] transition"
              >
                Browse Jobs
              </button>
            </div>
          )}
        </div>

        {/* Skip for logged-in users */}
        {step === 1 && (
          <div className="text-center">
            <button
              onClick={() => router.push('/candidate/jobs')}
              className="text-gray-600 hover:text-[#0D1B2A] text-sm underline"
            >
              Skip onboarding for now
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
