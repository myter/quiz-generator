interface Props {
  formUrl: string | null
  error: string | null
  onReset: () => void
}

export default function ResultView({ formUrl, error, onReset }: Props) {
  if (error) {
    return (
      <div className="space-y-3">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-wv-red">{error}</p>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm bg-wv-accent-light text-wv-text rounded-xl hover:bg-wv-accent-mid transition-colors"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!formUrl) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <svg className="w-5 h-5 text-wv-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p className="text-sm font-semibold text-wv-text">Quiz created!</p>
      </div>

      <a
        href={formUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="cta-glow-wrapper block no-underline"
      >
        <span className="cta-glow-inner">
          <p className="text-sm text-wv-text mb-0.5">Your quiz is ready</p>
          <span className="text-sm font-semibold bg-gradient-to-r from-[#00d4ff] via-[#6200ff] to-[#b000ff] bg-clip-text text-transparent">
            Open in Weavely
          </span>
        </span>
      </a>

      <button
        onClick={onReset}
        className="w-full px-4 py-2 text-sm bg-wv-accent-light text-wv-text rounded-xl hover:bg-wv-accent-mid transition-colors"
      >
        Generate another quiz
      </button>
    </div>
  )
}
