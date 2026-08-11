# Quick Test Guide - ASODS Talent Pool

## Access Points

### Public Form
- **URL**: http://localhost:3001/talent-pool
- **Status**: No login required
- **Features**: 15-page form with progress bar

### Admin Panel
- **URL**: http://localhost:3001/admin/talent-pool
- **Status**: Requires admin login
- **Features**: List all submissions, view details, manage tier/status/notes

## Test Scenario: Customer Service Track (Complete Path)

### Step 1: Fill out the form
Navigate to http://localhost:3001/talent-pool

#### Page 1 - Personal Information
```
Full Name: John Test Candidate
Email: john.test@example.com
Phone: +234 701 234 5678
State: Lagos
City/LGA: Ikoyi
Preferred Contact: WhatsApp
→ Click Next
```

#### Page 2 - Education
```
Highest Education: Bachelor's Degree
Field of Study: Business Administration
Institution: University of Lagos
Graduation Year: 2022
Professional Certifications: YES ← This triggers Page 3
→ Click Next
```

#### Page 3 - Professional Certifications
```
Select: ICAN, Microsoft Certification
Additional: "Google Analytics Certification in progress"
→ Click Next (skips to Page 4, as branching is automatic)
```

#### Page 4 - Work Experience
```
Employment Status: Employed ← This triggers Page 5
→ Click Next
```

#### Page 5 - Current/Recent Employment
```
Job Title: Customer Service Officer
Company: Tech Solutions Ltd
Industry: IT/Software
Years in Role: 1–2 years
Responsibilities: Handle customer inquiries, manage support tickets, resolve issues promptly
Key Achievements: Improved customer satisfaction by 15%, resolved 500+ tickets
→ Click Next
```

#### Page 6 - Skills & Competencies
```
Select at least 3 skills: 
  ☑ Customer Service
  ☑ Written Communication
  ☑ Presentation
  ☑ Teamwork
  ☑ Problem Solving
Skill to Improve: Data Analysis
Digital Literacy: 4
→ Click Next
```

#### Page 7 - Job Preferences
```
Roles: ☑ Customer Service Representative, ☑ Administrative Assistant
Work Arrangement: ☑ Hybrid, ☑ Remote
Employment Type: ☑ Full-time, ☑ Contract
Preferred Location: Lagos, Abuja
Willing to Relocate: Maybe
→ Click Next
```

#### Page 8 - Availability & Compensation
```
How soon can start: Within 1 week
Salary Expectation: ₦150,000–₦250,000
Willing to train: Yes
→ Click Next
```

#### Page 9 - Candidate Screening
```
About yourself: I am a dedicated customer service professional with 2 years of experience in tech support.

Three strongest qualities: Patience, problem-solving, communication skills

Difficult situation: Once had an angry customer demanding refund. I listened, empathized, offered solution.

Task prioritization: I use a priority matrix - urgent/important first, then schedule others

Why consider you: My track record of high customer satisfaction and proven ability to handle difficult situations

Comfortable with KPIs: Yes
→ Click Next
```

#### Page 10 - Role-Specific Assessment
```
Primary area of interest: Customer Service
(This shows 3 Customer Service-specific questions)

Q1 - "A customer is angry...": I would apologize, listen to their concern, and work to find a solution immediately

Q2 - "What does excellent customer service...": Understanding customer needs and exceeding expectations

Q3 - "How would you handle a rude customer...": I would remain calm, empathize with their frustration, and work professionally
→ Click Next
```

#### Page 12 - CV & Supporting Documents
```
Upload CV: (optional for this test, can skip)
Upload Certificates: (optional)
→ Click Next
```

#### Page 13 - Professional References
```
Reference Name: Mary Okonkwo
Relationship: Former Manager
Contact: mary.okonkwo@example.com
→ Click Next
```

#### Page 14 - Declaration & Consent
```
☑ Candidate Declaration checkbox
☑ Talent Pool Consent checkbox
☑ Communication Consent checkbox
(All three must be checked to enable submit)
→ Click Next
```

#### Page 15 - How Did You Hear About Us
```
How did you hear: LinkedIn
(Referral name not shown as we didn't select Friend/Referral)
→ Click "Submit Registration"
```

### Step 2: Verify Success Message
You should see:
- ✓ "Registration Successfully Submitted!"
- "Thank you for registering with the ASODS Talent Pool."
- "Your profile has been successfully received..."
- Button to "Return to Home"

### Step 3: View in Admin Panel
1. Log in to admin (if not already): http://localhost:3001/admin/login
2. Navigate to: http://localhost:3001/admin/talent-pool
3. You should see the new submission in the list:
   - Name: John Test Candidate
   - Email: john.test@example.com
   - Location: Lagos
   - Roles: Shows Customer Service Representative, Administrative Assistant
   - Tier: unrated (default)
   - Status: new (default)
   - Registered: Today's date

### Step 4: View Submission Detail
1. Click "View" on the submission row
2. Verify these sections display:
   - **Personal Information**: All 6 fields from Page 1
   - **Education**: All education fields + certifications list (from JSONB)
   - **Current/Recent Employment**: Job, company, industry, responsibilities, achievements
   - **Skills & Competencies**: Checkboxes selected, skill to improve, literacy rating
   - **Job Preferences**: All selections
   - **Availability & Compensation**: Start date, salary, training choice
   - **Candidate Screening**: All 5 paragraph answers + KPI response
   - **Role-Specific Assessment**: Shows "Customer Service" track with 3 Q&A pairs (from JSONB.assessment_answers)
   - **Professional Reference**: Name, relationship, contact
   - **How They Found Us**: LinkedIn

### Step 5: Test Admin Controls
1. In the detail view, find the sidebar on the right
2. Change Tier: Select "A - Job Ready"
3. Change Status: Select "reviewing"
4. Add Admin Notes: "Excellent candidate, follow up next week"
5. Click "Save Changes"
6. Verify success message
7. Refresh page - changes should persist

### Step 6: Test List Page Filters
Back on http://localhost:3001/admin/talent-pool:
1. **Search**: Type "john.test@example.com" - should show 1 result
2. **Tier Filter**: Select "A - Job Ready" - should show your submission
3. **Status Filter**: Select "reviewing" - should show your submission
4. **Sort**: Change from "Date" to "Name" - order should change
5. **Sort Order**: Toggle between ascending/descending

## What's Tested

✓ Form branching (certifications, employment status, assessment track)
✓ All field types (text, email, phone, dropdown, radio, checkbox, textarea, file upload)
✓ Data storage to database columns
✓ Data storage to JSONB detailed_responses
✓ Admin list with search, filter, sort
✓ Admin detail view rendering all data
✓ Admin controls for tier, status, notes
✓ Success message with exact wording

## Database Verification

To verify data in Supabase:
1. Go to Supabase dashboard for asods-starter
2. Navigate to `talent_pool_submissions` table
3. Find the row with your test email
4. Check:
   - Columns contain: full_name, email, phone, state_of_residence, etc.
   - JSONB `detailed_responses` contains: certifications_list, about_yourself, assessment_answers, etc.
5. You should see the exact data you entered

## Troubleshooting

### Form doesn't load
- Check dev server is running: `npm run dev`
- Clear browser cache
- Try incognito/private window

### File upload fails
- Verify storage bucket `talent-pool-files` exists in Supabase
- Check .env.local has correct SUPABASE_URL and SUPABASE_ANON_KEY

### Admin page shows "not found"
- Verify you're logged in to admin (should see "ASODS Admin" header)
- Check URL is exactly: `/admin/talent-pool`

### Data doesn't appear in admin
- Wait 1-2 seconds after form submission
- Refresh admin list page
- Check browser console for errors

## Success Criteria

✓ Form submits without errors
✓ Success page displays with exact wording
✓ Submission appears in admin list within 2 seconds
✓ All data visible in admin detail view
✓ JSONB fields properly formatted and readable
✓ Admin controls (tier, status, notes) work and persist
✓ Search, filter, sort work on list page
