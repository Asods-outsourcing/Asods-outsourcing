# Talent Pool Form Submission - Debug Guide

## Steps to Test and Capture Real Error

### 1. Open Browser Dev Tools
- Go to http://localhost:3000/talent-pool
- Press F12 to open Developer Tools
- Click on "Console" tab
- Keep this open while testing

### 2. Fill Out Complete Form (Shortest Path)

**Page 1 - Personal Information**
```
Full Name: Test User
Email: test@example.com
Phone: +234 701 234 5678
State: Lagos
City/LGA: Ikoyi
Preferred Contact: WhatsApp
```

**Page 2 - Education**
```
Highest Education: Bachelor's Degree
Field of Study: Business Admin
Institution: University of Lagos
Graduation Year: 2022
Professional Certifications: NO (to skip Page 3)
```

**Page 4 - Work Experience**
```
Employment Status: Unemployed (to skip Page 5)
```

**Page 6 - Skills**
```
Select 3 skills (any)
Skill to improve: PowerPoint
Digital literacy: 3
```

**Page 7 - Job Preferences**
```
Roles: Select 2 (any)
Work arrangement: Remote
Employment type: Full-time
Location: Lagos
Relocate: No
```

**Page 8 - Availability**
```
Start: Immediately
Salary: ₦150,000–₦250,000
Training: Yes
```

**Page 9 - Screening**
```
Fill all 5 textareas with any text (e.g., "test answer")
KPIs: Yes
```

**Page 10 - Assessment**
```
Select: Customer Service
Answer 3 questions (e.g., "test answer" for each)
```

**Page 12 - CV**
```
Skip file upload (click Next without uploading)
```

**Page 13 - References**
```
Skip all (click Next)
```

**Page 14 - Declaration**
```
Check all 3 checkboxes
```

**Page 15 - How Heard**
```
Source: LinkedIn
```

### 3. Submit and Capture Error

**On Page 15, click "Submit Registration"**

**In Console, you should see multiple log statements:**
```
[FormSubmit] Prepared submission object: {...}
[FormSubmit] Supabase response - data: ...
[FormSubmit] Supabase response - error: ...
Submission error (raw): ...
Submission error (stringified): ...
Submission error (type): ...
Submission error (keys): ...
```

### 4. Document Everything

**Copy ALL console output** and look for:

1. **Submission object** - What shape is being sent?
   - Are all required fields present?
   - Are NULL/empty fields correct?
   - Is detailed_responses present?

2. **Supabase response error** - What is the error structure?
   - What are the keys in the error object?
   - What is the error message?
   - Is there a details field?
   - Is there a hint field?

3. **Error type** - Is it:
   - An Error instance?
   - A plain object?
   - A string?
   - Something else?

4. **Missing required fields** - Check:
   - availability (Page 8)
   - salary_expectation (Page 8)
   - willing_to_train (Page 8)
   - preferred_location (Page 7)
   - willing_to_relocate (Page 7)
   - assessment_track (Page 10)
   - referral_source (Page 15)

## What to Look For

### Potential Issues

1. **Empty string vs NULL**
   - Form sends `""` but DB expects `null`
   - Fix: Use `|| null` in submission object

2. **Missing JSONB structure**
   - Form doesn't set all fields in detailed_responses
   - Fix: Ensure all JSONB keys are present even if empty

3. **NULL vs NOT NULL mismatch**
   - Form sends `null` for a NOT NULL column
   - Fix: Send empty string `""` or require field on form

4. **Array field issue**
   - Form sends `[]` but DB rejects it
   - Fix: Send `null` instead of empty array for optional fields

5. **Assessment track**
   - If Page 10 not filled, assessment_track is `""`
   - May need to be `null` or a required field

6. **File URL issue**
   - If no CV uploaded, cv_url is `""`
   - May need to be `null` instead

## Expected Success

If submission succeeds, you should see:
```
[FormSubmit] Submission successful, data: [...]
```

And the page should redirect to the success page with the message:
"Registration Successfully Submitted!"

## Actual vs Expected Schema

The migration shows:
```sql
-- These MUST have a value (NOT NULL):
full_name text not null,
email text not null,
phone text not null,
state_of_residence text not null,
city_lga text not null,
preferred_contact_method text not null,
highest_education text not null,
field_of_study text not null,
institution text not null,
graduation_year text not null,
employment_status text not null,
detailed_responses jsonb not null default '{}',

-- These can be NULL (no NOT NULL constraint):
availability text,
salary_expectation text,
willing_to_train text,
assessment_track text,
referral_source text,
...and others
```

## Check This First

In the submission object, verify:
- `full_name` is NOT empty
- `email` is NOT empty
- `phone` is NOT empty  
- `state_of_residence` is NOT empty
- `city_lga` is NOT empty
- `preferred_contact_method` is NOT empty
- `highest_education` is NOT empty
- `field_of_study` is NOT empty
- `institution` is NOT empty
- `graduation_year` is NOT empty
- `employment_status` is NOT empty
- `detailed_responses` is a valid object

If ANY of these are empty/null when NOT NULL is required, that's the error.

## Next Steps After Test

1. Copy the exact console output
2. Look at the actual error message from Supabase
3. Check if it mentions a specific column
4. Send the full console output in the response

This will tell us exactly what's failing and why.
