# CV Requirement Change - Summary

## ✅ Changes Complete

### 1. Completion Logic Updated (2 files)
- **`src/app/auth/callback/route.ts`** → OAuth callback now requires CV
  - Old: `cv_url OR (bio AND skills)`
  - New: `cv_url AND bio AND skills` (all required)

- **`src/app/candidate/login/page.tsx`** → Email/password login now requires CV
  - Old: Only checked cv_url
  - New: Checks cv_url AND bio AND skills

### 2. Onboarding UI Updated
- **`src/app/candidate/onboarding/page.tsx`**
  - ❌ Removed "Skip for now" button on CV step
  - ❌ Removed `handleSkipCv()` function
  - ✅ Added red "Required to complete onboarding" text
  - ✅ Changed button from "Upload" to "Upload CV"
  - ✅ CV upload now gates access to success screen

### 3. Documentation Added
- `ONBOARDING_CV_REQUIREMENT.md` - Full technical details
- `CV_REQUIREMENT_SUMMARY.md` - This file

## 🔴 Important: Existing Test Accounts

**If you have test accounts that were marked "complete" under the old rules but DON'T have a cv_url:**

These accounts will now:
- ⚠️ Redirect to `/candidate/onboarding` instead of dashboard
- ⚠️ Force CV upload before proceeding
- ✅ This is **correct behavior** (they never fully onboarded)

### Check for affected accounts:
```sql
SELECT p.full_name, p.email, c.bio, c.skills, c.cv_url
FROM profiles p
LEFT JOIN candidates c ON p.id = c.profile_id
WHERE c.cv_url IS NULL
  AND c.bio IS NOT NULL
  AND c.skills IS NOT NULL;
```

## 🧪 Testing: New Accounts Cannot Skip CV

### Email Signup
1. Create account with email/password
2. Fill: Name → Bio → Skills
3. Reach CV upload step
4. "Skip for now" button: **NOT VISIBLE** ✅
5. Must select PDF and upload
6. Can only proceed with successful CV upload
7. Then redirects to `/candidate/jobs`

### Google OAuth (New User)
1. Sign up with Google
2. Lands on `/candidate/onboarding`
3. Fill: Name → Bio → Skills
4. Reach CV upload step
5. "Skip for now" button: **NOT VISIBLE** ✅
6. Must upload CV to continue
7. Then redirects to `/candidate/jobs`

### Google OAuth (Returning User - Complete)
1. Account with cv_url + bio + skills
2. Sign in with Google
3. Redirects to `/candidate/dashboard` (not onboarding) ✅

### Google OAuth (Returning User - Incomplete)
1. Account with bio + skills but NO cv_url (old test account)
2. Sign in with Google
3. Redirects to `/candidate/onboarding` (forced to upload CV) ✅

## 📋 Files Modified
- `src/app/auth/callback/route.ts`
- `src/app/candidate/login/page.tsx`
- `src/app/candidate/onboarding/page.tsx`

## 🚀 Ready to Deploy
1. Commit changes
2. Push to main
3. Deploy frontend
4. Test with fresh account (email + Google)
5. Confirm CV upload is mandatory

No database migration needed — only logic and UI changes.
