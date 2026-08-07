'use server'

import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface NotificationData {
  candidateId: string
  stage: 'screening' | 'interview' | 'placed' | 'rejected' | 'offer'
  candidateName: string
  candidateEmail: string
  jobTitle: string
  salary?: string
  startDate?: string
  customNote?: string
}

export async function sendNotificationEmail(data: NotificationData) {
  try {
    const supabase = await createClient()

    // Fetch the template for this stage
    const { data: template, error: templateError } = await supabase
      .from('notification_templates')
      .select('subject, body')
      .eq('stage', data.stage)
      .maybeSingle()

    if (templateError) {
      console.error('[Send Notification] Template fetch error:', templateError)
      return { success: false, error: 'Failed to fetch notification template' }
    }

    if (!template) {
      console.error('[Send Notification] No template found for stage:', data.stage)
      return { success: false, error: `No template configured for ${data.stage} stage` }
    }

    // Fill in placeholders
    let subject = template.subject
    let body = template.body

    // Replace common placeholders
    subject = subject.replace(/\{\{candidate_name\}\}/g, data.candidateName)
    subject = subject.replace(/\{\{job_title\}\}/g, data.jobTitle)

    body = body.replace(/\{\{candidate_name\}\}/g, data.candidateName)
    body = body.replace(/\{\{job_title\}\}/g, data.jobTitle)

    // Replace stage-specific placeholders
    if (data.salary) {
      body = body.replace(/\{\{salary\}\}/g, data.salary)
    }
    if (data.startDate) {
      body = body.replace(/\{\{start_date\}\}/g, data.startDate)
    }
    if (data.customNote) {
      body = body.replace(/\{\{custom_note\}\}/g, data.customNote)
    }

    // Send email via Resend
    console.log('[Send Notification] Sending email to:', data.candidateEmail)
    const { error: sendError } = await resend.emails.send({
      from: 'notifications@resend.dev',
      to: data.candidateEmail,
      subject: subject,
      html: `<p>${body.replace(/\n/g, '<br />')}</p>`,
    })

    if (sendError) {
      console.error('[Send Notification] Email send error:', sendError)
      return { success: false, error: 'Failed to send email' }
    }

    // Log the notification
    const { error: logError } = await supabase.from('notifications_log').insert({
      candidate_id: data.candidateId,
      stage: data.stage,
      sent_at: new Date().toISOString(),
      status: 'sent',
      template_used: template.subject,
    })

    if (logError) {
      console.error('[Send Notification] Failed to log notification:', logError)
      // Don't fail the whole operation if logging fails
    }

    console.log('[Send Notification] Email sent successfully')
    return { success: true }
  } catch (err) {
    console.error('[Send Notification] Unexpected error:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
