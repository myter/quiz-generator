import { useState, useEffect } from 'react'
import { createQuizAnon } from '../lib/api'

interface Props {
  formUrl: string
  quizPayload: {
    name: string
    formJSON: object
    themeJSON: object
    settings: object
    logicRules?: object[]
  }
}

export default function QuizEmbed({ formUrl, quizPayload }: Props) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Lock body scroll when overlay is mounted
  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [])

  async function handleContinue() {
    if (busy) return
    setBusy(true)
    setError(null)

    try {
      const { editorUrl } = await createQuizAnon(quizPayload)
      window.open(editorUrl, '_blank')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create copy')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] font-satoshi flex flex-col overflow-hidden">
      {/* Quiz iframe — fills space above banner */}
      <iframe
        src={formUrl}
        className="w-full flex-1 border-0"
        allow="clipboard-write"
      />

      {/* Full-width bottom banner — stacks on mobile */}
      <div
        className="relative w-full shrink-0 overflow-hidden"
        style={{
          background: 'linear-gradient(to right, #c8a2f5, #6200ff, #1A1A1A)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 px-4 sm:px-10 py-3 sm:py-5">
          {/* Text */}
          <h3 className="text-white font-bold text-[16px] sm:text-[22px] leading-tight text-center sm:text-left">
            Tweak, publish & share this quiz for free
          </h3>

          {/* Spacer — only on desktop */}
          <div className="hidden sm:block flex-1" />

          {/* CTA button */}
          <button
            onClick={handleContinue}
            disabled={busy}
            className={`cta-glow-wrapper banner-cta-pulse block shrink-0 ${busy ? 'disabled' : ''}`}
          >
            <div className="glow-bg" />
            <span className="cta-glow-inner text-[14px] sm:text-[16px] flex items-center justify-center gap-2 whitespace-nowrap">
              {busy && (
                <span
                  className="inline-block w-4 h-4 border-2 rounded-full animate-spin shrink-0"
                  style={{ borderColor: 'rgba(255,255,255,0.25)', borderTopColor: '#fff' }}
                />
              )}
              {busy ? 'Creating...' : 'Share my quiz'}
            </span>
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-200 px-4 pb-2 text-center">{error}</p>
        )}
      </div>
    </div>
  )
}
