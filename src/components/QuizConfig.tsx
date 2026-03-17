import type { QuizConfig, QuestionType, PageLayout } from '../lib/types'

interface Props {
  config: QuizConfig
  onChange: (config: QuizConfig) => void
}

export default function QuizConfig({ config, onChange }: Props) {
  const questionTypeOptions: { key: QuestionType; label: string }[] = [
    { key: 'closed', label: 'Closed-ended' },
    { key: 'open', label: 'Open-ended' },
    { key: 'both', label: 'Both' },
  ]

  const layoutOptions: { key: PageLayout; label: string }[] = [
    { key: 'one-per-page', label: 'One per page' },
    { key: 'all-on-one', label: 'All on one page' },
    { key: 'custom', label: 'Custom' },
  ]

  return (
    <div className="space-y-4">
      {/* Number of questions */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[20px] font-medium text-wv-text">
            Number of questions
          </label>
          <span className="text-[20px] font-semibold text-wv-accent tabular-nums">
            {config.numQuestions}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={20}
          value={config.numQuestions}
          onChange={e => onChange({ ...config, numQuestions: Number(e.target.value) })}
        />
        <div className="flex justify-between text-[16px] text-wv-muted mt-0.5">
          <span>1</span>
          <span>20</span>
        </div>
      </div>

      {/* Question types */}
      <div>
        <label className="block text-[20px] font-medium text-wv-text mb-2">
          Question type
        </label>
        <div className="flex flex-wrap gap-2">
          {questionTypeOptions.map(opt => (
            <button
              key={opt.key}
              onClick={() => onChange({ ...config, questionTypes: opt.key })}
              className={`px-3 py-1.5 text-[16px] rounded-full transition-colors ${
                config.questionTypes === opt.key
                  ? 'bg-wv-primary text-white'
                  : 'bg-wv-accent-light text-wv-text hover:bg-wv-accent-mid'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Page layout */}
      <div>
        <label className="block text-[20px] font-medium text-wv-text mb-2">
          Page layout
        </label>
        <div className="flex flex-wrap gap-2">
          {layoutOptions.map(opt => (
            <button
              key={opt.key}
              onClick={() => onChange({ ...config, pageLayout: opt.key })}
              className={`px-3 py-1.5 text-[16px] rounded-full transition-colors ${
                config.pageLayout === opt.key
                  ? 'bg-wv-primary text-white'
                  : 'bg-wv-accent-light text-wv-text hover:bg-wv-accent-mid'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Custom page count */}
        {config.pageLayout === 'custom' && (
          <div className="mt-2 flex items-center gap-2">
            <label className="text-[16px] text-wv-muted">Pages:</label>
            <input
              type="number"
              min={1}
              max={config.numQuestions}
              value={config.customPageCount}
              onChange={e => onChange({
                ...config,
                customPageCount: Math.max(1, Math.min(Number(e.target.value), config.numQuestions)),
              })}
              className="w-16 px-2 py-1 border border-wv-border rounded-lg text-[20px] text-wv-text bg-wv-input-bg focus:outline-none focus:ring-2 focus:ring-wv-accent/40 focus:border-wv-accent transition-colors text-center"
            />
          </div>
        )}
      </div>
    </div>
  )
}
