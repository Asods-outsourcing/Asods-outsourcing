# Phase 5: Email Notifications System - Implementation Complete ✅

## What's Been Built

A production-ready email notification system with the following architecture:

### 1. **Service-Role Based Logging** (Security Model)
- Notifications are sent using admin credentials
- Logging to `notifications_log` uses Supabase service role key (bypasses RLS)
- This is intentional: audit trail should only be written by system, never by clients
- RLS policies:
  - `notification_templates`: Admins can read/write
  - `notifications_log`: Admins can read, system can write (service role only)

### 2. **Template Management UI**
**Location:** `/admin/settings/notifications`

**Features:**
- Lists 5 pre-seeded templates (screening, interview, offer, placed, rejected)
- Edit mode shows available placeholders for each stage
- Validates templates before saving:
  - Warns (doesn't block) if missing expected placeholders
  - e.g., offer template should have `{{salary}}` and `{{start_date}}`
- Save button per template with confirmation toast
- Preview mode shows subject + body in formatted display
- Last updated timestamp

**Placeholders Available:**
- Common: `{{candidate_name}}`, `{{job_title}}`
- Offer-specific: `{{salary}}`, `{{start_date}}`, `{{custom_note}}`

### 3. **Automatic Email Sending**

**Triggered when admin moves candidate to:**
- **Screening** → Email sent automatically
- **Interview** → Email sent automatically
- **Rejected** → Email sent automatically
- **Offer** → Modal form opens first (doesn't auto-send)
- **Placed** → Placement modal opens first (different flow)

**For Offer Stage - Special Flow:**
1. Click "Send offer" button
2. OfferModal appears with form:
   - Salary/Compensation (required, e.g., "$60,000/year")
   - Start Date (required, defaults to today)
   - Optional custom notes
3. User fills form and clicks "Send Offer"
4. Email is sent with all placeholders filled
5. Stage is updated to 'offer' only after successful send
6. If email fails: stage updates but error shown to user

### 4. **Error Handling**
- If email send fails: stage is still updated (graceful degradation)
- User sees clear error message: "Email failed to send: [reason]. Please follow up manually."
- Encourages admin to contact candidate via other means
- Maintains data integrity: candidate progress not blocked by email issues

### 5. **Audit Trail**
Every email send logged to `notifications_log`:
```
id (uuid)
candidate_id (uuid) - FK to candidates
stage (text) - screening/interview/offer/placed/rejected
sent_at (timestamp) - when sent
status (text) - 'sent' or error status
template_used (text) - which template subject was used
created_at (timestamp)
```

Admins can query to see:
- What was sent to each candidate
- When it was sent
- Which template was used
- If it succeeded or failed

## Code Architecture

### Server Action: `sendNotificationEmail`
**File:** `src/lib/notifications/sendNotification.ts`

```typescript
interface NotificationData {
  candidateId: string
  stage: 'screening' | 'interview' | 'placed' | 'rejected' | 'offer'
  candidateName: string
  candidateEmail: string
  jobTitle: string
  salary?: string
  startDate?: string
  customNote?: string
}

export async function sendNotificationEmail(data: NotificationData)
  -> { success: boolean; error?: string }
```

**What it does:**
1. Fetches template for given stage from `notification_templates`
2. Replaces placeholders with real data
3. Sends email via Resend API (`notifications@resend.dev` domain)
4. Uses service role client to insert log entry (bypasses RLS)
5. Returns success/failure status

### Components

**OfferModal:** `src/components/OfferModal.tsx`
- Collects offer details (salary, start date, notes)
- Calls `sendNotificationEmail` with offer stage
- Updates stage only after successful send
- Shows errors clearly

**PlacementModal:** `src/components/PlacementModal.tsx`
- Already existed, unchanged
- Separate flow for recording deployment

### Database Client Enhancement

**File:** `src/lib/supabase/server.ts`

Added parameter to support both authenticated and service-role operations:
```typescript
export async function createClient(
  roleType: 'authenticated' | 'service_role' = 'authenticated'
)
```

- Default: uses anon key (normal authenticated requests)
- `'service_role'`: uses service role key (bypasses RLS)
- Only use service role for privileged operations (like writing audit logs)

### UI Integration

**Candidate Detail Page:** `src/app/admin/candidates/[id]/page.tsx`

- Stage change handlers:
  - Screening/Interview/Rejected: Send email automatically
  - Offer: Show modal first
  - Placed: Show placement modal
- Toast feedback:
  - Success: "Candidate moved to [stage]. Email sent to [email]"
  - Error: "Candidate moved to [stage], but email failed: [reason]. Please follow up manually."
- Email fails gracefully: stage updates, user sees clear message

## Environment Configuration

**.env.local needs:**
```
RESEND_API_KEY=re_[your-key-from-dashboard]
NOTIFICATION_FROM_EMAIL=notifications@resend.dev
SUPABASE_SERVICE_ROLE_KEY=[from-your-supabase-project]
```

**For production (later):**
1. Verify custom domain in Resend dashboard (asods.com)
2. Change `NOTIFICATION_FROM_EMAIL` to `notifications@asods.com`
3. Potentially change `RESEND_API_KEY` to production key
4. No code changes needed - just env vars

## Testing

See `TESTING_NOTIFICATIONS.md` for step-by-step testing guide.

**Quick start:**
1. Use your own email as test candidate's email (resend.dev limitation)
2. Go to `/admin/candidates/[id]` for that application
3. Move candidate through stages: Screening → Interview → Offer → Placed
4. Check inbox for emails
5. Query `notifications_log` to verify audit trail
6. Go to `/admin/settings/notifications` to edit templates and see changes reflected in next email

## Current Limitations & Path to Production

### 1. Resend Test Domain (`resend.dev`)
- **Current:** Only delivers to your Resend account email
- **Testing workaround:** Use your email as candidate email
- **Production fix:**
  1. Verify custom domain in Resend dashboard (asods.com)
  2. Update `NOTIFICATION_FROM_EMAIL=notifications@asods.com`
  3. All real candidate emails will work

### 2. Candidate Email Collection
- Assumes candidates provided email during onboarding
- Offers no recovery if email missing (shows error to admin)
- Consider adding email verification flow in future phases

### 3. Template Customization
- UI allows any text, just validates critical placeholders
- No live preview of final email (can add later)
- No multi-language support (future enhancement)

## Files Created/Modified

**Created:**
- `src/components/OfferModal.tsx` - Offer form modal
- `TESTING_NOTIFICATIONS.md` - Testing guide
- `IMPLEMENTATION_COMPLETE.md` - This file

**Modified:**
- `src/lib/supabase/server.ts` - Added service role support
- `src/lib/notifications/sendNotification.ts` - Service role logging
- `src/app/admin/candidates/[id]/page.tsx` - Offer modal integration
- `src/app/admin/settings/notifications/page.tsx` - Rebuilt template editor
- `.env.local` - Added NOTIFICATION_FROM_EMAIL

**Database (already run in Supabase):**
- `notification_templates` table (pre-seeded with 5 templates)
- `notifications_log` table (audit trail)
- RLS policies (admins read templates, system writes logs)

## Success Criteria

✅ Templates can be edited and changes persist
✅ Emails sent automatically when moving candidates through pipeline
✅ Offer emails include salary, start date, custom notes
✅ All sends logged to notifications_log with audit trail
✅ Email failures don't block stage updates
✅ Clear user feedback (toasts) on success/failure
✅ Admin can query `notifications_log` for audit purposes
✅ Service role used only for privileged operations (logs)
✅ Build passes with no errors
✅ Code ready for production (just env var changes for real domain)

## Architecture Principles Used

1. **Security First**
   - Service role only for audit logging (not exposed client-side)
   - RLS policies properly configured
   - No secrets in code (all in env vars)

2. **Graceful Degradation**
   - Email failures don't block state changes
   - Admin informed immediately of problems
   - Data integrity maintained

3. **Non-Technical Admin UX**
   - Simple text editor for templates
   - Clear placeholder references
   - Toast feedback for actions
   - No code editing required

4. **Extensibility**
   - Easy to add more stages (just add template + sending logic)
   - Easy to change sender domain (one env var)
   - Easy to add more placeholders (just add to template + send function)
   - Modular components (OfferModal, PlacementModal separate)

## Next Steps (Future Phases)

### Short-term (Days)
1. Test end-to-end following TESTING_NOTIFICATIONS.md
2. Get actual Resend domain verification set up
3. Deploy to production

### Medium-term (Weeks)
1. Add notifications-log viewer page (`/admin/settings/notifications-log`)
2. Add email preview in template editor
3. Add per-stage enable/disable toggles
4. Add retry logic for failed sends

### Long-term (Months)
1. Multi-language template support
2. Template variables for company branding
3. SMS notifications alongside email
4. Webhook for email delivery tracking (via Resend API)
5. A/B testing for different email templates

## How to Use After Launch

**For admins:**
1. Go to Settings → Notifications to customize email templates
2. Move candidates through pipeline as usual
3. Emails automatically send with configured templates
4. Check Settings → Notifications-Log to audit what was sent (future feature)

**For developers:**
1. To add a new notification stage: add template + update sending logic
2. To change sender domain: update `.env.local` NOTIFICATION_FROM_EMAIL
3. To debug: check browser console + server logs for `[Send Notification]` entries
4. To check audit trail: query `notifications_log` table in Supabase

---

**Status: Ready for Testing** ✅

All code complete, database set up, ready to test end-to-end.
