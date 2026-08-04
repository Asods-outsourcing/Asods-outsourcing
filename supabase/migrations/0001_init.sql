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
create policy "profiles_self" on profiles for select using (auth.uid() = id);
create policy "profiles_admin_all" on profiles for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Candidates: own data only, admins see all
create policy "candidates_self" on candidates for all using (
  profile_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Employers: own company only, admins see all
create policy "employers_self" on employers for all using (
  profile_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Jobs: public jobs readable by anyone, full access for owning employer + admin
create policy "jobs_public_read" on jobs for select using (is_public = true);
create policy "jobs_owner_write" on jobs for all using (
  employer_id in (select id from employers where profile_id = auth.uid())
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Applications: candidate sees own, admin sees all
create policy "applications_self" on applications for all using (
  candidate_id in (select id from candidates where profile_id = auth.uid())
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Staffing requests: employer sees own, admin sees all
create policy "requests_self" on staffing_requests for all using (
  employer_id in (select id from employers where profile_id = auth.uid())
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Deployed staff: relevant employer + admin
create policy "deployed_staff_visibility" on deployed_staff for select using (
  employer_id in (select id from employers where profile_id = auth.uid())
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Invoices: relevant employer + admin
create policy "invoices_visibility" on invoices for select using (
  employer_id in (select id from employers where profile_id = auth.uid())
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
