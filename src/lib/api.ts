import type { QuizConfig, ExtractResponse, CreateQuizResponse } from './types'

let _apiUrl = ''

export function setApiUrl(url: string) {
  _apiUrl = url.replace(/\/$/, '')
}

export async function extractQuestions(
  content: string,
  file: File | null,
  googleDocUrl: string,
  config: Pick<QuizConfig, 'numQuestions' | 'questionTypes'>
): Promise<ExtractResponse> {
  const body: Record<string, unknown> = {
    config: {
      numQuestions: config.numQuestions,
      questionTypes: config.questionTypes,
    },
  }

  if (file) {
    const base64 = await fileToBase64(file)
    body.file = base64
  } else if (googleDocUrl) {
    body.googleDocUrl = googleDocUrl
  } else {
    body.content = content
  }

  const res = await fetch(`${_apiUrl}/api/extract-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Extraction failed (${res.status})`)
  }

  return res.json()
}

export async function createQuiz(payload: {
  name: string
  formJSON: object
  themeJSON: object
  settings: object
  logicRules?: object[]
}): Promise<CreateQuizResponse> {
  const res = await fetch(`${_apiUrl}/api/create-quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Quiz creation failed (${res.status})`)
  }

  return res.json()
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
