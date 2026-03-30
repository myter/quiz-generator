import { Router } from 'express'
import { generateForm } from '../services/formGenerator.js'

const router = Router()

router.post('/generate-form', async (req, res) => {
  try {
    const { prompt, documentTexts } = req.body as {
      prompt: string
      documentTexts?: string[]
    }

    if (!prompt || !prompt.trim()) {
      res.status(400).json({ error: 'Missing prompt' })
      return
    }

    const result = await generateForm(prompt, documentTexts || [])

    res.json(result)
  } catch (err) {
    console.error('Generate form error:', err)
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to generate form',
    })
  }
})

export default router
