interface RichTextDisplayProps {
  content: string
  className?: string
}

export default function RichTextDisplay({
  content,
  className = '',
}: RichTextDisplayProps) {
  if (!content) {
    return null
  }

  return (
    <div
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
