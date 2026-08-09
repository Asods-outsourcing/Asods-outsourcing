'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const MAX_CV_SIZE = 10 * 1024 * 1024 // 10MB

export default function DocumentsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [candidateId, setCandidateId] = useState<string | null>(null)
  const [cvUrl, setCvUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/candidate/login')
          return
        }

        // Fetch candidate data
        const { data: candidate, error: candidateError } = await supabase
          .from('candidates')
          .select('id, cv_url')
          .eq('profile_id', user.id)
          .maybeSingle()

        if (candidateError) {
          setError('Failed to load candidate data')
          setLoading(false)
          return
        }

        if (!candidate) {
          setError('Candidate profile not found')
          setLoading(false)
          return
        }

        setCandidateId(candidate.id)
        setCvUrl(candidate.cv_url)
        setLoading(false)
      } catch (err) {
        console.error('Error loading documents:', err)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    loadData()
  }, [supabase, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')

    // Check file type
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are accepted. Please upload a PDF resume.')
      setCvFile(null)
      setFileName('')
      return
    }

    // Check file size
    if (file.size > MAX_CV_SIZE) {
      setError(`File is too large. Maximum size is 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`)
      setCvFile(null)
      setFileName('')
      return
    }

    setCvFile(file)
    setFileName(file.name)
  }

  const handleUpload = async () => {
    if (!cvFile || !candidateId) {
      setError('Please select a file')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      // Get current user for unique filename
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('User not found')
        setUploading(false)
        return
      }

      // Upload file with unique name
      const fileExt = 'pdf'
      const fileName = `${user.id}-${Date.now()}.${fileExt}`

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

      // Update candidate record
      const { error: updateError } = await supabase
        .from('candidates')
        .update({ cv_url: data.publicUrl })
        .eq('id', candidateId)

      if (updateError) {
        setError(`Failed to save CV: ${updateError.message}`)
        setUploading(false)
        return
      }

      setCvUrl(data.publicUrl)
      setCvFile(null)
      setFileName('')
      setSuccess('CV uploaded successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload CV')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="max-w-4xl mx-auto py-8 px-4 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#0D1B2A] mb-8">Your Documents</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-[#333333]">Loading documents...</p>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {/* Current CV */}
          {cvUrl && (
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-bold text-[#0D1B2A] mb-4">Current CV</h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start sm:items-center gap-3">
                  <svg className="w-8 h-8 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-[#0D1B2A] text-sm sm:text-base">Resume (PDF)</p>
                    <p className="text-xs text-gray-600">Uploaded to your profile</p>
                  </div>
                </div>
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-blue-600 font-medium hover:text-blue-700 text-sm"
                >
                  View
                </a>
              </div>
            </div>
          )}

          {/* Upload New CV */}
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#0D1B2A] mb-4">
              {cvUrl ? 'Replace CV' : 'Upload CV'}
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-[#D4AF37] transition">
              <svg className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>

              <label className="cursor-pointer">
                <p className="text-xs sm:text-sm font-medium text-[#0D1B2A]">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PDF only, max 10MB</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {fileName && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs sm:text-sm">
                Selected: <span className="font-medium">{fileName}</span>
              </div>
            )}

            {cvFile && (
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setCvFile(null)
                    setFileName('')
                  }}
                  className="w-full sm:flex-1 px-4 py-2 border border-gray-300 text-[#0D1B2A] rounded-lg font-medium hover:bg-gray-50 transition text-sm"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full sm:flex-1 px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded-lg font-medium hover:bg-[#c49d23] disabled:opacity-50 transition text-sm"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            )}
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-[#0D1B2A] mb-3">CV Upload Guidelines</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#333333]">
              <li>• Format: PDF only</li>
              <li>• Maximum size: 10MB</li>
              <li>• Keep it concise: 1-2 pages recommended</li>
              <li>• Include: contact info, summary, experience, skills, education</li>
              <li>• Recruiters will review this with your job applications</li>
            </ul>
          </div>
        </div>
      )}
    </main>
  )
}
