interface Props {
  disabled: boolean
  loading: boolean
  onClick: () => void
}

export default function GenerateButton({ disabled, loading, onClick }: Props) {
  return (
    <div className={`cta-glow-wrapper ${disabled || loading ? 'disabled' : ''}`}>
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className="cta-glow-inner w-full"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="spinner" />
            <span className="text-sm font-semibold text-wv-text">Generating quiz...</span>
          </span>
        ) : (
          <span className="text-sm font-semibold bg-gradient-to-r from-[#00d4ff] via-[#6200ff] to-[#b000ff] bg-clip-text text-transparent">
            Generate my quiz
          </span>
        )}
      </button>
    </div>
  )
}
