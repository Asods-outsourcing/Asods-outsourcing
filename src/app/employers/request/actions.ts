'use server'

import { createClient } from '@/lib/supabase/server'

export type StaffingRequestPayload = {
  companyName: string
  rolesNeeded: string
  quantity: number
  timeline: string
  contactName: string
  contactEmail: string
  contactPhone: string
}

/**
 * Server action to submit a staffing request.
 * 
 * Handles both first-time leads (new employer record) and returning leads
 * (existing contact_email). Uses upsert to gracefully handle duplicate
 * submissions from the same email.
 */
export async function submitStaffingRequest(payload: StaffingRequestPayload) {
  try {
    const supabase = await createClient()

    // Step 1: Upsert employer record (creates if new, updates if exists)
    // This handles the case where the same lead submits twice with same email
    const { data: employer, error: employerError } = await supabase
      .from('employers')
      .upsert({
        contact_email: payload.contactEmail,
        company_name: payload.companyName,
        contact_name: payload.contactName,
        contact_phone: payload.contactPhone,
        profile_id: null, // Unauthenticated lead — no user account yet
      }, { onConflict: 'contact_email' })
      .select('id')
      .single()

    if (employerError) {
      console.error('[StaffingRequest] Employer upsert error:', employerError)
      throw new Error('Failed to process employer record')
    }

    if (!employer) {
      throw new Error('No employer record returned')
    }

    // Step 2: Create staffing request
    const { data: request, error: requestError } = await supabase
      .from('staffing_requests')
      .insert({
        employer_id: employer.id,
        roles_needed: payload.rolesNeeded,
        quantity: payload.quantity,
        timeline: payload.timeline,
        status: 'new',
      })
      .select('id')
      .single()

    if (requestError) {
      console.error('[StaffingRequest] Request insert error:', requestError)
      throw new Error('Failed to create staffing request')
    }

    if (!request) {
      throw new Error('No request ID returned')
    }

    console.log('[StaffingRequest] Success:', {
      employerId: employer.id,
      requestId: request.id,
      email: payload.contactEmail,
    })

    return {
      success: true,
      requestId: request.id,
      message: 'Staffing request submitted successfully! We will review and contact you within 24 hours.',
    }
  } catch (error) {
    console.error('[StaffingRequest] Error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    }
  }
}
