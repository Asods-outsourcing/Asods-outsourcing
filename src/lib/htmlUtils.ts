/**
 * Utility functions for handling HTML content
 */

/**
 * Strip HTML tags from a string and decode HTML entities
 * Returns plain text suitable for previews
 */
export function stripHtmlTags(html: string): string {
  if (!html) return ''

  // First, decode HTML entities (&nbsp; → space, &amp; → &, etc.)
  const decoded = decodeHtmlEntities(html)

  // Remove HTML tags by replacing anything between < and >
  const plainText = decoded.replace(/<[^>]*>/g, '')

  // Clean up extra whitespace
  return plainText.trim()
}

/**
 * Decode HTML entities like &nbsp;, &amp;, etc.
 */
function decodeHtmlEntities(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
  }

  let decoded = text
  for (const [entity, char] of Object.entries(htmlEntities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char)
  }
  return decoded
}

/**
 * Create a preview of text, truncated to specified length with ellipsis
 */
export function createPreview(text: string, maxLength: number = 120): string {
  if (!text) return ''

  const stripped = stripHtmlTags(text)

  if (stripped.length <= maxLength) {
    return stripped
  }

  // Truncate and add ellipsis, trying not to cut off mid-word
  let truncated = stripped.substring(0, maxLength)

  // Find the last space within the truncated text
  const lastSpace = truncated.lastIndexOf(' ')
  if (lastSpace > 0 && lastSpace > maxLength - 30) {
    // If there's a space reasonably close, truncate there
    truncated = truncated.substring(0, lastSpace)
  }

  return truncated.trim() + '...'
}
