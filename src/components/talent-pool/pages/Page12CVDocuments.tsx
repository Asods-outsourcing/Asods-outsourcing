'use client'

import { useState } from 'react'
import { FormData } from '../TalentPoolForm'
import { createClient } from '@/lib/supabase/client'

interface Props {
  formData: FormData
  handleInputChange: (field: keyof FormData, value: any) => void
}

export default function Page12CVDocuments({ formData, handleInputChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const supabase = createClient()

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      setUploadError(null)

      const file = e.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.type.includes('pdf') && !file.name.endsWith('.pdf')) {
        throw new Error('Only PDF files are allowed for CV')
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('CV file must be smaller than 10MB')
      }

      // Upload to storage
      const fileName = `cv-${Date.now()}-${Math.random().toString(36).substring(7)}.pdf`
      const { data, error } = await supabase.storage
        .from('talent-pool-files')
        .upload(fileName, file)

      if (error) throw error

      // Get public URL
      const { data: publicData } = supabase.storage
        .from('talent-pool-files')
        .getPublicUrl(fileName)

      handleInputChange('cv_url', publicData.publicUrl)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      setUploadError(message)
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleCertificateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      setUploadError(null)

      const file = e.target.files?.[0]
      if (!file) return

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Certificate file must be smaller than 10MB')
      }

      // Upload to storage
      const fileName = `cert-${Date.now()}-${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`
      const { data, error } = await supabase.storage
        .from('talent-pool-files')
        .upload(fileName, file)

      if (error) throw error

      // Get public URL
      const { data: publicData } = supabase.storage
        .from('talent-pool-files')
        .getPublicUrl(fileName)

      const urls = formData.certificate_urls || []
      urls.push(publicData.publicUrl)
      handleInputChange('certificate_urls', urls)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      setUploadError(message)
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">CV & Supporting Documents</h2>
      <p className="text-gray-600 mb-6">
        Upload your CV and any supporting documents (certificates, portfolio, etc.).
      </p>

      <div className="space-y-6">
        {uploadError && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {uploadError}
          </div>
        )}

        {/* CV Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload CV *
            <span className="text-xs text-gray-500 block mt-1">PDF preferred, maximum 10 MB</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
            <input
              type="file"
              onChange={handleCVUpload}
              disabled={uploading}
              className="hidden"
              id="cv-upload"
              accept=".pdf,application/pdf"
              required
            />
            <label htmlFor="cv-upload" className="cursor-pointer block">
              {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
              {formData.cv_url && (
                <div className="text-green-600 font-semibold mt-2">✓ CV uploaded</div>
              )}
            </label>
          </div>
        </div>

        {/* Certificates Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload relevant certificates/portfolio
            <span className="text-xs text-gray-500 block mt-1">Optional - maximum 10 MB per file</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
            <input
              type="file"
              onChange={handleCertificateUpload}
              disabled={uploading}
              className="hidden"
              id="cert-upload"
              multiple
            />
            <label htmlFor="cert-upload" className="cursor-pointer block">
              {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
              {formData.certificate_urls && formData.certificate_urls.length > 0 && (
                <div className="text-green-600 font-semibold mt-2">
                  ✓ {formData.certificate_urls.length} file(s) uploaded
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Uploaded Files List */}
        {(formData.cv_url || (formData.certificate_urls && formData.certificate_urls.length > 0)) && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Uploaded Files</h3>
            <ul className="space-y-2">
              {formData.cv_url && (
                <li className="text-sm text-gray-700">
                  📄 CV: <a href={formData.cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a>
                </li>
              )}
              {formData.certificate_urls && formData.certificate_urls.map((url, idx) => (
                <li key={idx} className="text-sm text-gray-700">
                  📎 Certificate {idx + 1}: <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
