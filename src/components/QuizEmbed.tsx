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
        style={{
          position: 'relative',
          width: '100%',
          flexShrink: 0,
          background: 'linear-gradient(to right, #c8a2f5, #6200ff, #1A1A1A)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            textAlign: 'center',
          }}
        >
          {/* Text */}
          <h3
            style={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            Tweak, publish &amp; share this quiz for free
          </h3>

          {/* CTA button */}
          <button
            onClick={handleContinue}
            disabled={busy}
            className={`cta-glow-wrapper banner-cta-pulse block shrink-0 ${busy ? 'disabled' : ''}`}
          >
            <div className="glow-bg" />
            <span
              className="cta-glow-inner flex items-center justify-center gap-2"
              style={{ fontSize: '14px', whiteSpace: 'nowrap', padding: '8px 20px' }}
            >
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
          <p style={{ fontSize: '13px', color: '#fecaca', padding: '0 16px 8px', textAlign: 'center', margin: 0 }}>{error}</p>
        )}
      </div>
    </div>
  )
}
