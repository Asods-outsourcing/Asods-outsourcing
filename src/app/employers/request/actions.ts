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
 * TODO: Once Supabase credentials are available, uncomment the real implementation.
 * For now, this logs the payload and returns a success response for UI testing.
 */
export async function submitStaffingRequest(payload: StaffingRequestPayload) {
  try {
    // Log the payload to console for verification
    console.log('=== STAFFING REQUEST SUBMISSION (TODO: WIRE TO DB) ===')
    console.log(JSON.stringify(payload, null, 2))
    console.log('=====================================================')

    // TODO: Uncomment once Supabase is connected
    /*
    const supabase = await createClient()

    // Step 1: Check if employer exists by contact_email
    const { data: existingEmployer } = await supabase
      .from('employers')
      .select('id')
      .eq('contact_email', payload.contactEmail)
      .single()

    let employerId: string
    
    if (existingEmployer) {
      // Employer already exists, use their ID
      employerId = existingEmployer.id
    } else {
      // Create new employer record
      const { data: newEmployer, error: employerError } = await supabase
        .from('employers')
        .insert({
          contact_email: payload.contactEmail,
          company_name: payload.companyName,
          contact_phone: payload.contactPhone,
          profile_id: null, // Unauthenticated lead — no user account yet
        })
        .select('id')
        .single()

      if (employerError) {
        console.error('Error creating employer:', employerError)
        throw new Error('Failed to create employer record')
      }

      if (!newEmployer) {
        throw new Error('No employer ID returned')
      }

      employerId = newEmployer.id
    }

    // Step 2: Create staffing request
    const { data: request, error: requestError } = await supabase
      .from('staffing_requests')
      .insert({
        employer_id: employerId,
        roles_needed: payload.rolesNeeded,
        quantity: payload.quantity,
        timeline: payload.timeline,
        status: 'new',
      })
      .select('id')
      .single()

    if (requestError) {
      console.error('Error creating staffing request:', requestError)
      throw new Error('Failed to create staffing request')
    }

    if (!request) {
      throw new Error('No request ID returned')
    }

    return {
      success: true,
      requestId: request.id,
      message: 'Staffing request submitted successfully',
    }
    */

    // For now, return mock success for UI testing
    return {
      success: true,
      requestId: 'tmp-' + Date.now(),
      message: 'Staffing request received! We will review and contact you within 24 hours.',
    }
  } catch (error) {
    console.error('Staffing request error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    }
  }
}
