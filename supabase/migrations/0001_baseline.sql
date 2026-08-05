-- ============================================================================
-- ASODS OUTSOURCING — COMPLETE SCHEMA BASELINE
-- ============================================================================
-- This is the canonical schema for the ASODS platform. It covers Phase 1
-- (public site + leads), Phase 2 (candidate portal), and pre-builds tables
-- for Phases 3–6 so future development never requires schema restructuring.
--
-- Safe to run against a fresh database environment. Do NOT include destructive
-- drop statements here — they belong in a separate dangerous_full_reset.sql
-- script meant only for manual database resets, never for deployment.
--
-- Every bug found during Phase 2 debugging has a specific fix baked in:
--   1. RLS infinite recursion        → is_admin() security definer function
--   2. Missing INSERT policies       → every table has explicit CRUD policies
--   3. Duplicate candidate/employer  → UNIQUE constraints on profile_id
--   4. Storage upload/read failures  → storage bucket + policies here
-- ============================================================================


-- ============================================================================
-- STEP 1: TYPES
-- ============================================================================
create type if not exists user_role as enum ('candidate', 'employer', 'admin');
create type if not exists application_stage as enum ('applied', 'screening', 'interview', 'offer', 'placed', 'rejected');
create type if not exists request_status as enum ('new', 'in_progress', 'shortlisted', 'closed');
create type if not exists invoice_status as enum ('draft', 'due', 'paid', 'overdue');


-- ============================================================================
-- STEP 2: TABLES
-- ============================================================================

-- Profiles extend Supabase auth.users. One profile per auth user, enforced.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'candidate',
  full_name text,
  email text,
  admin_access text[] default '{}',  -- e.g. {requests,candidates} for Phase 3
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Employers: nullable profile_id supports unauthenticated leads captured via
-- the public /employers/request form (Phase 1), before they ever sign up.
-- contact_email is the interim identity key for those leads.
create table if not exists employers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references profiles(id) on delete set null,
  company_name text not null,
  industry text,
  cac_number text,
  contact_name text,
  contact_email text unique,
  contact_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Candidates: UNIQUE on profile_id makes duplicate rows a database-level
-- impossibility (this was today's core bug — one profile, one candidate row).
create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  bio text,
  skills text[] default '{}',
  cv_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid references employers(id) on delete cascade,
  title text not null,
  description text,
  location text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- UNIQUE on (candidate_id, job_id) prevents duplicate applications at the
-- database level, not just client-side "Already Applied" UI logic.
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  stage application_stage not null default 'applied',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (candidate_id, job_id)
);

create table if not exists staffing_requests (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references employers(id) on delete cascade,
  roles_needed text not null,
  quantity int not null default 1,
  timeline text,
  status request_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Phase 5 table, pre-built now so the schema never needs restructuring later.
create table if not exists deployed_staff (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidates(id) on delete set null,
  employer_id uuid references employers(id) on delete set null,
  request_id uuid references staffing_requests(id) on delete set null,
  start_date date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Phase 6 table, pre-built now for the same reason.
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references employers(id) on delete cascade,
  amount numeric not null,
  paystack_ref text,
  status invoice_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_candidates_profile_id on candidates(profile_id);
create index if not exists idx_employers_profile_id on employers(profile_id);
create index if not exists idx_jobs_employer_id on jobs(employer_id);
create index if not exists idx_jobs_is_public on jobs(is_public);
create index if not exists idx_applications_candidate_id on applications(candidate_id);
create index if not exists idx_applications_job_id on applications(job_id);
create index if not exists idx_staffing_requests_employer_id on staffing_requests(employer_id);
create index if not exists idx_deployed_staff_employer_id on deployed_staff(employer_id);
create index if not exists idx_invoices_employer_id on invoices(employer_id);


-- ============================================================================
-- STEP 3: HELPER FUNCTION (fixes the recursion bug for good)
-- ============================================================================
-- security definer means this function runs with elevated privileges and
-- bypasses RLS internally, so checking "is this user an admin" never
-- re-triggers the RLS policy on `profiles` that's asking the same question.
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;


-- ============================================================================
-- STEP 4: updated_at AUTO-UPDATE TRIGGER (small quality-of-life addition)
-- ============================================================================
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger if not exists trg_profiles_updated_at before update on profiles
  for each row execute function set_updated_at();
create trigger if not exists trg_employers_updated_at before update on employers
  for each row execute function set_updated_at();
create trigger if not exists trg_candidates_updated_at before update on candidates
  for each row execute function set_updated_at();
create trigger if not exists trg_jobs_updated_at before update on jobs
  for each row execute function set_updated_at();
create trigger if not exists trg_applications_updated_at before update on applications
  for each row execute function set_updated_at();
create trigger if not exists trg_staffing_requests_updated_at before update on staffing_requests
  for each row execute function set_updated_at();
create trigger if not exists trg_deployed_staff_updated_at before update on deployed_staff
  for each row execute function set_updated_at();
create trigger if not exists trg_invoices_updated_at before update on invoices
  for each row execute function set_updated_at();


-- ============================================================================
-- STEP 5: ENABLE RLS ON EVERYTHING
-- ============================================================================
alter table profiles enable row level security;
alter table employers enable row level security;
alter table candidates enable row level security;
alter table jobs enable row level security;
alter table applications enable row level security;
alter table staffing_requests enable row level security;
alter table deployed_staff enable row level security;
alter table invoices enable row level security;


-- ============================================================================
-- STEP 6: POLICIES — every table gets explicit SELECT/INSERT/UPDATE/DELETE.
-- No table relies on an implicit "for all" catch-all with a missing clause.
-- ============================================================================

-- PROFILES
create policy if not exists "profiles_select_self_or_admin" on profiles
  for select using (auth.uid() = id or is_admin());
create policy if not exists "profiles_insert_self" on profiles
  for insert with check (auth.uid() = id);
create policy if not exists "profiles_update_self_or_admin" on profiles
  for update using (auth.uid() = id or is_admin());
-- Deliberately no DELETE policy on profiles — deleting an auth user cascades
-- automatically; nobody should delete just the profile row directly.

-- EMPLOYERS
create policy if not exists "employers_select_self_or_admin" on employers
  for select using (profile_id = auth.uid() or is_admin());
create policy if not exists "employers_insert_self_or_lead" on employers
  for insert with check (
    profile_id = auth.uid()      -- authenticated employer creating their own record
    or profile_id is null        -- unauthenticated lead via /employers/request
    or is_admin()
  );
create policy if not exists "employers_update_self_or_admin" on employers
  for update using (profile_id = auth.uid() or is_admin());
create policy if not exists "employers_delete_admin_only" on employers
  for delete using (is_admin());

-- CANDIDATES
create policy if not exists "candidates_select_self_or_admin" on candidates
  for select using (profile_id = auth.uid() or is_admin());
create policy if not exists "candidates_insert_self" on candidates
  for insert with check (profile_id = auth.uid());
create policy if not exists "candidates_update_self_or_admin" on candidates
  for update using (profile_id = auth.uid() or is_admin());
create policy if not exists "candidates_delete_admin_only" on candidates
  for delete using (is_admin());

-- JOBS
create policy if not exists "jobs_select_public_or_owner_or_admin" on jobs
  for select using (
    is_public = true
    or employer_id in (select id from employers where profile_id = auth.uid())
    or is_admin()
  );
create policy if not exists "jobs_insert_owner_or_admin" on jobs
  for insert with check (
    employer_id in (select id from employers where profile_id = auth.uid())
    or is_admin()
  );
create policy if not exists "jobs_update_owner_or_admin" on jobs
  for update using (
    employer_id in (select id from employers where profile_id = auth.uid())
    or is_admin()
  );
create policy if not exists "jobs_delete_owner_or_admin" on jobs
  for delete using (
    employer_id in (select id from employers where profile_id = auth.uid())
    or is_admin()
  );

-- APPLICATIONS
create policy if not exists "applications_select_self_or_admin" on applications
  for select using (
    candidate_id in (select id from candidates where profile_id = auth.uid())
    or job_id in (select id from jobs where employer_id in (select id from employers where profile_id = auth.uid()))
    or is_admin()
  );
create policy if not exists "applications_insert_self" on applications
  for insert with check (
    candidate_id in (select id from candidates where profile_id = auth.uid())
  );
create policy if not exists "applications_update_self_or_admin" on applications
  for update using (
    candidate_id in (select id from candidates where profile_id = auth.uid())
    or is_admin()
  );
create policy if not exists "applications_delete_self_or_admin" on applications
  for delete using (
    candidate_id in (select id from candidates where profile_id = auth.uid())
    or is_admin()
  );

-- STAFFING REQUESTS
create policy if not exists "requests_select_self_or_admin" on staffing_requests
  for select using (
    employer_id in (select id from employers where profile_id = auth.uid())
    or is_admin()
  );
create policy if not exists "requests_insert_self_or_lead_or_admin" on staffing_requests
  for insert with check (
    employer_id in (select id from employers where profile_id = auth.uid())
    or employer_id in (select id from employers where profile_id is null) -- lead flow
    or is_admin()
  );
create policy if not exists "requests_update_self_or_admin" on staffing_requests
  for update using (
    employer_id in (select id from employers where profile_id = auth.uid())
    or is_admin()
  );
create policy if not exists "requests_delete_self_or_admin" on staffing_requests
  for delete using (
    employer_id in (select id from employers where profile_id = auth.uid())
    or is_admin()
  );

-- DEPLOYED STAFF (admin-managed; employer can view their own placements)
create policy if not exists "deployed_staff_select_self_or_admin" on deployed_staff
  for select using (
    employer_id in (select id from employers where profile_id = auth.uid())
    or is_admin()
  );
create policy if not exists "deployed_staff_insert_admin_only" on deployed_staff
  for insert with check (is_admin());
create policy if not exists "deployed_staff_update_admin_only" on deployed_staff
  for update using (is_admin());
create policy if not exists "deployed_staff_delete_admin_only" on deployed_staff
  for delete using (is_admin());

-- INVOICES (admin-managed; employer can view their own)
create policy if not exists "invoices_select_self_or_admin" on invoices
  for select using (
    employer_id in (select id from employers where profile_id = auth.uid())
    or is_admin()
  );
create policy if not exists "invoices_insert_admin_only" on invoices
  for insert with check (is_admin());
create policy if not exists "invoices_update_admin_only" on invoices
  for update using (is_admin());
create policy if not exists "invoices_delete_admin_only" on invoices
  for delete using (is_admin());


-- ============================================================================
-- STEP 7: STORAGE — cvs bucket + policies (fixes today's upload bugs)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('cvs', 'cvs', true)
on conflict (id) do nothing;

drop policy if exists "cvs_insert_own" on storage.objects;
drop policy if exists "cvs_update_own" on storage.objects;
drop policy if exists "cvs_select_public" on storage.objects;
drop policy if exists "cvs_delete_own" on storage.objects;

-- Upload only into your own folder: cvs/{auth.uid()}/filename.pdf
create policy "cvs_insert_own"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'cvs' and auth.uid()::text = (storage.foldername(name))[1]
);

-- Replace/update only your own files
create policy "cvs_update_own"
on storage.objects for update
to authenticated
using (
  bucket_id = 'cvs' and auth.uid()::text = (storage.foldername(name))[1]
);

-- Public read so admin/employers can open a candidate's CV via its URL later
create policy "cvs_select_public"
on storage.objects for select
to public
using (bucket_id = 'cvs');

-- Allow a candidate to delete/replace their own old CV
create policy "cvs_delete_own"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'cvs' and auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================================
-- DONE. Schema is ready for application deployment.
-- ============================================================================
