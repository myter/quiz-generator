import OpenAI from 'openai'
import type { ExtractedQuestion } from '../types.js'

let _openai: OpenAI | null = null
function getClient(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return _openai
}

export async function generateQuestions(
  text: string,
  numQuestions: number,
  questionTypes: 'closed' | 'open' | 'both'
): Promise<ExtractedQuestion[]> {
  const typeInstruction = {
    closed: 'All questions must be closed-ended (multiple choice) with exactly 4 options each.',
    open: 'All questions must be open-ended (short text answer).',
    both: 'Use a mix of closed-ended (multiple choice with 4 options) and open-ended (short text answer) questions.',
  }[questionTypes]

  const response = await getClient().chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.7,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a quiz generator. Given source content, create quiz questions that test understanding of the material.

Rules:
- Generate exactly ${numQuestions} questions.
- ${typeInstruction}
- Each question must have a clear, unambiguous correct answer.
- For closed-ended questions, provide exactly 4 options. The correct answer must be one of the options.
- For open-ended questions, provide a concise correct answer (what would be accepted as correct).
- Each question is worth 1 point.
- Vary difficulty: include easy, medium, and hard questions.
- IMPORTANT: The quiz MUST be in the same language as the user's input. Detect the language of the provided text/prompt and write ALL questions, options, and answers in that same language. If the input is in English, the quiz must be in English. If in French, everything must be in French. Always match the language of the input exactly.

Return a JSON object with this exact schema:
{
  "questions": [
    {
      "question": "string",
      "type": "closed" | "open",
      "options": ["string", "string", "string", "string"],  // only for closed-ended
      "correctAnswer": "string",
      "score": 1
    }
  ]
}`,
      },
      {
        role: 'user',
        content: `Generate a quiz based on this content:\n\n${text}`,
      },
    ],
  })

  const raw = response.choices[0]?.message?.content
  if (!raw) throw new Error('No response from OpenAI')

  const parsed = JSON.parse(raw)
  const questions: ExtractedQuestion[] = parsed.questions

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('Failed to generate valid questions')
  }

  return questions.slice(0, numQuestions)
}
