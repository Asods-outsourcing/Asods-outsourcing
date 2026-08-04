# ASODS Outsourcing — Site Architecture & Route Map

Stack assumption: Next.js (App Router) + TypeScript + Supabase (Auth, Postgres, Storage, Realtime) + Tailwind + Paystack + Vercel.

---

## 1. Public marketing site (unauthenticated)

```
/                          Home
/about                     Company overview, vision/mission, values
/services                  Recruitment, outsourcing, payroll, training, consulting, verification
/industries                Banking, fintech, telecom, manufacturing, logistics, retail, healthcare
/why-asods                 Competitive advantage / differentiation
/careers                   Public job listings (pulls from candidate portal DB)
/careers/[jobId]           Single job detail + "Apply" CTA (routes into candidate auth)
/employers                 Employer-facing pitch page + "Request staff" CTA
/employers/request         Public staffing request form (lead capture, no login required)
/blog                      HR/career insights (optional CMS-backed)
/blog/[slug]
/contact
/privacy-policy
/faq
```

Notes:
- `/employers/request` is the single most important conversion page — this is where a bank's HR manager submits a staffing need. Keep it short (company, role, number needed, timeline, contact) then route to a full onboarding call/proposal flow, not a hard signup wall.
- `/careers` should be public-readable but "Apply" triggers Supabase Auth (magic link or Paystack-free candidate signup).

---

## 2. Candidate portal (`/candidate/*`, authenticated)

```
/candidate/signup                 Register (email, phone, Supabase Auth)
/candidate/login
/candidate/onboarding             Profile setup wizard (bio, skills, CV upload)
/candidate/dashboard              Application status overview
/candidate/profile                Edit profile, CV, portfolio links
/candidate/jobs                   Browse/search open roles
/candidate/jobs/[jobId]
/candidate/applications           List of applications + status (applied, screening, interview, offer, rejected)
/candidate/applications/[id]      Detail + timeline
/candidate/documents              CV, certificates, ID uploads (Supabase Storage)
/candidate/interviews             Scheduled interview slots
/candidate/settings
```

Key data candidates own: profile, CV/documents, applications, interview slots.

---

## 3. Employer portal (`/employer/*`, authenticated — B2B clients)

```
/employer/signup                  Company registration + KYC-lite (CAC number, industry)
/employer/login
/employer/onboarding              Company profile setup
/employer/dashboard               Active requests, deployed staff count, invoices due
/employer/staffing-requests        List of submitted requests
/employer/staffing-requests/new   Create new request (roles, qty, location, salary range, timeline)
/employer/staffing-requests/[id]  Status + shortlisted candidates for review
/employer/candidates/[id]         View candidate profile (redacted contact until approved)
/employer/deployed-staff          Employees currently placed with this client
/employer/deployed-staff/[id]     Performance notes, attendance, replacement request
/employer/billing                 Invoices, payment history (Paystack)
/employer/billing/pay/[invoiceId] Paystack checkout
/employer/contracts               Signed service agreements (PDF)
/employer/support                 Ticket/contact account manager
/employer/settings
```

Key data employers own: company profile, staffing requests, contracts, invoices.

---

## 4. Admin dashboard (`/admin/*`, internal staff only — role-gated)

**Design principle: this will be operated by non-technical staff (e.g. a recruiter or ops person), not a developer.** So instead of organizing by technical system (ATS/CRM/payroll), the nav is organized by daily task, uses plain verbs, kanban boards instead of filterable tables, and hides anything irrelevant to that person's role.

```
/admin/login
/admin/home                       "What needs your attention today" — new requests, candidates
                                   awaiting review, interviews today. Not a KPI dashboard.

# New requests (what clients are asking for)
/admin/requests                   List of staffing requests waiting on action, newest first
/admin/requests/[id]              One request: who needs what, by when
                                   -> button: "Find candidates" / "Send shortlist to client"

# Candidates (one simple board, not separate ATS pages)
/admin/candidates                 Kanban board: New → Shortlisted → Interviewing → Placed → Not selected
                                   Drag a card to move stage. Click a card for full profile.
/admin/candidates/[id]            Profile, CV, notes box
                                   -> buttons: "Shortlist", "Schedule interview", "Mark placed"

# Clients (one simple list, not "CRM")
/admin/clients                    List of companies ASODS works with
/admin/clients/[id]               Contact info, their open requests, their placed staff
                                   -> button: "Log a call/note"

# Placed staff (who's working where right now)
/admin/placed-staff                Simple list: candidate, client, start date, status (fine / needs attention)
/admin/placed-staff/[id]           -> button: "Flag for replacement"

# Payments (only shown to staff with finance access)
/admin/invoices                    List of client invoices with a big status pill: Paid / Due / Overdue
                                    -> button: "Send invoice" (auto-generates Paystack link)

# System (super admin only)
/admin/team                        Internal staff accounts — toggle what each person can see
/admin/settings
```

Role-based visibility: a recruiter logs in and sees only Home, Requests, Candidates. A finance person sees Home, Invoices. Nothing is hidden for security reasons alone — it's hidden so the interface never shows a menu item that isn't their job, which is the biggest source of "I don't know what this button does" confusion for non-technical users.

---

## 5. Shared/core Supabase tables (high level)

```
users                 (Supabase auth.users + profile extension: role = candidate|employer|admin)
candidates            (profile, skills, cv_url, status)
employers             (company_name, industry, cac_number, contact)
jobs                  (title, employer_id, description, status)
applications          (candidate_id, job_id, stage, notes)
staffing_requests     (employer_id, roles_needed, qty, timeline, status)
deployed_staff        (candidate_id, employer_id, request_id, start_date, status)
contracts             (employer_id, file_url, signed_at)
invoices              (employer_id, amount, paystack_ref, status)
interviews            (application_id, scheduled_at, mode)
training_programs     (title, description)
training_enrollments  (candidate_id, program_id, status)
verification_requests (candidate_id, type, status, result)
notes                 (polymorphic: attached to candidate/employer/deployed_staff)
```

Row-Level Security is critical here: candidates only see their own rows, employers only see their own requests/staff, admins see everything — enforce via Supabase RLS policies keyed on `auth.uid()` and a `role` claim.

---

## 6. Build sequencing recommendation

Given this is a big scope, a sane MVP order:

1. Public site + `/employers/request` lead form (get you client-facing credibility fast)
2. Candidate signup + job browsing + apply flow
3. Admin ATS (candidates, jobs, pipeline) — you need this to actually process the applicants from step 2
4. Employer portal (staffing requests, candidate review)
5. Deployed staff tracking + admin CRM
6. Payroll + invoicing (Paystack) — last because it's the most compliance-sensitive and least urgent for early credibility
