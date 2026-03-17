import { useState } from 'react'
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
    <div className="fixed inset-0 z-[9999] font-satoshi flex flex-col">
      {/* Quiz iframe — fills space above banner */}
      <iframe
        src={formUrl}
        className="w-full flex-1 border-0"
        allow="clipboard-write"
      />

      {/* Full-width bottom banner */}
      <div
        className="relative w-full shrink-0 overflow-hidden"
        style={{
          background: 'linear-gradient(to right, #c8a2f5, #6200ff, #1A1A1A)',
        }}
      >
        <div className="flex items-center px-6 sm:px-10 py-4 sm:py-5">
          {/* Left — text */}
          <h3 className="text-white font-bold text-[20px] sm:text-[24px] leading-tight shrink-0">
            Tweak, publish & share this quiz for free
          </h3>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right — CTA button (glow style with pulse) */}
          <div className="flex items-center gap-3 shrink-0">
            {error && (
              <p className="text-sm text-red-200 hidden sm:block">{error}</p>
            )}
            <button
              onClick={handleContinue}
              disabled={busy}
              className={`cta-glow-wrapper banner-cta-pulse block ${busy ? 'disabled' : ''}`}
            >
              <div className="glow-bg" />
              <span className="cta-glow-inner text-[16px] flex items-center justify-center gap-2">
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
        </div>

        {error && (
          <p className="text-sm text-red-200 px-6 pb-2 sm:hidden">{error}</p>
        )}
      </div>
    </div>
  )
}
