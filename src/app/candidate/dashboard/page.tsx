'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface ApplicationCount {
  applied: number
  screening: number
  interview: number
  offer: number
  placed: number
  rejected: number
}

export default function CandidateDashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<{ full_name: string } | null>(null)
  const [counts, setCounts] = useState<ApplicationCount>({
    applied: 0,
    screening: 0,
    interview: 0,
    offer: 0,
    placed: 0,
    rejected: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()

        if (!profileError && profileData) {
          setProfile(profileData)
        }

        // Fetch candidate ID
        const { data: candidate, error: candidateError } = await supabase
          .from('candidates')
          .select('id')
          .eq('profile_id', user.id)
          .single()

        if (candidateError || !candidate) {
          setError('Failed to load candidate profile')
          setLoading(false)
          return
        }

        // Fetch application counts by stage
        const { data: applications, error: applicationsError } = await supabase
          .from('applications')
          .select('stage')
          .eq('candidate_id', candidate.id)

        if (!applicationsError && applications) {
          const stageCounts: ApplicationCount = {
            applied: 0,
            screening: 0,
            interview: 0,
            offer: 0,
            placed: 0,
            rejected: 0,
          }

          applications.forEach((app) => {
            if (app.stage in stageCounts) {
              stageCounts[app.stage as keyof ApplicationCount]++
            }
          })

          setCounts(stageCounts)
        }

        setLoading(false)
      } catch (err) {
        console.error('Error loading dashboard:', err)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    loadData()
  }, [supabase, router])

  const totalApplications =
    counts.applied +
    counts.screening +
    counts.interview +
    counts.offer +
    counts.placed +
    counts.rejected

  return (
    <div className="min-h-screen bg-[#F1F2F6]">
      {/* Header */}
      <header className="bg-[#0D1B2A] text-white py-4 px-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">ASODS</h1>
            <p className="text-sm text-gray-300">Dashboard</p>
          </div>
          <nav className="flex gap-6">
            <Link href="/candidate/jobs" className="hover:text-[#D4AF37] transition">
              Browse Jobs
            </Link>
            <Link href="/candidate/applications" className="hover:text-[#D4AF37] transition">
              Applications
            </Link>
            <Link href="/candidate/profile" className="hover:text-[#D4AF37] transition">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-12 px-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#333333]">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Welcome */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#0D1B2A] mb-2">
                Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!
              </h2>
              <p className="text-[#333333]">Track your applications and career progress</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Application Overview */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h3 className="text-2xl font-bold text-[#0D1B2A] mb-6">Application Overview</h3>

              {totalApplications === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#333333] mb-4">You haven&rsquo;t applied to any jobs yet</p>
                  <Link
                    href="/candidate/jobs"
                    className="inline-block bg-[#D4AF37] text-[#0D1B2A] px-6 py-2 rounded-lg font-medium hover:bg-[#c49d23] transition"
                  >
                    Browse Open Jobs
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Applied */}
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <p className="text-gray-600 text-sm font-medium mb-2">Applied</p>
                    <p className="text-4xl font-bold text-[#0D1B2A]">{counts.applied}</p>
                  </div>

                  {/* Screening */}
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <p className="text-gray-600 text-sm font-medium mb-2">Under Review</p>
                    <p className="text-4xl font-bold text-blue-600">{counts.screening}</p>
                  </div>

                  {/* Interview */}
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <p className="text-gray-600 text-sm font-medium mb-2">Interviews</p>
                    <p className="text-4xl font-bold text-purple-600">{counts.interview}</p>
                  </div>

                  {/* Offer */}
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <p className="text-gray-600 text-sm font-medium mb-2">Offers</p>
                    <p className="text-4xl font-bold text-green-600">{counts.offer}</p>
                  </div>

                  {/* Placed */}
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <p className="text-gray-600 text-sm font-medium mb-2">Placed</p>
                    <p className="text-4xl font-bold text-[#D4AF37]">{counts.placed}</p>
                  </div>

                  {/* Rejected */}
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <p className="text-gray-600 text-sm font-medium mb-2">Not Selected</p>
                    <p className="text-4xl font-bold text-red-600">{counts.rejected}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/candidate/jobs"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center"
              >
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h4 className="font-bold text-[#0D1B2A] mb-2">Browse Jobs</h4>
                <p className="text-sm text-gray-600">Explore open opportunities</p>
              </Link>

              <Link
                href="/candidate/applications"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center"
              >
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]"
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
                <h4 className="font-bold text-[#0D1B2A] mb-2">View Applications</h4>
                <p className="text-sm text-gray-600">Check status of all applications</p>
              </Link>

              <Link
                href="/candidate/profile"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center"
              >
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h4 className="font-bold text-[#0D1B2A] mb-2">Update Profile</h4>
                <p className="text-sm text-gray-600">Keep your profile current</p>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
