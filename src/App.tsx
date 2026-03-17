import { useReducer, useEffect } from 'react'
import ContextInput from './components/ContextInput'
import QuizConfigPanel from './components/QuizConfig'
import GenerateButton from './components/GenerateButton'
import ResultView from './components/ResultView'
import QuizEmbed from './components/QuizEmbed'
import { setApiUrl, extractQuestions, createQuiz } from './lib/api'
import { buildFullPayload } from './lib/formBuilder'
import type { InputMode, QuizConfig, WidgetStep } from './lib/types'

interface QuizPayload {
  name: string
  formJSON: object
  themeJSON: object
  settings: object
  logicRules?: object[]
}

interface State {
  step: WidgetStep
  inputMode: InputMode
  content: string
  file: File | null
  selectedPages: number[]
  googleDocUrl: string
  config: QuizConfig
  formUrl: string | null
  quizPayload: QuizPayload | null
  error: string | null
}

type Action =
  | { type: 'SET_INPUT_MODE'; mode: InputMode }
  | { type: 'SET_CONTENT'; value: string }
  | { type: 'SET_FILE'; file: File | null }
  | { type: 'SET_SELECTED_PAGES'; pages: number[] }
  | { type: 'SET_GOOGLE_DOC_URL'; url: string }
  | { type: 'SET_CONFIG'; config: QuizConfig }
  | { type: 'START_LOADING' }
  | { type: 'SUCCESS'; formUrl: string; quizPayload: QuizPayload }
  | { type: 'ERROR'; error: string }
  | { type: 'RESET' }

const initialState: State = {
  step: 'input',
  inputMode: 'text',
  content: '',
  file: null,
  selectedPages: [],
  googleDocUrl: '',
  config: {
    numQuestions: 10,
    pageLayout: 'one-per-page',
    customPageCount: 3,
    questionTypes: 'closed',
  },
  formUrl: null,
  quizPayload: null,
  error: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_INPUT_MODE':
      return { ...state, inputMode: action.mode }
    case 'SET_CONTENT':
      return { ...state, content: action.value }
    case 'SET_FILE':
      return { ...state, file: action.file }
    case 'SET_SELECTED_PAGES':
      return { ...state, selectedPages: action.pages }
    case 'SET_GOOGLE_DOC_URL':
      return { ...state, googleDocUrl: action.url }
    case 'SET_CONFIG':
      return { ...state, config: action.config }
    case 'START_LOADING':
      return { ...state, step: 'loading', error: null }
    case 'SUCCESS':
      return { ...state, step: 'result', formUrl: action.formUrl, quizPayload: action.quizPayload }
    case 'ERROR':
      return { ...state, step: 'error', error: action.error }
    case 'RESET':
      return { ...initialState }
  }
}

interface AppProps {
  apiUrl?: string
}

export default function App({ apiUrl = '' }: AppProps) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (apiUrl) setApiUrl(apiUrl)
  }, [apiUrl])

  const hasContent =
    (state.inputMode === 'text' && state.content.trim().length > 0) ||
    (state.inputMode === 'pdf' && state.file !== null && state.selectedPages.length > 0) ||
    (state.inputMode === 'docx' && state.file !== null) ||
    (state.inputMode === 'googleDoc' && state.googleDocUrl.trim().length > 0)

  const canGenerate = hasContent && state.step !== 'loading'

  async function handleGenerate() {
    dispatch({ type: 'START_LOADING' })

    try {
      // Step 1: Extract questions via backend
      const { questions } = await extractQuestions(
        state.content,
        state.file,
        state.googleDocUrl,
        { numQuestions: state.config.numQuestions, questionTypes: state.config.questionTypes },
        state.selectedPages
      )

      if (!questions || questions.length === 0) {
        throw new Error('No questions could be generated from the provided content.')
      }

      // Step 2: Build formJSON client-side
      const payload = buildFullPayload(questions, state.config)

      // Step 3: Create quiz via backend → Weavely API (team-owned)
      const { formUrl } = await createQuiz(payload)

      dispatch({ type: 'SUCCESS', formUrl, quizPayload: payload })
    } catch (err) {
      dispatch({
        type: 'ERROR',
        error: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      })
    }
  }

  const isInputStep = state.step === 'input' || state.step === 'loading'

  // Show full-screen quiz embed when quiz is created
  if (state.step === 'result' && state.formUrl && state.quizPayload) {
    return (
      <QuizEmbed
        formUrl={state.formUrl}
        quizPayload={state.quizPayload}
      />
    )
  }

  return (
    <div className="w-full font-satoshi">
      <div className="bg-wv-card rounded-2xl border border-wv-border p-8 sm:p-12 shadow-sm space-y-5">

        {isInputStep ? (
          <>
            <ContextInput
              inputMode={state.inputMode}
              content={state.content}
              file={state.file}
              selectedPages={state.selectedPages}
              googleDocUrl={state.googleDocUrl}
              onInputModeChange={m => dispatch({ type: 'SET_INPUT_MODE', mode: m })}
              onContentChange={v => dispatch({ type: 'SET_CONTENT', value: v })}
              onFileChange={f => dispatch({ type: 'SET_FILE', file: f })}
              onSelectedPagesChange={p => dispatch({ type: 'SET_SELECTED_PAGES', pages: p })}
              onGoogleDocUrlChange={u => dispatch({ type: 'SET_GOOGLE_DOC_URL', url: u })}
            />

            <div className="border-t border-wv-border pt-4">
              <QuizConfigPanel
                config={state.config}
                onChange={c => dispatch({ type: 'SET_CONFIG', config: c })}
              />
            </div>

            <div className="pt-1">
              <GenerateButton
                disabled={!canGenerate}
                loading={state.step === 'loading'}
                onClick={handleGenerate}
              />
            </div>
          </>
        ) : (
          <ResultView
            formUrl={state.formUrl}
            error={state.error}
            onReset={() => dispatch({ type: 'RESET' })}
          />
        )}
      </div>
    </div>
  )
}
