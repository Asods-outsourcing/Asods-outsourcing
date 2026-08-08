# Job Listing Improvements - Rich Text Editor Implementation

## Overview

Updated the job creation and editing flows to use a professional rich text editor (Tiptap) for job descriptions. Implemented proper separation of concerns with a short "job summary" for listing cards and a rich "description" field for the full posting.

## What Changed

### 1. New Fields

#### Job Summary (NEW)
- **Field Type**: Plain text
- **Length**: Max 200 characters
- **Where it appears**: Job listing cards in `/candidate/jobs`
- **Admin label hint**: "1-2 sentences, shown on the job listing card"
- **Database**: `jobs.job_summary` column (added via migration)

#### Job Description (MODIFIED)
- **Field Type**: Changed from plain textarea to Tiptap rich text editor
- **Storage Format**: HTML (rendered by Tiptap)
- **Where it appears**: Job detail pages (`/candidate/jobs/[jobId]`)
- **Database**: `jobs.description` column (existing, now stores HTML)
- **Supported formatting**: Bold, Italic, Bullet lists, Numbered lists

### 2. New Components

#### `RichTextEditor.tsx`
```typescript
<RichTextEditor 
  value={description}
  onChange={setDescription}
  placeholder="Enter content..."
  disabled={false}
/>
```
- Admin-facing component for creating/editing rich content
- Simple toolbar: B (bold), I (italic), • (list), 1. (ordered list)
- Auto-saves to HTML on every keystroke
- Clear labeling for non-technical admins

#### `RichTextDisplay.tsx`
```typescript
<RichTextDisplay 
  content={job.description}
  className="text-gray-800"
/>
```
- Public-facing component for displaying rich content
- Safely renders HTML with proper formatting
- Uses Tailwind prose classes for professional typography
- No raw tags visible to users

### 3. Updated Pages

#### Admin Dashboard

**Create Job: `/admin/jobs/new`**
- Title field (unchanged)
- **NEW: Job Summary field** (200 char textarea with counter)
- **UPDATED: Description field** (Tiptap editor instead of textarea)
- Location field (unchanged)
- Employer selector (unchanged)
- Public toggle (unchanged)

**Edit Job: `/admin/jobs/[id]`**
- Same layout as create
- Pre-populates all fields including rich content
- Character counter for job summary

#### Candidate Pages

**Job Listings: `/candidate/jobs`**
- Shows job title + location
- **NEW: Shows `job_summary`** instead of truncated description
- Character limit respected (line-clamp-3 for display)
- "View Details" and "Apply" buttons

**Job Detail: `/candidate/jobs/[jobId]`**
- Job title, location, posted date
- Application status indicator
- **UPDATED: Description renders with RichTextDisplay component**
  - Bold text appears bold
  - Italic text appears italic
  - Lists render as proper lists
  - No raw HTML visible

### 4. Database Schema

Migration: `supabase/migrations/0002_add_job_summary.sql`

```sql
ALTER TABLE jobs ADD COLUMN job_summary TEXT;
COMMENT ON COLUMN jobs.job_summary IS 'Short job summary (1-2 sentences) displayed on job listing cards';
COMMENT ON COLUMN jobs.description IS 'Full job description with rich text formatting (HTML format from Tiptap editor)';
```

### 5. Dependencies Added

```json
{
  "@tiptap/core": "^2.10.3",
  "@tiptap/starter-kit": "^2.10.3",
  "@tiptap/pm": "^2.10.3",
  "@tiptap/react": "^2.10.3"
}
```

Installed via: `npm install`

## File Structure

```
src/
├── components/
│   ├── RichTextEditor.tsx          (NEW - Admin editor)
│   └── RichTextDisplay.tsx         (NEW - Public renderer)
└── app/
    ├── admin/jobs/
    │   ├── new/page.tsx            (UPDATED - Uses RichTextEditor)
    │   └── [id]/page.tsx           (UPDATED - Uses RichTextEditor)
    └── candidate/jobs/
        ├── page.tsx                (UPDATED - Shows job_summary)
        └── [jobId]/page.tsx        (UPDATED - Uses RichTextDisplay)

supabase/migrations/
└── 0002_add_job_summary.sql        (NEW - Database migration)
```

## Testing Instructions

### Prerequisites
- Dev server running: `npm run dev` (running on port 3001)
- Database migrations applied (auto-applied by Supabase)
- Admin access for job creation

### Test Scenario: Create and Display a Rich Job

#### Step 1: Create a Job with Rich Content

Navigate to: `http://localhost:3001/admin/jobs/new`

Fill in:
- **Job Title**: "Senior Backend Engineer"
- **Job Summary**: "Join our backend team to build scalable APIs serving millions of users."
- **Job Description**: Use the editor toolbar to create:
  ```
  About the Role
  
  We're seeking an experienced backend engineer to lead our platform development.
  
  Key Responsibilities:
  • Design and implement RESTful APIs
  • Optimize database queries and caching strategies  
  • Mentor junior developers
  • Participate in code reviews
  
  Required Experience:
  1. 5+ years of backend development
  2. Proficiency with Python, Node.js, or Go
  3. Strong SQL and database design knowledge
  
  Preferred:
  • Experience with Kubernetes
  • Familiarity with event-driven architecture
  ```
- **Location**: "San Francisco, CA"
- **Employer**: (Select if available)
- **Public**: ✓ Checked

Click "Create Job"

#### Step 2: Verify on Listing Page

Navigate to: `http://localhost:3001/candidate/jobs`

Expected behavior:
- ✅ Job title appears prominently
- ✅ Job summary shows: "Join our backend team to build scalable APIs serving millions of users."
- ✅ Location displays: "San Francisco, CA"
- ✅ "View Details" and "Apply Now" buttons present
- ✅ **No raw HTML tags visible** in the summary

#### Step 3: Verify on Detail Page

Click "View Details"

Expected rendering:
- ✅ **Bold text** appears bold (not `<strong>` tags):
  - "About the Role"
  - "Key Responsibilities:"
  - etc.

- ✅ **Bullet list renders correctly**:
  ```
  • Design and implement RESTful APIs
  • Optimize database queries and caching strategies  
  • Mentor junior developers
  • Participate in code reviews
  ```

- ✅ **Numbered list renders correctly**:
  ```
  1. 5+ years of backend development
  2. Proficiency with Python, Node.js, or Go
  3. Strong SQL and database design knowledge
  ```

- ✅ **No raw tags visible**: No `<p>`, `<strong>`, `<ul>`, `<li>` etc. in the output
- ✅ **Proper spacing**: Lists are properly indented and spaced
- ✅ **Text formatting**: All formatting from the editor is preserved

#### Step 4: Test Edit Flow

Go to: `http://localhost:3001/admin/jobs`

1. Find the job you created
2. Click to edit
3. Verify:
   - ✅ Job summary loads with text
   - ✅ Description loads with rich formatting intact
   - ✅ Editor toolbar is available
4. Make changes:
   - Add some italic text
   - Modify a list item
   - Click "Save Changes"
5. Return to candidate detail page
6. ✅ Verify changes appear correctly rendered

## Technical Details

### Rich Text Storage Format

Data stored in `jobs.description`:
```html
<p>About the Role</p>
<p>We're seeking an experienced backend engineer to lead our platform development.</p>
<p>Key Responsibilities:</p>
<ul>
  <li>Design and implement RESTful APIs</li>
  <li>Optimize database queries and caching strategies</li>
  <li>Mentor junior developers</li>
  <li>Participate in code reviews</li>
</ul>
<p>Required Experience:</p>
<ol>
  <li>5+ years of backend development</li>
  <li>Proficiency with Python, Node.js, or Go</li>
  <li>Strong SQL and database design knowledge</li>
</ol>
```

### Editor Toolbar Mapping

| UI Button | Markdown | HTML | Keyboard |
|-----------|----------|------|----------|
| **B** | `**text**` | `<strong>text</strong>` | Ctrl+B |
| **I** | `_text_` | `<em>text</em>` | Ctrl+I |
| • List | `- item` | `<ul><li>item</li></ul>` | Ctrl+Shift+8 |
| 1. List | `1. item` | `<ol><li>item</li></ol>` | Ctrl+Shift+7 |

### Display Configuration

`RichTextDisplay` uses Tailwind CSS `prose prose-sm` classes:
- Automatically styles lists, text, spacing
- Respects max-width for readability
- Uses semantic HTML classes for consistency
- Compatible with existing ASODS color scheme

## Limitations & Future Work

### Current Limitations
- ❌ No heading support (h2, h3, etc.)
- ❌ No links or images
- ❌ No code blocks
- ❌ No tables
- ❌ No color/font changes

### Possible Future Enhancements
- Add heading support (h2, h3)
- Add link support (URLs, internal links)
- Add block quotes
- Add horizontal rules
- Add code block support
- Add image uploads
- Add keyboard shortcuts help
- Export to PDF
- Import from Markdown/DOCX

## Troubleshooting

### Issue: Editor toolbar not visible
- Solution: Ensure Tiptap packages installed (`npm install`)
- Check browser console for JS errors
- Verify `RichTextEditor.tsx` is in `src/components/`

### Issue: Raw HTML showing instead of rendered content
- Solution: Verify page uses `<RichTextDisplay />` component
- Check that `content` prop is being passed correctly
- Ensure `dangerouslySetInnerHTML` is not overridden elsewhere

### Issue: Changes not saving
- Solution: Check job_summary has text (is required now)
- Verify description has HTML content (at least `<p></p>`)
- Check browser console for API errors
- Verify database migration was applied

### Issue: Rich content lost on edit
- Solution: Page refresh might be needed after save
- Try clearing browser cache
- Verify database contains HTML data (not plain text)

## Rollback Plan

If issues arise:

1. **Revert code changes**:
   - Remove `RichTextEditor` and `RichTextDisplay` components
   - Restore original textarea fields in admin pages
   - Restore plain text rendering on candidate pages

2. **Revert database** (if job_summary was added):
   - Create reverse migration to drop `job_summary` column
   - Or keep column (harmless if unused)

3. **Remove dependencies**:
   - Remove Tiptap packages from `package.json`
   - Run `npm install`

## Questions?

Refer to:
- Tiptap documentation: https://tiptap.dev
- Tailwind Prose: https://tailwindcss.com/docs/typography-plugin
- Code examples: See `/RICH_TEXT_JOBS_UPDATE.md`
