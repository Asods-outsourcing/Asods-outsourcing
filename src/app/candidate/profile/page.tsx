'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface CandidateProfile {
  full_name: string
  email: string
  bio: string
  skills: string[]
}

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<CandidateProfile | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [skills, setSkills] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/candidate/login')
          return
        }

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single()

        if (profileError) {
          setError('Failed to load profile')
          setLoading(false)
          return
        }

        // Fetch candidate details
        const { data: candidate, error: candidateError } = await supabase
          .from('candidates')
          .select('bio, skills')
          .eq('profile_id', user.id)
          .single()

        if (candidateError) {
          setError('Failed to load candidate details')
          setLoading(false)
          return
        }

        const combined: CandidateProfile = {
          full_name: profileData.full_name || '',
          email: profileData.email || '',
          bio: candidate.bio || '',
          skills: candidate.skills || [],
        }

        setProfile(combined)
        setFullName(combined.full_name)
        setBio(combined.bio)
        setSkills(combined.skills.join(', '))
        setLoading(false)
      } catch (err) {
        console.error('Error loading profile:', err)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    loadProfile()
  }, [supabase, router])

  const handleSave = async () => {
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('User not found')
        setSaving(false)
        return
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)

      if (profileError) {
        setError('Failed to save profile')
        setSaving(false)
        return
      }

      // Update candidate
      const skillList = skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      const { error: candidateError } = await supabase
        .from('candidates')
        .update({ bio, skills: skillList })
        .eq('profile_id', user.id)

      if (candidateError) {
        setError('Failed to save candidate details')
        setSaving(false)
        return
      }

      setProfile({
        full_name: fullName,
        email: profile?.email || '',
        bio,
        skills: skillList,
      })

      setEditing(false)
      setSuccess('Profile updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F1F2F6]">
      {/* Header */}
      <header className="bg-[#0D1B2A] text-white py-4 px-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">ASODS</h1>
            <p className="text-sm text-gray-300">Profile</p>
          </div>
          <nav className="flex gap-6">
            <Link href="/candidate/dashboard" className="hover:text-[#D4AF37] transition">
              Dashboard
            </Link>
            <Link href="/candidate/jobs" className="hover:text-[#D4AF37] transition">
              Browse Jobs
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-12 px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-[#0D1B2A]">Your Profile</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded-lg font-medium hover:bg-[#c49d23] transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#333333]">Loading profile...</p>
          </div>
        ) : profile ? (
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  disabled={saving}
                />
              ) : (
                <p className="text-[#0D1B2A] font-medium">{profile.full_name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Email Address</label>
              <p className="text-[#0D1B2A] font-medium">{profile.email}</p>
              <p className="text-xs text-gray-500 mt-1">Contact your recruiter to change your email</p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Professional Bio</label>
              {editing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  rows={4}
                  disabled={saving}
                />
              ) : (
                <p className="text-[#0D1B2A]">{bio || 'No bio provided'}</p>
              )}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Skills</label>
              {editing ? (
                <textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  rows={2}
                  placeholder="Separate skills with commas"
                  disabled={saving}
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.length > 0 ? (
                    profile.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600">No skills added</p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            {editing && (
              <div className="flex gap-4 pt-6 border-t">
                <button
                  onClick={() => {
                    setEditing(false)
                    setFullName(profile.full_name)
                    setBio(profile.bio)
                    setSkills(profile.skills.join(', '))
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-[#0D1B2A] rounded-lg font-medium hover:bg-gray-50 transition"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-[#0D1B2A] text-white rounded-lg font-medium hover:bg-[#0a1420] disabled:opacity-50 transition"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        ) : null}

        {/* Links to other sections */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Link
            href="/candidate/documents"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <svg
              className="w-12 h-12 mb-4 text-[#D4AF37]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-bold text-[#0D1B2A] mb-1">Documents</h3>
            <p className="text-sm text-gray-600">Upload or replace your CV</p>
          </Link>

          <Link
            href="/candidate/settings"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <svg
              className="w-12 h-12 mb-4 text-[#D4AF37]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-lg font-bold text-[#0D1B2A] mb-1">Settings</h3>
            <p className="text-sm text-gray-600">Manage account settings</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
