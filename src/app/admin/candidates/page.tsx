'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { stageConfig, stageOrder } from '@/lib/admin/kanban'
import { sendNotificationEmail } from '@/lib/notifications/sendNotification'

interface Application {
  id: string
  stage: keyof typeof stageConfig
  notes: string
  candidates: {
    id: string
    profile_id: string
  }
  jobs: {
    title: string
  }
  full_name?: string
}

export default function CandidatesKanbanPage() {
  const supabase = createClient()

  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [draggedApp, setDraggedApp] = useState<Application | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('applications')
          .select(`
            id,
            stage,
            notes,
            candidates (
              id,
              profile_id
            ),
            jobs (title)
          `)
          .order('created_at', { ascending: false })

        if (fetchError) {
          console.error('[Candidates Kanban] Fetch error:', fetchError)
          setError('Failed to load candidates')
          setLoading(false)
          return
        }

        // Get profile names for all candidates
        const profileIds = (data || [])
          .map((app: any) => app.candidates?.profile_id)
          .filter(Boolean)

        let profileMap: Record<string, string> = {}
        if (profileIds.length > 0) {
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', profileIds)

          if (!profileError && profiles) {
            profileMap = Object.fromEntries(profiles.map((p: any) => [p.id, p.full_name]))
          }
        }

        // Flatten and enrich with names
        const flattened = (data || []).map((app: any) => ({
          id: app.id,
          stage: app.stage,
          notes: app.notes,
          candidates: app.candidates,
          jobs: app.jobs,
          full_name: app.candidates?.profile_id ? profileMap[app.candidates.profile_id] : 'Unknown',
        }))

        setApplications(flattened)
        setLoading(false)
      } catch (err) {
        console.error('[Candidates Kanban] Error:', err)
        console.error('[Candidates Kanban] Error stringified:', JSON.stringify(err, null, 2))
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    loadApplications()
  }, [supabase])

  const handleDragStart = (app: Application) => {
    setDraggedApp(app)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (newStage: keyof typeof stageConfig) => {
    if (!draggedApp || draggedApp.stage === newStage) {
      setDraggedApp(null)
      return
    }

    console.log(`[Stage Change Handler] FIRED - Moving candidate ${draggedApp.id} (${draggedApp.full_name}) from ${draggedApp.stage} to ${newStage}`)

    try {
      console.log('[Stage Change Handler] Updating stage in database...')
      const { error: updateError } = await supabase
        .from('applications')
        .update({ stage: newStage })
        .eq('id', draggedApp.id)

      if (updateError) {
        console.error('[Stage Change Handler] Supabase update error:', updateError)
        showToast('Failed to move candidate', 'error')
        setDraggedApp(null)
        return
      }

      console.log('[Stage Change Handler] Stage updated in DB. Fetching application data for notification...')
      
      // Fetch full application data for notification
      const { data: appData, error: fetchError } = await supabase
        .from('applications')
        .select(`
          id,
          stage,
          candidate_id,
          job_id,
          jobs (title)
        `)
        .eq('id', draggedApp.id)
        .single()

      if (fetchError || !appData) {
        console.error('[Stage Change Handler] Failed to fetch updated application:', fetchError)
        showToast('Failed to fetch application data', 'error')
        setDraggedApp(null)
        return
      }

      console.log('[Stage Change Handler] Fetched application data:', appData)

      // Fetch candidate profile for notification
      const { data: candidateData, error: candidateError } = await supabase
        .from('candidates')
        .select('profile_id')
        .eq('id', appData.candidate_id)
        .single()

      if (candidateError || !candidateData) {
        console.error('[Stage Change Handler] Failed to fetch candidate:', candidateError)
        showToast('Failed to fetch candidate data', 'error')
        setDraggedApp(null)
        return
      }

      console.log('[Stage Change Handler] Fetched candidate data:', candidateData)

      // Fetch profile for email and name
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', candidateData.profile_id)
        .single()

      if (profileError || !profileData) {
        console.error('[Stage Change Handler] Failed to fetch candidate profile:', profileError)
        console.error('[Stage Change Handler] Raw error object:', profileError)
        showToast('Failed to fetch candidate profile', 'error')
        setDraggedApp(null)
        return
      }

      console.log('[Stage Change Handler] Fetched profile data:', profileData)
      console.log('[Stage Change Handler] Calling sendNotificationEmail server action...')

      // Get job title from appData
      const jobTitle = (appData.jobs as any)?.title || 'Unknown Position'
      console.log('[Stage Change Handler] Job title:', jobTitle)

      // Only send notification for stages that have templates (not 'applied')
      if (newStage === 'applied') {
        console.log('[Stage Change Handler] Stage is "applied" (new application) - skipping notification')
      } else {
        // Call server action to send notification
        const notificationResult = await sendNotificationEmail({
          candidateId: draggedApp.id,
          stage: newStage as 'screening' | 'interview' | 'offer' | 'placed' | 'rejected',
          candidateName: profileData.full_name,
          candidateEmail: profileData.email,
          jobTitle: jobTitle,
        })

        console.log('[Stage Change Handler] Notification result:', notificationResult)

        if (!notificationResult.success) {
          console.error('[Stage Change Handler] Notification failed:', notificationResult.error)
          showToast(`Warning: Stage updated but notification failed (${notificationResult.error})`, 'error')
        } else {
          console.log('[Stage Change Handler] ✅ Notification sent successfully')
        }
      }

      // Update local state
      setApplications(
        applications.map((app) =>
          app.id === draggedApp.id ? { ...app, stage: newStage } : app
        )
      )

      showToast(
        `Moved to ${stageConfig[newStage].label}`,
        'success'
      )
      setDraggedApp(null)
    } catch (err) {
      console.error('[Stage Change Handler] Unexpected error:', err)
      console.error('[Stage Change Handler] Raw error object:', err)
      console.error('[Stage Change Handler] Error stringified:', JSON.stringify(err, null, 2))
      showToast('An error occurred', 'error')
      setDraggedApp(null)
    }
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const groupedByStage = stageOrder.reduce(
    (acc, stage) => {
      acc[stage] = applications.filter((app) => app.stage === stage)
      return acc
    },
    {} as Record<keyof typeof stageConfig, Application[]>
  )

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading candidates...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#0D1B2A] mb-2">Candidates Pipeline</h1>
        <p className="text-gray-600">Drag candidates to move through stages. Click to add notes.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {toast && (
        <div
          className={`mb-6 p-4 rounded ${
            toast.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {toast.message}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">No applications yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 pb-8 overflow-x-auto">
          {stageOrder.map((stage) => {
            const config = stageConfig[stage]
            const stageApps = groupedByStage[stage]

            return (
              <div
                key={stage}
                className={`${config.color} ${config.borderColor} border-2 rounded-lg p-4 min-h-96 flex-shrink-0 w-full lg:w-auto`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-[#0D1B2A]">{config.label}</h2>
                  <span className="inline-block w-6 h-6 bg-white rounded-full text-center text-xs font-bold text-[#0D1B2A]">
                    {stageApps.length}
                  </span>
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(stage)}
                  className="space-y-3 min-h-80"
                >
                  {stageApps.map((app) => (
                    <Link
                      key={app.id}
                      href={`/admin/candidates/${app.id}`}
                      draggable
                      onDragStart={() => handleDragStart(app)}
                      className="block bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition cursor-move border-l-4 border-[#D4AF37]"
                    >
                      <p className="font-medium text-sm text-[#0D1B2A] truncate">
                        {app.full_name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-600 truncate mt-1">
                        {app.jobs?.title || 'Unknown job'}
                      </p>
                      {app.notes && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                          "{app.notes}"
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
