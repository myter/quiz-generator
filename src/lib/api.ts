import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import type { QuizConfig, ExtractResponse, CreateQuizResponse } from './types'

let _apiUrl = ''

export function setApiUrl(url: string) {
  _apiUrl = url.replace(/\/$/, '')
}

export async function extractQuestions(
  content: string,
  file: File | null,
  googleDocUrl: string,
  config: Pick<QuizConfig, 'numQuestions' | 'questionTypes'>,
  selectedPages: number[] = []
): Promise<ExtractResponse> {
  const body: Record<string, unknown> = {
    config: {
      numQuestions: config.numQuestions,
      questionTypes: config.questionTypes,
    },
  }

  if (file && file.name.endsWith('.docx')) {
    // Extract text client-side from DOCX
    const text = await extractTextFromDocx(file)
    body.content = text
  } else if (file && selectedPages.length > 0) {
    // Extract text client-side from selected PDF pages only
    const text = await extractTextFromPdf(file, selectedPages)
    body.content = text
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
}): Promise<CreateQuizResponse & { editorUrl: string }> {
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

export async function createQuizAnon(payload: {
  name: string
  formJSON: object
  themeJSON: object
  settings: object
  logicRules?: object[]
}): Promise<{ formId: string; editorUrl: string }> {
  // Call Weavely API directly from browser — no auth headers.
  // Works because the page is on a *.weavely.ai domain.
  const res = await fetch('https://api.weavely.ai/v1/forms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: payload.name || 'Generated Quiz (Copy)',
      publish: true,
      formJSON: payload.formJSON,
      themeJSON: payload.themeJSON,
      settings: payload.settings,
      logicRules: payload.logicRules || [],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Anon quiz creation failed (${res.status})`)
  }

  const data = await res.json()
  return {
    formId: data.id,
    editorUrl: data.url,
  }
}

async function extractTextFromPdf(file: File, selectedPages: number[]): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const texts: string[] = []
  for (const pageNum of selectedPages) {
    if (pageNum > pdf.numPages) continue
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ')
    texts.push(pageText)
  }

  return texts.join('\n\n')
}

async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}
