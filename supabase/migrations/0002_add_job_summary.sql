-- Add job_summary column to jobs table
-- This is a short description (1-2 sentences) shown on job listing cards
alter table if exists jobs 
add column if not exists job_summary text;

-- Add comment for clarity
comment on column jobs.job_summary is 'Short job summary (1-2 sentences) displayed on job listing cards';
comment on column jobs.description is 'Full job description with rich text formatting (HTML format from Tiptap editor)';
