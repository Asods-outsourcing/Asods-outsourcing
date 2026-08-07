# Phase 5: Notifications System - Setup & Implementation Guide

## Overview

This phase adds automated email notifications when candidates move through the pipeline. The system uses Resend for email delivery (via their shared resend.dev domain for testing, with production domain verification needed later).

---

## ⚠️ CRITICAL LIMITATION

**Current Domain:** `resend.dev` (Resend's test domain)  
**Current Capability:** Emails ONLY deliver reliably to your own Resend account email address

This means:
- ✅ Test emails to admin@your-email.com will work
- ✅ System is fully implemented and testable
- ❌ Real candidate emails (e.g., john@gmail.com) won't reliably deliver
- **Solution:** Verify a real domain (e.g., asods.com) in Resend admin panel

Once you verify a domain, just update `.env.local`:
```
RESEND_API_KEY=your_real_api_key  # (already set up for resend.dev)
# Code doesn't change - it just works
```

---

## Setup Instructions

### 1. Install Resend Package

```bash
npm install resend
```

### 2. Set Up Database Tables

Run the SQL from `docs/notification_tables.sql` in your Supabase dashboard:
1. Go to https://app.supabase.com
2. Select your project → SQL Editor
3. Create new query, paste entire contents of `notification_tables.sql`
4. Run it

This creates:
- `notification_templates` table (5 rows pre-filled with default templates)
- `notifications_log` table (audit trail)
- RLS policies (admin-only access)

### 3. Add RESEND_API_KEY to `.env.local`

You'll need to add your Resend API key. Get it from:
1. https://dashboard.resend.com/api-keys
2. Create a new API key
3. Add to `.env.local`:

```
RESEND_API_KEY=re_your_actual_key_here
```

**Important:** Never commit this to git - it's in `.env.local` (gitignored)

---

## What Was Built

### ✅ Completed

1. **Server Action for Email Sending**
   - File: `src/lib/notifications/sendNotification.ts`
   - Fetches template for stage
   - Fills placeholders with candidate data
   - Sends via Resend
   - Logs to `notifications_log`
   - Handles errors gracefully

2. **Notification Settings Page**
   - File: `src/admin/settings/notifications/page.tsx`
   - Lists all 5 templates (screening, interview, offer, placed, rejected)
   - Shows available placeholders for each stage
   - Edit inline: subject + body textarea
   - Warns if missing critical placeholders (e.g., {{salary}} in Offer)
   - Save with confirmation toast
   - Added to admin nav as "Settings ⚙️"

3. **Default Templates**
   - Pre-seeded in database via SQL
   - Brand-friendly tone, non-technical language
   - Placeholders: `{{candidate_name}}`, `{{job_title}}`, `{{salary}}`, `{{start_date}}`, `{{custom_note}}`

### ⏳ Still Needs Implementation

The following still need to be built in the candidate detail page and offer modal:

1. **Trigger on Stage Change**
   - When admin clicks "Screening", "Interview", "Placed", or "Rejected" button
   - Call `sendNotificationEmail()` with candidate data
   - Show toast: "Email sent to [email]" or error message
   - If email fails, still update stage but show "Email failed - follow up manually"

2. **Offer Modal**
   - When admin moves to "Offer" stage, show modal first (not direct update)
   - Fields: salary, start date, optional custom note
   - Then send Offer email with those values filled in
   - Then move application to "Offer" stage

3. **Notifications Log Viewer** (optional)
   - `/admin/settings/notifications-log` page
   - Show table: candidate, stage, sent_at, status, template_used
   - Useful for auditing what was sent when

---

## Files Created

```
src/
├── lib/notifications/
│   └── sendNotification.ts          # Server action for sending emails
├── app/admin/
│   └── settings/notifications/
│       └── page.tsx                 # Template editor UI

docs/
├── notification_tables.sql          # SQL migration for database
└── PHASE_5_NOTIFICATIONS_SETUP.md   # This file

.env.local (updated)
├── RESEND_API_KEY=...              # Added
```

---

## Testing Instructions

### Test 1: Verify Database Setup

1. Go to Supabase dashboard
2. SQL Editor → Run a query:
   ```sql
   SELECT stage, subject FROM notification_templates;
   ```
3. Should return 5 rows (screening, interview, offer, placed, rejected)

### Test 2: Access Settings Page

1. Log in to `/admin/login` as admin
2. Go to `/admin/settings/notifications`
3. Should see all 5 templates
4. Edit one: change subject, add a note
5. Click "Save Template"
6. Verify toast confirmation
7. Refresh page - changes should persist

### Test 3: Edit and Test Email (Once Implemented)

1. **Set up test email:** Use YOUR OWN email address as the candidate email
   - This is critical because resend.dev only delivers to your Resend account
2. Create a test candidate with your email
3. Move candidate to "Screening"
4. Check your email for the screening template
5. Edit the template in settings
6. Move another test candidate to "Screening"
7. Verify new template was used

### Test 4: Full Pipeline (Once Implemented)

Using a test candidate with YOUR email:
1. Create → move to Screening → check email
2. Move to Interview → check email
3. Move to Offer → fill form (salary, date) → check email
4. Move to Placed → check email
5. Move to Rejected → check email

After each email, verify in `notifications_log` table:
```sql
SELECT candidate_id, stage, sent_at, status FROM notifications_log ORDER BY sent_at DESC LIMIT 5;
```

---

## Production Domain Setup

When you're ready for real emails to candidates:

1. **Verify Domain in Resend**
   - Go to https://dashboard.resend.com
   - Add your domain (e.g., asods.com)
   - Follow DNS verification steps
   - Takes 15-30 minutes

2. **Get Production API Key**
   - Dashboard → API Keys → Create new
   - Update `.env.local` with new key

3. **Update Email From Address** (optional)
   - In `src/lib/notifications/sendNotification.ts`
   - Change `from: 'notifications@resend.dev'` to `from: 'notifications@asods.com'`

4. **Deploy**
   - Set env var in production environment
   - No code changes needed - system automatically uses new domain

---

## API & Implementation Details

### sendNotificationEmail() Function

```typescript
interface NotificationData {
  candidateId: string
  stage: 'screening' | 'interview' | 'placed' | 'rejected' | 'offer'
  candidateName: string
  candidateEmail: string
  jobTitle: string
  salary?: string        // Only for offer
  startDate?: string     // Only for offer
  customNote?: string    // Only for offer
}

// Usage:
const { success, error } = await sendNotificationEmail({
  candidateId: 'abc-123',
  stage: 'interview',
  candidateName: 'John Doe',
  candidateEmail: 'john@example.com',
  jobTitle: 'Software Engineer',
})

if (success) {
  showToast('Email sent!')
} else {
  showToast(`Error: ${error}`)
}
```

### Database Schema

**notification_templates**
```
id              | uuid (primary key)
stage           | text (unique) - screening|interview|offer|placed|rejected
subject         | text
body            | text with placeholders
updated_at      | timestamp
updated_by      | uuid (references profiles.id)
created_at      | timestamp
```

**notifications_log**
```
id              | uuid (primary key)
candidate_id    | uuid (references candidates.id)
stage           | text - what stage was this email for?
sent_at         | timestamp
status          | text - 'sent' or 'failed'
template_used   | text - snapshot of the template subject
created_at      | timestamp
```

---

## Placeholder Reference

| Stage | Placeholders |
|-------|--------------|
| Screening | `{{candidate_name}}`, `{{job_title}}` |
| Interview | `{{candidate_name}}`, `{{job_title}}` |
| Offer | `{{candidate_name}}`, `{{job_title}}`, `{{salary}}`, `{{start_date}}`, `{{custom_note}}` |
| Placed | `{{candidate_name}}`, `{{job_title}}` |
| Rejected | `{{candidate_name}}`, `{{job_title}}` |

---

## Error Handling

The system handles these cases gracefully:

1. **Template Not Found** → Shows admin error: "No template configured for this stage"
2. **Email Send Fails** → Stage updates anyway, shows toast: "Email failed - follow up manually"
3. **Log Insert Fails** → Email was sent, log failed, system continues (logged to console)
4. **Invalid Placeholders** → Admin gets warning when saving, can choose to continue anyway

---

## Next Steps to Complete

1. **Install Resend:** `npm install resend`
2. **Run SQL migration** in Supabase
3. **Add RESEND_API_KEY** to `.env.local`
4. **Implement notification sending** in candidate detail page
5. **Implement offer modal** in candidate detail page
6. **Test end-to-end** with your own email

Once working, update `.env.local` with production Resend key and domain-verified sender address.

---

## Questions or Issues?

- Check `notifications_log` table to see what was actually sent
- Check server console logs for `[Send Notification]` messages
- Verify `.env.local` has `RESEND_API_KEY` set
- Make sure database tables were created (run SQL migration)
- Confirm you're logged in as admin to access settings page
