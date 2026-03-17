export type InputMode = 'text' | 'pdf' | 'docx' | 'googleDoc'

export type QuestionType = 'closed' | 'open' | 'both'

export type PageLayout = 'one-per-page' | 'all-on-one' | 'custom'

export interface QuizConfig {
  numQuestions: number
  pageLayout: PageLayout
  customPageCount: number
  questionTypes: QuestionType
}

export interface ExtractedQuestion {
  question: string
  type: 'closed' | 'open'
  options?: string[]
  correctAnswer: string | string[]
  score: number
}

export interface ExtractResponse {
  questions: ExtractedQuestion[]
}

export interface CreateQuizResponse {
  formId: string
  formUrl: string
  editorUrl: string
}

export type WidgetStep = 'input' | 'loading' | 'result' | 'error'
