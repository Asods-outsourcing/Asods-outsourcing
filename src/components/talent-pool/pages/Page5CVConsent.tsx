'use client'

import { useState, useRef } from 'react'
import { FormData } from '../TalentPoolForm'
import { createClient } from '@/lib/supabase/client'

interface Props {
  formData: FormData
  handleInputChange: (field: keyof FormData, value: any) => void
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export default function Page5CVConsent({ formData, handleInputChange }: Props) {
  const supabase = createClient()
  const cvInputRef = useRef<HTMLInputElement>(null)
  const certInputRef = useRef<HTMLInputElement>(null)

  const [cvUploading, setCvUploading] = useState(false)
  const [certsUploading, setCertsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [cvFileName, setCvFileName] = useState<string | null>(null)
  const [certFileNames, setCertFileNames] = useState<string[]>([])

  const handleCvDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file) uploadCvFile(file)
  }

  const handleCvSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadCvFile(file)
  }

  const uploadCvFile = async (file: File) => {
    setUploadError(null)

    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are accepted for CV.')
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File is too large. Maximum size is 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`)
      return
    }

    setCvUploading(true)

    try {
      const fileName = `cv-${Date.now()}.pdf`

      const { error: uploadError } = await supabase.storage
        .from('talent-pool-files')
        .upload(fileName, file, { upsert: false })

      if (uploadError) {
        console.error('CV upload error:', uploadError)
        setUploadError(`Upload failed: ${uploadError.message}`)
        setCvUploading(false)
        return
      }

      // Get public URL
      const { data } = supabase.storage
        .from('talent-pool-files')
        .getPublicUrl(fileName)

      handleInputChange('cv_url', data.publicUrl)
      setCvFileName(file.name)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload CV')
    } finally {
      setCvUploading(false)
    }
  }

  const handleCertsDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) uploadCertFiles(files)
  }

  const handleCertsSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) uploadCertFiles(files)
  }

  const uploadCertFiles = async (files: File[]) => {
    setUploadError(null)

    const validFiles = files.filter(file => {
      if (file.type !== 'application/pdf') {
        setUploadError(`Skipping ${file.name}: only PDF files are accepted.`)
        return false
      }
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`Skipping ${file.name}: file is too large (max 10MB).`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setCertsUploading(true)

    try {
      const uploadedUrls: string[] = [...(formData.certificate_urls || [])]
      const uploadedNames: string[] = [...certFileNames]

      for (const file of validFiles) {
        const fileName = `cert-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.pdf`

        const { error: uploadError } = await supabase.storage
          .from('talent-pool-files')
          .upload(fileName, file, { upsert: false })

        if (uploadError) {
          console.error(`Certificate upload error for ${file.name}:`, uploadError)
          continue
        }

        const { data } = supabase.storage
          .from('talent-pool-files')
          .getPublicUrl(fileName)

        uploadedUrls.push(data.publicUrl)
        uploadedNames.push(file.name)
      }

      handleInputChange('certificate_urls', uploadedUrls)
      setCertFileNames(uploadedNames)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload certificates')
    } finally {
      setCertsUploading(false)
    }
  }

  const removeCertificate = (index: number) => {
    const newUrls = formData.certificate_urls.filter((_, i) => i !== index)
    const newNames = certFileNames.filter((_, i) => i !== index)
    handleInputChange('certificate_urls', newUrls)
    setCertFileNames(newNames)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">CV, Consent & Submission</h2>
      <p className="text-gray-600 mb-6">
        Complete your registration by uploading your CV and confirming your consent.
      </p>

      <div className="space-y-6">
        {/* Upload Your CV */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Your CV *</label>
          <p className="text-xs text-gray-600 mb-3">PDF preferred, max 10MB</p>

          <div
            onDrop={handleCvDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer"
          >
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>

            <label className="cursor-pointer">
              <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PDF only</p>
              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf"
                onChange={handleCvSelect}
                className="hidden"
                disabled={cvUploading}
              />
            </label>
          </div>

          {cvFileName && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
              ✓ Selected: {cvFileName}
            </div>
          )}

          {cvUploading && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
              Uploading CV...
            </div>
          )}
        </div>

        {/* Upload Certificates */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Relevant Certificates/Portfolio *</label>
          <p className="text-xs text-gray-600 mb-3">PDF only, max 10MB per file</p>

          <div
            onDrop={handleCertsDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer"
          >
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>

            <label className="cursor-pointer">
              <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PDF only, multiple files allowed</p>
              <input
                ref={certInputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={handleCertsSelect}
                className="hidden"
                disabled={certsUploading}
              />
            </label>
          </div>

          {certFileNames.length > 0 && (
            <div className="mt-3 space-y-2">
              {certFileNames.map((name, idx) => (
                <div key={idx} className="p-3 bg-green-50 border border-green-200 rounded flex items-center justify-between text-sm">
                  <span className="text-green-700">✓ {name}</span>
                  <button
                    onClick={() => removeCertificate(idx)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {certsUploading && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
              Uploading certificates...
            </div>
          )}
        </div>

        {uploadError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {uploadError}
          </div>
        )}

        {/* How did you hear about ASODS */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">How did you hear about ASODS? *</label>
          <select
            value={formData.referral_source}
            onChange={(e) => handleInputChange('referral_source', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">-- Select a source --</option>
            <option value="ASODS Website">ASODS Website</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Instagram">Instagram</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Facebook">Facebook</option>
            <option value="X">X</option>
            <option value="TikTok">TikTok</option>
            <option value="Referral">Referral</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Candidate Declaration */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={formData.declaration_agreed}
              onChange={(e) => handleInputChange('declaration_agreed', e.target.checked)}
              className="mt-1 mr-3 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
            <span className="text-sm text-gray-700">
              I confirm that the information provided is accurate and complete to the best of my knowledge. *
            </span>
          </label>
        </div>

        {/* Talent Pool Consent */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={formData.talent_pool_consent}
              onChange={(e) => handleInputChange('talent_pool_consent', e.target.checked)}
              className="mt-1 mr-3 w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              required
            />
            <span className="text-sm text-gray-700">
              I consent to ASODS retaining my information for consideration for current and future employment, outsourcing, contract, training and recruitment opportunities that may match my profile. *
            </span>
          </label>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Both checkboxes must be checked to complete your registration.
        </p>
      </div>
    </div>
  )
}
