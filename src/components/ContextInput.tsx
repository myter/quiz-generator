import { useRef } from 'react'
import type { InputMode } from '../lib/types'

const EXAMPLE_PROMPT = 'Create a quiz about the solar system covering planets, their order from the sun, notable features like rings or moons, and basic facts about the sun.'

const MAX_CHARS = 2000

interface Props {
  inputMode: InputMode
  content: string
  file: File | null
  googleDocUrl: string
  onInputModeChange: (mode: InputMode) => void
  onContentChange: (val: string) => void
  onFileChange: (file: File | null) => void
  onGoogleDocUrlChange: (url: string) => void
}

export default function ContextInput({
  inputMode,
  content,
  file,
  googleDocUrl,
  onInputModeChange,
  onContentChange,
  onFileChange,
  onGoogleDocUrlChange,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const modes: { key: InputMode; label: string }[] = [
    { key: 'text', label: 'Text' },
    { key: 'pdf', label: 'PDF' },
    { key: 'googleDoc', label: 'Google Doc' },
  ]

  return (
    <div className="space-y-3">
      {/* Source mode tabs */}
      <div className="flex items-center gap-2">
        {modes.map(m => (
          <button
            key={m.key}
            onClick={() => onInputModeChange(m.key)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              inputMode === m.key
                ? 'bg-wv-primary text-white'
                : 'bg-wv-accent-light text-wv-text hover:bg-wv-accent-mid'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Text input */}
      {inputMode === 'text' && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-wv-text">
              Describe your quiz topic or paste content
            </label>
            <button
              onClick={() => onContentChange(EXAMPLE_PROMPT)}
              className="text-xs text-wv-accent hover:underline"
            >
              Try example
            </button>
          </div>
          <textarea
            value={content}
            onChange={e => onContentChange(e.target.value.slice(0, MAX_CHARS))}
            placeholder="e.g. A quiz about World War II focusing on key battles and dates..."
            rows={4}
            className="w-full px-3 py-2.5 border border-wv-border rounded-xl text-sm text-wv-text bg-wv-input-bg focus:outline-none focus:ring-2 focus:ring-wv-accent/40 focus:border-wv-accent transition-colors resize-none"
          />
          <p className="text-xs text-wv-muted text-right mt-0.5">
            {content.length}/{MAX_CHARS}
          </p>
        </div>
      )}

      {/* PDF upload */}
      {inputMode === 'pdf' && (
        <div>
          <label className="block text-sm font-medium text-wv-text mb-1">
            Upload a PDF document
          </label>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            onChange={e => onFileChange(e.target.files?.[0] || null)}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full px-3 py-6 border-2 border-dashed border-wv-border-strong rounded-xl text-sm text-wv-muted hover:border-wv-accent hover:text-wv-text transition-colors"
          >
            {file ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                {file.name}
              </span>
            ) : (
              'Click to select a PDF file'
            )}
          </button>
          {file && (
            <button
              onClick={() => {
                onFileChange(null)
                if (fileRef.current) fileRef.current.value = ''
              }}
              className="text-xs text-wv-red mt-1 hover:underline"
            >
              Remove file
            </button>
          )}
        </div>
      )}

      {/* Google Doc URL */}
      {inputMode === 'googleDoc' && (
        <div>
          <label className="block text-sm font-medium text-wv-text mb-1">
            Google Doc link
          </label>
          <input
            type="url"
            value={googleDocUrl}
            onChange={e => onGoogleDocUrlChange(e.target.value)}
            placeholder="https://docs.google.com/document/d/..."
            className="w-full px-3 py-2.5 border border-wv-border rounded-xl text-sm text-wv-text bg-wv-input-bg focus:outline-none focus:ring-2 focus:ring-wv-accent/40 focus:border-wv-accent transition-colors"
          />
          <p className="text-xs text-wv-muted mt-1">
            Make sure the document is publicly accessible (Anyone with the link)
          </p>
        </div>
      )}
    </div>
  )
}
