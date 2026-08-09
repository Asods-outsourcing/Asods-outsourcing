-- Add job status and category columns to jobs table
-- Status replaces relying solely on is_public for visibility logic
-- Jobs should only show to candidates when status = 'open' AND is_public = true

-- Create enum type for job status
create type job_status as enum ('open', 'filled', 'paused');

-- Add status column (default 'open' on creation)
alter table if exists jobs 
add column if not exists status job_status not null default 'open';

-- Add category column (freeform text for filtering)
alter table if exists jobs 
add column if not exists category text;

-- Add comments for clarity
comment on column jobs.status is 'Job status: open (visible to candidates), filled (position taken), paused (temporarily hidden)';
comment on column jobs.category is 'Job category for filtering (e.g., Healthcare, Manufacturing, Banking) - freeform text entered by admin';

-- Add index on status for faster filtering
create index if not exists idx_jobs_status on jobs(status);
