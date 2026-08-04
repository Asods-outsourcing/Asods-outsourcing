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

    // Create profile if it doesn't exist (attempt insert, ignore duplicate error)
    const { error: createProfileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        role: 'candidate',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email,
      })
      .select()
      .maybeSingle()

    // Ignore "duplicate key value violates unique constraint" errors
    if (createProfileError) {
      console.error('Error creating profile:', {
        message: createProfileError.message,
        code: createProfileError.code,
        details: (createProfileError as any).details,
        hint: (createProfileError as any).hint,
        userId: user.id,
      })
      // Continue anyway - might be duplicate or RLS issue
    }

    // Create candidate record if it doesn't exist
    const { error: createCandidateError } = await supabase
      .from('candidates')
      .insert({
        profile_id: user.id,
      })
      .select()
      .maybeSingle()

    // Ignore duplicate errors
    if (createCandidateError && createCandidateError.code !== '23505') {
      console.error('Error creating candidate record:', createCandidateError)
      // Continue anyway
    }

    // Check candidate onboarding status
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('id, cv_url, bio, skills')
      .eq('profile_id', user.id)
      .maybeSingle()

    if (candidateError && candidateError.code !== 'PGRST116') {
      console.error('Error checking candidate record:', candidateError)
      // Continue anyway; the onboarding page will handle this
    }

    // Determine if onboarding is complete
    // Complete ONLY if: has cv_url AND has bio AND has skills (all required)
    const isOnboardingComplete = 
      !!(candidate?.cv_url) && 
      !!(candidate?.bio) && 
      candidate?.skills && 
      candidate.skills.length > 0

    // Redirect based on onboarding status
    if (isOnboardingComplete) {
      // User has completed onboarding, send to dashboard
      return NextResponse.redirect(new URL('/candidate/dashboard', request.url))
    } else {
      // First-time user, send to onboarding
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
