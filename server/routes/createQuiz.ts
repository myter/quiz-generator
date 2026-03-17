import { Router } from 'express'
import type { CreateQuizRequest } from '../types.js'

const router = Router()

const WEAVELY_API_URL = 'https://api.weavely.ai/v1/forms'

router.post('/create-quiz', async (req, res) => {
  try {
    const body = req.body as CreateQuizRequest
    const token = process.env.WEAVELY_API_TOKEN
    const teamId = process.env.WEAVELY_TEAM_ID

    if (!token || !teamId) {
      res.status(500).json({ error: 'Server misconfigured: missing Weavely credentials' })
      return
    }

    if (!body.formJSON || !body.themeJSON) {
      res.status(400).json({ error: 'Missing formJSON or themeJSON' })
      return
    }

    const weaveyRes = await fetch(WEAVELY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: body.name || 'Generated Quiz',
        teamId,
        publish: true,
        formJSON: body.formJSON,
        themeJSON: body.themeJSON,
        settings: body.settings,
        logicRules: body.logicRules || [],
      }),
    })

    if (!weaveyRes.ok) {
      const errBody = await weaveyRes.text()
      console.error('Weavely API error:', weaveyRes.status, errBody)
      res.status(502).json({ error: 'Failed to create quiz in Weavely' })
      return
    }

    const data = await weaveyRes.json()
    res.json({
      formId: data.id,
      editorUrl: data.url,
      formUrl: `https://forms.weavely.ai/${data.id}`,
    })
  } catch (err) {
    console.error('Create quiz error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    res.status(500).json({ error: message })
  }
})

// Anonymous copy — no auth, no team. Works because server is on *.weavely.ai domain
router.post('/create-quiz-anon', async (req, res) => {
  try {
    const body = req.body as CreateQuizRequest

    if (!body.formJSON || !body.themeJSON) {
      res.status(400).json({ error: 'Missing formJSON or themeJSON' })
      return
    }

    const weaveyRes = await fetch(WEAVELY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: body.name || 'Generated Quiz (Copy)',
        publish: true,
        formJSON: body.formJSON,
        themeJSON: body.themeJSON,
        settings: body.settings,
        logicRules: body.logicRules || [],
      }),
    })

    if (!weaveyRes.ok) {
      const errBody = await weaveyRes.text()
      console.error('Weavely API error (anon):', weaveyRes.status, errBody)
      res.status(502).json({ error: 'Failed to create anonymous quiz copy' })
      return
    }

    const data = await weaveyRes.json()
    res.json({
      formId: data.id,
      editorUrl: data.url,
    })
  } catch (err) {
    console.error('Create anon quiz error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    res.status(500).json({ error: message })
  }
})

export default router
