import { useState, useEffect } from 'react'
import { setApiUrl, generateForm, createQuiz } from './lib/api'
import FormEmbed from './components/FormEmbed'

type Step = 'idle' | 'loading' | 'preview' | 'error'

interface FormPayload {
  name: string
  formJSON: object
  themeJSON: object
  settings: object
}

interface Props {
  apiUrl: string
  interceptSelector: string
}

export default function FormGeneratorApp({ apiUrl, interceptSelector }: Props) {
  const [step, setStep] = useState<Step>('idle')
  const [error, setError] = useState<string | null>(null)
  const [formUrl, setFormUrl] = useState<string | null>(null)
  const [formPayload, setFormPayload] = useState<FormPayload | null>(null)

  useEffect(() => {
    if (apiUrl) setApiUrl(apiUrl)
  }, [apiUrl])

  // Intercept the existing prompt box form
  useEffect(() => {
    if (!interceptSelector) return

    const form = document.querySelector(interceptSelector) as HTMLFormElement | null
    if (!form) {
      console.warn(`[form-generator] No element found for selector: ${interceptSelector}`)
      return
    }

    const handleSubmit = async (e: Event) => {
      e.preventDefault()
      e.stopPropagation()

      // Extract prompt text from the form's textarea or input
      const textInput = form.querySelector('textarea, input[type="text"]') as HTMLTextAreaElement | HTMLInputElement | null
      const prompt = textInput?.value?.trim() || ''

      if (!prompt) return

      // Extract files from file inputs — read as text client-side
      const fileInputs = form.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>
      const documentTexts: string[] = []
      for (const input of fileInputs) {
        if (!input.files) continue
        for (let i = 0; i < Math.min(input.files.length, 3); i++) {
          const text = await readFileAsText(input.files[i])
          if (text) documentTexts.push(text)
        }
      }

      await handleGenerate(prompt, documentTexts)
    }

    form.addEventListener('submit', handleSubmit, true)
    return () => form.removeEventListener('submit', handleSubmit, true)
  }, [interceptSelector])

  async function handleGenerate(prompt: string, documentTexts: string[]) {
    setStep('loading')
    setError(null)

    try {
      // Generate form spec via LLM
      const { formJSON, themeJSON, settings } = await generateForm(prompt, documentTexts)

      const payload: FormPayload = {
        name: 'Generated Form',
        formJSON,
        themeJSON,
        settings,
      }

      // Create shadow form (team-owned, for preview)
      const { formUrl: previewUrl } = await createQuiz(payload)

      setFormPayload(payload)
      setFormUrl(previewUrl)
      setStep('preview')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('error')
    }
  }

  // Show iframe overlay when form is ready
  if (step === 'preview' && formUrl && formPayload) {
    return <FormEmbed formUrl={formUrl} formPayload={formPayload} />
  }

  // Loading overlay
  if (step === 'loading') {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100dvh',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <span
            className="inline-block w-8 h-8 border-3 rounded-full animate-spin"
            style={{ borderColor: 'rgba(255,255,255,0.25)', borderTopColor: '#fff' }}
          />
          <p style={{ marginTop: '16px', fontSize: '18px', fontWeight: 600 }}>
            Generating your form...
          </p>
          <p style={{ marginTop: '4px', fontSize: '14px', opacity: 0.7 }}>
            This may take a few seconds
          </p>
        </div>
      </div>
    )
  }

  // Error overlay
  if (step === 'error' && error) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100dvh',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div style={{ textAlign: 'center', color: '#fff', maxWidth: '400px', padding: '20px' }}>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#fecaca' }}>
            Failed to generate form
          </p>
          <p style={{ marginTop: '8px', fontSize: '14px', opacity: 0.7 }}>
            {error}
          </p>
          <button
            onClick={() => setStep('idle')}
            style={{
              marginTop: '16px',
              padding: '10px 24px',
              background: '#6200ff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    )
  }

  // Idle state — nothing visible, just listening for form submit
  return null
}

async function readFileAsText(file: File): Promise<string> {
  // For text files, read directly
  if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
    return file.text()
  }
  // For other file types, read as text and hope for the best
  // In production, PDF/DOCX extraction could be done server-side
  try {
    return await file.text()
  } catch {
    return ''
  }
}
