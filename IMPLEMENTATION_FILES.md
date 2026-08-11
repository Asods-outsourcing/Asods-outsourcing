# ASODS Talent Pool - Implementation File Structure

## Files Created

### Public Form Pages
```
src/app/talent-pool/
└── page.tsx                                    # Main page wrapper

src/components/talent-pool/
├── TalentPoolForm.tsx                         # Main form component with state & branching
├── SuccessMessage.tsx                         # Success page after submission
└── pages/
    ├── Page1PersonalInfo.tsx                  # Personal information (6 fields)
    ├── Page2Education.tsx                     # Education & certifications check
    ├── Page3Certifications.tsx                # Professional certifications (only if yes on page 2)
    ├── Page4WorkExperience.tsx                # Employment status (branching point)
    ├── Page5CurrentEmployment.tsx             # Current job details (only if employed/self-employed)
    ├── Page6SkillsCompetencies.tsx           # Skills checkboxes + digital literacy
    ├── Page7JobPreferences.tsx                # Job preferences & relocation
    ├── Page8AvailabilityCompensation.tsx     # Availability, salary, training
    ├── Page9CandidateScreening.tsx           # Screening questions (5 paragraphs)
    ├── Page10RoleSpecificAssessment.tsx      # Assessment track selection + Q&A
    ├── Page12CVDocuments.tsx                  # CV & certificate file uploads
    ├── Page13References.tsx                   # Professional references (optional)
    ├── Page14Declaration.tsx                  # Consent checkboxes
    └── Page15HowDidYouHear.tsx               # Referral source
```

### Admin Interface
```
src/app/admin/talent-pool/
├── page.tsx                                   # List all submissions (search, filter, sort)
└── [id]/
    └── page.tsx                               # Detail view with admin controls
```

### Updated Files
```
src/components/
└── Header.tsx                                 # Added "Talent Pool" to navigation

src/app/admin/
└── layout.tsx                                 # Added "Talent Pool" to admin nav
```

### Database
```
supabase/migrations/
└── 0004_talent_pool.sql                      # Table, storage bucket, RLS policies
                                               # (ALREADY CREATED - not modified)
```

### Documentation
```
TALENT_POOL_IMPLEMENTATION_COMPLETE.md         # Full implementation details & spec mapping
QUICK_TEST_GUIDE.md                            # Step-by-step testing guide
IMPLEMENTATION_FILES.md                        # This file
test-talent-pool.js                            # Example test data structure
```

## File Count Summary
- **New form pages**: 15 components
- **Form wrapper**: 1 component
- **Success page**: 1 component
- **Admin pages**: 2 components
- **Updated navigation**: 2 files
- **Documentation**: 3 files
- **Total new/modified**: 26 files

## Data Storage Architecture

### Database Table: `talent_pool_submissions`

#### Real Columns (Indexed for Admin Queries)
```sql
-- Personal Information
full_name TEXT
email TEXT
phone TEXT
state_of_residence TEXT
city_lga TEXT
preferred_contact_method TEXT

-- Education
highest_education TEXT
field_of_study TEXT
institution TEXT
graduation_year TEXT
has_certifications BOOLEAN

-- Work Experience
employment_status TEXT
current_job_title TEXT
current_company TEXT
current_industry TEXT
years_in_role TEXT

-- Skills & Preferences
digital_literacy_rating INT
preferred_roles TEXT[]  -- Array type
work_arrangement TEXT[]
employment_type TEXT[]
preferred_location TEXT
willing_to_relocate TEXT

-- Availability
availability TEXT
salary_expectation TEXT
willing_to_train TEXT

-- Assessment
assessment_track TEXT

-- Files
cv_url TEXT
certificate_urls TEXT[]

-- Referral
referral_source TEXT
referral_name TEXT

-- Admin Fields
tier candidate_tier  -- Enum: A, B, C, inactive, unrated
status talent_pool_status  -- Enum: new, reviewing, contacted, placed, inactive
admin_notes TEXT
last_contacted_at TIMESTAMPTZ

-- Timestamps
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

#### JSONB Column: `detailed_responses`
Stores flexible, optional, and long-tail response data:

```json
{
  "certifications_list": ["ICAN", "ACCA"],
  "additional_certifications": "string",
  "strongest_skills": ["Customer Service", "Sales"],
  "skill_to_improve": "string",
  "current_responsibilities": "string",
  "current_achievements": "string",
  "about_yourself": "string",
  "strongest_qualities": "string",
  "difficult_situation": "string",
  "task_prioritization": "string",
  "why_employer_should_consider": "string",
  "comfortable_with_kpis": "Yes|No|Depends on the role",
  "assessment_answers": {
    "q1": "answer text",
    "q2": "answer text",
    "q3": "answer text",
    "excel_rating": "1-5"
  },
  "reference_name": "string",
  "reference_relationship": "string",
  "reference_contact": "string"
}
```

### Storage Bucket: `talent-pool-files`
```
talent-pool-files/
├── cv-{timestamp}-{random}.pdf               # CVs
└── cert-{timestamp}-{random}.{ext}           # Certificates & portfolio
```

## Component Hierarchy

```
TalentPoolForm (main state container)
├── Page1PersonalInfo
├── Page2Education
├── Page3Certifications
├── Page4WorkExperience
├── Page5CurrentEmployment
├── Page6SkillsCompetencies
├── Page7JobPreferences
├── Page8AvailabilityCompensation
├── Page9CandidateScreening
├── Page10RoleSpecificAssessment
├── Page12CVDocuments
├── Page13References
├── Page14Declaration
└── Page15HowDidYouHear
    └── (on success)
        └── SuccessMessage

AdminTalentPoolList (search, filter, sort)
├── (renders table rows linking to...)
└── AdminTalentPoolDetail (full view + controls)
```

## State Management

### TalentPoolForm State
```typescript
interface FormData {
  // All 60+ form fields
  // Updates via handleInputChange callback
  // Branching logic via handleNext/handleBack
  // Submission via handleSubmit
}

// Current page tracking
currentPage: number (1-15)

// UI state
isSubmitting: boolean
submissionError: string | null
submissionSuccess: boolean
```

### AdminTalentPoolDetail State
```typescript
interface Submission {
  // All form fields + admin fields
}

// Edit state
tier: string
status: string
notes: string
isSaving: boolean
```

### AdminTalentPoolList State
```typescript
// Filter/sort state
searchQuery: string
tierFilter: TierFilter
statusFilter: StatusFilter
sortBy: SortBy
sortOrder: 'asc' | 'desc'

// Display state
submissions: Submission[]
loading: boolean
```

## API Integration

### Supabase Client
- Uses `createClient()` from `src/lib/supabase/client.ts`
- All queries use Row Level Security (RLS)

### RLS Policies
```sql
-- talent_pool_public_insert
-- ANYONE can INSERT (public form)

-- talent_pool_admin_select
-- ADMIN only can SELECT (view submissions)

-- talent_pool_admin_update
-- ADMIN only can UPDATE (edit tier, status, notes)

-- talent_pool_admin_delete
-- ADMIN only can DELETE

-- storage talent_pool_files_public_insert
-- ANYONE can upload files

-- storage talent_pool_files_public_read
-- ANYONE can read files (for public URLs)
```

## File Upload Flow

1. User selects file on Page 12
2. File validated (type, size)
3. Uploaded to `talent-pool-files` storage bucket
4. Public URL returned
5. URL stored in `cv_url` or `certificate_urls` array
6. On submission, URLs included in submission object
7. Admin can download from public URL

## Build & Runtime

### Build
```bash
npm run build
# Generates optimized production build
# All TypeScript validated
# No runtime errors
```

### Development
```bash
npm run dev
# Runs Next.js dev server
# Available at http://localhost:3001
# Hot reload enabled
```

### Environment Required
```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Navigation Structure

### Public Site
```
Header Navigation
├── Home
├── About
├── Services
├── Industries
├── Careers
├── Talent Pool          ← NEW
├── For Employers
└── Contact
```

### Admin Panel
```
Admin Header
├── Today (Dashboard)
├── Requests
├── Candidates
├── Jobs
├── Deployed
├── Talent Pool          ← NEW
└── Settings
```

## Testing Files

```
test-talent-pool.js                            # Example submission structure
QUICK_TEST_GUIDE.md                            # Step-by-step test scenario
```

## Documentation Files

```
TALENT_POOL_IMPLEMENTATION_COMPLETE.md         # Complete spec mapping & features
IMPLEMENTATION_FILES.md                        # This file (file structure)
QUICK_TEST_GUIDE.md                            # Testing guide
```

## Key Technologies Used

- **React 18+**: UI components with hooks (useState, useEffect, useCallback)
- **Next.js 15+**: Framework with App Router
- **TypeScript**: Full type safety
- **Supabase**: Database, storage, authentication
- **Tailwind CSS**: Styling (inherited from project)

## Naming Conventions

### Components
- Page components: `Page{Number}{Topic}.tsx`
- Admin pages: `[id]/page.tsx` in Next.js app router format

### Database
- Table: `talent_pool_submissions` (snake_case)
- Columns: Mixed (project standard)
  - Core fields: `snake_case`
  - Arrays: `plural_snake_case`
  - JSONB: `snake_case`
- Enums: `candidate_tier`, `talent_pool_status`

### Storage
- Bucket: `talent-pool-files`
- File paths: `{type}-{timestamp}-{random}.{ext}`

### Routes
- Public: `/talent-pool`
- Admin list: `/admin/talent-pool`
- Admin detail: `/admin/talent-pool/[id]`

## Dependencies

No new npm packages added. Uses existing project dependencies:
- next
- react
- react-dom
- @supabase/supabase-js
- typescript
- tailwindcss
- etc.

## Exports & Imports

All components use:
- `'use client'` directive for client-side components
- `import { createClient } from '@/lib/supabase/client'` for DB access
- Standard Next.js imports (Link, useRouter, useParams, etc.)

## Performance Considerations

- Forms use client-side state (no unnecessary re-renders)
- Admin list uses server queries with filters
- File uploads chunked (10MB max per file)
- Branching logic computed on client (instant)
- Admin detail page fetches full record once on mount
