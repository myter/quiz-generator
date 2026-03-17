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

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 640)
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 640)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return isDesktop
}

export default function QuizEmbed({ formUrl, quizPayload }: Props) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isDesktop = useIsDesktop()

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

      {/* Full-width bottom banner */}
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
            flexDirection: isDesktop ? 'row' : 'column',
            alignItems: 'center',
            gap: isDesktop ? '16px' : '10px',
            padding: isDesktop ? '20px 40px' : '12px 16px',
            textAlign: isDesktop ? 'left' : 'center',
          }}
        >
          {/* Text */}
          <h3
            style={{
              color: '#fff',
              fontWeight: 700,
              fontSize: isDesktop ? '22px' : '14px',
              lineHeight: 1.3,
              margin: 0,
              flexShrink: 0,
            }}
          >
            Tweak, publish &amp; share this quiz for free
          </h3>

          {/* Spacer — desktop only */}
          {isDesktop && <div style={{ flex: 1 }} />}

          {/* Error — desktop inline */}
          {error && isDesktop && (
            <p style={{ fontSize: '14px', color: '#fecaca', margin: 0 }}>{error}</p>
          )}

          {/* CTA button */}
          <button
            onClick={handleContinue}
            disabled={busy}
            className={`cta-glow-wrapper banner-cta-pulse block shrink-0 ${busy ? 'disabled' : ''}`}
          >
            <div className="glow-bg" />
            <span
              className="cta-glow-inner flex items-center justify-center gap-2"
              style={{
                fontSize: isDesktop ? '16px' : '14px',
                whiteSpace: 'nowrap',
                padding: isDesktop ? '12px 24px' : '8px 20px',
              }}
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

        {/* Error — mobile below */}
        {error && !isDesktop && (
          <p style={{ fontSize: '13px', color: '#fecaca', padding: '0 16px 8px', textAlign: 'center', margin: 0 }}>{error}</p>
        )}
      </div>
    </div>
  )
}
