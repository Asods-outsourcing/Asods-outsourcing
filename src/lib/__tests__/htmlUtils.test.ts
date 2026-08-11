import { stripHtmlTags, createPreview } from '../htmlUtils'

describe('htmlUtils', () => {
  describe('stripHtmlTags', () => {
    it('should remove HTML tags', () => {
      const input = '<p><strong>Key Responsibilities</strong></p>'
      expect(stripHtmlTags(input)).toBe('Key Responsibilities')
    })

    it('should handle multiple tags', () => {
      const input = '<p><strong>Lead</strong> recruitment <em>initiatives</em></p>'
      expect(stripHtmlTags(input)).toBe('Lead recruitment initiatives')
    })

    it('should decode HTML entities', () => {
      const input = 'Key&nbsp;Skills&nbsp;Required'
      expect(stripHtmlTags(input)).toBe('Key Skills Required')
    })

    it('should handle combined HTML and entities', () => {
      const input = '<p>Lead&nbsp;<strong>recruitment</strong>&nbsp;initiatives</p>'
      expect(stripHtmlTags(input)).toBe('Lead recruitment initiatives')
    })

    it('should handle empty string', () => {
      expect(stripHtmlTags('')).toBe('')
    })

    it('should handle plain text', () => {
      const input = 'This is plain text'
      expect(stripHtmlTags(input)).toBe('This is plain text')
    })
  })

  describe('createPreview', () => {
    it('should truncate long text with ellipsis', () => {
      const input =
        'This is a very long description that exceeds the maximum length and should be truncated with an ellipsis at the end to indicate continuation'
      const preview = createPreview(input, 60)
      expect(preview).toEndWith('...')
      expect(preview.length).toBeLessThanOrEqual(66) // ~60 + "..."
    })

    it('should not add ellipsis to short text', () => {
      const input = 'Short text'
      expect(createPreview(input, 60)).toBe('Short text')
    })

    it('should strip HTML and truncate', () => {
      const input =
        '<p><strong>Lead recruitment initiatives</strong> for financial services clients. We are looking for experienced recruiters.</p>'
      const preview = createPreview(input, 50)
      expect(preview).toEndWith('...')
      expect(stripHtmlTags(preview.slice(0, -3))).not.toContain('<')
    })

    it('should use default length of 120 if not specified', () => {
      const input = 'a'.repeat(150)
      const preview = createPreview(input)
      expect(preview.length).toBeLessThanOrEqual(126) // 120 + "..."
    })

    it('should decode entities in preview', () => {
      const input =
        'Key&nbsp;Responsibilities&nbsp;and&nbsp;Duties which will be very long and exceed the character limit significantly'
      const preview = createPreview(input, 50)
      expect(preview).toContain('Key')
      expect(preview).not.toContain('&nbsp;')
    })
  })
})
