-- ============================================================================
-- TALENT POOL — REBUILD FOR SIMPLIFIED 5-PAGE FORM
-- ============================================================================
-- Replaces the 15-page version entirely. Assumes no real candidate data
-- needs preserving (only test submissions so far) — this is a clean wipe
-- and rebuild, not a column migration.

-- ----------------------------------------------------------------------------
-- STEP 1: Clean wipe of the old version
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "talent_pool_files_public_insert" ON storage.objects;
DROP POLICY IF EXISTS "talent_pool_files_public_read" ON storage.objects;
DROP TABLE IF EXISTS talent_pool_submissions CASCADE;
DROP TYPE IF EXISTS candidate_tier CASCADE;
DROP TYPE IF EXISTS talent_pool_status CASCADE;

-- ----------------------------------------------------------------------------
-- STEP 2: Rebuild types (unchanged — admin tiering/status still applies)
-- ----------------------------------------------------------------------------
create type candidate_tier as enum ('A', 'B', 'C', 'inactive', 'unrated');
create type talent_pool_status as enum ('new', 'reviewing', 'contacted', 'placed', 'inactive');

-- ----------------------------------------------------------------------------
-- STEP 3: New leaner table matching the 5-page form exactly
-- ----------------------------------------------------------------------------
create table talent_pool_submissions (
  id uuid primary key default gen_random_uuid(),

  -- Page 1: Personal Information
  full_name text not null,
  email text not null,
  phone text not null,
  state_of_residence text not null,
  city_lga text not null,
  preferred_contact_method text not null,

  -- Page 2: Education & Experience
  highest_education text not null,
  field_of_study text not null,
  employment_status text not null,
  years_of_experience text not null,
  current_job_title text,
  work_experience_description text not null,

  -- Page 3: Skills & Job Preferences
  roles_of_interest text[] not null default '{}',
  strongest_skills text[] not null default '{}',
  preferred_work_arrangement text not null,
  preferred_employment_type text not null,

  -- Page 4: Availability & Screening
  availability text not null,
  salary_expectation text not null,
  about_yourself text not null,
  strongest_qualities text not null,
  willing_to_train text not null,

  -- Page 5: CV, Consent & Submission
  cv_url text,
  certificate_urls text[] default '{}',
  referral_source text not null,
  declaration_agreed boolean not null default false,
  talent_pool_consent boolean not null default false,

  -- Detailed responses (JSON for flexibility)
  detailed_responses jsonb default '{}',

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
create index idx_talent_pool_roles_of_interest on talent_pool_submissions using gin(roles_of_interest);

create trigger trg_talent_pool_updated_at
  before update on talent_pool_submissions
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- STEP 4: RLS — public insert, admin-only read/write, WITHOUT return data
-- ----------------------------------------------------------------------------
alter table talent_pool_submissions enable row level security;

create policy "talent_pool_public_insert" on talent_pool_submissions
  for insert with check (true);

create policy "talent_pool_admin_select" on talent_pool_submissions
  for select using (is_admin());

create policy "talent_pool_admin_update" on talent_pool_submissions
  for update using (is_admin());

create policy "talent_pool_admin_delete" on talent_pool_submissions
  for delete using (is_admin());

-- Explicit grants — belt-and-suspenders alongside RLS, confirmed necessary
-- from today's debugging.
GRANT INSERT ON talent_pool_submissions TO anon;
GRANT SELECT, UPDATE, DELETE ON talent_pool_submissions TO authenticated;

-- ----------------------------------------------------------------------------
-- STEP 5: Storage bucket + policies (unchanged from before)
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('talent-pool-files', 'talent-pool-files', true)
on conflict (id) do nothing;

create policy "talent_pool_files_public_insert"
on storage.objects for insert
to public
with check (bucket_id = 'talent-pool-files');

create policy "talent_pool_files_public_read"
on storage.objects for select
to public
using (bucket_id = 'talent-pool-files');

-- Force PostgREST to recognize the fresh schema immediately
NOTIFY pgrst, 'reload schema';

-- ----------------------------------------------------------------------------
-- VERIFICATION — run these after
-- ----------------------------------------------------------------------------
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'talent_pool_submissions';
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'talent_pool_submissions';
