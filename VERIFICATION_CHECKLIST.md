# ASODS Talent Pool - Verification Checklist

Use this checklist to verify the implementation is complete and working.

## ✅ Pre-Check: System Running

- [ ] Dev server running: `npm run dev` outputs "Ready in X.Xs"
- [ ] Access http://localhost:3001 and see ASODS home page
- [ ] No TypeScript errors in terminal
- [ ] No runtime errors in browser console

## ✅ Part 1: Public Navigation

### Step 1: Check Header
- [ ] Navigate to http://localhost:3001
- [ ] Click on "Talent Pool" in header navigation
- [ ] URL changes to http://localhost:3001/talent-pool
- [ ] Page displays form title "ASODS Talent Pool"

### Step 2: Check Progress Bar
- [ ] Progress bar visible showing "Page 1 of 15"
- [ ] Progress bar at ~7% completion (1/15 pages)
- [ ] All page navigation works

## ✅ Part 2: Form Pages (All 15)

### Page 1: Personal Information
- [ ] URL: /talent-pool
- [ ] Fields visible: Full Name, Email, Phone, State, City/LGA, Preferred Contact
- [ ] Can fill all fields
- [ ] Next button works
- [ ] Progress shows "Page 1 of 15"

### Page 2: Education & Qualifications
- [ ] URL: /talent-pool (same)
- [ ] Progress shows "Page 2 of 15"
- [ ] Fields: Education level, Field of Study, Institution, Graduation Year
- [ ] Checkbox: "Do you have certifications?" (Yes/No)
- [ ] Select "Yes" to show both Page 3 → 4 branching
- [ ] Select "No" to skip to Page 4

### Page 3: Professional Certifications
- [ ] Only appears if Page 2 answered "Yes"
- [ ] Progress shows "Page 3 of 15"
- [ ] 10 certification checkboxes visible
- [ ] Can select multiple certifications
- [ ] Textarea for additional certifications
- [ ] Next button skips to Page 4

### Page 4: Work Experience
- [ ] Progress shows "Page 4 of 15"
- [ ] Radio buttons for employment status
- [ ] If "Employed" or "Self-employed" → next is Page 5
- [ ] If other status → next is Page 6 (skips Page 5)

### Page 5: Current/Recent Employment
- [ ] Only appears if employed/self-employed on Page 4
- [ ] Progress shows "Page 5 of 15"
- [ ] Fields: Job Title, Company, Industry (dropdown), Years in Role
- [ ] Textarea: Responsibilities, Achievements
- [ ] Next button goes to Page 6

### Page 6: Skills & Competencies
- [ ] Progress shows "Page 6 of 15"
- [ ] 29 skill checkboxes in grid
- [ ] Can select multiple skills
- [ ] Text input: "Skill to improve"
- [ ] Digital literacy 1-5 radio buttons
- [ ] Next goes to Page 7

### Page 7: Job Preferences
- [ ] Progress shows "Page 7 of 15"
- [ ] Checkboxes for 13 job roles
- [ ] Checkboxes for work arrangements (On-site, Hybrid, Remote)
- [ ] Checkboxes for employment types (Full-time, Part-time, etc.)
- [ ] Text input: Preferred work location
- [ ] Radio buttons: Willing to relocate (Yes, No, Maybe)

### Page 8: Availability & Compensation
- [ ] Progress shows "Page 8 of 15"
- [ ] Radio buttons: How soon can start (5 options)
- [ ] Radio buttons: Salary expectation (7 options with ₦ symbol)
- [ ] Radio buttons: Willing to train (Yes, No, Depends)

### Page 9: Candidate Screening
- [ ] Progress shows "Page 9 of 15"
- [ ] 5 textarea fields for screening questions
- [ ] Radio buttons: Comfortable with KPIs (3 options)
- [ ] All fields required

### Page 10: Role-Specific Assessment
- [ ] Progress shows "Page 10 of 15"
- [ ] 6 radio button options for primary interest:
  - [ ] Customer Service
  - [ ] Sales / Business Development
  - [ ] Administration / Data Entry
  - [ ] Finance / Banking
  - [ ] Logistics / Operations
  - [ ] Digital / IT
- [ ] After selection, 3 Q&A fields appear
- [ ] For Excel question, shows 1-5 radio buttons (not textarea)
- [ ] Other questions show textarea

### Page 12: CV & Supporting Documents
- [ ] Progress shows "Page 12 of 15" (skip page 11)
- [ ] File upload for CV (marked required)
- [ ] File upload for certificates (marked optional)
- [ ] Can select and upload files
- [ ] Files accepted: PDF for CV, any format for certs

### Page 13: Professional References
- [ ] Progress shows "Page 13 of 15"
- [ ] Text inputs: Reference Name, Relationship, Contact
- [ ] All fields marked optional

### Page 14: Declaration & Consent
- [ ] Progress shows "Page 14 of 15"
- [ ] 3 checkboxes with exact wording:
  1. "I confirm that the information provided is accurate..."
  2. "I consent to ASODS retaining my submitted information..."
  3. "I agree that ASODS may contact me..."
- [ ] Submit button disabled until all 3 checked
- [ ] Next button skips to Page 15 (if continuing without submitting)

### Page 15: How Did You Hear About Us?
- [ ] Progress shows "Page 15 of 15"
- [ ] 10 radio options for referral source
- [ ] If "Friend/Referral" selected, shows text input for referrer name
- [ ] "Submit Registration" button (or "Next" if going back)

## ✅ Part 3: Form Submission

### Submit Form
- [ ] Fill entire form with test data
- [ ] Complete all required fields
- [ ] Click "Submit Registration" on Page 15
- [ ] See loading state ("Submitting...")
- [ ] Page redirects to success page

### Success Page
- [ ] URL: Still /talent-pool (same page)
- [ ] Message shows: "Registration Successfully Submitted! ✓"
- [ ] Message includes: "Thank you for registering with the ASODS Talent Pool"
- [ ] Message includes: "Your profile has been successfully received..."
- [ ] Message includes: "keep your phone number, WhatsApp and email active..."
- [ ] ASODS branding visible
- [ ] Button: "Return to Home" links to /

## ✅ Part 4: Admin List View

### Access Admin
- [ ] Navigate to http://localhost:3001/admin/talent-pool
- [ ] If not logged in, redirected to /admin/login
- [ ] Log in with admin credentials
- [ ] See admin header "ASODS Admin"

### List Page Display
- [ ] Table visible with columns:
  - [ ] Name (with employment status underneath)
  - [ ] Contact (email, phone)
  - [ ] Location
  - [ ] Roles (first 2, with +N more)
  - [ ] Tier (colored badge: A/B/C/etc)
  - [ ] Status (colored badge: New/Reviewing/etc)
  - [ ] Registered date
  - [ ] View link

### List Page Controls
- [ ] **Search box**: Type name/email/phone → filters results
- [ ] **Tier dropdown**: Select "A - Job Ready" → shows only A tier
- [ ] **Status dropdown**: Select "new" → shows only new submissions
- [ ] **Sort by dropdown**: Can select Date/Name/Status/Tier
- [ ] **Order toggle**: Button switches between ascending/descending
- [ ] **Results count**: Shows "Showing X of Y"

### Test Data Appears
- [ ] Your test submission appears in the table
- [ ] Name matches what you entered
- [ ] State/location shows correctly
- [ ] Tier shows "unrated" (default)
- [ ] Status shows "new" (default)
- [ ] Registration date shows today

## ✅ Part 5: Admin Detail View

### Access Detail Page
- [ ] Click "View" button on your test submission
- [ ] URL changes to /admin/talent-pool/[uuid]
- [ ] Can go back with "← Back to Submissions" link

### Sections Display
Verify each section shows correct data:

- [ ] **Header**: Name, employment status, registration date
- [ ] **Personal Information**: All 6 fields from Page 1
- [ ] **Education**: Education level, field, institution, year, certifications (from JSONB)
- [ ] **Current/Recent Employment** (if applicable):
  - [ ] Job title, company, industry, years
  - [ ] Responsibilities text
  - [ ] Achievements text
- [ ] **Skills & Competencies**:
  - [ ] Selected skills displayed as badges
  - [ ] Skill to improve shows
  - [ ] Digital literacy rating (e.g., 4/5)
- [ ] **Job Preferences**:
  - [ ] Roles shown as badges
  - [ ] Work arrangements, employment types listed
  - [ ] Location and relocation preference
- [ ] **Availability & Compensation**:
  - [ ] Start date, salary expectation, training willingness
- [ ] **Candidate Screening**:
  - [ ] "About yourself" paragraph
  - [ ] "Strongest qualities" paragraph
  - [ ] "Difficult situation" paragraph
  - [ ] "Task prioritization" paragraph
  - [ ] "Why consider you" paragraph
  - [ ] "Comfortable with KPIs" response
- [ ] **Role-Specific Assessment**:
  - [ ] Assessment track shown (e.g., "Customer Service")
  - [ ] 3 Q&A pairs visible (from JSONB.assessment_answers)
- [ ] **Professional Reference** (if provided):
  - [ ] Name, relationship, contact info
- [ ] **Documents**: 
  - [ ] CV listed with download link
  - [ ] Certificates listed with download links (if uploaded)
- [ ] **How They Found Us**:
  - [ ] Referral source shown

### Admin Controls (Sidebar)
- [ ] **Tier dropdown**: Can select A/B/C/Inactive/Unrated
- [ ] **Status dropdown**: Can select New/Reviewing/Contacted/Placed/Inactive
- [ ] **Admin Notes textarea**: Can type and edit notes
- [ ] **Save Changes button**: Enabled and clickable
- [ ] **Quick info**: Shows updated date and submission ID

### Test Admin Controls
- [ ] Change Tier from "unrated" to "A"
- [ ] Change Status from "new" to "reviewing"
- [ ] Add Admin Notes: "Test submission"
- [ ] Click "Save Changes"
- [ ] See success message
- [ ] Refresh page
- [ ] Verify changes persisted

## ✅ Part 6: File Upload Verification

### Upload Test File
- [ ] Go back to form at /talent-pool
- [ ] Fill form again, get to Page 12
- [ ] Select a PDF file for CV upload
- [ ] File uploads (may show "Uploading..." briefly)
- [ ] Confirms "CV uploaded" with checkmark
- [ ] Can see download link in detail view

### File Access
- [ ] In admin detail page, CV shows with download link
- [ ] Click download link
- [ ] File downloads successfully (not 404)
- [ ] File is correct (same PDF you uploaded)

## ✅ Part 7: Data Verification in Admin

### Verify Exact Values
Using your test submission, verify these exact matches:

- [ ] Full name matches exactly
- [ ] Email matches exactly
- [ ] Phone matches exactly
- [ ] State of residence matches
- [ ] All selected checkboxes appear
- [ ] All textarea content matches word-for-word
- [ ] Assessment answers match exactly
- [ ] Certifications list matches

### Verify JSONB Structure
In admin detail page, all these JSONB fields display:
- [ ] certifications_list (array of strings)
- [ ] additional_certifications (text)
- [ ] strongest_skills (array of badges)
- [ ] skill_to_improve (text)
- [ ] about_yourself (text)
- [ ] strongest_qualities (text)
- [ ] difficult_situation (text)
- [ ] task_prioritization (text)
- [ ] why_employer_should_consider (text)
- [ ] comfortable_with_kpis (text)
- [ ] assessment_answers.q1, q2, q3 (texts)
- [ ] reference_name, reference_relationship, reference_contact (if provided)

## ✅ Part 8: Branching Logic Verification

### Test Branching Path 1: With Certifications
- [ ] Page 2: Select "Yes" for certifications
- [ ] Click Next
- [ ] See Page 3 (Certifications page)
- [ ] Fill and click Next
- [ ] See Page 4 (Work Experience)
- [ ] ✅ Branching correct

### Test Branching Path 2: Without Certifications
- [ ] Restart form at /talent-pool
- [ ] Page 2: Select "No" for certifications
- [ ] Click Next
- [ ] See Page 4 directly (skipped Page 3)
- [ ] ✅ Branching correct

### Test Branching Path 3: Employed
- [ ] Page 4: Select "Employed"
- [ ] Click Next
- [ ] See Page 5 (Current Employment)
- [ ] Fill and click Next
- [ ] See Page 6 (Skills)
- [ ] ✅ Branching correct

### Test Branching Path 4: Not Employed
- [ ] Restart form
- [ ] Pages 1-2 → Page 4
- [ ] Page 4: Select "Unemployed" or "Student"
- [ ] Click Next
- [ ] See Page 6 directly (skipped Page 5)
- [ ] ✅ Branching correct

## ✅ Part 9: Back Navigation

- [ ] On any page, click "Back" button
- [ ] Goes to previous page
- [ ] Form data preserved (fields still filled)
- [ ] Works correctly even with branching

## ✅ Part 10: UI/UX Verification

### Form Display
- [ ] Form centered and readable on desktop
- [ ] Form responsive on mobile
- [ ] No layout shifts when filling
- [ ] Error messages clear if validation fails

### Admin Display
- [ ] Table readable with all columns visible
- [ ] Detail page laid out in readable sections
- [ ] Sidebar with admin controls visible and accessible
- [ ] No console errors in browser dev tools

## ✅ Final Checklist

- [ ] All 15 form pages display correctly
- [ ] Branching logic works (all 4 paths tested)
- [ ] File upload works
- [ ] Form submission succeeds
- [ ] Success page shows correct message
- [ ] Admin list shows submissions
- [ ] Admin detail shows all data including JSONB
- [ ] Admin controls work and persist
- [ ] Search/filter/sort work on admin list
- [ ] Files are downloadable
- [ ] No TypeScript errors during build
- [ ] No runtime errors in console
- [ ] Form accessible at `/talent-pool`
- [ ] Admin accessible at `/admin/talent-pool`
- [ ] Navigation updated in header

---

## 🎯 Success Criteria

✅ **All items checked** = Implementation is complete and working correctly

If any item is unchecked:
1. Note which item
2. Check browser console for errors
3. Check terminal for build errors
4. Review TALENT_POOL_IMPLEMENTATION_COMPLETE.md for that section
5. Check specific file in IMPLEMENTATION_FILES.md

---

Estimated verification time: **20-30 minutes** for complete end-to-end test
