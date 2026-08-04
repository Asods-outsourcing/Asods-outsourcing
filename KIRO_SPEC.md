# ASODS Outsourcing Limited — Build Spec for Kiro

## Project summary

ASODS Outsourcing Limited is a Nigerian HR outsourcing and recruitment company (Lagos).
This repo is a Next.js platform with three authenticated portals sitting on a shared
Supabase backend, plus a public marketing site. Full business context is in
`docs/BUSINESS_PLAN.md` — read it for tone, services, and target industries.

**Differentiation this platform must deliver** (this is the actual product thesis, not
just a feature list): competitors in this market make clients and candidates wait and
hope, with no visibility after submitting a form. ASODS's edge is real-time visibility —
clients watch their staffing request move through the pipeline, candidates see their
application status live. Every screen should reinforce "you can see it happening,"
not "submit and wait."

## Stack

- Next.js 15 (App Router), TypeScript
- Tailwind CSS v4
- Supabase (Auth, Postgres, Storage, Realtime) — schema already scaffolded in
  `supabase/migrations/0001_init.sql`, apply it first
- Paystack for invoicing/payments
- Deploy target: Vercel

## Non-technical admin operator — critical constraint

The admin side will be used daily by a non-technical recruiter/ops person, not a
developer. This changes UI decisions, not just copy:

- Organize admin nav by task ("New requests", "Candidates", "Clients", "Placed staff"),
  never by technical system name ("ATS", "CRM").
- Candidate pipeline is a drag-and-drop kanban board (New → Shortlisted → Interviewing
  → Placed → Not selected), not a filterable data table.
- Every action is a labeled button with a plain verb: "Shortlist", "Send to client",
  "Mark placed" — never "Update status".
- Show a confirmation message after every action (e.g. "Candidate shortlisted — client
  will be notified").
- Role-based nav: a recruiter only sees Home/Requests/Candidates. A finance-access user
  only sees Home/Invoices. Don't show nav items irrelevant to the logged-in person's
  `admin_access` array (see `profiles.admin_access` in the schema).
- The admin home screen (`/admin/home`) is a "what needs your attention today" feed —
  new requests, candidates awaiting review, interviews today — never a KPI/chart
  dashboard as the landing view.

## Site map

### 1. Public site (no auth)
```
/                    Home
/about               Company overview, vision/mission/values
/services            Recruitment, outsourcing, payroll, training, consulting, verification
/industries           Banking, fintech, telecom, manufacturing, logistics, retail, healthcare
/careers              Public job listings (reads from `jobs` where is_public = true)
/careers/[jobId]      Job detail + apply CTA -> candidate auth
/employers            Employer pitch page
/employers/request    Public lead-capture staffing request form (no login required) —
                       this is the single highest-priority conversion page, keep it short:
                       company name, roles needed, quantity, timeline, contact info
/contact
/privacy-policy
/faq
```

### 2. Candidate portal (`/candidate/*`, role = candidate)
```
/candidate/signup, /candidate/login
/candidate/onboarding       Profile wizard: bio, skills, CV upload to Supabase Storage
/candidate/dashboard        Application status overview
/candidate/profile
/candidate/jobs             Browse/search open roles
/candidate/applications     List with live stage (uses `applications.stage`)
/candidate/applications/[id]
/candidate/documents
/candidate/settings
```

### 3. Employer portal (`/employer/*`, role = employer)
```
/employer/signup, /employer/login
/employer/onboarding         Company profile (name, industry, CAC number)
/employer/dashboard          Active requests, deployed staff count, invoices due
/employer/staffing-requests
/employer/staffing-requests/new
/employer/staffing-requests/[id]   Live status + shortlisted candidates
/employer/deployed-staff
/employer/deployed-staff/[id]
/employer/billing            Invoices + Paystack payment history
/employer/billing/pay/[invoiceId]
/employer/settings
```

### 4. Admin dashboard (`/admin/*`, role = admin — see constraint above)
```
/admin/login
/admin/home                  Today's tasks feed (default landing view)
/admin/requests               List of staffing requests awaiting action
/admin/requests/[id]          -> buttons: "Find candidates", "Send shortlist to client"
/admin/candidates             Kanban board by stage
/admin/candidates/[id]        Profile + notes -> "Shortlist" / "Schedule interview" / "Mark placed"
/admin/clients
/admin/clients/[id]
/admin/placed-staff
/admin/placed-staff/[id]      -> "Flag for replacement"
/admin/invoices                Only visible if 'invoices' in admin_access
/admin/team                    Super admin only — toggle each staff member's admin_access
/admin/settings
```

## Database

Schema is in `supabase/migrations/0001_init.sql` — apply this first via
`supabase db push` or the SQL editor. It includes:
- Tables: `profiles`, `employers`, `candidates`, `jobs`, `applications`,
  `staffing_requests`, `deployed_staff`, `invoices`
- Row Level Security already enabled and scoped: candidates/employers see only their
  own rows, admins see everything, public job listings are readable by anyone.
- Do not disable RLS. Do not use the service role key on the client — only in server
  actions/route handlers that need to bypass RLS deliberately (e.g. admin bulk actions).

## Design system

Brand assets: navy `#0D1B2A`, gold `#D4AF37`, charcoal `#333333`, off-white `#F1F2F6`.
Font: Montserrat. Logo and full brand guide are in `docs/BRAND_GUIDE.png` — follow it
for the public site and portal headers. Keep portal interiors clean and functional
(this is a work tool, not a marketing surface) but carry the navy/gold accent through
buttons, active nav states, and status pills.

## Build order (do not reorder — each phase depends on the last)

1. Public site + `/employers/request` lead form — ship first for client-facing credibility.
2. Candidate signup + job browsing + apply flow.
3. Admin: Requests + Candidates kanban — needed to actually process applicants from
   step 2. Build the non-technical-friendly UI from the start, not as a later pass.
4. Employer portal: staffing requests + candidate review.
5. Deployed staff tracking + admin Clients view.
6. Paystack invoicing — last, most compliance-sensitive, least urgent for early
   credibility.

## Environment

Copy `.env.local.example` to `.env.local` and fill in Supabase + Paystack keys before
running `npm run dev`.

## Reference docs in this repo

- `docs/BUSINESS_PLAN.md` — full ASODS business plan (services, market, financials)
- `docs/BRAND_GUIDE.png` — logo, color palette, typography, brand values
- `docs/ARCHITECTURE.md` — extended route map and Supabase table notes
