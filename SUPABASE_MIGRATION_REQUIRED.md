# ⚠️ CRITICAL: Supabase Migration Not Yet Deployed

## Error Seen
When trying to fill out onboarding (Step 1 - name):
- "Failed to save name" error message
- Console shows: `500 (Internal Server Error)` on Supabase API calls

## Root Cause
The RLS policies for INSERT, UPDATE, DELETE were **added to the migration file** but **not yet deployed to Supabase**.

The database still only has the old SELECT-only policies. When onboarding tries to UPDATE the profile:
```typescript
await supabase
  .from('profiles')
  .update({ full_name: fullName })
  .eq('id', userId)
```

It fails because:
- ❌ No UPDATE policy exists on profiles table
- ❌ RLS blocks all updates (security default)
- ❌ 500 error returned to client

## Solution: Deploy the Migration

### Run this command in your project directory:
```bash
supabase db push
```

This will:
1. Compare your local migrations with the Supabase database
2. Apply all new policies from `supabase/migrations/0001_init.sql`
3. Add INSERT policies (for signup profile/candidate creation)
4. Add UPDATE policies (for onboarding profile/candidate edits)
5. Add DELETE policies (for future features)

### What Gets Deployed
From the migration file, these policies will be created:

**Profiles table:**
- ✅ `profiles_insert_self` - Users can create their own profile
- ✅ `profiles_update_self` - Users can update their own profile
- (Already have SELECT policies)

**Candidates table:**
- ✅ `candidates_insert_self` - Users can create their own candidate record
- ✅ `candidates_update_self` - Users can update their candidate record
- ✅ `candidates_delete_self` - Users can delete their candidate record
- (Already have SELECT policies)

**Other tables:**
- ✅ Similar policies for employers, jobs, applications, staffing_requests, deployed_staff, invoices

## Steps

### 1. Open Terminal
```bash
cd c:\Users\User\Desktop\asods-starter
```

### 2. Ensure you're logged into Supabase CLI
```bash
supabase login
```

(If not logged in, it will open a browser to authenticate)

### 3. Push the migration
```bash
supabase db push
```

Expected output:
```
Applying migrations...
✓ Deployed migration "0001_init.sql"
✓ All pending migrations have been applied
```

### 4. Verify Deployment
In Supabase dashboard:
- Go to SQL Editor
- Run this query to see all policies:
```sql
SELECT tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename IN ('profiles', 'candidates')
ORDER BY tablename, policyname;
```

Should return multiple policies per table (select, insert, update, delete)

## After Deployment

### Test Onboarding Again:
1. Refresh http://localhost:3000
2. Click "Sign Up as Candidate"
3. Click "Continue with Google"
4. Authorize
5. Land on onboarding
6. Fill in name → Click "Continue"
7. **Should work now** ✅ (no "Failed to save name" error)

## Troubleshooting

### If `supabase db push` fails:
- Make sure you're in the project directory
- Check you're authenticated: `supabase projects list`
- Make sure `.env.local` has correct Supabase credentials

### If policies don't show up:
- They might already be deployed
- Check if different version exists
- Try accessing Supabase dashboard directly to verify

### If UPDATE still fails after deployment:
- Hard refresh browser (Ctrl+Shift+R)
- Check browser DevTools console for new error message
- Verify the policy name matches the table

## Files Involved
- `supabase/migrations/0001_init.sql` - Contains all RLS policies
- `.env.local` - Supabase credentials (used by `supabase db push`)

## Timeline
1. ✅ Migration file created with all policies
2. ✅ Code changes to support new operations
3. ⏭️ **PENDING: Deploy migration to Supabase** ← YOU ARE HERE
4. ⏭️ Test onboarding end-to-end
5. ⏭️ Test OAuth flow
6. ⏭️ Test CV upload requirement

## Next Steps
1. Run: `supabase db push`
2. Wait for success
3. Refresh browser and try onboarding again
4. Let me know if it works!
