# Testing Notification System - Phase 5

## Overview

The complete email notification system has been implemented with the following features:

1. **Service-role based notification logging** - Audit trail stored server-side using Supabase service role
2. **Template management UI** - Admin interface to edit templates at `/admin/settings/notifications`
3. **Automatic email sending** - Triggered when moving candidates through pipeline stages
4. **Offer modal** - Special flow for sending offer emails with salary/start date fields
5. **Graceful error handling** - Emails can fail without blocking stage updates

## Setup Requirements

✅ **Already Done:**
- Database tables created (`notification_templates`, `notifications_log`)
- Server action created (`src/lib/notifications/sendNotification.ts`)
- Template editor UI built (`src/app/admin/settings/notifications`)
- Offer modal component created (`src/components/OfferModal.tsx`)
- Candidate detail page integrated with notification sending
- Service role key support added to Supabase client
- Environment variable configured: `RESEND_API_KEY`, `NOTIFICATION_FROM_EMAIL`

❌ **Testing Limitation:**
- Currently using `resend.dev` (Resend's test domain)
- Emails ONLY reliably deliver to YOUR OWN Resend account email address
- Real candidate emails won't work until you verify a custom domain (asods.com) in Resend
- **Workaround for testing:** Use your own email as the test candidate's email

## Step-by-Step Testing

### Setup: Create Test Candidate with Your Email

1. Sign up as a candidate with your personal email
2. Complete onboarding (CV, bio, skills)
3. Apply for a job (will create an `applications` record)
4. Navigate to `/admin/candidates/[id]` for that application

### Test 1: Verify Template Editor Works

**Goal:** Edit a template and confirm changes persist

**Steps:**
1. Go to `/admin/settings/notifications` (or click Settings → Notifications in admin nav)
2. Find the **Screening** template
3. Click "Edit Template"
4. Change the subject to something unique like: `"TESTING: {{candidate_name}} - Screening Update"`
5. Save the template
6. Should see green success toast: "Screening template saved successfully"
7. Refresh the page
8. Verify the custom text still appears

**Expected Result:** Template saved and persisted

---

### Test 2: Send Screening Notification

**Goal:** Verify email sends and notification_log entry created

**Steps:**
1. Go back to the candidate detail page (`/admin/candidates/[id]`)
2. Click "Screening" button in the "Update Status" section
3. Candidate should move to Screening stage
4. Should see success toast with your email: `"Candidate moved to Screening. Email sent to [your-email]"`
5. Check your email inbox for the message from ASODS
6. Verify it includes your name, job title, and the custom text from step 1

**Database verification:**
- Run this query in Supabase SQL editor:
```sql
SELECT candidate_id, stage, sent_at, status, template_used 
FROM notifications_log 
WHERE stage = 'screening' 
ORDER BY sent_at DESC 
LIMIT 5;
```
- Should see a row with your candidate's ID, stage='screening', status='sent', and the screening template subject

**Expected Result:**
- Email received with correct content
- Row added to notifications_log
- Candidate stage updated to 'screening'

---

### Test 3: Send Interview Notification

**Goal:** Verify second notification and that templates are being used

**Steps:**
1. Still on the same candidate detail page
2. Click "Schedule interview" button
3. Should see success toast with your email
4. Check your email inbox
5. Verify subject and body use the Interview template

**Database verification:**
```sql
SELECT stage, COUNT(*) FROM notifications_log GROUP BY stage;
```
- Should show 1 screening, 1 interview

**Expected Result:** Interview email received, notifications_log updated

---

### Test 4: Send Offer with Custom Details

**Goal:** Verify offer modal flow and custom fields are used

**Steps:**
1. Still on the same candidate detail page
2. Click "Send offer" button
3. An **OfferModal** should pop up with form fields:
   - Salary/Compensation (required)
   - Start Date (required, defaults to today)
   - Additional Notes (optional)
4. Fill in:
   - Salary: `$60,000/year`
   - Start Date: `2025-09-01`
   - Notes: `Includes health insurance and 3 weeks PTO`
5. Click "Send Offer"
6. Modal should close, candidate should now be in "Offer" stage
7. Check email - should include:
   - Your name
   - Job title
   - Salary: `$60,000/year`
   - Start Date: `2025-09-01`
   - Custom note text

**Database verification:**
```sql
SELECT stage, template_used FROM notifications_log WHERE stage = 'offer';
```
- Should see the offer template was used

**Expected Result:**
- Offer email with all custom fields filled in
- Candidate stage changed to 'offer'
- notifications_log entry with stage='offer'

---

### Test 5: Send Rejection Notification

**Goal:** Verify final notification type

**Steps:**
1. Still on the same candidate detail page
2. Click "Not selected" button
3. Should see success toast
4. Check email
5. Should receive rejection message

**Database verification:**
```sql
SELECT stage, sent_at FROM notifications_log ORDER BY sent_at DESC LIMIT 10;
```
- Should now show: screening, interview, offer, rejected (4 rows total)

**Expected Result:** Rejection email received with proper template

---

### Test 6: Test Email Failure Handling (Optional)

**Goal:** Verify app handles email failures gracefully

**Steps:**
1. Create another test candidate with an **invalid email** (something like `invalid@test.invalid`)
2. Move them to Screening stage
3. Should see red error toast: `"Candidate moved to Screening, but email failed to send: ... Please follow up manually."`
4. But candidate stage should still be updated to 'screening'
5. Check notifications_log - might have entry with status='failed' (depending on how Resend handles invalid emails)

**Expected Result:** Stage updated even though email failed, clear error message shown

---

### Test 7: Edit Template and Verify New Email Uses It

**Goal:** Confirm templates are read fresh, not cached

**Steps:**
1. Go to `/admin/settings/notifications` again
2. Edit the **Interview** template
3. Change subject from `"{{candidate_name}} - Interview Invitation for {{job_title}}"` to `"UPDATED: Interview for {{job_title}}"`
4. Save
5. Create a brand new test candidate (or use a candidate still in applied stage)
6. Move to Screening, then Interview
7. Check email received - subject should be: `"UPDATED: Interview for [job_title]"`

**Expected Result:** New template text appears in email (not cached)

---

### Complete Flow Screenshot Path

For proof, you should have:
- ✅ Email showing: Screening notification (with custom text)
- ✅ Email showing: Interview notification
- ✅ Email showing: Offer with salary & start date & custom note
- ✅ Email showing: Rejection notification
- ✅ Database query showing 4 rows in notifications_log (screening, interview, offer, rejected)
- ✅ Database query showing template_used field matches subject line
- ✅ Screenshot of template editor with changes saved

---

## Troubleshooting

### Emails Not Arriving

**Issue:** Emails aren't being received

**Checks:**
1. Verify `RESEND_API_KEY` in `.env.local` is valid
   - Check in https://dashboard.resend.com/api-keys
   - Key should start with `re_`
2. Verify `NOTIFICATION_FROM_EMAIL` is set to `notifications@resend.dev`
3. Check browser console for errors when clicking stage change buttons
4. Check server logs for `[Send Notification]` entries
5. Remember: `resend.dev` only delivers to your Resend account email

**If still not working:**
- Candidates email must exactly match the email associated with your Resend account
- Use your personal email as the candidate's email for testing

### Template Changes Not Showing

**Issue:** You edited a template but emails still use old text

**Checks:**
1. Make sure you clicked "Save Template" (not just refreshed page)
2. Confirm the green success toast appeared
3. Refresh the notifications page to verify the change persisted
4. Database likely has the new template - the issue is usually browser cache
5. Try incognito/private mode when testing to avoid cache

### notifications_log Entries Missing

**Issue:** Emails send but no log entries appear

**Checks:**
1. Verify Supabase service role key is correct in `.env.local`
2. Check RLS policies on notifications_log table (should allow insert)
3. The service role client bypasses RLS, so check server-side logs
4. Run: `SELECT * FROM notifications_log LIMIT 10;` - should return rows

---

## Current Configuration

**Environment Variables (set in .env.local):**
```
RESEND_API_KEY=[your actual key from https://dashboard.resend.com/api-keys]
NOTIFICATION_FROM_EMAIL=notifications@resend.dev
SUPABASE_SERVICE_ROLE_KEY=[from your Supabase project settings]
```

**Database:**
- 5 pre-seeded templates (screening, interview, offer, placed, rejected)
- notifications_log table with 1000+ potential rows for audit trail
- RLS policies: admins can read templates, system can write logs

**API:**
- Resend domain: `resend.dev` (test/shared domain)
- Production ready: just change `NOTIFICATION_FROM_EMAIL` to verified domain later

---

## Known Limitations

1. **Resend Test Domain:** `resend.dev` only delivers to your account email
   - **Fix:** Verify custom domain (asods.com) in Resend dashboard
   - After verification, just update `NOTIFICATION_FROM_EMAIL` env var

2. **Offer Form:** Required fields (salary, start date) must be filled
   - If left blank, modal shows error and doesn't send
   - This is intentional - offers need these details

3. **No Resend sending:** If your Resend account is deleted/suspended, emails won't send
   - Check Resend dashboard for account status

---

## Files Modified/Created

**Created:**
- `src/components/OfferModal.tsx` - Offer form modal component
- `TESTING_NOTIFICATIONS.md` - This file

**Modified:**
- `src/lib/supabase/server.ts` - Added service_role parameter support
- `src/lib/notifications/sendNotification.ts` - Uses service role for logging
- `src/app/admin/candidates/[id]/page.tsx` - Integrated offer modal, email sending
- `src/app/admin/settings/notifications/page.tsx` - Rebuilt template editor UI
- `.env.local` - Added NOTIFICATION_FROM_EMAIL

---

## Success Criteria

✅ All tests pass and you have actual emails received
✅ notifications_log table populated with audit trail entries
✅ Template editor allows live editing with immediate persistence
✅ Offer modal collects custom data and includes it in emails
✅ Email failures don't block stage updates
✅ Clear toast messages show what happened to user

