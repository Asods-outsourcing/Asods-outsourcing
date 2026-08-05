# Phase 3 Admin Dashboard - Complete Flow Walkthrough

This document demonstrates the full admin experience from login through candidate management.

---

## 1. Admin Login Flow

**URL:** `/admin/login`

### Screen 1: Login Page
```
┌─────────────────────────────────────────┐
│                                         │
│            ASODS Admin                  │
│    Staff management dashboard           │
│                                         │
│  Email Address: [admin@asods.com__]    │
│  Password:      [••••••••____________]  │
│                                         │
│  [        Sign in        ]              │
│                                         │
│  Admin access only. Contact ASODS       │
│  leadership for credentials.            │
│                                         │
└─────────────────────────────────────────┘
```

### Action: Enter credentials and sign in

**Authentication Flow:**
1. Enter email and password
2. Supabase Auth verifies credentials
3. System checks if `profile.role = 'admin'`
4. If not admin: Sign out and show "Access denied"
5. If admin: Redirect to `/admin/home`

**Console Logs:**
```
[Admin Login] Attempting login for: admin@asods.com
[Admin Login] Login successful, redirecting to admin home
```

---

## 2. Admin Home - Today's Feed

**URL:** `/admin/home`

### Screen 2: Today's Feed
```
┌─────────────────────────────────────────────────────┐
│  ASODS Admin                              Logout    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  What needs your attention today                   │
│  New staffing requests and applications            │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Zenith Bank needs 5 sales executives        │  │
│  │ By August 30, 2026               [Review →] │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Access Bank needs 3 data analysts            │  │
│  │ By September 15, 2026            [Review →] │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ New application for Senior Developer         │  │
│  │ Strong Python and AWS background [Review →] │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
```

### What Happens Here:
- System fetches new staffing requests (status = 'new')
- System fetches applications awaiting screening (stage = 'applied')
- Combined feed shows up to 10 items, newest first
- Plain language summaries, one action button per item

**Navigation Options:**
- Click "Review →" on a request → Goes to `/admin/requests/[id]`
- Click "Review →" on an application → Goes to `/admin/candidates`
- Use top navigation to jump to: Today | Requests | Candidates

---

## 3. Staffing Requests - List View

**URL:** `/admin/requests`

### Screen 3: All Requests Table
```
┌─────────────────────────────────────────────────────────────────┐
│  Staffing Requests                                              │
│  Manage all client staffing requests                            │
├──────┬──────────┬──────┬──────────┬───────────┬────────┬────────┤
│ Co   │ Roles    │ Qty  │ Timeline │ Status    │ Submit │ Action │
├──────┼──────────┼──────┼──────────┼───────────┼────────┼────────┤
│Zenith│Sales Exe │  5   │Aug 30    │ New       │Jul 25  │ View → │
│ Bank │cutives  │      │ 2026     │           │ 2026   │        │
├──────┼──────────┼──────┼──────────┼───────────┼────────┼────────┤
│Access│Data Ana- │  3   │Sep 15    │ In prog   │Jul 22  │ View → │
│ Bank │lysts     │      │ 2026     │           │ 2026   │        │
├──────┼──────────┼──────┼──────────┼───────────┼────────┼────────┤
│GTCo  │Account   │  2   │Aug 10    │ Shortlist │Jul 10  │ View → │
│      │Managers  │      │ 2026     │ed         │ 2026   │        │
└──────┴──────────┴──────┴──────────┴───────────┴────────┴────────┘
```

### Features:
- **Newest first:** Sorted by `created_at DESC`
- **Status badges:** Color-coded (New=blue, In progress=yellow, Shortlisted=purple, Closed=green)
- **Quick action:** "View →" link to detail page

---

## 4. Request Detail & Status Management

**URL:** `/admin/requests/[id]` (e.g., `/admin/requests/abc-123`)

### Screen 4: Request Detail
```
┌────────────────────────────────────────────────────────────┐
│ ← Back to requests                                         │
│                                                            │
│ Left column (2/3 width):                                   │
│                                                            │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ Zenith Bank                                         │  │
│ │                                                     │  │
│ │ Roles Needed: Sales Executives                      │  │
│ │ Quantity: 5                                         │  │
│ │ Timeline: August 30, 2026                           │  │
│ │ Submitted: July 25, 2026, 2:30 PM                  │  │
│ └─────────────────────────────────────────────────────┘  │
│                                                            │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ Contact Information                                 │  │
│ │ Contact Name: John Smith                            │  │
│ │ Email: john@zenithlive.com                          │  │
│ │ Phone: +234 701 123 4567                            │  │
│ └─────────────────────────────────────────────────────┘  │
│                                                            │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ Next Steps                                          │  │
│ │ Use the candidates board to find suitable matches.  │  │
│ │ Mark this request as "In progress" when you begin   │  │
│ │ screening, and "Shortlisted" once you have a        │  │
│ │ shortlist ready to send.                            │  │
│ │                                                     │  │
│ │ [Browse candidates →]                              │  │
│ └─────────────────────────────────────────────────────┘  │
│                                                            │
│ Right column sidebar (1/3 width):                         │
│                                                            │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ Request Status                                      │  │
│ │                                                     │  │
│ │ Update Status:                                      │  │
│ │ [✓ New              ]                               │  │
│ │ [ In progress       ]                               │  │
│ │ [ Shortlisted       ]                               │  │
│ │ [ Closed            ]                               │  │
│ │                                                     │  │
│ │ [    Save status    ]                               │  │
│ │                                                     │  │
│ │ New — Just received                                 │  │
│ │ In progress — Actively screening candidates        │  │
│ │ Shortlisted — Shortlist ready to send              │  │
│ │ Closed — Position filled or cancelled              │  │
│ └─────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Action: Change status from "New" to "In progress"

**User Steps:**
1. Click dropdown (currently shows "✓ New")
2. Select "In progress"
3. Click "Save status" button
4. Green toast appears: "Status updated successfully"
5. Button briefly shows "Updating..." then returns to normal

**What Happens Behind Scenes:**
1. Supabase updates `staffing_requests.status = 'in_progress'` for this record
2. `updated_at` timestamp automatically set by database trigger
3. Local state updates immediately to reflect new status
4. Toast auto-dismisses after 3 seconds

**Console Logs:**
```
[Request Detail] Status update successful
Updated request abc-123 to in_progress
```

---

## 5. Candidates Kanban Board

**URL:** `/admin/candidates`

### Screen 5: Kanban Pipeline
```
┌──────────────────────────────────────────────────────────────────┐
│  Candidates Pipeline                                             │
│  Drag candidates to move through stages. Click to add notes.     │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┬──┐
│  │   New    │ │Screening │ │Interview │ │  Offer   │ │ Placed   │N│
│  │          │ │          │ │          │ │          │ │          │o│
│  │   (4)    │ │    (2)   │ │    (1)   │ │    (0)   │ │    (1)   │t│
│  │          │ │          │ │          │ │          │ │          │ │
│  ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤s│
│  │          │ │          │ │          │ │          │ │          │e│
│  │┌────────┐│ │┌────────┐│ │┌────────┐│ │          │ │┌────────┐│l│
│  ││ Amara  ││ ││ David  ││ ││ Jessica││ │          │ ││ Chuk   ││e│
│  ││ C.     ││ ││ K.     ││ ││ M.     ││ │          │ ││ A.     ││c│
│  ││Senior ││ ││Account ││ ││Project ││ │          │ ││Senior ││t│
│  ││Python ││ ││Manager ││ ││Manager ││ │          │ ││Data    ││e│
│  ││AWS    ││ ││        ││ ││        ││ │          │ ││Engineer││d│
│  └┴────────┘│ └┴────────┘│ └┴────────┘│ │          │ │└┴────────┘│ │
│  │          │ │          │ │          │ │          │ │          │ │
│  │┌────────┐│ │┌────────┐│ │          │ │          │ │          │ │
│  ││ Korede││ ││ Ama    ││ │          │ │          │ │          │ │
│  ││ O.     ││ ││ N.     ││ │          │ │          │ │          │ │
│  ││Full    ││ ││Backend ││ │          │ │          │ │          │ │
│  ││Stack   ││ ││Dev     ││ │          │ │          │ │          │ │
│  ││Node.js ││ ││Java    ││ │          │ │          │ │          │ │
│  └┴────────┘│ └┴────────┘│ │          │ │          │ │          │ │
│  │          │ │          │ │          │ │          │ │          │ │
│  │┌────────┐│ │          │ │          │ │          │ │          │ │
│  ││ Folake││ │          │ │          │ │          │ │          │ │
│  ││ P.     ││ │          │ │          │ │          │ │          │ │
│  ││QA Lead ││ │          │ │          │ │          │ │          │ │
│  ││Manual  ││ │          │ │          │ │          │ │          │ │
│  ││Testing ││ │          │ │          │ │          │ │          │ │
│  └┴────────┘│ │          │ │          │ │          │ │          │ │
│  │          │ │          │ │          │ │          │ │          │ │
│  │┌────────┐│ │          │ │          │ │          │ │          │ │
│  ││ Tunde ││ │          │ │          │ │          │ │          │ │
│  ││ T.     ││ │          │ │          │ │          │ │          │ │
│  ││DevOps  ││ │          │ │          │ │          │ │          │ │
│  ││Kubernetes││          │ │          │ │          │ │          │ │
│  ││Docker  ││ │          │ │          │ │          │ │          │ │
│  └┴────────┘│ │          │ │          │ │          │ │          │ │
│  │          │ │          │ │          │ │          │ │          │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┴──┘
```

### Key Features:
- **6 columns:** New → Screening → Interview → Offer → Placed → Not selected
- **Plain language labels:** "Not selected" instead of "Rejected"
- **Live counts:** Each column shows number of candidates
- **Card info:** Name, job title, notes preview if any
- **Drag & drop:** Click and hold to drag card to new column
- **Immediate feedback:** Toast shows "Moved to [Stage]"

---

## 6. Candidate Detail Page - First Visit

**URL:** `/admin/candidates/[appId]` (e.g., `/admin/candidates/xyz-789`)

### Screen 6: Candidate Profile
```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to candidates                                            │
│                                                                 │
│ Left column (2/3 width):                                        │
│                                                                 │
│ ┌──────────────────────────────────────┐  [View CV]            │
│ │ Amara Chukwu                         │                       │
│ │ Senior Python Developer              │                       │
│ │                                      │                       │
│ │ Email: amara.chukwu@email.com       │                       │
│ │                                      │                       │
│ │ Professional Summary:                │                       │
│ │ 8 years of experience building       │                       │
│ │ scalable web applications with       │                       │
│ │ Python and Django. Expert in AWS     │                       │
│ │ cloud architecture...                │                       │
│ │                                      │                       │
│ │ Skills:                              │                       │
│ │ [Python] [Django] [AWS] [Docker]     │                       │
│ │ [PostgreSQL] [Kubernetes]            │                       │
│ │                                      │                       │
│ │ Applied For: Senior Backend Dev      │                       │
│ │ Description: We're looking for...    │                       │
│ │                                      │                       │
│ │ Applied On: July 28, 2026            │                       │
│ └──────────────────────────────────────┘                       │
│                                                                 │
│ ┌──────────────────────────────────────┐                       │
│ │ Notes                          [Edit]│                       │
│ │ No notes yet                         │                       │
│ └──────────────────────────────────────┘                       │
│                                                                 │
│ Right column sidebar (1/3 width):                              │
│                                                                 │
│ ┌──────────────────────────────────────┐                       │
│ │ Update Status                        │                       │
│ │                                      │                       │
│ │ [New              ] (current)        │                       │
│ │ [Screening        ]                  │                       │
│ │ [Schedule inter...] (disabled)       │                       │
│ │ [Send offer       ] (disabled)       │                       │
│ │ [Mark placed      ] (disabled)       │                       │
│ │ [Not selected     ]                  │                       │
│ │                                      │                       │
│ │ Current status: New                  │                       │
│ │ Use the action buttons to move this  │                       │
│ │ candidate through the pipeline. Each │                       │
│ │ update will save immediately and     │                       │
│ │ send notifications.                  │                       │
│ └──────────────────────────────────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Action Sequence: Add notes, then move to Screening

**Step 1: Click "Edit" on Notes**
```
┌──────────────────────────────────────┐
│ Notes                           [Edit]│
│                                      │
│ [Notes input box with placeholder]  │
│                                      │
│ [Cancel]             [Save notes]   │
└──────────────────────────────────────┘
```

**Step 2: Type notes**
```
Admin types: "Strong technical skills, impressed by AWS portfolio. 
Recommended for screening round. Follow up on previous project 
end dates for timeline clarity."
```

**Step 3: Click "Save notes"**
- Button shows "Saving..." briefly
- Green toast: "Notes saved"
- Toast auto-dismisses after 3 seconds
- Textarea closes, notes display in read-only mode

**Step 4: Click "Screening" button**
- Green toast: "Candidate moved to Screening"
- Current button becomes disabled/grayed out: (current)
- Immediately moves card on kanban board in background
- If they go back to kanban, card has moved to Screening column

**Console Logs:**
```
[Candidate Detail] Notes update successful
[Candidate Detail] Stage update successful
Moved candidate xyz-789 from applied to screening
```

---

## 7. Candidate Card Movement on Kanban

### Step 1: Back to Kanban Board
**URL:** `/admin/candidates`

The card now shows up in "Screening" column:

```
┌──────────────┐ ┌──────────────┐
│   New (3)    │ │Screening(3) │
├──────────────┤ ├──────────────┤
│              │ │              │
│┌────────────┐│ │┌────────────┐│
││ Korede    ││ ││ Amara      ││
││ O.        ││ ││ C.         ││
││Full Stack ││ ││Senior      ││
││           ││ ││"Strong tech...││
└┴────────────┘│ └┴────────────┘│
│              │ │              │
│┌────────────┐│ │┌────────────┐│
││ Folake    ││ ││ David      ││
││ P.        ││ ││ K.         ││
││QA Lead    ││ ││Account Mgr ││
│└────────────┘│ │└────────────┘│
│              │ │              │
│┌────────────┐│ │┌────────────┐│
││ Tunde     ││ ││ Ama        ││
││ T.        ││ ││ N.         ││
││DevOps     ││ ││Backend Dev ││
│└────────────┘│ │└────────────┘│
│              │ │              │
└──────────────┘ └──────────────┘
```

### Step 2: Drag Amara from "Screening" to "Interview"

**User action:** Click and hold Amara's card, drag to Interview column, release

**Automatic actions:**
1. Card visually moves in UI with smooth transition
2. Database updates: `applications.stage = 'interview'` for her record
3. `updated_at` timestamp set automatically
4. Toast appears: "Moved to Interview"
5. Interview column count increases from 1 to 2
6. Screening column count decreases from 3 to 2

**If there's an error (network issue, permission denied):**
- Card snaps back to original column
- Red toast: "Failed to move candidate"
- No database update happens

**Console Logs:**
```
[Kanban] Drop handler triggered for stage: interview
Updated application xyz-789 stage from screening to interview
[Kanban] Drop successful, showing toast
```

---

## 8. Interview Stage - Schedule Button

**URL:** `/admin/candidates/[appId]` (same candidate, now in Interview stage)

### Screen 8: Interview Stage Actions
```
┌──────────────────────────────────────┐
│ Update Status                        │
│                                      │
│ [New              ]                  │
│ [Screening        ]                  │
│ [Schedule inter...] (current)        │
│ [Send offer       ]                  │
│ [Mark placed      ] (disabled)       │
│ [Not selected     ]                  │
│                                      │
│ Current status: Interview            │
└──────────────────────────────────────┘
```

### Action: Click "Schedule interview"
- Same pattern as before: database update, toast confirmation
- Green toast: "Candidate moved to Interview scheduled"
- Card moves to Interview column on kanban (visual feedback)
- Button becomes disabled for this stage

---

## 9. Multi-Stage Flow - Offer to Placed

### Path: Interview → Offer → Placed

**From Interview stage:**
1. Admin clicks "Send offer" button
2. Toast: "Candidate moved to Offer"
3. Card moves to Offer column on kanban
4. Database updates application.stage = 'offer'

**From Offer stage:**
1. Admin clicks "Mark placed" button
2. Toast: "Candidate moved to Placed"
3. Card moves to Placed column on kanban (green background)
4. Database updates application.stage = 'placed'

**Rejection path (any stage):**
1. Admin clicks "Not selected" button
2. Toast: "Candidate moved to Not selected"
3. Card moves to rightmost column (red background)
4. Database updates application.stage = 'rejected'

---

## 10. Confirming Complete Flow End-to-End

### Timeline Summary:
```
1. ADMIN LOGS IN
   ↓ (Authenticate, verify admin role)
   
2. SEES TODAY'S FEED
   ↓ (Shows 2 pending requests, 1 new application)
   
3. OPENS FIRST REQUEST
   ↓ (View Zenith Bank details, contact info)
   
4. CHANGES REQUEST STATUS: NEW → IN PROGRESS
   ↓ (Toast: "Status updated successfully")
   
5. NAVIGATES TO CANDIDATES
   ↓ (Kanban board appears with 6 columns)
   
6. OPENS AMARA'S APPLICATION
   ↓ (Full profile, notes, skills, CV link visible)
   
7. ADDS NOTES
   ↓ (Types assessment, clicks Save)
   ↓ (Toast: "Notes saved")
   
8. MOVES TO SCREENING
   ↓ (Clicks "Screening" button)
   ↓ (Toast: "Candidate moved to Screening")
   
9. BACK TO KANBAN
   ↓ (Amara's card now in Screening column)
   
10. DRAGS AMARA TO INTERVIEW
    ↓ (Drag and drop interaction)
    ↓ (Toast: "Moved to Interview")
    
11. BACK TO CANDIDATE DETAIL
    ↓ (Open Amara again to add more notes)
    
12. ADDS MORE NOTES: "Good fit, proceed to offer"
    ↓ (Save notes)
    ↓ (Toast: "Notes saved")
    
13. CLICKS "SEND OFFER"
    ↓ (Toast: "Candidate moved to Offer")
    
14. NAVIGATES BACK TO KANBAN
    ↓ (Amara now in Offer column)
    
15. WORKFLOW CONTINUES...
    ↓ (Next: Move to Placed, Mark as Not selected, etc.)
```

---

## Key Non-Technical Operator Principles Implemented

### ✅ Plain Language
- Buttons say "Schedule interview", "Send offer", "Mark placed", "Not selected"
- No jargon like "advance stage", "pipeline progression", "transition"
- Feed says "needs 5 sales executives" not "staffing request for 5 roles"

### ✅ Confirmation at Every Action
- Every stage change shows a toast: "Moved to [Stage]"
- Every note save shows a toast: "Notes saved"
- Every status update shows a toast: "Status updated successfully"
- No silent saves

### ✅ Kanban Instead of Tables
- Visual pipeline shows candidate flow
- Drag-to-move is intuitive (no dropdown menus for status)
- Column headers are large and clear
- Card counts per stage visible at a glance

### ✅ One Clear Verb Per Button
- "Review" (on home feed)
- "View" (on requests list)
- "Schedule interview" (not "advance to interview")
- "Mark placed" (not "update stage to placed")
- "Send offer" (not "move to offer")
- "Not selected" (not "reject")

### ✅ Role-Based Navigation
- Only admins can access `/admin/*`
- Navigation shows relevant sections for admin role
- Logout always available
- Redirect to login if not authenticated

---

## Database Interactions Summary

### Tables Modified:
1. **staffing_requests**
   - `UPDATE status` on status change
   - `updated_at` auto-set by trigger

2. **applications**
   - `UPDATE stage` on every stage change
   - `UPDATE notes` on note save
   - `updated_at` auto-set by trigger

### RLS Policies Used:
- `is_admin()` function checks role
- Admin policies allow full access
- All queries respect RLS automatically

### Error Handling:
- Full error objects logged with `console.error`
- User sees plain language error messages
- Failed operations don't update local state
- Network errors show "An error occurred"

---

## Production Readiness Checklist

- [x] Admin login with role verification
- [x] Role-based navigation in header
- [x] Role-based page access (redirect if not admin)
- [x] Home feed showing pending action items
- [x] Requests list with status badges
- [x] Request detail with status management
- [x] Kanban board with 6 stages
- [x] Drag-to-move candidate cards
- [x] Candidate detail page
- [x] Notes editor with save
- [x] Stage action buttons with tooltips
- [x] Toast confirmations on every action
- [x] Error handling and display
- [x] Console logging for debugging
- [x] Mobile responsive design
- [x] Brand colors throughout
- [x] TypeScript types all correct
- [x] Build passes (no type errors)
- [x] RLS policies enforced
- [x] `.maybeSingle()` used everywhere
- [x] No raw "check if admin" queries
