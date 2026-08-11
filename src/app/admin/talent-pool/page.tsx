'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Submission {
  id: string
  full_name: string
  email: string
  phone: string
  state_of_residence: string
  preferred_roles: string[]
  tier: string
  status: string
  created_at: string
  employment_status: string
}

type SortBy = 'created_at' | 'full_name' | 'status' | 'tier'
type TierFilter = 'all' | 'unrated' | 'A' | 'B' | 'C' | 'inactive'
type StatusFilter = 'all' | 'new' | 'reviewing' | 'contacted' | 'placed' | 'inactive'

export default function TalentPoolListPage() {
  const router = useRouter()
  const supabase = createClient()

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState<TierFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortBy, setSortBy] = useState<SortBy>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        let query = supabase
          .from('talent_pool_submissions')
          .select('id, full_name, email, phone, state_of_residence, preferred_roles, tier, status, created_at, employment_status')

        // Apply filters
        if (tierFilter !== 'all') {
          query = query.eq('tier', tierFilter)
        }
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter)
        }

        // Apply sorting
        query = query.order(sortBy, { ascending: sortOrder === 'asc' })

        const { data, error } = await query

        if (error) throw error

        // Apply search filter on client side
        let filtered = data || []
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          filtered = filtered.filter(s =>
            s.full_name.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.phone.includes(q)
          )
        }

        setSubmissions(filtered)
      } catch (err) {
        console.error('Error fetching submissions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [supabase, tierFilter, statusFilter, sortBy, sortOrder])

  // Filter by search on client
  const displaySubmissions = submissions.filter(s =>
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone.includes(searchQuery)
  )

  const toggleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'new': 'bg-blue-100 text-blue-800',
      'reviewing': 'bg-yellow-100 text-yellow-800',
      'contacted': 'bg-purple-100 text-purple-800',
      'placed': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getTierBadge = (tier: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-green-100 text-green-800 font-bold',
      'B': 'bg-blue-100 text-blue-800 font-bold',
      'C': 'bg-orange-100 text-orange-800 font-bold',
      'inactive': 'bg-gray-100 text-gray-800',
      'unrated': 'bg-gray-50 text-gray-600'
    }
    return colors[tier] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Loading submissions...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Talent Pool Submissions</h1>
        <p className="text-gray-600">Manage and review candidate registrations</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name, email, phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tier Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tier</label>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as TierFilter)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Tiers</option>
              <option value="unrated">Unrated</option>
              <option value="A">A - Job Ready</option>
              <option value="B">B - Qualified</option>
              <option value="C">C - Training Required</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="reviewing">Reviewing</option>
              <option value="contacted">Contacted</option>
              <option value="placed">Placed</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_at">Date Registered</option>
              <option value="full_name">Name</option>
              <option value="status">Status</option>
              <option value="tier">Tier</option>
            </select>
          </div>

          {/* Sort Order Toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Order</label>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-200 transition"
            >
              {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="text-sm text-gray-600 mb-4">
        Showing {displaySubmissions.length} of {submissions.length} submission(s)
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => toggleSort('full_name')}
                  className="text-sm font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-1"
                >
                  Name {sortBy === 'full_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Roles</th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => toggleSort('tier')}
                  className="text-sm font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-1"
                >
                  Tier {sortBy === 'tier' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => toggleSort('status')}
                  className="text-sm font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-1"
                >
                  Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => toggleSort('created_at')}
                  className="text-sm font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-1"
                >
                  Registered {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displaySubmissions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  No submissions found
                </td>
              </tr>
            ) : (
              displaySubmissions.map(submission => (
                <tr key={submission.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{submission.full_name}</div>
                    <div className="text-xs text-gray-500">{submission.employment_status}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">{submission.email}</div>
                    <div className="text-xs text-gray-500">{submission.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {submission.state_of_residence}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      {submission.preferred_roles.slice(0, 2).map((role, idx) => (
                        <div key={idx} className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded mr-1">
                          {role}
                        </div>
                      ))}
                      {submission.preferred_roles.length > 2 && (
                        <div className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          +{submission.preferred_roles.length - 2} more
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getTierBadge(submission.tier)}`}>
                      {submission.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadge(submission.status)}`}>
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(submission.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/talent-pool/${submission.id}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
