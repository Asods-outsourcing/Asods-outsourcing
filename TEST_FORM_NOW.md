# TEST TALENT POOL FORM - STEP BY STEP

## Current Status
- ✅ Dev server running on http://localhost:3000
- ✅ Better error logging added
- ✅ Field validation added
- ✅ Ready to test

## STEP 1: Open Form with Developer Tools

1. Open browser to http://localhost:3000/talent-pool
2. Press `F12` to open Developer Tools
3. Click "Console" tab at top of dev tools
4. **Keep this open** - you'll see real error messages here

## STEP 2: Fill Form - Shortest Valid Path

Follow these steps EXACTLY. This is the shortest valid path to test submission.

### PAGE 1/15 - Personal Information

```
Full Name:         Test User 123
Email:             test.user+123@example.com
Phone:             +234 701 234 5678
State:             Lagos
City/LGA:          Ikoyi
Contact Method:    WhatsApp
```

Click **Next**

### PAGE 2/15 - Education

```
Education:         Bachelor's Degree
Field of Study:    Business Administration
Institution:       University of Lagos
Graduation Year:   2022
Certifications:    NO  ← Select NO to skip Page 3
```

Click **Next** → Should go to Page 4 (skipping Page 3)

### PAGE 4/15 - Work Experience

```
Employment:        Unemployed  ← Select to skip Page 5
```

Click **Next** → Should go to Page 6 (skipping Page 5)

### PAGE 6/15 - Skills & Competencies

```
Select Skills:     ☑ Customer Service
                   ☑ Sales
                   ☑ Teamwork
Improve:           Microsoft Excel
Digital Literacy:  3  (radio button)
```

Click **Next**

### PAGE 7/15 - Job Preferences

```
Roles:             ☑ Customer Service Representative
                   ☑ Sales Executive
Arrangements:      ☑ Remote
Employment Type:   ☑ Full-time
Location:          Lagos, Abuja
Relocate:          No
```

Click **Next**

### PAGE 8/15 - Availability & Compensation

```
Start:             Immediately
Salary:            ₦150,000–₦250,000
Training:          Yes
```

Click **Next**

### PAGE 9/15 - Candidate Screening

Fill ALL 5 textareas (any text is fine, just not empty):

```
About yourself:           I am a talented professional with 5+ years experience in customer service and sales.
Strongest qualities:      Communication, problem-solving, leadership
Difficult situation:      Managed angry customer complaint successfully by empathizing and providing solution.
Task prioritization:      I use Eisenhower matrix - urgent/important first, then schedule others accordingly.
Why consider you:         I have proven track record of high performance, customer satisfaction, and team collaboration.
Comfortable with KPIs:    Yes
```

Click **Next**

### PAGE 10/15 - Role-Specific Assessment

```
Select Track:      Customer Service
```

After selecting, 3 questions appear. Answer all 3:

```
Q1 (Angry customer):     I would listen empathetically, apologize for inconvenience, and provide immediate solution.
Q2 (Excellent service):  Meeting customer needs promptly, exceeding expectations, and building long-term relationships.
Q3 (Rude customer):      Remain calm and professional, empathize with their frustration, resolve their issue courteously.
```

Click **Next**

### PAGE 12/15 - CV & Documents

```
Upload CV:         (SKIP - don't upload)
Certificates:      (SKIP - don't upload)
```

Click **Next**

### PAGE 13/15 - Professional References

```
All fields optional - SKIP
```

Click **Next**

### PAGE 14/15 - Declaration & Consent

```
☑ Candidate Declaration checkbox
☑ Talent Pool Consent checkbox
☑ Communication Consent checkbox
```

(All 3 MUST be checked to enable submit button)

Click **Next**

### PAGE 15/15 - How Did You Hear About Us

```
Source:            LinkedIn
Referral name:     (not shown since we didn't select Friend/Referral)
```

Click **Submit Registration**

## STEP 3: Capture the Error

### In Browser Console, Look For:

After clicking submit, scroll up in the console and find these exact log lines:

1. `[FormSubmit] Prepared submission object: {...}`
2. `[FormSubmit] Supabase response - data: ...`
3. `[FormSubmit] Supabase response - error: ...`
4. `Submission error (raw): ...`
5. `Submission error (stringified): ...`
6. `Submission error (type): ...`
7. `Submission error (keys): ...`

### In Browser, Look For:

- Red error message displayed on the form page (if validation fails)
- Or red error popup (if Supabase rejects the submission)

## STEP 4: Copy and Report

### Copy Everything From Console

Right-click in console → Select All → Copy

This will include:
- The submission object that was sent
- The exact error response from Supabase
- The error type, keys, and message

## What We're Looking For

### Success Scenario
- Form submits without error
- Page shows "Registration Successfully Submitted!" message
- Redirects to success page

### Failure Scenario (What we expect to capture)
- Console shows:
  - Supabase error details (message, code, details)
  - Error object structure  
  - Which field(s) are problematic

## Quick Checklist Before Submit

Before clicking "Submit Registration" on Page 15, verify:
- [ ] All required fields filled (no empty/blank fields)
- [ ] Email looks valid (has @ symbol)
- [ ] Phone has +234 prefix
- [ ] At least one skill selected
- [ ] At least one role selected  
- [ ] Assessment track selected (Customer Service)
- [ ] All 3 consent checkboxes checked
- [ ] Referral source selected
- [ ] All screening paragraph answers not empty

## If Validation Error Appears During Navigation

If red error appears when clicking Next:
- Form will prevent you from moving forward
- It will tell you which field is missing
- Go back and fill that field
- Then click Next again

## If Submission Fails

After clicking "Submit Registration":
1. Look at browser error message on form page
2. Check console for detailed logs
3. Capture the exact Supabase error

## Need Help?

If form won't load:
- Clear browser cache (Ctrl+Shift+Delete)
- Try in incognito window
- Check localhost:3000 (no /talent-pool first)

If can't fill a field:
- Check browser console for JavaScript errors
- Try refreshing the page

If getting stuck on a page:
- Make sure ALL required fields on that page are filled
- Red validation error should tell you which field

---

## Ready to Test?

1. ✅ Dev server is running at http://localhost:3000
2. ✅ Better error logging is in place
3. ✅ Form validation is active

**Now go to**: http://localhost:3000/talent-pool

**Follow the steps above**, and when you see an error, send me:
- The exact console output
- The error message displayed on the form
- Steps you followed
