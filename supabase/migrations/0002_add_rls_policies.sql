-- Add missing RLS policies for signup and onboarding operations
-- This migration only adds policies, tables and types already exist

-- Profiles: users can create their own profile during signup
create policy "profiles_insert_self" on profiles for insert with check (auth.uid() = id);
-- Profiles: users can update their own profile
create policy "profiles_update_self" on profiles for update using (auth.uid() = id);

-- Candidates: users can create their own candidate record
create policy "candidates_insert_self" on candidates for insert with check (profile_id = auth.uid());
-- Candidates: users can update their own candidate record
create policy "candidates_update_self" on candidates for update using (
  profile_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
-- Candidates: users can delete their own candidate record
create policy "candidates_delete_self" on candidates for delete using (
  profile_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Employers: users can create their own employer record
create policy "employers_insert_self" on employers for insert with check (
  profile_id is null or profile_id = auth.uid()
);
-- Employers: users can update their own employer record
create policy "employers_update_self" on employers for update using (
  profile_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
-- Employers: users can delete their own employer record
create policy "employers_delete_self" on employers for delete using (
  profile_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Jobs: owner can insert, update, delete
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

-- Applications: candidate can insert, update, delete own applications
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

-- Staffing requests: employer can insert, update, delete own requests
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

-- Deployed staff: admin only
create policy "deployed_staff_insert" on deployed_staff for insert with check (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "deployed_staff_update" on deployed_staff for update using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "deployed_staff_delete" on deployed_staff for delete using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Invoices: admin only
create policy "invoices_insert" on invoices for insert with check (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "invoices_update" on invoices for update using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "invoices_delete" on invoices for delete using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
