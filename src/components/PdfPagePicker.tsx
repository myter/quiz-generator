import { useEffect, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs'

const MAX_PAGES = 10

interface Props {
  file: File
  selectedPages: number[]
  onSelectedPagesChange: (pages: number[]) => void
  onRemoveFile: () => void
}

export default function PdfPagePicker({ file, selectedPages, onSelectedPagesChange, onRemoveFile }: Props) {
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function renderThumbnails() {
      setLoading(true)
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      if (cancelled) return

      const total = pdf.numPages
      setTotalPages(total)

      const thumbs: string[] = []
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 0.4 })
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({ canvasContext: ctx, viewport }).promise
        thumbs.push(canvas.toDataURL())
        if (cancelled) return
      }

      setThumbnails(thumbs)
      setLoading(false)
    }

    renderThumbnails()
    return () => { cancelled = true }
  }, [file])

  function togglePage(pageNum: number) {
    if (selectedPages.includes(pageNum)) {
      onSelectedPagesChange(selectedPages.filter(p => p !== pageNum))
    } else if (selectedPages.length < MAX_PAGES) {
      onSelectedPagesChange([...selectedPages, pageNum].sort((a, b) => a - b))
    }
  }

  function selectAll() {
    if (selectedPages.length === Math.min(totalPages, MAX_PAGES)) {
      onSelectedPagesChange([])
    } else {
      onSelectedPagesChange(
        Array.from({ length: Math.min(totalPages, MAX_PAGES) }, (_, i) => i + 1)
      )
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block w-6 h-6 border-2 border-wv-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[16px] text-wv-muted mt-2">Loading PDF pages...</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[20px] font-medium text-wv-text">Select pages for your quiz</p>
          <p className="text-[16px] text-wv-muted">
            {totalPages > MAX_PAGES
              ? `You can select up to ${MAX_PAGES} pages.`
              : 'Click pages to select or deselect.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={selectAll}
            className="text-[16px] px-3 py-1 rounded-lg border border-wv-border hover:border-wv-accent text-wv-text transition-colors"
          >
            {selectedPages.length === Math.min(totalPages, MAX_PAGES) ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-[20px] font-medium text-wv-text">
            {selectedPages.length} / {MAX_PAGES}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-1">
        {thumbnails.map((thumb, i) => {
          const pageNum = i + 1
          const isSelected = selectedPages.includes(pageNum)
          const isDisabled = !isSelected && selectedPages.length >= MAX_PAGES

          return (
            <button
              key={pageNum}
              onClick={() => !isDisabled && togglePage(pageNum)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                isSelected
                  ? 'border-wv-primary shadow-md ring-2 ring-wv-primary/20'
                  : isDisabled
                    ? 'border-wv-border opacity-40 cursor-not-allowed'
                    : 'border-wv-border hover:border-wv-accent'
              }`}
            >
              <img
                src={thumb}
                alt={`Page ${pageNum}`}
                className="w-full h-auto"
              />
              <span className={`absolute bottom-1 right-1 text-xs px-1.5 py-0.5 rounded ${
                isSelected ? 'bg-wv-primary text-white' : 'bg-black/50 text-white'
              }`}>
                {pageNum}
              </span>
              {isSelected && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-wv-primary rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <button
        onClick={onRemoveFile}
        className="text-[16px] text-wv-red hover:underline"
      >
        Remove file
      </button>
    </div>
  )
}
