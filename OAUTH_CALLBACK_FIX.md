# OAuth Callback Flow Fix

## Problem
Google OAuth was completing successfully but:
1. Redirecting back to the homepage with a raw `?code=...` parameter still in the URL
2. Not exchanging the authorization code for a session
3. Not checking onboarding status
4. Leaving users on the public homepage instead of redirecting to authenticated pages

## Root Cause
There was no OAuth callback route handler. The signup page was configured to redirect directly to `/candidate/onboarding`, but Supabase OAuth returns with an authorization code that must be exchanged for a session server-side.

## Solution Implemented

### 1. Created `/auth/callback` Route Handler
**File:** `src/app/auth/callback/route.ts`

This server-side route handler now:
- Intercepts the OAuth callback with the authorization code
- Exchanges the code for a session using `supabase.auth.exchangeCodeForSession(code)`
- Handles OAuth errors gracefully and redirects to login with error details
- Creates a profile and candidate record if they don't exist (first-time users)
- Checks onboarding completion status:
  - Complete if: has `cv_url` OR (has `bio` AND has `skills`)
  - Incomplete otherwise
- Redirects appropriately:
  - **First-time users** → `/candidate/onboarding`
  - **Returning users** → `/candidate/dashboard`

### 2. Updated OAuth Redirect URLs
**Files Modified:**
- `src/app/candidate/signup/page.tsx`
- `src/app/candidate/login/page.tsx`

Changed both from:
```typescript
redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/candidate/onboarding`
```

To:
```typescript
redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
```

## Error Handling
The callback handler gracefully handles:
- OAuth errors (invalid credentials, user denial, etc.)
- Missing authorization code
- Code exchange failures
- Profile/candidate creation errors
- User retrieval failures

All errors redirect to `/candidate/login` with error details as query parameters, allowing the UI to display user-friendly messages.

## Testing Checklist

### Email Signup Flow (Already Working)
- [x] Click "Sign Up" as Candidate with email/password
- [x] Complete signup form
- [x] Land on `/candidate/signup-confirm` → email confirmation
- [x] Click email link → should land on `/candidate/onboarding`

### Google OAuth Flow (Now Fixed)
- [ ] From homepage, click "Sign Up as Candidate"
- [ ] Click "Or continue with Google"
- [ ] Complete Google authentication (or select account)
- [ ] **Should NOT see homepage with `?code=` in URL**
- [ ] **Should see `/candidate/onboarding`** (loading profile form - first-time user)
- [ ] Complete onboarding steps (name, bio, skills, CV)
- [ ] Should redirect to `/candidate/jobs` (or dashboard if already complete)

### Google OAuth Return Flow (Repeat User)
- [ ] Complete signup + onboarding once
- [ ] Logout or clear session
- [ ] Go back to login page
- [ ] Click "Or continue with Google"
- [ ] Complete Google authentication
- [ ] **Should see `/candidate/dashboard`** (not onboarding)
- [ ] Dashboard shows saved profile info

### Error Scenarios
- [ ] Try OAuth with disabled Google integration → error message on login page
- [ ] Network interruption during code exchange → error message on login page

## Implementation Notes

### Profile Creation During OAuth
The callback handler automatically creates:
1. **Profile record** with:
   - `id`: user's auth ID
   - `role`: 'candidate'
   - `full_name`: from OAuth metadata or email username fallback
   - `email`: from OAuth provider

2. **Candidate record** with:
   - `profile_id`: linked to the profile

This mirrors the email signup flow and ensures consistency.

### Onboarding Completion Logic
Uses a two-part OR check:
```typescript
const isOnboardingComplete = 
  !!(candidate?.cv_url) || 
  (!!(candidate?.bio) && candidate?.skills && candidate.skills.length > 0)
```

This allows users to complete onboarding either by:
- Uploading a CV, OR
- Filling in bio and at least one skill

Flexibility accommodates different user preferences.

## Database Consistency
The RLS policies deployed in the previous fix (`supabase/migrations/0001_init.sql`) ensure:
- Users can only INSERT their own profile during signup
- Users can only INSERT their own candidate record
- Profile and candidate updates are scoped to the user
- This callback handler respects all existing RLS constraints

## Supabase Configuration Requirements
Ensure your Supabase project has:
1. **Google OAuth provider** configured in Auth settings
2. **Authorized redirect URIs** include:
   - `{YOUR_SITE_URL}/auth/callback` (for this handler)
   - Any other OAuth providers' callbacks
3. **NEXT_PUBLIC_SITE_URL** environment variable set (e.g., `http://localhost:3000` for dev)

## Related Files
- Authentication: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`
- Signup: `src/app/candidate/signup/page.tsx`
- Login: `src/app/candidate/login/page.tsx`
- Onboarding: `src/app/candidate/onboarding/page.tsx`
- Dashboard: `src/app/candidate/dashboard/page.tsx` (redirect destination)
- RLS Policies: `supabase/migrations/0001_init.sql`

## Future Enhancements
- Add retry logic for transient failures
- Track OAuth provider used (Google, GitHub, etc.) for future features
- Add multi-provider support (GitHub, Microsoft, etc.)
- Implement profile photo sync from OAuth provider
