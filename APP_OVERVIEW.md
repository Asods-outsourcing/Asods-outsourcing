# ASODS Outsourcing - Complete Application Overview

**Project:** ASODS (African Staffing & Outsourcing Development Services)  
**Tech Stack:** Next.js 14 (TypeScript, React), Supabase (PostgreSQL + Auth), Tailwind CSS  
**Status:** Phase 2 Complete, Rebuilt Schema, Production Ready  
**Last Updated:** August 5, 2026

---

## Table of Contents
1. [Project Vision](#project-vision)
2. [Architecture Overview](#architecture-overview)
3. [Phase 1: Public Site & Lead Capture](#phase-1-public-site--lead-capture)
4. [Phase 2: Candidate Portal](#phase-2-candidate-portal)
5. [Future Phases](#future-phases)
6. [Database Schema](#database-schema)
7. [Recent Fixes & Rebuild](#recent-fixes--rebuild)
8. [Deployment & Testing](#deployment--testing)

---

## Project Vision

ASODS bridges African talent and global employers through a modern staffing platform. The platform has three main user types:

- **Candidates:** African professionals seeking international opportunities
- **Employers:** Companies and staffing firms seeking African talent
- **Admin:** Internal ASODS team managing operations, payouts, and disputes

The platform is built in phases to validate each market segment before scaling.

---

## Architecture Overview

### Technology Stack

**Frontend:**
- Next.js 14 with TypeScript
- React for UI components
- Tailwind CSS for styling
- Client-side routing with `/app` directory

**Backend:**
- Supabase (PostgreSQL database + Auth)
- Row-Level Security (RLS) for data isolation
- Server actions for form submissions
- OAuth (Google) for easy candidate signup

**Deployment:**
- Vercel (Next.js hosting)
- Supabase cloud (managed PostgreSQL)

### Key Files & Directories

```
src/app/
├── (public pages - accessible to everyone)
│   ├── page.tsx - Home
│   ├── about/ - About ASODS
│   ├── contact/ - Contact form
│   ├── careers/ - Browse open roles
│   ├── careers/[jobId]/ - Job detail view
│   ├── employers/ - Employer landing page
│   ├── employers/request/ - Lead capture form (server action)
│   ├── faq/ - FAQ page
│   ├── industries/ - Service sectors
│   ├── privacy/ - Privacy policy
│   └── services/ - Service offerings
│
├── auth/
│   └── callback/route.ts - OAuth callback (Google login)
│
└── candidate/
    ├── login/ - Email/password login
    ├── signup/ - Email/password signup
    ├── signup-confirm/ - Email confirmation page
    ├── onboarding/ - 5-step profile completion
    ├── dashboard/ - Main candidate hub
    ├── profile/ - View/edit candidate profile
    ├── documents/ - CV management
    ├── jobs/ - Browse available jobs
    ├── jobs/[jobId]/ - Job detail + apply
    └── applications/ - View submitted applications
        └── applications/[id]/ - Application detail

supabase/
└── migrations/
    └── 0001_baseline.sql - Complete schema (no drops, safe)

docs/
└── dangerous_full_reset.sql - Manual DB reset (destructive only)
```

---

## Phase 1: Public Site & Lead Capture

**Status:** ✅ Complete  
**Goal:** Build public marketing site and capture employer leads

### Features Implemented

#### Public Pages
- **Home (`/`)** - Hero with value prop, how it works, testimonials
- **About (`/about`)** - Company mission, team, impact metrics
- **Services (`/services`)** - What ASODS offers
- **Industries (`/industries`)** - Sectors served
- **Careers (`/careers`)** - Browse open roles (mock data for now)
- **FAQ (`/faq`)** - Common questions
- **Contact (`/contact`)** - Contact form
- **Privacy (`/privacy`)** - Privacy policy

#### Employer Lead Capture
- **`/employers`** - Employer landing page, call-to-action
- **`/employers/request`** - Public form for staffing requests
  - Company name, roles needed, timeline, contact info
  - Server action saves to Supabase
  - Creates `employers` record (unauthenticated lead)
  - Creates `staffing_requests` record
  - Supports duplicate email (updates existing, creates new request)

### Key Implementation Details
- No authentication required for public pages
- Lead capture form accepts unauthenticated submissions
- Employers table allows `profile_id = null` for leads
- Unique constraint on `contact_email` for lead deduplication
- All pages use consistent branding (colors: dark blue #0D1B2A, gold #D4AF37)

---

## Phase 2: Candidate Portal

**Status:** ✅ Complete (with rebuilt schema)  
**Goal:** Enable African professionals to create profiles, upload CVs, and apply for jobs

### Features Implemented

#### Authentication
- **Email/Password Signup** (`/candidate/signup`)
  - Creates Supabase auth user
  - Creates `profiles` record (role: candidate)
  - Creates `candidates` record (empty, waiting for onboarding)
  - Sends confirmation email
  
- **Email/Password Login** (`/candidate/login`)
  - Checks if onboarding complete (cv_url + bio + skills)
  - Routes to dashboard or onboarding accordingly
  
- **Google OAuth** (`/auth/callback`)
  - OAuth callback handler
  - Same profile/candidate creation as email signup
  - Same routing based on onboarding status

#### Candidate Onboarding
**Route:** `/candidate/onboarding` (5 required steps)

1. **Step 1: Full Name**
   - Text input, saved to `profiles.full_name`
   - Required to continue

2. **Step 2: Bio**
   - Textarea (200 words), saved to `candidates.bio`
   - Required to continue

3. **Step 3: Skills**
   - Comma-separated skills, saved to `candidates.skills` (JSON array)
   - At least 1 skill required

4. **Step 3.5: CV Upload**
   - PDF only, max 10MB
   - Uploaded to Supabase storage (`cvs/{profile_id}/filename.pdf`)
   - URL saved to `candidates.cv_url`
   - Required to complete

5. **Step 4: Review**
   - Summary of all data entered
   - "Browse Jobs" button redirects to `/candidate/jobs`

**Completion Check:**
- All 3 fields must exist: `bio`, `skills` (length > 0), `cv_url`
- Checked on login, onboarding page load, and OAuth callback
- Uses `.maybeSingle()` queries to handle first-time users

#### Candidate Dashboard
**Route:** `/candidate/dashboard`

- Welcome message with candidate name
- Quick stats (applications submitted, jobs saved, etc.)
- Navigation to profiles, jobs, applications, documents
- Only accessible after login

#### Profile Management
**Route:** `/candidate/profile`

- View/edit full name, bio, skills
- Displays current values from database
- Update button saves changes

#### Document Management
**Route:** `/candidate/documents`

- View uploaded CV URL
- Option to upload new CV (replaces old one in storage)
- Shows upload date

#### Job Browsing
**Routes:**
- `/candidate/jobs` - List all public jobs
- `/candidate/jobs/[jobId]` - Job detail view

- Lists all jobs marked `is_public = true`
- Shows title, description, location, company
- "Apply" button creates `applications` record
- Checks if already applied (unique constraint prevents duplicates)
- Graceful error: "You've already applied to this job" (code 23505)

#### Application Tracking
**Routes:**
- `/candidate/applications` - List all applications submitted
- `/candidate/applications/[id]` - View specific application

- Shows application status (applied, screening, interview, etc.)
- Links to original job posting
- Notes from employer (if any)

---

## Future Phases

### Phase 3: Admin Dashboard
**Not yet built, schema pre-built**

- Admin-only `/admin/home` route
- Candidate management (view profiles, verify CVs, block/approve)
- Job management (create, edit, archive)
- Application pipeline (track stage: applied → screening → interview → offer → placed)
- Staffing request management
- Deployed staff tracking
- Payment/invoice management

### Phase 4: Employer Portal
**Not yet built, schema pre-built**

- Employer authentication (existing leads can sign up)
- Job posting dashboard
- Application review interface
- Candidate shortlisting
- Interview scheduling
- Offer management

### Phase 5: Deployed Staff Management
**Not yet built, schema pre-built**

- Track deployed staff assignments
- Duration tracking
- Performance metrics
- Replacement management

### Phase 6: Invoicing & Payments
**Not yet built, schema pre-built**

- Invoice generation
- Payment tracking (Paystack integration)
- Payout management to candidates
- Financial reporting

---

## Database Schema

### Complete After Rebuild (0001_baseline.sql)

#### Core Tables

**`profiles`** (extends auth.users)
```sql
id (pk) → auth.users.id
role (enum: candidate, employer, admin)
full_name, email
admin_access (array for Phase 3)
created_at, updated_at
```

**`candidates`** (Phase 2)
```sql
id (pk), profile_id (fk, UNIQUE)
bio, skills (text array), cv_url
created_at, updated_at
```

**`employers`** (Phase 1 & 4)
```sql
id (pk), profile_id (fk, UNIQUE, nullable)
company_name, industry, cac_number
contact_name, contact_email (UNIQUE), contact_phone
created_at, updated_at
```

**`jobs`** (Phase 2 browsing)
```sql
id (pk), employer_id (fk)
title, description, location
is_public (boolean)
created_at, updated_at
```

**`applications`** (Phase 2)
```sql
id (pk), candidate_id (fk), job_id (fk)
stage (enum: applied, screening, interview, offer, placed, rejected)
notes, created_at, updated_at
UNIQUE (candidate_id, job_id)
```

**`staffing_requests`** (Phase 1 leads, Phase 4 employer)
```sql
id (pk), employer_id (fk)
roles_needed, quantity, timeline
status (enum: new, in_progress, shortlisted, closed)
created_at, updated_at
```

**`deployed_staff`** (Phase 5)
```sql
id (pk), candidate_id (fk), employer_id (fk), request_id (fk)
start_date, status
created_at, updated_at
```

**`invoices`** (Phase 6)
```sql
id (pk), employer_id (fk)
amount, paystack_ref, status (enum: draft, due, paid, overdue)
created_at, updated_at
```

#### Row-Level Security (RLS)

Every table has explicit policies:
- **Users see their own data** (profile_id = auth.uid())
- **Admins see everything** (via `is_admin()` function)
- **Public data readable by all** (e.g., `jobs.is_public = true`)
- **Unauthenticated leads can create staffing requests**

The `is_admin()` function uses `SECURITY DEFINER` to prevent infinite RLS recursion.

#### Storage

**`cvs` bucket** (public)
- Upload: `cvs/{profile_id}/filename.pdf`
- Policies:
  - Upload only to own folder
  - Replace/update own files
  - Public read (for admin/employer access)
  - Own delete (to replace old CVs)

---

## Recent Fixes & Rebuild

### Phase 2 Debugging Issues

During Phase 2 testing, several critical bugs were discovered and fixed:

#### Bug 1: RLS Infinite Recursion
**Problem:** RLS policy checking `is_admin()` would trigger the same policy again, causing infinite loops.  
**Fix:** Created `is_admin()` function with `SECURITY DEFINER` flag, bypassing RLS.  
**Proof:** Verified in schema - all policies now use `is_admin()` without recursion.

#### Bug 2: Missing INSERT Policies
**Problem:** Some tables lacked explicit INSERT policies, blocking profile/candidate creation.  
**Fix:** Every table now has complete CRUD policies (SELECT, INSERT, UPDATE, DELETE).  
**Proof:** 0001_baseline.sql shows all policies explicitly.

#### Bug 3: Duplicate Rows
**Problem:** Users signing up twice or retrying would create duplicate profile/candidate rows, breaking `.single()` queries (PGRST116 error).  
**Root Cause:** Plain `.insert()` without duplicate checks + no database constraints.  
**Fix:**
- Added UNIQUE constraints at database level
- Changed all `.insert()` to `.upsert(..., { onConflict: 'profile_id' })`
- Changed all `.single()` to `.maybeSingle()` to handle 0-row cases
- Added graceful error handling for code 23505 (duplicate key violations)

#### Bug 4: Storage Upload Failures
**Problem:** CV uploads were failing silently.  
**Fix:** Created `cvs` bucket and explicit storage policies with correct folder-based path patterns.

### Schema Rebuild

**Date:** August 5, 2026

**What Changed:**
- Rebuilt from scratch in clean Supabase database
- Applied all bug fixes permanently (constraints, policies, functions)
- Pre-built tables for future phases (no schema migrations needed)
- Verified against app code (all `.single()` → `.maybeSingle()`, etc.)

**Files:**
- `supabase/migrations/0001_baseline.sql` - Safe, complete schema (for deployment)
- `docs/dangerous_full_reset.sql` - Destructive reset (manual use only)

**Code Updates (12 changes across 7 files):**
- Replaced 12 `.single()` calls with `.maybeSingle()` across candidate portal
- Confirmed upsert operations in signup, OAuth, employer request form
- Verified unique constraint error handling in job apply buttons
- Full error logging in place (raw objects, no assumptions)

---

## Deployment & Testing

### Environment Setup

**Required .env variables:**
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or production domain
```

**Local Development:**
```bash
npm install
npm run dev  # Runs on http://localhost:3000
```

**Build & Deploy:**
```bash
npm run build
npm start
```

### Testing Checklist

#### Quick Smoke Test (5 min)
- [ ] Homepage loads
- [ ] Public pages accessible
- [ ] Employer request form submits

#### Fresh Candidate Flow (20 min)
- [ ] Signup with new email → confirmation email received
- [ ] Email click redirects to onboarding
- [ ] Complete all 5 steps (including CV upload)
- [ ] Logout & login → lands on dashboard (not onboarding)
- [ ] Profile shows uploaded data
- [ ] Browse jobs, view job detail, apply to job
- [ ] Application appears in applications list

#### Duplicate Prevention
- [ ] Double-click submit button → no duplicates or errors
- [ ] Refresh mid-flow → recovers gracefully
- [ ] Repeat login 3 times → no new rows created

#### Google OAuth
- [ ] Click "Continue with Google"
- [ ] Authenticate with Google account
- [ ] Redirects to onboarding
- [ ] Complete onboarding
- [ ] Logout & re-login → dashboard (not onboarding)

#### Employer Lead Form
- [ ] Submit `/employers/request` form → success
- [ ] Submit again with same email → succeeds (updates employer, new request)
- [ ] Database shows 1 employer row, 2 staffing requests

### Database Verification

After testing, run these queries to confirm no duplicates and correct constraints:

```sql
-- Check no duplicate candidates
SELECT profile_id, COUNT(*) FROM candidates 
GROUP BY profile_id HAVING COUNT(*) > 1;
-- Expected: 0 rows

-- Check unique constraints exist
SELECT conname FROM pg_constraint 
WHERE contype = 'u' AND conrelid::regclass::text IN ('candidates','employers','applications');
-- Expected: candidates_profile_id_key, employers_profile_id_key, 
--           employers_contact_email_key, applications_candidate_id_job_id_key
```

### Console Logs

All operations log with prefixes for easy debugging:
- `[Signup]` - Signup flow logs
- `[Login]` - Login flow logs
- `[Onboarding]` - Onboarding page logs
- `[OAuth Callback]` - OAuth callback logs
- `[StaffingRequest]` - Employer request form logs

All errors log the full error object:
```javascript
console.error('[Label]', error)
console.error('[Label] stringified:', JSON.stringify(error, null, 2))
```

---

## Key Files & Responsibilities

### Pages & Routes

| Path | File | Purpose |
|------|------|---------|
| `/` | `src/app/page.tsx` | Homepage |
| `/about` | `src/app/about/page.tsx` | About page |
| `/employers` | `src/app/employers/page.tsx` | Employer landing |
| `/employers/request` | `src/app/employers/request/page.tsx` | Lead capture form |
| `/candidate/signup` | `src/app/candidate/signup/page.tsx` | Email signup |
| `/candidate/login` | `src/app/candidate/login/page.tsx` | Email login |
| `/auth/callback` | `src/app/auth/callback/route.ts` | OAuth callback |
| `/candidate/onboarding` | `src/app/candidate/onboarding/page.tsx` | Profile setup (5 steps) |
| `/candidate/dashboard` | `src/app/candidate/dashboard/page.tsx` | Main hub |
| `/candidate/jobs` | `src/app/candidate/jobs/page.tsx` | Job list |
| `/candidate/jobs/[jobId]` | `src/app/candidate/jobs/[jobId]/page.tsx` | Job detail + apply |
| `/candidate/applications` | `src/app/candidate/applications/page.tsx` | Applications list |

### Server Actions & API Routes

| File | Purpose |
|------|---------|
| `src/app/employers/request/actions.ts` | Staffing request submission |
| `src/app/auth/callback/route.ts` | OAuth callback handler |

### Utilities

| File | Purpose |
|------|---------|
| `src/lib/supabase/client.ts` | Client-side Supabase instance |
| `src/lib/supabase/server.ts` | Server-side Supabase instance |

---

## Summary

**ASODS** is a modern staffing platform connecting African talent with global employers. The application is built in phases:

- **Phase 1 ✅** - Public site + employer lead capture (`/employers/request` form)
- **Phase 2 ✅** - Candidate portal with full signup → onboarding → job browsing → applications workflow
- **Phase 3-6 🔲** - Planned (admin dashboard, employer portal, deployed staff, invoicing)

**Current State:** Production-ready with rebuilt schema, all critical bugs fixed, comprehensive testing procedures documented.

**To Deploy:**
1. Set environment variables
2. Run `supabase db push` to apply schema
3. Deploy to Vercel
4. Test with fresh signup flow end-to-end
5. Verify zero duplicates in database

**Technology:** Next.js 14 + Supabase + TypeScript + Tailwind CSS.

All code is clean, well-structured, and ready for team handoff.
