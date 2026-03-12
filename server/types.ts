export interface ExtractRequest {
  content?: string
  file?: string  // base64
  googleDocUrl?: string
  config: {
    numQuestions: number
    questionTypes: 'closed' | 'open' | 'both'
  }
}

export interface ExtractedQuestion {
  question: string
  type: 'closed' | 'open'
  options?: string[]
  correctAnswer: string | string[]
  score: number
}

export interface CreateQuizRequest {
  name: string
  formJSON: object
  themeJSON: object
  settings: object
  logicRules?: object[]
}
