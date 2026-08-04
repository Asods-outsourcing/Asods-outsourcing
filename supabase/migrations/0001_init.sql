-- ASODS initial schema
-- Run via: supabase db push (or paste into Supabase SQL editor)

create type user_role as enum ('candidate', 'employer', 'admin');
create type application_stage as enum ('applied', 'screening', 'interview', 'offer', 'placed', 'rejected');
create type request_status as enum ('new', 'in_progress', 'shortlisted', 'closed');
create type invoice_status as enum ('draft', 'due', 'paid', 'overdue');

-- Profiles extend Supabase auth.users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  full_name text,
  email text,
  admin_access text[] default '{}', -- e.g. {requests,candidates}
  created_at timestamptz default now()
);

create table employers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete set null,
  contact_email text not null unique,
  company_name text not null,
  industry text,
  cac_number text,
  contact_phone text,
  created_at timestamptz default now()
);

create table candidates (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  bio text,
  skills text[],
  cv_url text,
  created_at timestamptz default now()
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid references employers(id) on delete cascade,
  title text not null,
  description text,
  location text,
  is_public boolean default true,
  created_at timestamptz default now()
);

create table applications (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidates(id) on delete cascade,
  job_id uuid references jobs(id) on delete cascade,
  stage application_stage default 'applied',
  notes text,
  created_at timestamptz default now()
);

create table staffing_requests (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid references employers(id) on delete cascade,
  roles_needed text not null,
  quantity int not null,
  timeline text,
  status request_status default 'new',
  created_at timestamptz default now()
);

create table deployed_staff (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidates(id),
  employer_id uuid references employers(id),
  request_id uuid references staffing_requests(id),
  start_date date,
  status text default 'active',
  created_at timestamptz default now()
);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid references employers(id) on delete cascade,
  amount numeric not null,
  paystack_ref text,
  status invoice_status default 'draft',
  created_at timestamptz default now()
);

-- Index on contact_email for fast lead lookups
create unique index idx_employers_contact_email on employers(contact_email);

-- Row Level Security
alter table profiles enable row level security;
alter table employers enable row level security;
alter table candidates enable row level security;
alter table jobs enable row level security;
alter table applications enable row level security;
alter table staffing_requests enable row level security;
alter table deployed_staff enable row level security;
alter table invoices enable row level security;

-- Profiles: users see only their own row; admins see all
create policy "profiles_self_select" on profiles for select using (auth.uid() = id);
create policy "profiles_admin_all_select" on profiles for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
-- Profiles: users can create their own profile during signup
create policy "profiles_insert_self" on profiles for insert with check (auth.uid() = id);
-- Profiles: users can update their own profile
create policy "profiles_update_self" on profiles for update using (auth.uid() = id);

-- Candidates: own data only, admins see all
create policy "candidates_select_self" on candidates for select using (
  profile_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "candidates_insert_self" on candidates for insert with check (profile_id = auth.uid());
create policy "candidates_update_self" on candidates for update using (
  profile_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "candidates_delete_self" on candidates for delete using (
  profile_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Employers: own company only, admins see all
create policy "employers_select_self" on employers for select using (
  profile_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "employers_insert_self" on employers for insert with check (
  profile_id is null or profile_id = auth.uid()
);
create policy "employers_update_self" on employers for update using (
  profile_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "employers_delete_self" on employers for delete using (
  profile_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Jobs: public jobs readable by anyone, full access for owning employer + admin
create policy "jobs_public_read" on jobs for select using (is_public = true);
create policy "jobs_owner_read" on jobs for select using (
  employer_id in (select id from employers where profile_id = auth.uid())
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "jobs_owner_insert" on jobs for insert with check (
  employer_id in (select id from employers where profile_id = auth.uid())
);
create policy "jobs_owner_update" on jobs for update using (
  employer_id in (select id from employers where profile_id = auth.uid())
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "jobs_owner_delete" on jobs for delete using (
  employer_id in (select id from employers where profile_id = auth.uid())
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Applications: candidate sees own, admin sees all
create policy "applications_select_self" on applications for select using (
  candidate_id in (select id from candidates where profile_id = auth.uid())
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "applications_insert_self" on applications for insert with check (
  candidate_id in (select id from candidates where profile_id = auth.uid())
);
create policy "applications_update_self" on applications for update using (
  candidate_id in (select id from candidates where profile_id = auth.uid())
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "applications_delete_self" on applications for delete using (
  candidate_id in (select id from candidates where profile_id = auth.uid())
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Staffing requests: employer sees own, admin sees all
create policy "requests_select_self" on staffing_requests for select using (
  employer_id in (select id from employers where profile_id = auth.uid())
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "requests_insert_self" on staffing_requests for insert with check (
  employer_id in (select id from employers where profile_id = auth.uid())
);
create policy "requests_update_self" on staffing_requests for update using (
  employer_id in (select id from employers where profile_id = auth.uid())
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "requests_delete_self" on staffing_requests for delete using (
  employer_id in (select id from employers where profile_id = auth.uid())
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Deployed staff: relevant employer + admin can read, admin can write
create policy "deployed_staff_select" on deployed_staff for select using (
  employer_id in (select id from employers where profile_id = auth.uid())
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "deployed_staff_insert" on deployed_staff for insert with check (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "deployed_staff_update" on deployed_staff for update using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "deployed_staff_delete" on deployed_staff for delete using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Invoices: relevant employer + admin can read, admin can write
create policy "invoices_select" on invoices for select using (
  employer_id in (select id from employers where profile_id = auth.uid())
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "invoices_insert" on invoices for insert with check (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "invoices_update" on invoices for update using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "invoices_delete" on invoices for delete using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
