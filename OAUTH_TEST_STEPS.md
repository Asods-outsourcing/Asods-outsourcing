# OAuth Callback Flow - End-to-End Testing Guide

## Prerequisites
- [ ] Dev server running: `npm run dev` (http://localhost:3000)
- [ ] Supabase project configured with Google OAuth
- [ ] `NEXT_PUBLIC_SITE_URL` set in `.env.local` (should be `http://localhost:3000` for dev)
- [ ] Google OAuth Redirect URI includes: `http://localhost:3000/auth/callback`

## Test 1: First-Time Google OAuth (New Candidate)

### Steps:
1. Open browser to `http://localhost:3000`
2. Click **"Sign Up as Candidate"** button in hero section
3. Click **"Or continue with Google"** button
4. Complete Google sign-in flow:
   - Select or enter Google account
   - Grant ASODS access to email, profile
5. **Expected behavior:**
   - Browser redirects to `/auth/callback`
   - Route handler exchanges code for session (no visible code in URL)
   - Profile and candidate records created in database
   - Auto-redirects to `/candidate/onboarding`
   - Onboarding form displays with name pre-filled from Google profile

### What NOT to see:
- ❌ Homepage with `?code=...` or `?error=...` in URL
- ❌ 401/403 errors in browser console
- ❌ "Unauthorized" error messages

### Verify in Database:
```sql
-- Run in Supabase SQL Editor
SELECT id, role, full_name, email, created_at 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 1;

SELECT id, profile_id, bio, skills, cv_url, created_at 
FROM candidates 
WHERE profile_id = (SELECT id FROM profiles ORDER BY created_at DESC LIMIT 1)
LIMIT 1;
```

---

## Test 2: Complete Onboarding After Google OAuth

### Prerequisites:
- Complete Test 1 (land on onboarding page after Google OAuth)

### Steps:
1. Fill in **Full Name** → Click **Continue**
2. Fill in **Bio** → Click **Continue**
3. Fill in **Skills** (e.g., "JavaScript, React, Project Management") → Click **Continue**
4. **Upload CV** (or Skip) → Upload button or Skip button
5. Should see **"You're all set!"** success screen
6. Click **"Browse Jobs"** button
7. **Expected behavior:**
   - Redirects to `/candidate/jobs` (or `/candidate/dashboard`)
   - Profile information is saved in database
   - Can see publicly available jobs

### Verify in Database:
```sql
SELECT id, profile_id, bio, skills, cv_url, created_at 
FROM candidates 
WHERE profile_id = (SELECT id FROM profiles ORDER BY created_at DESC LIMIT 1)
LIMIT 1;
```

Should see bio, skills array populated.

---

## Test 3: Google OAuth Return Flow (Existing User)

### Prerequisites:
- Completed Test 1 and 2 (have profile + completed onboarding)
- Logout from the app OR clear Supabase session cookie

### Steps:
1. Go to `http://localhost:3000/candidate/login`
2. Click **"Or continue with Google"**
3. Complete Google sign-in (same account as before)
4. **Expected behavior:**
   - Browser redirects to `/auth/callback`
   - Callback handler detects `cv_url` OR (bio + skills) exist
   - Callback handler redirects to `/candidate/dashboard` (NOT onboarding)
   - Dashboard loads with existing profile data

### Verify:
- See candidate dashboard with saved profile info
- No redirect to onboarding

---

## Test 4: Email + Password Signup (Sanity Check)

### Prerequisites:
- Use a different email than Test 1

### Steps:
1. Go to `http://localhost:3000/candidate/signup`
2. Fill in form:
   - Full Name: "Test User"
   - Email: "test+oauth@example.com"
   - Password: "SecurePass123!"
   - Confirm: "SecurePass123!"
3. Click **"Sign Up"** button
4. Click confirmation link in email (or check for redirect to signup-confirm)
5. Navigate to `/candidate/onboarding` in URL bar
6. **Expected behavior:**
   - Email signup still works as before
   - Lands on onboarding (not affected by OAuth changes)

---

## Test 5: Error Scenarios

### 5a: User Denies OAuth Permissions
1. Click "Or continue with Google"
2. At Google consent screen, click "No" or deny permissions
3. **Expected behavior:**
   - Redirected to `/candidate/login`
   - Error message appears: "OAuth error details"
   - No 401/403 in console
   - User can retry

### 5b: Network Error During Code Exchange
1. Click "Or continue with Google"
2. Kill the dev server mid-flow (or disable internet)
3. Complete Google sign-in
4. **Expected behavior:**
   - Error message appears on login page
   - Graceful error handling (no crash)
   - Can retry from login page

### 5c: Supabase Connection Down
1. Click "Or continue with Google"
2. Complete Google sign-in
3. Supabase is unreachable (simulate by stopping DB)
4. **Expected behavior:**
   - Error redirects to `/candidate/login`
   - Error message displayed
   - No user session created

---

## Browser DevTools Checklist

### Network Tab
- [ ] See request to `https://accounts.google.com/...` (OAuth provider)
- [ ] See redirect to `http://localhost:3000/auth/callback?code=...`
- [ ] See POST to Supabase exchanging code for session
- [ ] Final redirect to `/candidate/onboarding` or `/candidate/dashboard`
- [ ] NO visible `?code=` parameter in final URL

### Console Tab
- [ ] No JavaScript errors
- [ ] May see console.log from callback handler (for debugging)
- [ ] No 401/403 Unauthorized errors
- [ ] No "Supabase session expired" messages

### Application Tab (Cookies/Storage)
- [ ] After successful OAuth, see Supabase auth cookies:
  - `sb-{PROJECT_ID}-auth-token` (session token)
  - `sb-{PROJECT_ID}-auth-token.0` (if split across multiple cookies)
- [ ] Refresh page → session persists (logged in)
- [ ] Delete cookies → session lost (need to re-login)

---

## Debugging Tips

### If stuck on homepage with `?code=` parameter:
1. Check console for JavaScript errors
2. Verify `/auth/callback` route file exists: `src/app/auth/callback/route.ts`
3. Check `NEXT_PUBLIC_SITE_URL` in `.env.local`
4. Verify Google OAuth redirect URI includes callback URL
5. Restart dev server: `npm run dev`

### If seeing 401 on profile/candidate insert:
1. Verify RLS policies were deployed: Check Supabase SQL Editor
2. Run this query:
   ```sql
   SELECT * FROM pg_policies WHERE tablename IN ('profiles', 'candidates');
   ```
3. Should see multiple policies per table (insert, update, select, delete)
4. If not present, run migration: `supabase db push`

### If landing on onboarding but can't fill form:
1. Check browser console for errors
2. Verify profile/candidate records exist in DB
3. Check Network tab for failed API calls

### If landing on dashboard but data is missing:
1. Open DevTools → Network tab
2. Check requests to `/api/candidate/profile` or `/from('candidates')`
3. Verify RLS policies allow SELECT

---

## Post-Test Cleanup

### To reset a test user account:
```sql
-- Get the user ID
SELECT id FROM auth.users WHERE email = 'test+oauth@example.com';

-- Delete related records (cascades to candidates, applications, etc.)
DELETE FROM profiles WHERE id = '{USER_ID}';

-- This also deletes from auth.users due to cascade
```

### To reset all test data:
```sql
TRUNCATE profiles CASCADE;
-- Or via Supabase UI: delete rows manually
```

---

## Success Criteria

All tests passed when:
- ✅ First OAuth signup lands on onboarding (no code param in URL)
- ✅ After onboarding, lands on jobs/dashboard
- ✅ Returning OAuth user lands on dashboard (not onboarding)
- ✅ Email signup still works normally
- ✅ Errors are handled gracefully with user-friendly messages
- ✅ Browser console has no 401/403/auth errors
- ✅ Database has correct profile/candidate records with RLS visible
- ✅ Session persists on page refresh (cookies present)
