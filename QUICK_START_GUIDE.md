# Quick Start - Jobs System with Status & Categories

## What's New

### For Admins
1. **Status control** - Mark jobs as Open, Filled, or Paused
2. **Categories** - Tag jobs (Healthcare, Manufacturing, etc.)
3. **Applicant count** - See engagement at a glance
4. **Duplicate jobs** - Repost similar roles instantly
5. **Delete with warnings** - See how many applications before deleting
6. **Search jobs** - Find by title quickly

### For Candidates
1. **Category filter** - Filter by job category
2. **Search jobs** - Search by title/description
3. **Visibility logic** - Only see jobs that are Open and Public

---

## How to Use

### Admin: Creating a Job
1. Go to `/admin/jobs` → Click "Create Job"
2. Fill in: Title, Summary, Description, Location, Employer
3. **NEW**: Enter Category (e.g., "Healthcare")
4. **NEW**: Select Status (Open is default)
5. Check "Make this job public"
6. Click "Create Job"

**Note**: New jobs default to status "Open" - they're immediately visible if public.

### Admin: Managing Jobs
1. Go to `/admin/jobs`
2. **Change Status**: Use the dropdown in the Status column
   - Open → visible to candidates
   - Filled → hidden from candidates
   - Paused → hidden from candidates
3. **See Applications**: Look at "X applicants" next to title
4. **Duplicate**: Click "Duplicate" to repost a similar role
5. **Delete**: Click "Delete" → confirm → job and all applications are removed

### Admin: Editing a Job
1. Go to `/admin/jobs` → Click "Edit" on a job
2. Update any fields
3. **NEW**: Change category or status on the edit form
4. **NEW**: Click "Delete Job" button to remove it (confirms with modal)
5. Click "Save Changes"

### Candidate: Finding Jobs
1. Go to `/candidate/jobs`
2. **NEW**: Use search to find by title/description
3. **NEW**: Use category dropdown to filter by industry
4. Click "Clear Filters" to reset
5. Click "View Details" or "Apply Now"

---

## Testing the New Features

### Quick Test 1: Status Controls
1. Admin: Create a job, set to Public ✓
2. Candidate: Refresh - job appears in list ✓
3. Admin: Change status from Open → Filled via dropdown
4. Candidate: Refresh - job disappears ✓
5. Admin: Change status back to Open
6. Candidate: Refresh - job reappears ✓

### Quick Test 2: Categories & Search
1. Admin: Create job "Healthcare Assistant" with category "Healthcare"
2. Candidate: Category dropdown shows "Healthcare" ✓
3. Candidate: Select "Healthcare" - job appears ✓
4. Candidate: Search "Healthcare" - job appears ✓
5. Candidate: Clear filters - all jobs shown ✓

### Quick Test 3: Duplicate & Delete
1. Admin: Create job "Senior Developer"
2. Admin: Click "Duplicate" - new job created with status "Open" ✓
3. Admin: As candidate, apply to original job
4. Admin: Click "Delete" on job - warning shows "1 application" ✓
5. Admin: Confirm delete - both job and application removed ✓

---

## Database Setup

**⚠️ IMPORTANT**: Run this migration in Supabase SQL editor:

```sql
create type job_status as enum ('open', 'filled', 'paused');

alter table if exists jobs 
add column if not exists status job_status not null default 'open';

alter table if exists jobs 
add column if not exists category text;

comment on column jobs.status is 'Job status: open (visible to candidates), filled (position taken), paused (temporarily hidden)';
comment on column jobs.category is 'Job category for filtering (e.g., Healthcare, Manufacturing, Banking) - freeform text entered by admin';

create index if not exists idx_jobs_status on jobs(status);
```

File location: `supabase/migrations/0003_add_job_status_category.sql`

---

## Visibility Rules

**Job is visible to candidates when:**
- `status = 'open'` **AND** `is_public = true`

**Job is hidden from candidates when:**
- `status = 'filled'` OR `status = 'paused'` OR `is_public = false`

---

## Important Notes

- **Status defaults to "Open"** when creating jobs
- **Category is freeform** - admins can enter anything (Healthcare, Manufacturing, etc.)
- **Deleting a job also deletes all applications** via cascade delete
- **Duplicating a job** copies everything except applications
- **Search is real-time** - no need to click a button
- **Category filter is dynamic** - only shows categories that exist in the database

---

## Troubleshooting

**Q: I created a job but it doesn't appear for candidates**
A: Check both:
1. Is the status "Open"? (Not "Filled" or "Paused")
2. Is "Make this job public" checked?

**Q: I see more jobs as admin than candidates**
A: Correct! Admins see all jobs. Candidates only see Open+Public jobs.

**Q: Where's the category filter?**
A: It appears automatically when jobs have categories. If you see "All Categories" option, categories exist.

**Q: Can I change a job's status without editing it?**
A: Yes! Use the Status dropdown in the admin jobs list - changes instantly.

**Q: What happens if I delete a job with applications?**
A: Modal warning shows the count. Deleting removes job AND all its applications.


