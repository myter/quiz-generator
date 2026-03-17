import { useEffect, useState, useRef } from 'react'

interface Props {
  disabled: boolean
  loading: boolean
  onClick: () => void
}

const EXPECTED_DURATION = 12000 // 12 seconds

export default function GenerateButton({ disabled, loading, onClick }: Props) {
  const [progress, setProgress] = useState(0)
  const [overtime, setOvertime] = useState(false)
  const startRef = useRef<number>(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!loading) {
      setProgress(0)
      setOvertime(false)
      cancelAnimationFrame(rafRef.current)
      return
    }

    startRef.current = Date.now()
    setOvertime(false)

    function tick() {
      const elapsed = Date.now() - startRef.current
      const pct = Math.min(elapsed / EXPECTED_DURATION, 1)
      // Ease out — fast start, slows down near the end
      setProgress(1 - Math.pow(1 - pct, 2))

      if (elapsed >= EXPECTED_DURATION) {
        setOvertime(true)
        setProgress(1)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [loading])

  return (
    <div className={`cta-glow-wrapper ${disabled || loading ? 'disabled' : ''}`}>
      <div className="glow-bg" />
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className="cta-glow-inner w-full relative overflow-hidden"
      >
        {loading ? (
          <>
            {/* Progress bar background */}
            <div
              className="absolute inset-0 bg-white/10 transition-none"
              style={{ width: `${progress * 100}%` }}
            />
            <span className="relative flex items-center justify-center gap-2">
              {overtime && (
                <span
                  className="inline-block w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ borderColor: 'rgba(255,255,255,0.25)', borderTopColor: '#fff' }}
                />
              )}
              <span>{overtime ? 'Almost there, hold on...' : 'Generating your quiz...'}</span>
            </span>
          </>
        ) : (
          <span>Generate my quiz</span>
        )}
      </button>
    </div>
  )
}
