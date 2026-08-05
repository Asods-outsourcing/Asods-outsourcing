-- ============================================================================
-- ⚠️  DANGEROUS: FULL DATABASE RESET
-- ============================================================================
-- THIS SCRIPT IS DESTRUCTIVE AND IRREVERSIBLE.
--
-- Use ONLY for:
--   • Manual development environment resets
--   • Testing against a clean database
--   • Never as part of automated deployment
--   • Never against production
--
-- This will DELETE all data and schema. Make sure you have backups.
-- Once you run this, you cannot undo it. Data cannot be recovered.
--
-- After running this, you MUST immediately apply the baseline schema:
--   supabase db push  (or manually run 0001_baseline.sql)
-- ============================================================================


-- ============================================================================
-- DESTROY EVERYTHING (in correct dependency order)
-- ============================================================================

-- Storage policies first (depend on storage.objects)
drop policy if exists "cvs_insert_own" on storage.objects;
drop policy if exists "cvs_update_own" on storage.objects;
drop policy if exists "cvs_select_public" on storage.objects;
drop policy if exists "cvs_delete_own" on storage.objects;

-- Storage bucket itself
delete from storage.buckets where id = 'cvs';

-- Tables (order matters for foreign keys)
drop table if exists invoices cascade;
drop table if exists deployed_staff cascade;
drop table if exists staffing_requests cascade;
drop table if exists applications cascade;
drop table if exists jobs cascade;
drop table if exists candidates cascade;
drop table if exists employers cascade;
drop table if exists profiles cascade;

-- Types
drop type if exists user_role cascade;
drop type if exists application_stage cascade;
drop type if exists request_status cascade;
drop type if exists invoice_status cascade;

-- Functions and triggers
drop function if exists set_updated_at() cascade;
drop function if exists is_admin() cascade;


-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- After running this, confirm everything is gone:
--
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- -> should return no rows
--
-- SELECT typname FROM pg_type WHERE typnamespace = 2200;
-- -> should show only built-in types, not user_role, application_stage, etc.
--
-- SELECT * FROM storage.buckets WHERE id = 'cvs';
-- -> should return no rows
--
-- ============================================================================
-- NEXT: Apply 0001_baseline.sql to rebuild the schema
-- ============================================================================
