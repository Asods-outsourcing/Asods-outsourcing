import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * OAuth Callback Handler
 * Exchanges the authorization code for a session and redirects based on onboarding status
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error(`OAuth error: ${error} - ${errorDescription}`)
    return NextResponse.redirect(
      new URL(
        `/candidate/login?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`,
        request.url
      )
    )
  }

  // Handle missing code
  if (!code) {
    console.error('OAuth callback missing authorization code')
    return NextResponse.redirect(
      new URL(
        '/candidate/login?error=missing_code&description=Authorization code not found',
        request.url
      )
    )
  }

  try {
    // Exchange the code for a session
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Exchange code error:', exchangeError)
      return NextResponse.redirect(
        new URL(
          `/candidate/login?error=exchange_failed&description=${encodeURIComponent(exchangeError.message)}`,
          request.url
        )
      )
    }

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('Failed to get user after exchange:', userError)
      return NextResponse.redirect(
        new URL(
          '/candidate/login?error=get_user_failed&description=Unable to retrieve user after authentication',
          request.url
        )
      )
    }

    console.log('[OAuth Callback] Exchanged code for session, user ID:', user.id)

    // Profile row will be created automatically by database trigger (handle_new_user)
    // Now that we have a real authenticated session, create or upsert the candidates row
    console.log('[OAuth Callback] Attempting to upsert candidate for profile_id:', user.id)
    const { error: createCandidateError } = await supabase
      .from('candidates')
      .upsert(
        {
          profile_id: user.id,
        },
        { onConflict: 'profile_id' }
      )
      .select()
      .maybeSingle()

    // Log full error details if upsert fails
    if (createCandidateError) {
      console.error('[OAuth Callback] Candidate upsert error - FULL ERROR OBJECT:', {
        message: createCandidateError.message,
        code: createCandidateError.code,
        details: (createCandidateError as any).details,
        hint: (createCandidateError as any).hint,
        status: (createCandidateError as any).status,
      })
      // Continue anyway - should be safe with unique constraint in place
    } else {
      console.log('[OAuth Callback] Candidate upsert successful')
    }

    // Check candidate onboarding status
    console.log('[OAuth Callback] Checking candidate onboarding status for profile_id:', user.id)
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('id, cv_url, bio, skills')
      .eq('profile_id', user.id)
      .maybeSingle()

    if (candidateError && candidateError.code !== 'PGRST116') {
      console.error('[OAuth Callback] Error checking candidate record:', {
        message: candidateError.message,
        code: candidateError.code,
        details: (candidateError as any).details,
        hint: (candidateError as any).hint,
      })
      // Continue anyway; the onboarding page will handle this
    }

    // Determine if onboarding is complete
    // Complete ONLY if: has cv_url AND has bio AND has skills (all required)
    const isOnboardingComplete = 
      !!(candidate?.cv_url) && 
      !!(candidate?.bio) && 
      candidate?.skills && 
      candidate.skills.length > 0

    console.log('[OAuth Callback] Onboarding status check:', {
      has_candidate_record: !!candidate,
      has_cv_url: !!candidate?.cv_url,
      has_bio: !!candidate?.bio,
      has_skills: candidate?.skills ? candidate.skills.length > 0 : false,
      isOnboardingComplete,
    })

    // Redirect based on onboarding status
    if (isOnboardingComplete) {
      // User has completed onboarding, send to dashboard
      console.log('[OAuth Callback] ✓ Onboarding complete - redirecting to dashboard')
      return NextResponse.redirect(new URL('/candidate/dashboard', request.url))
    } else {
      // First-time user, send to onboarding
      console.log('[OAuth Callback] ✗ Onboarding incomplete - redirecting to onboarding')
      return NextResponse.redirect(new URL('/candidate/onboarding', request.url))
    }
  } catch (err) {
    console.error('Unexpected error in auth callback:', err)
    return NextResponse.redirect(
      new URL(
        `/candidate/login?error=internal_error&description=${encodeURIComponent(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        )}`,
        request.url
      )
    )
  }
}
