# OAuth Callback Configuration Issue - FIXED ✅

## What Happened
When you clicked "Continue with Google", it authenticated successfully but then redirected to the **homepage instead of the onboarding page**.

## Root Cause Found
The `NEXT_PUBLIC_SITE_URL` in `.env.local` was set to the production Vercel URL:
```
NEXT_PUBLIC_SITE_URL="https://asods-outsourcing.vercel.app/"
```

This caused Google OAuth to redirect to:
```
https://asods-outsourcing.vercel.app/auth/callback (WRONG - production server)
```

Instead of:
```
http://localhost:3000/auth/callback (CORRECT - local dev)
```

## Fix Applied ✅
Updated `.env.local` to use localhost for development:
```
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Dev server has been restarted to pick up the new value.

## Next Steps: Configure Supabase OAuth

You must add the local callback URL to your Supabase project's Google OAuth settings:

### 1. Go to Supabase Dashboard
- Navigate to: Authentication → Providers → Google

### 2. Add Localhost Redirect URI
Add **all these** as Authorized redirect URIs:
```
http://localhost:3000/auth/callback
http://192.168.8.254:3000/auth/callback
https://asods-outsourcing.vercel.app/auth/callback
```

(Keep the production URL for when deployed to Vercel)

### 3. Make Sure Google OAuth is Configured
- [ ] Google OAuth provider is **enabled** in Supabase
- [ ] Client ID and secret are filled in
- [ ] Redirect URIs include localhost URLs above

### 4. Test Again
After updating Supabase:
1. Refresh http://localhost:3000 in browser
2. Click "Sign Up as Candidate" or "Continue with Google"
3. Complete Google authentication
4. Should see: **Redirect to `/auth/callback` → then to `/candidate/onboarding`**
5. NOT the homepage ✅

## Expected OAuth Flow (After Fix)
```
1. User clicks "Continue with Google"
   ↓
2. Redirected to Google auth screen
   ↓
3. User authorizes
   ↓
4. Google redirects to: http://localhost:3000/auth/callback?code=...
   ↓
5. Next.js route handler at /auth/callback receives request
   ↓
6. Handler exchanges code for session
   ↓
7. Handler creates profile + candidate records (if first-time)
   ↓
8. Handler checks onboarding status (cv_url + bio + skills)
   ↓
9. If incomplete: Redirect to /candidate/onboarding
   If complete: Redirect to /candidate/dashboard
   ↓
10. Done ✅
```

## Configuration for Different Environments

### Development (Local)
```
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
Supabase Redirect URI: http://localhost:3000/auth/callback
```

### Staging (if needed)
```
NEXT_PUBLIC_SITE_URL="https://staging.asods-outsourcing.com"
Supabase Redirect URI: https://staging.asods-outsourcing.com/auth/callback
```

### Production (Vercel)
```
NEXT_PUBLIC_SITE_URL="https://asods-outsourcing.vercel.app"
Supabase Redirect URI: https://asods-outsourcing.vercel.app/auth/callback
```

## Files Modified
- `.env.local` - Updated `NEXT_PUBLIC_SITE_URL` to localhost

## Files NOT Modified (But Critical)
- `src/app/auth/callback/route.ts` - Route handler (no changes needed)
- `src/app/candidate/signup/page.tsx` - Uses env variable correctly ✅
- `src/app/candidate/login/page.tsx` - Uses env variable correctly ✅

## Testing Checklist

After configuring Supabase:
- [ ] Google OAuth sign-up redirects to onboarding (not homepage)
- [ ] Email/password signup still works normally
- [ ] Onboarding forces CV upload (no skip button)
- [ ] After onboarding completes, redirects to `/candidate/jobs`
- [ ] Returning user with complete profile goes to `/candidate/dashboard`
- [ ] Console has no 401/403 errors

## Troubleshooting

### Still seeing homepage after Google OAuth?
1. Check browser Network tab
2. Look for GET `/auth/callback?code=...`
3. If not present: Supabase redirect URI not configured
4. If present but fails: Check dev server console for errors

### Getting OAuth error on login?
1. Check the error message
2. Usually means redirect URI mismatch
3. Verify Supabase redirect URIs include localhost

### Dev server not picking up env change?
1. Restart dev server: `npm run dev`
2. Check that `.env.local` has correct `NEXT_PUBLIC_SITE_URL`
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
