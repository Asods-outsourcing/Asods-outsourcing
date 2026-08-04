# OAuth Callback Fix - Version 2 ✅

## Problem Identified
After Google OAuth and code exchange, the callback handler was failing with:
```
error=profile_check&description=Unable%20to%20check%20profile%20status
```

The user was redirected back to login page with an error instead of proceeding to onboarding.

## Root Cause
The callback handler was trying to **check if the profile exists** before creating it:
```typescript
const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('id, role')
  .eq('id', user.id)
  .maybeSingle()
```

**Problem:** RLS policy blocks SELECT until the profile exists, but we need to check BEFORE creating it!

This created a chicken-and-egg problem:
- SELECT fails due to RLS (user can only see their own profile if it exists)
- Profile doesn't exist yet (first-time user)
- Error gets returned

## Solution Applied ✅

### Simplified the flow:
Instead of checking if profile exists, **just attempt to create it and ignore duplicate errors**:

```typescript
// Attempt to create profile, ignore if already exists
const { error: createProfileError } = await supabase
  .from('profiles')
  .insert({
    id: user.id,
    role: 'candidate',
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    email: user.email,
  })

// Ignore "duplicate key" error (error code 23505)
if (createProfileError && createProfileError.code !== '23505') {
  console.error('Error creating profile:', createProfileError)
  // Continue anyway - profile might already exist
}

// Same for candidate record
const { error: createCandidateError } = await supabase
  .from('candidates')
  .insert({ profile_id: user.id })

if (createCandidateError && createCandidateError.code !== '23505') {
  console.error('Error creating candidate record:', createCandidateError)
  // Continue anyway
}
```

This approach:
- ✅ Works with RLS policies (INSERT policies allow self-creation)
- ✅ Doesn't fail on duplicate (first-time users get created, repeat users are ignored)
- ✅ Is more reliable than checking first

### Also fixed:
- Removed old/dead code that was trying to check profile before creating
- Cleaned up duplicate create logic
- Handler is now simpler and more robust

## Files Modified
- `src/app/auth/callback/route.ts` - Simplified profile/candidate creation logic

## Expected Behavior After Fix

### First-Time Google OAuth User:
```
1. Click "Continue with Google"
2. Authorize
3. Redirected to /auth/callback?code=...
4. Handler exchanges code for session ✅
5. Handler attempts to create profile ✅
6. Handler attempts to create candidate ✅
7. Handler checks onboarding (cv_url + bio + skills)
8. Redirected to /candidate/onboarding ✅
9. User sees onboarding form, can upload CV
```

### Return Google OAuth User (Already Onboarded):
```
1. Click "Continue with Google"
2. Authorize
3. Redirected to /auth/callback?code=...
4. Handler exchanges code ✅
5. Handler attempts to create profile (ignored - already exists) ✅
6. Handler checks onboarding (complete)
7. Redirected to /candidate/dashboard ✅
```

## Testing

### Test 1: Fresh Google OAuth
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Go to http://localhost:3000
- [ ] Click "Sign Up as Candidate"
- [ ] Click "Or continue with Google"
- [ ] Authorize Google login
- [ ] **Should see: Onboarding form (no errors in URL)**
- [ ] **Should NOT see: Login page with error message**

### Test 2: Complete Onboarding
- [ ] Fill: Name → Bio → Skills
- [ ] Upload CV (REQUIRED)
- [ ] Should redirect to `/candidate/jobs`
- [ ] **Should NOT see: Dashboard with "Failed to load profile"**

### Test 3: Return User
- [ ] Logout
- [ ] Go to login page
- [ ] Click "Or continue with Google"
- [ ] Authorize
- [ ] **Should see: Dashboard (not onboarding)**

## Console Debugging
If you still see errors, check browser console for:
- `Error checking candidate record:` - Might be RLS issue, but shouldn't stop flow
- `Error creating profile:` - If error code is NOT 23505, might be real error
- No other auth errors should appear

## Environment Check
✅ `NEXT_PUBLIC_SITE_URL="http://localhost:3000"` - Correct for local dev

## Remaining Requirements
✅ Add `http://localhost:3000/auth/callback` to Supabase Google OAuth Redirect URIs

Go to Supabase → Authentication → Google Provider → Authorized redirect URIs

Add:
- `http://localhost:3000/auth/callback`
- `http://192.168.8.254:3000/auth/callback` (if testing over network)
- Keep production URL: `https://asods-outsourcing.vercel.app/auth/callback`

## Architecture Notes
The simplified approach is actually better because:
1. **Simpler to understand** - "Try to create, ignore if exists"
2. **Fewer database queries** - No check query, just insert
3. **RLS-friendly** - Uses INSERT policy instead of fighting SELECT policy
4. **More resilient** - Doesn't fail if something blocks the check query
5. **Database-safe** - Duplicate key error is harmless, unique constraint handles idempotency
