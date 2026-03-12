import type { ExtractedQuestion, QuizConfig } from './types'

function uuid(): string {
  return crypto.randomUUID()
}

interface FormPage {
  id: string
  name: string
  type: 'form-page' | 'ending-page'
  elements: FormElement[]
}

interface FormElement {
  id: string
  type: string
  label?: string
  description?: string
  placeholder?: string
  settings?: Record<string, unknown>
  quiz?: { score: number; answer: string | string[] }
}

function buildQuestionElement(q: ExtractedQuestion): FormElement {
  const id = uuid()

  if (q.type === 'closed' && q.options && q.options.length > 0) {
    return {
      id,
      type: 'radio-buttons',
      label: q.question,
      settings: {
        required: true,
        randomize: false,
        options: q.options.map(opt => ({
          label: opt,
          value: opt,
        })),
      },
      quiz: {
        score: q.score,
        answer: Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer,
      },
    }
  }

  // Open-ended question
  return {
    id,
    type: 'input-text',
    label: q.question,
    settings: { required: true },
    placeholder: 'Type your answer...',
    quiz: {
      score: q.score,
      answer: Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer,
    },
  }
}

function distributeQuestions(
  questions: ExtractedQuestion[],
  config: QuizConfig
): FormPage[] {
  const elements = questions.map(buildQuestionElement)

  if (config.pageLayout === 'all-on-one') {
    return [{
      id: uuid(),
      name: 'Quiz',
      type: 'form-page',
      elements,
    }]
  }

  if (config.pageLayout === 'one-per-page') {
    return elements.map((el, i) => ({
      id: uuid(),
      name: `Question ${i + 1}`,
      type: 'form-page',
      elements: [el],
    }))
  }

  // Custom page count
  const pageCount = Math.max(1, Math.min(config.customPageCount, elements.length))
  const pages: FormPage[] = []
  const perPage = Math.ceil(elements.length / pageCount)

  for (let i = 0; i < pageCount; i++) {
    const pageElements = elements.slice(i * perPage, (i + 1) * perPage)
    if (pageElements.length > 0) {
      pages.push({
        id: uuid(),
        name: `Page ${i + 1}`,
        type: 'form-page',
        elements: pageElements,
      })
    }
  }

  return pages
}

function buildEndingPage(): FormPage {
  return {
    id: uuid(),
    name: 'Results',
    type: 'ending-page',
    elements: [
      {
        id: uuid(),
        type: 'heading',
        label: 'Quiz Complete!',
      },
      {
        id: uuid(),
        type: 'paragraph',
        label: '<div>You scored <b>{{quiz:quiz-score}}</b> out of <b>{{quiz:max-score}}</b></div><div><br></div><div>Correct answers: <b>{{quiz:correct-answers}}</b> / <b>{{quiz:total-quiz-questions}}</b></div>',
      },
    ],
  }
}

export function buildFormJSON(questions: ExtractedQuestion[], config: QuizConfig) {
  const questionPages = distributeQuestions(questions, config)
  const endingPage = buildEndingPage()

  return {
    pages: [...questionPages, endingPage],
  }
}

export function buildThemeJSON() {
  return {
    name: 'Nova',
    font: {
      text: { size: '16px', family: 'Plus Jakarta Sans' },
      headings: { size: '32px', family: 'Plus Jakarta Sans' },
    },
    logo: { src: null, variables: { width: '40px', justifySelf: 'center' } },
    colors: {
      primary: '#6c5ce7',
      background: '#FFFFFF',
      text: '#000000',
      question: '#000000',
      answer: '#000000',
      secondary: '#222222',
      surface: '#F7F8FA',
      border: '#dedfe0',
      error: '#FF0000',
    },
    layout: { type: 'clean' },
    visual: {
      type: 'color',
      value: '#FFFFFF',
      variables: { size: 'cover', repeat: 'no-repeat', position: 'center' },
    },
    components: {
      form: { variables: { gap: '30px', maxWidth: '700px', textAlign: 'left' } },
      input: { preset: 'default' },
      button: { preset: 'default', hoverAnimation: { preset: 'grow' } },
      question: { variables: { fontWeight: '500' } },
    },
  }
}

export function buildSettings(config: QuizConfig) {
  return {
    mode: 'quiz',
    quiz: {
      instantFeedback: config.pageLayout === 'one-per-page',
    },
    general: {
      showProgressBar: true,
      showValidationErrors: true,
    },
  }
}

export function buildFullPayload(questions: ExtractedQuestion[], config: QuizConfig) {
  return {
    name: 'Generated Quiz',
    formJSON: buildFormJSON(questions, config),
    themeJSON: buildThemeJSON(),
    settings: buildSettings(config),
  }
}
