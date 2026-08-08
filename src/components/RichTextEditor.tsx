import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState, useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter rich text...',
  disabled = false,
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
      }),
    ],
    content: value || '<p></p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editable: !disabled,
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-64 bg-gray-100 rounded-lg border border-gray-300" />
  }

  if (!editor) {
    return null
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled || !editor.can().chain().focus().toggleBold().run()}
          className={`px-3 py-2 rounded text-sm font-medium transition ${
            editor.isActive('bold')
              ? 'bg-[#D4AF37] text-[#0D1B2A]'
              : 'bg-white border border-gray-300 text-[#333333] hover:bg-gray-100'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Bold"
        >
          <strong>B</strong>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled || !editor.can().chain().focus().toggleItalic().run()}
          className={`px-3 py-2 rounded text-sm font-medium transition ${
            editor.isActive('italic')
              ? 'bg-[#D4AF37] text-[#0D1B2A]'
              : 'bg-white border border-gray-300 text-[#333333] hover:bg-gray-100'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Italic"
        >
          <em>I</em>
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled || !editor.can().chain().focus().toggleBulletList().run()}
          className={`px-3 py-2 rounded text-sm font-medium transition ${
            editor.isActive('bulletList')
              ? 'bg-[#D4AF37] text-[#0D1B2A]'
              : 'bg-white border border-gray-300 text-[#333333] hover:bg-gray-100'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Bullet List"
        >
          • List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled || !editor.can().chain().focus().toggleOrderedList().run()}
          className={`px-3 py-2 rounded text-sm font-medium transition ${
            editor.isActive('orderedList')
              ? 'bg-[#D4AF37] text-[#0D1B2A]'
              : 'bg-white border border-gray-300 text-[#333333] hover:bg-gray-100'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Numbered List"
        >
          1. List
        </button>
      </div>

      {/* Editor */}
      <div className={`p-4 min-h-64 ${disabled ? 'bg-gray-50' : ''}`}>
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none outline-none"
        />
      </div>
    </div>
  )
}
