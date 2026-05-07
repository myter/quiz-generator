import OpenAI from 'openai'

let _openai: OpenAI | null = null
function getClient(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return _openai
}

const ELEMENT_SPEC = `
Available Weavely form element types:

INPUT ELEMENTS:
- input-text: Single-line text. { type: "input-text", label, settings: { required }, description?, placeholder? }
- input-email: Email with validation. { type: "input-email", label, settings: { required }, description?, placeholder? }
- input-number: Numeric only. { type: "input-number", label, settings: { required }, description?, placeholder? }
- input-phone-number: Phone input. { type: "input-phone-number", label, settings: { required }, description?, placeholder? }
- input-url: URL with validation. { type: "input-url", label, settings: { required }, description?, placeholder? }
- input-date: Date picker. { type: "input-date", label, settings: { required }, description?, placeholder? }
- input-time: Time picker. { type: "input-time", label, settings: { required }, description?, placeholder? }
- text-area: Multi-line text. { type: "text-area", label, settings: { required }, description?, placeholder? }
- input-file: File upload. { type: "input-file", label, settings: { required, maxFiles?, maxFileSize?, allowedFileType? }, description? }

CHOICE ELEMENTS:
- radio-buttons: Single select. { type: "radio-buttons", label, settings: { required, randomize?, options: [{ label, value }] }, description? }
- checkbox-buttons: Multi select. { type: "checkbox-buttons", label, settings: { required, randomize?, allowOtherOption?, options: [{ label, value }] }, description? }
- dropdown: Dropdown menu. { type: "dropdown", label, settings: { required, randomize?, options: [{ label, value }] }, description? }
- checkbox: Single yes/no. { type: "checkbox", label, settings: { required, default? }, description? }

RATING ELEMENTS:
- star-rating: Stars. { type: "star-rating", label, settings: { required, stars: number, icon? }, description? }
- scale-rating: Numeric scale. { type: "scale-rating", label, settings: { required, scales: number }, description? }
- range-slider: Slider. { type: "range-slider", label, settings: { min, max, step }, description? }
- ranking: Drag-and-drop ranking. { type: "ranking", label, settings: { required, options: [{ label, value }] }, description? }

LAYOUT ELEMENTS:
- heading: Section title. { type: "heading", label }
- paragraph: Text block (supports HTML). { type: "paragraph", label }

SPECIAL:
- matrix: Grid of choices. { type: "matrix", label, fields: [{ id, type: "matrix-field", label, settings: { required, multiple?, options: [{ label, value }] } }], settings: { required, multiple?, options: [{ label, value }] } }
- signature: Signature capture. { type: "signature", label, settings: { fileFormat? }, description? }
`

const THEME_SPEC = `
Theme presets: Nova, Retro, Dawn, Dusk, Frost, Ember, Glass.
Pick the most appropriate preset for the form topic. The preset provides default colors/fonts.
You can override specific colors if needed.

themeJSON structure:
{
  "name": "preset name",
  "font": { "text": { "size": "16px", "family": "Plus Jakarta Sans" }, "headings": { "size": "32px", "family": "Plus Jakarta Sans" } },
  "logo": { "src": null, "variables": { "width": "40px", "justifySelf": "center" } },
  "colors": { "primary": "#hex", "background": "#hex", "text": "#hex", "question": "#hex", "answer": "#hex", "secondary": "#hex", "surface": "#hex", "border": "#hex", "error": "#hex" },
  "layout": { "type": "clean" },
  "visual": { "type": "color", "value": "#hex", "variables": { "size": "cover", "repeat": "no-repeat", "position": "center" } },
  "components": { "form": { "variables": { "gap": "30px", "maxWidth": "700px", "textAlign": "left" } }, "input": { "preset": "default" }, "button": { "preset": "default", "hoverAnimation": { "preset": "grow" } }, "question": { "variables": { "fontWeight": "500" } } }
}

Layout types: "clean" (no visual), "under" (background), "left"/"right" (side panel), "over", "through".
`

export async function generateForm(
  prompt: string,
  documentTexts: string[]
): Promise<{ formJSON: object; themeJSON: object; settings: object }> {
  const contextParts = [prompt]
  documentTexts.forEach((text, i) => {
    if (text.trim()) {
      contextParts.push(`\n--- Document ${i + 1} ---\n${text}`)
    }
  })
  const userContent = contextParts.join('\n')

  const response = await getClient().chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.7,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a form builder. Given a user's description (and optionally document content for context), generate a complete Weavely form specification.

${ELEMENT_SPEC}

${THEME_SPEC}

Rules:
- Choose appropriate element types for each field (e.g. input-email for emails, radio-buttons for single choice, checkbox-buttons for multi-select, star-rating for ratings, etc.)
- Every element needs a unique "id" — use UUID v4 format (e.g. "a1b2c3d4-e5f6-7890-abcd-ef1234567890")
- Every page needs a unique "id" in the same UUID format
- Group related fields on the same page. Use multiple pages for long forms.
- Add a heading element at the top of each page to give context
- Add an ending-page as the last page with a thank-you message (type: "ending-page")
- Set "required": true for essential fields
- Pick a theme preset that fits the form's purpose (e.g. "Frost" for professional, "Ember" for warm/creative, "Nova" for general)
- IMPORTANT: The form MUST be in the same language as the user's input. If the prompt is in French, write all labels, descriptions, placeholders, and headings in French. Always match the input language exactly.
- For settings, use type: "form" (not "quiz"), showProgressBar: true, showValidationErrors: true

Return a JSON object with this exact structure:
{
  "formJSON": {
    "pages": [
      {
        "id": "uuid",
        "name": "Page Name",
        "type": "form-page",
        "elements": [...]
      },
      {
        "id": "uuid",
        "name": "Thank You",
        "type": "ending-page",
        "elements": [
          { "id": "uuid", "type": "heading", "label": "Thank you!" },
          { "id": "uuid", "type": "paragraph", "label": "Your response has been recorded." }
        ]
      }
    ]
  },
  "themeJSON": { ... },
  "settings": {
    "general": {
      "showProgressBar": true,
      "showValidationErrors": true
    }
  }
}`,
      },
      {
        role: 'user',
        content: `Create a form based on this:\n\n${userContent}`,
      },
    ],
  })

  const raw = response.choices[0]?.message?.content
  if (!raw) throw new Error('No response from OpenAI')

  const parsed = JSON.parse(raw)

  if (!parsed.formJSON?.pages || !Array.isArray(parsed.formJSON.pages)) {
    throw new Error('Invalid form specification: missing pages')
  }

  return {
    formJSON: parsed.formJSON,
    themeJSON: parsed.themeJSON || {},
    settings: parsed.settings || {},
  }
}
