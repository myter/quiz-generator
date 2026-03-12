import { Router } from 'express'
import { extractText } from '../services/textExtractor.js'
import { generateQuestions } from '../services/questionGenerator.js'
import type { ExtractRequest } from '../types.js'

const router = Router()

router.post('/extract-questions', async (req, res) => {
  try {
    const body = req.body as ExtractRequest

    if (!body.config?.numQuestions || !body.config?.questionTypes) {
      res.status(400).json({ error: 'Missing config.numQuestions or config.questionTypes' })
      return
    }

    // Extract text from the provided source
    const text = await extractText(body.content, body.file, body.googleDocUrl)

    if (text.length < 20) {
      res.status(400).json({ error: 'Content is too short to generate meaningful questions.' })
      return
    }

    // Truncate very long texts to stay within LLM context limits
    const truncated = text.slice(0, 15000)

    // Generate questions via OpenAI
    const questions = await generateQuestions(
      truncated,
      body.config.numQuestions,
      body.config.questionTypes
    )

    res.json({ questions })
  } catch (err) {
    console.error('Extract questions error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    res.status(500).json({ error: message })
  }
})

export default router
