'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface FeedItem {
  type: 'request' | 'candidate'
  id: string
  title: string
  subtitle: string
  actionText: string
  actionHref: string
  timestamp?: string
}

export default function AdminHomePage() {
  const router = useRouter()
  const supabase = createClient()

  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadFeed = async () => {
      try {
        // Fetch new staffing requests
        const { data: newRequests, error: reqError } = await supabase
          .from('staffing_requests')
          .select(`
            id,
            roles_needed,
            quantity,
            timeline,
            created_at,
            employer_id
          `)
          .eq('status', 'new')
          .order('created_at', { ascending: false })
          .limit(5)

        if (reqError) {
          console.error('[Admin Home] Requests fetch error:', reqError)
        }

        // Get employer names
        let employerMap: Record<string, string> = {}
        if (newRequests && newRequests.length > 0) {
          const empIds = Array.from(new Set(newRequests.map((r: any) => r.employer_id)))
          const { data: employers } = await supabase
            .from('employers')
            .select('id, company_name')
            .in('id', empIds)

          if (employers) {
            employerMap = Object.fromEntries(employers.map((e: any) => [e.id, e.company_name]))
          }
        }

        // Fetch candidates awaiting review (applications in 'applied' stage)
        const { data: applicants, error: appError } = await supabase
          .from('applications')
          .select(`
            id,
            created_at,
            candidate_id,
            job_id
          `)
          .eq('stage', 'applied')
          .order('created_at', { ascending: false })
          .limit(5)

        if (appError) {
          console.error('[Admin Home] Applications fetch error:', appError)
        }

        // Get candidate bios and job titles
        let candidateMap: Record<string, any> = {}
        let jobMap: Record<string, any> = {}

        if (applicants && applicants.length > 0) {
          const candIds = Array.from(new Set(applicants.map((a: any) => a.candidate_id)))
          const jobIds = Array.from(new Set(applicants.map((a: any) => a.job_id)))

          const { data: candidates } = await supabase
            .from('candidates')
            .select('id, profile_id, bio')
            .in('id', candIds)

          const { data: jobs } = await supabase
            .from('jobs')
            .select('id, title')
            .in('id', jobIds)

          if (candidates) {
            candidateMap = Object.fromEntries(candidates.map((c: any) => [c.id, c]))
          }
          if (jobs) {
            jobMap = Object.fromEntries(jobs.map((j: any) => [j.id, j]))
          }
        }

        // Build feed items
        const items: FeedItem[] = []

        if (newRequests) {
          newRequests.forEach((req: any) => {
            items.push({
              type: 'request',
              id: req.id,
              title: `${employerMap[req.employer_id] || 'Client'} needs ${req.quantity} ${req.roles_needed}`,
              subtitle: `By ${req.timeline || 'TBD'}`,
              actionText: 'Review',
              actionHref: `/admin/requests/${req.id}`,
            })
          })
        }

        if (applicants) {
          applicants.forEach((app: any) => {
            const candidate = candidateMap[app.candidate_id]
            const job = jobMap[app.job_id]
            items.push({
              type: 'candidate',
              id: app.id,
              title: `New application for ${job?.title || 'a job'}`,
              subtitle: candidate?.bio ? candidate.bio.substring(0, 80) + '...' : 'New applicant',
              actionText: 'Review',
              actionHref: `/admin/candidates?applicationId=${app.id}`,
            })
          })
        }

        setFeedItems(items.slice(0, 10)) // Show up to 10 items
        setLoading(false)
      } catch (err) {
        console.error('[Admin Home] Error:', err)
        console.error('[Admin Home] Error stringified:', JSON.stringify(err, null, 2))
        setError('Failed to load feed')
        setLoading(false)
      }
    }

    loadFeed()
  }, [supabase])

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#0D1B2A] mb-2">What needs your attention today</h1>
      <p className="text-gray-600 mb-8">New staffing requests and applications awaiting action</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading feed...</p>
        </div>
      ) : feedItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 mb-4">All caught up! No pending requests or applications right now.</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/admin/requests"
              className="px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded font-medium hover:bg-[#c49d23] transition"
            >
              Browse all requests
            </Link>
            <Link
              href="/admin/candidates"
              className="px-4 py-2 border border-gray-300 text-[#0D1B2A] rounded font-medium hover:bg-gray-50 transition"
            >
              View candidates
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {feedItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-lg font-medium text-[#0D1B2A]">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.subtitle}</p>
                </div>
                <Link
                  href={item.actionHref}
                  className="px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded font-medium hover:bg-[#c49d23] transition whitespace-nowrap"
                >
                  {item.actionText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
