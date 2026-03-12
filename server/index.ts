import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import extractQuestionsRouter from './routes/extractQuestions.js'
import createQuizRouter from './routes/createQuiz.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.use('/api', extractQuestionsRouter)
app.use('/api', createQuizRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Quiz generator API running on port ${PORT}`)
})
