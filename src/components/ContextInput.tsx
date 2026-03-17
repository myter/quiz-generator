import { useRef, useState } from 'react'
import type { InputMode } from '../lib/types'
import PdfPagePicker from './PdfPagePicker'

const EXAMPLE_PROMPT = 'Create a quiz about the solar system covering planets, their order from the sun, notable features like rings or moons, and basic facts about the sun.'

const MAX_CHARS = 2000

interface Props {
  inputMode: InputMode
  content: string
  file: File | null
  selectedPages: number[]
  googleDocUrl: string
  onInputModeChange: (mode: InputMode) => void
  onContentChange: (val: string) => void
  onFileChange: (file: File | null) => void
  onSelectedPagesChange: (pages: number[]) => void
  onGoogleDocUrlChange: (url: string) => void
}

export default function ContextInput({
  inputMode,
  content,
  file,
  selectedPages,
  googleDocUrl,
  onInputModeChange,
  onContentChange,
  onFileChange,
  onSelectedPagesChange,
  onGoogleDocUrlChange,
}: Props) {
  const pdfFileRef = useRef<HTMLInputElement>(null)
  const docxFileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const modes: { key: InputMode; label: string }[] = [
    { key: 'text', label: 'Text' },
    { key: 'pdf', label: 'PDF' },
    { key: 'docx', label: 'Word' },
    { key: 'googleDoc', label: 'Google Doc' },
  ]

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
  }

  function handleDrop(e: React.DragEvent, accept: string) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.name.endsWith(accept)) {
      onFileChange(droppedFile)
    }
  }

  function handleRemovePdf() {
    onFileChange(null)
    onSelectedPagesChange([])
    if (pdfFileRef.current) pdfFileRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      {/* Source mode tabs */}
      <div className="flex items-center gap-2">
        {modes.map(m => (
          <button
            key={m.key}
            onClick={() => onInputModeChange(m.key)}
            className={`px-3 py-1 text-[16px] rounded-full transition-colors ${
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
            <label className="block text-[20px] font-medium text-wv-text">
              Describe your quiz topic or paste content
            </label>
            <button
              onClick={() => onContentChange(EXAMPLE_PROMPT)}
              className="text-[16px] text-wv-accent hover:underline"
            >
              Try example
            </button>
          </div>
          <textarea
            value={content}
            onChange={e => onContentChange(e.target.value.slice(0, MAX_CHARS))}
            placeholder="e.g. A quiz about World War II focusing on key battles and dates..."
            rows={4}
            className="w-full px-3 py-2.5 border border-wv-border rounded-xl text-[20px] text-wv-text bg-wv-input-bg focus:outline-none focus:ring-2 focus:ring-wv-accent/40 focus:border-wv-accent transition-colors resize-none"
          />
          <p className="text-[16px] text-wv-muted text-right mt-0.5">
            {content.length}/{MAX_CHARS}
          </p>
        </div>
      )}

      {/* PDF upload + page picker */}
      {inputMode === 'pdf' && (
        <div>
          <input
            ref={pdfFileRef}
            type="file"
            accept=".pdf"
            onChange={e => {
              onFileChange(e.target.files?.[0] || null)
              onSelectedPagesChange([])
            }}
            className="hidden"
          />

          {!file ? (
            <>
              <label className="block text-[20px] font-medium text-wv-text mb-1">
                Upload a PDF document
              </label>
              <button
                onClick={() => pdfFileRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={e => handleDrop(e, '.pdf')}
                className={`w-full px-3 py-6 border-2 border-dashed rounded-xl text-[20px] transition-colors ${
                  dragging
                    ? 'border-wv-accent bg-wv-accent-light text-wv-text'
                    : 'border-wv-border-strong text-wv-muted hover:border-wv-accent hover:text-wv-text'
                }`}
              >
                Click or drag & drop a PDF file
              </button>
            </>
          ) : (
            <PdfPagePicker
              file={file}
              selectedPages={selectedPages}
              onSelectedPagesChange={onSelectedPagesChange}
              onRemoveFile={handleRemovePdf}
            />
          )}
        </div>
      )}

      {/* DOCX upload */}
      {inputMode === 'docx' && (
        <div>
          <label className="block text-[20px] font-medium text-wv-text mb-1">
            Upload a Word document
          </label>
          <input
            ref={docxFileRef}
            type="file"
            accept=".docx"
            onChange={e => onFileChange(e.target.files?.[0] || null)}
            className="hidden"
          />
          <button
            onClick={() => docxFileRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={e => handleDrop(e, '.docx')}
            className={`w-full px-3 py-6 border-2 border-dashed rounded-xl text-[20px] transition-colors ${
              dragging
                ? 'border-wv-accent bg-wv-accent-light text-wv-text'
                : 'border-wv-border-strong text-wv-muted hover:border-wv-accent hover:text-wv-text'
            }`}
          >
            {file ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                {file.name}
              </span>
            ) : (
              'Click or drag & drop a Word file (.docx)'
            )}
          </button>
          {file && (
            <button
              onClick={() => {
                onFileChange(null)
                if (docxFileRef.current) docxFileRef.current.value = ''
              }}
              className="text-[16px] text-wv-red mt-1 hover:underline"
            >
              Remove file
            </button>
          )}
        </div>
      )}

      {/* Google Doc URL */}
      {inputMode === 'googleDoc' && (
        <div>
          <label className="block text-[20px] font-medium text-wv-text mb-1">
            Google Doc link
          </label>
          <input
            type="url"
            value={googleDocUrl}
            onChange={e => onGoogleDocUrlChange(e.target.value)}
            placeholder="https://docs.google.com/document/d/..."
            className="w-full px-3 py-2.5 border border-wv-border rounded-xl text-[20px] text-wv-text bg-wv-input-bg focus:outline-none focus:ring-2 focus:ring-wv-accent/40 focus:border-wv-accent transition-colors"
          />
          <p className="text-[16px] text-wv-muted mt-1">
            Make sure the document is publicly accessible (Anyone with the link)
          </p>
        </div>
      )}
    </div>
  )
}
