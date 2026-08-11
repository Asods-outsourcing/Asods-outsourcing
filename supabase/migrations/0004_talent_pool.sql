-- ============================================================================
-- TALENT POOL — public, no-login registration form submissions
-- ============================================================================
-- Design approach: core fields admin will actually filter/sort/search by are
-- real columns. The long-tail detailed responses (screening answers,
-- role-specific assessment answers, certifications list, etc.) are stored as
-- JSONB so we don't end up with a 50+ column table that's painful to
-- maintain. Admin UI can still display all of it, just reads from the JSONB
-- blob for the less-frequently-filtered fields.

create type candidate_tier as enum ('A', 'B', 'C', 'inactive', 'unrated');
create type talent_pool_status as enum ('new', 'reviewing', 'contacted', 'placed', 'inactive');

create table talent_pool_submissions (
  id uuid primary key default gen_random_uuid(),

  -- Page 1: Personal Information
  full_name text not null,
  email text not null,
  phone text not null,
  state_of_residence text not null,
  city_lga text not null,
  preferred_contact_method text not null,

  -- Page 2: Education
  highest_education text not null,
  field_of_study text not null,
  institution text not null,
  graduation_year text not null,
  has_certifications boolean not null default false,

  -- Page 4/5: Work Experience
  employment_status text not null,
  current_job_title text,
  current_company text,
  current_industry text,
  years_in_role text,

  -- Page 6: Skills
  digital_literacy_rating int,

  -- Page 7: Job Preferences
  preferred_roles text[],
  work_arrangement text[],
  employment_type text[],
  preferred_location text,
  willing_to_relocate text,

  -- Page 8: Availability & Compensation
  availability text,
  salary_expectation text,
  willing_to_train text,

  -- Page 10: which role-specific assessment track they took
  assessment_track text,

  -- File uploads (Supabase Storage URLs)
  cv_url text,
  certificate_urls text[],

  -- Page 15
  referral_source text,
  referral_name text,

  -- Everything else long-tail: certifications list, work responsibilities,
  -- achievements, skills checkboxes, screening paragraph answers,
  -- role-specific assessment answers, references — stored as structured JSON
  -- so the table doesn't need 40 more columns.
  detailed_responses jsonb not null default '{}',

  -- Admin management fields
  tier candidate_tier not null default 'unrated',
  status talent_pool_status not null default 'new',
  admin_notes text,
  last_contacted_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_talent_pool_status on talent_pool_submissions(status);
create index idx_talent_pool_tier on talent_pool_submissions(tier);
create index idx_talent_pool_created_at on talent_pool_submissions(created_at desc);
create index idx_talent_pool_preferred_roles on talent_pool_submissions using gin(preferred_roles);

create trigger trg_talent_pool_updated_at
  before update on talent_pool_submissions
  for each row execute function set_updated_at();

-- ============================================================================
-- RLS: anyone (including anonymous/unauthenticated) can INSERT — this is a
-- public form with no login required. Only admins can SELECT/UPDATE/DELETE.
-- ============================================================================
alter table talent_pool_submissions enable row level security;

create policy "talent_pool_public_insert" on talent_pool_submissions
  for insert with check (true);

create policy "talent_pool_admin_select" on talent_pool_submissions
  for select using (is_admin());

create policy "talent_pool_admin_update" on talent_pool_submissions
  for update using (is_admin());

create policy "talent_pool_admin_delete" on talent_pool_submissions
  for delete using (is_admin());

-- ============================================================================
-- STORAGE: bucket for talent pool CVs/certificates (separate from the
-- existing candidate portal's "cvs" bucket, since these are unauthenticated
-- public submissions, not logged-in candidate accounts)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('talent-pool-files', 'talent-pool-files', true)
on conflict (id) do nothing;

-- Anyone (including anonymous) can upload — this is a public form
create policy "talent_pool_files_public_insert"
on storage.objects for insert
to public
with check (bucket_id = 'talent-pool-files');

-- Public read (needed so admin can view/download the files via URL)
create policy "talent_pool_files_public_read"
on storage.objects for select
to public
using (bucket_id = 'talent-pool-files');

-- No public update/delete — once submitted, a file shouldn't be alterable
-- by anyone other than an admin acting through the service role if needed.
