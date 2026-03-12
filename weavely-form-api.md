## Create form

> POST api.weavely.ai/v1/forms

Creates a new form from a complete form specification.

### Request

#### Headers

<ParamField header="Authorization" type="string" required>
  `Bearer <token>`\
  Your personal token.
</ParamField>

<ParamField header="Content-Type" type="string" required>
  `application/json`
</ParamField>

#### Body

The request body is a complete form specification with the following structure:

<ParamField body="name" type="string">
  Display name for the form shown in the Weavely dashboard.
</ParamField>

<ParamField body="teamId" type="string" required>
  The UUID of the team to associate this form with.
</ParamField>

<ParamField body="publish" type="boolean">
  Set to `true` to publish the form immediately. Without this, the form is created as a draft and won't be accessible at its public URL.
</ParamField>

<ParamField body="formJSON" type="object" required>
  The form structure containing all pages and elements.

  ```json
  {
    "pages": [
      {
        "id": "string",
        "name": "string",
        "type": "form-page" | "ending-page",
        "elements": [...]
      }
    ]
  }
  ```

  See **Form Structure Reference** below for complete element types and configurations.
</ParamField>

<ParamField body="themeJSON" type="object" required>
  The form's visual theme configuration.

  ```json
  {
    "name": "string",
    "font": {...},
    "logo": {...},
    "colors": {...},
    "layout": {...},
    "visual": {...}
  }
  ```

  See **Theme Configuration Reference** below for all available options.
</ParamField>

<ParamField body="settings" type="object">
  Optional form settings.

  ```json
  {
    "mode": "quiz",
    "quiz": {
      "instantFeedback": boolean
    },
    "access": {
      "stopSubmissions": boolean
    },
    "general": {
      "showProgressBar": boolean,
      "autoSaveProgress": boolean,
      "showValidationErrors": boolean
    },
    "notifications": {
      "submissionEmail": {...},
      "confirmationEmail": {...}
    },
    "i18n": {
      "language": "string"
    }
  }
  ```

  See **Quiz Mode Reference** below for quiz-specific settings. See **Internationalisation Reference** for supported language codes.
</ParamField>

<ParamField body="logicRules" type="array">
  Optional conditional logic rules.

  Each rule defines conditions and actions to execute based on field values.

  See **Logic Rules Reference** below for complete documentation.
</ParamField>

<ParamField body="eventTriggers" type="array">
  Optional event-based triggers.

  Triggers execute actions in response to form events (e.g., form submission, page load).

  See **Event Triggers Reference** below for available triggers and actions.
</ParamField>

<ParamField body="calculatedValues" type="array">
  Optional calculated field values.

  (Currently undocumented - reserved for future use)
</ParamField>

<ParamField body="pageAttributes" type="object">
  Optional page-specific attributes.

  (Currently undocumented - reserved for future use)
</ParamField>

### Response

<ResponseField name="id" type="string">
  The unique identifier (UUID) of the created form.
</ResponseField>

<ResponseField name="url" type="string">
  Direct link to edit the form in the Weavely editor.

  Format: `https://forms.weavely.ai/editor/{formId}`
</ResponseField>

### Example

**Request:**

```bash
curl -X POST https://api.weavely.ai/v1/forms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wvy_your_token_here" \
  -d '{
    "name": "Contact Form",
    "teamId": "your-team-uuid",
    "publish": true,
    "formJSON": {
      "pages": [{
        "id": "page-1",
        "name": "Contact",
        "type": "form-page",
        "elements": [
          {
            "id": "name",
            "type": "input-text",
            "label": "Your Name",
            "settings": { "required": true },
            "placeholder": "Enter your name..."
          }
        ]
      }]
    },
    "themeJSON": {
      "name": "Nova",
      "colors": {
        "primary": "#6c5ce7",
        "background": "#FFFFFF"
      }
    }
  }'
```

**Response:**

```json
{
  "id": "8e2d178f-4e9c-4fe3-9619-e44412bf7ba1",
  "url": "https://forms.weavely.ai/editor/8e2d178f-4e9c-4fe3-9619-e44412bf7ba1"
}
```

---

## Form Structure Reference

### Element Types

Weavely forms support 26 element types organized into categories:

**Input Elements:**

- `input-text` - Single-line text input
- `input-number` - Numeric input
- `input-email` - Email address input with validation
- `input-phone-number` - Phone number input
- `input-url` - URL input with validation
- `input-time` - Time picker
- `input-date` - Date picker
- `text-area` - Multi-line text input
- `input-file` - File upload

**Choice Elements:**

- `checkbox-buttons` - Multiple selection checkboxes
- `radio-buttons` - Single selection radio buttons
- `dropdown` - Dropdown select menu
- `image-choice` - Image-based selection
- `checkbox` - Single checkbox (yes/no)
- `matrix` - Grid of choices (rows × columns)
- `ranking` - Drag-and-drop ranking

**Rating Elements:**

- `star-rating` - Star-based rating (customizable number of stars)
- `scale-rating` - Numeric scale rating
- `range-slider` - Slider with min/max values

**Display Elements:**

- `heading` - Heading text
- `paragraph` - Paragraph text
- `image` - Image display
- `embed-html` - Custom HTML embed
- `embed-audio` - Audio player
- `embed-video` - Video embed

**Special Elements:**

- `signature` - Digital signature capture

---

### Element Specifications

<Accordion title="input-text">
  **Single-line text input**

  ```json
  {
    "type": "input-text",
    "label": "string",
    "settings": {
      "required": boolean
    },
    "description": "string",
    "placeholder": "string"
  }
  ```
</Accordion>

<Accordion title="input-number">
  **Numeric input only**

  ```json
  {
    "type": "input-number",
    "label": "string",
    "settings": {
      "required": boolean
    },
    "description": "string",
    "placeholder": "string"
  }
  ```
</Accordion>

<Accordion title="input-email">
  **Email input with validation**

  ```json
  {
    "type": "input-email",
    "label": "string",
    "settings": {
      "required": boolean
    },
    "description": "string",
    "placeholder": "string"
  }
  ```
</Accordion>

<Accordion title="input-phone-number">
  **Phone number input**

  ```json
  {
    "type": "input-phone-number",
    "label": "string",
    "settings": {
      "required": boolean
    },
    "description": "string",
    "placeholder": "string"
  }
  ```
</Accordion>

<Accordion title="input-url">
  **URL input with validation**

  ```json
  {
    "type": "input-url",
    "label": "string",
    "settings": {
      "required": boolean
    },
    "description": "string",
    "placeholder": "string"
  }
  ```
</Accordion>

<Accordion title="input-time">
  **Time picker input**

  ```json
  {
    "type": "input-time",
    "label": "string",
    "settings": {
      "required": boolean
    },
    "description": "string",
    "placeholder": "string"
  }
  ```
</Accordion>

<Accordion title="input-date">
  **Date picker input**

  ```json
  {
    "type": "input-date",
    "label": "string",
    "settings": {
      "required": boolean
    },
    "description": "string",
    "placeholder": "string"
  }
  ```
</Accordion>

<Accordion title="text-area">
  **Multi-line text input**

  ```json
  {
    "type": "text-area",
    "label": "string",
    "settings": {
      "required": boolean
    },
    "description": "string",
    "placeholder": "string"
  }
  ```
</Accordion>

<Accordion title="input-file">
  **File upload input**

  ```json
  {
    "type": "input-file",
    "label": "string",
    "settings": {
      "required": boolean,
      "maxFiles": number,
      "maxFileSize": number,
      "allowedFileType": "string"
    },
    "description": "string",
    "placeholder": "string"
  }
  ```
</Accordion>

<Accordion title="checkbox-buttons">
  **Multiple selection checkboxes**

  ```json
  {
    "type": "checkbox-buttons",
    "label": "string",
    "settings": {
      "required": boolean,
      "randomize": boolean,
      "allowOtherOption": boolean,
      "otherOptionLabel": "string",
      "options": [
        {
          "label": "string",
          "value": "string"
        }
      ]
    },
    "description": "string",
    "placeholder": "string"
  }
  ```
</Accordion>

<Accordion title="radio-buttons">
  **Single selection radio group**

  ```json
  {
    "type": "radio-buttons",
    "label": "string",
    "settings": {
      "required": boolean,
      "randomize": boolean,
      "allowOtherOption": boolean,
      "otherOptionLabel": "string",
      "options": [
        {
          "label": "string",
          "value": "string"
        }
      ]
    },
    "description": "string",
    "placeholder": "string"
  }
  ```
</Accordion>

<Accordion title="dropdown">
  **Dropdown select menu**

  ```json
  {
    "type": "dropdown",
    "label": "string",
    "settings": {
      "required": boolean,
      "randomize": boolean,
      "options": [
        {
          "label": "string",
          "value": "string"
        }
      ]
    },
    "description": "string"
  }
  ```
</Accordion>

<Accordion title="image-choice">
  **Image-based selection**

  ```json
  {
    "type": "image-choice",
    "label": "string",
    "settings": {
      "required": boolean,
      "multiple": boolean,
      "randomize": boolean,
      "imageWidth": number,
      "imageHeight": number,
      "imageFit": "string",
      "options": [
        {
          "label": "string",
          "value": "string",
          "data": { "url": "string" } | null
        }
      ]
    },
    "description": "string",
    "placeholder": "string"
  }
  ```
</Accordion>

<Accordion title="checkbox">
  **Single checkbox (yes/no)**

  ```json
  {
    "type": "checkbox",
    "label": "string",
    "settings": {
      "required": boolean,
      "default": boolean
    },
    "description": "string",
    "placeholder": "string"
  }
  ```
</Accordion>

<Accordion title="matrix">
  **Grid of choices (rows × columns)**

  ```json
  {
    "type": "matrix",
    "label": "string",
    "fields": [
      {
        "id": "string (UUID)",
        "type": "matrix-field",
        "label": "string",
        "settings": {
          "required": boolean,
          "multiple": boolean,
          "options": [
            {
              "label": "string",
              "value": "string"
            }
          ]
        },
        "description": "string",
        "placeholder": "string"
      }
    ],
    "settings": {
      "required": boolean,
      "multiple": boolean,
      "options": [
        {
          "label": "string",
          "value": "string"
        }
      ]
    },
    "description": "string"
  }
  ```
</Accordion>

<Accordion title="ranking">
  **Drag-and-drop ranking**

  ```json
  {
    "type": "ranking",
    "label": "string",
    "settings": {
      "required": boolean,
      "options": [
        {
          "label": "string",
          "value": "string"
        }
      ]
    },
    "description": "string",
    "placeholder": "string"
  }
  ```
</Accordion>

<Accordion title="star-rating">
  **Star-based rating**

  ```json
  {
    "type": "star-rating",
    "label": "string",
    "settings": {
      "required": boolean,
      "stars": number,
      "icon": "string"
    },
    "description": "string",
    "placeholder": "string"
  }
  ```
</Accordion>

<Accordion title="scale-rating">
  **Numeric scale rating**

  ```json
  {
    "type": "scale-rating",
    "label": "string",
    "settings": {
      "required": boolean,
      "scales": number
    },
    "description": "string",
    "placeholder": "string"
  }
  ```
</Accordion>

<Accordion title="range-slider">
  **Slider with min/max values**

  ```json
  {
    "type": "range-slider",
    "label": "string",
    "settings": {
      "min": number,
      "max": number,
      "step": number
    },
    "description": "string",
    "placeholder": "string"
  }
  ```
</Accordion>

<Accordion title="heading">
  **Heading text**

  ```json
  {
    "type": "heading",
    "label": "string"
  }
  ```
</Accordion>

<Accordion title="paragraph">
  **Paragraph text. Supports HTML markup and variable piping via `{{variable_id}}` syntax.**

  ```json
  {
    "type": "paragraph",
    "label": "string"
  }
  ```
</Accordion>

<Accordion title="image">
  **Image display**

  ```json
  {
    "type": "image",
    "settings": {
      "src": "string (URL)"
    }
  }
  ```
</Accordion>

<Accordion title="embed-html">
  **Custom HTML embed**

  ```json
  {
    "type": "embed-html",
    "settings": {
      "codeSnippet": "string"
    }
  }
  ```
</Accordion>

<Accordion title="embed-audio">
  **Audio player**

  ```json
  {
    "type": "embed-audio",
    "settings": {
      "url": "string"
    }
  }
  ```
</Accordion>

<Accordion title="embed-video">
  **Video embed**

  ```json
  {
    "type": "embed-video",
    "settings": {
      "url": "string"
    }
  }
  ```
</Accordion>

<Accordion title="signature">
  **Digital signature capture**

  ```json
  {
    "type": "signature",
    "label": "string",
    "settings": {
      "fileFormat": "string"
    },
    "description": "string",
    "placeholder": "string"
  }
  ```
</Accordion>

---

## Theme Configuration Reference

The `themeJSON` object controls all visual styling for the form. It contains the following sections: `name`, `font`, `logo`, `colors`, `layout`, `visual`, and `components`.

### Theme Presets

Weavely includes 7 preset themes. Set via the `name` field — the preset provides default values for colors, fonts, and components. Any explicit values you set will override the preset defaults.

- `Nova`
- `Retro`
- `Dawn`
- `Dusk`
- `Frost`
- `Ember`
- `Glass`

### Font

Controls typography for body text and headings independently.

```json
"font": {
  "text": {
    "size": "16px",
    "family": "Plus Jakarta Sans"
  },
  "headings": {
    "size": "32px",
    "family": "Plus Jakarta Sans"
  }
}
```

You can also set the font family globally using a shorthand:

```json
"font": {
  "family": "Poppins"
}
```

### Logo

Optional logo image displayed on the form.

```json
"logo": {
  "src": "string (URL)" | null,
  "variables": {
    "width": "40px",
    "justifySelf": "center"
  }
}
```

Set `src` to an image URL, or `null` for no logo.

### Colors

Full color palette for the form. All values are hex codes.

```json
"colors": {
  "primary": "#6c5ce7",
  "background": "#FFFFFF",
  "text": "#000000",
  "question": "#000000",
  "answer": "#000000",
  "secondary": "#222222",
  "surface": "#F7F8FA",
  "border": "#dedfe0",
  "error": "#FF0000"
}
```

| Color | Controls |
|---|---|
| `primary` | Buttons, accents, active states |
| `background` | Page/form background |
| `text` | General body text |
| `question` | Field labels / question text |
| `answer` | User input text |
| `secondary` | Secondary UI elements |
| `surface` | Input field backgrounds |
| `border` | Input borders, dividers |
| `error` | Validation error messages |

You can provide only a subset of colors (e.g. just `primary` and `background`) and the theme preset will fill in the rest.

### Layout

Controls where the visual (image or color) appears relative to the form.

```json
"layout": {
  "type": "right"
}
```

| Type | Description |
|---|---|
| `under` | Visual is placed behind the form as a full-page background |
| `left` | Visual is displayed as a left side panel, form on the right |
| `right` | Visual is displayed as a right side panel, form on the left |
| `clean` | No visual — form only |
| `over` | Visual overlays the form area |
| `through` | Visual bleeds through the form |

### Visual

The background visual — either an image or a solid color. Works together with `layout` to determine how the visual is positioned.

**Image visual:**

```json
"visual": {
  "type": "image",
  "value": "string (image URL)",
  "variables": {
    "size": "cover",
    "repeat": "no-repeat",
    "position": "center"
  }
}
```

**Color visual:**

```json
"visual": {
  "type": "color",
  "value": "#5a3131",
  "variables": {
    "size": "cover",
    "repeat": "no-repeat",
    "position": "center"
  }
}
```

The `variables` object uses CSS-like properties and defaults to `size: "cover"`, `repeat: "no-repeat"`, `position: "center"` for both types.

**Common combinations:**

- Side image: `layout.type: "right"` (or `"left"`) + `visual.type: "image"` — displays a photo alongside the form
- Background color: `layout.type: "under"` + `visual.type: "color"` — fills the page behind the form with a solid color
- Background image: `layout.type: "under"` + `visual.type: "image"` — fills the page behind the form with an image
- No visual: `layout.type: "clean"` — form only, no visual element

### Components

Controls form layout, input style, button style, and question weight.

```json
"components": {
  "form": {
    "variables": {
      "gap": "30px",
      "maxWidth": "700px",
      "textAlign": "left"
    }
  },
  "input": {
    "preset": "default"
  },
  "button": {
    "preset": "default",
    "hoverAnimation": {
      "preset": "grow"
    }
  },
  "question": {
    "variables": {
      "fontWeight": "500"
    }
  }
}
```

**Input presets:**

- `default` — Rounded input styling
- `square` — Square input styling

**Button presets:**

- `default` — Rounded button styling
- `square` — Square button styling

**Hover animation presets:**

- `default` — Default hover animation
- `grow` — Grow effect on hover

### Complete themeJSON Example

```json
{
  "name": "Nova",
  "font": {
    "text": { "size": "16px", "family": "Plus Jakarta Sans" },
    "headings": { "size": "32px", "family": "Plus Jakarta Sans" }
  },
  "logo": {
    "src": null,
    "variables": { "width": "40px", "justifySelf": "center" }
  },
  "colors": {
    "primary": "#6c5ce7",
    "background": "#FFFFFF",
    "text": "#000000",
    "question": "#000000",
    "answer": "#000000",
    "secondary": "#222222",
    "surface": "#F7F8FA",
    "border": "#dedfe0",
    "error": "#FF0000"
  },
  "layout": { "type": "right" },
  "visual": {
    "type": "image",
    "value": "https://example.com/your-image.jpg",
    "variables": { "size": "cover", "repeat": "no-repeat", "position": "center" }
  },
  "components": {
    "form": { "variables": { "gap": "30px", "maxWidth": "700px", "textAlign": "left" } },
    "input": { "preset": "default" },
    "button": { "preset": "default", "hoverAnimation": { "preset": "grow" } },
    "question": { "variables": { "fontWeight": "500" } }
  }
}
```

---

## Quiz Mode Reference

Quiz mode turns a form into a scored assessment.

### Enabling Quiz Mode

Set `settings.mode` to `"quiz"` and optionally configure quiz-specific settings:

```json
{
  "settings": {
    "mode": "quiz",
    "quiz": {
      "instantFeedback": true
    }
  }
}
```

| Setting | Type | Description |
|---|---|---|
| `mode` | `"quiz"` | Activates quiz mode. Omit for standard form behaviour |
| `quiz.instantFeedback` | boolean | When `true`, shows correct/incorrect feedback after each question rather than at the end |

### Quiz-Compatible Element Types

Only the following element types support quiz scoring:

- `radio-buttons`
- `checkbox-buttons`
- `input-text`
- `dropdown`

### The `quiz` Property

Add a `quiz` object to any compatible element to define its correct answer and score:

```json
{
  "id": "string (UUID)",
  "type": "radio-buttons",
  "label": "What is the capital of France?",
  "settings": { ... },
  "quiz": {
    "score": 1,
    "answer": "Paris"
  }
}
```

| Field | Type | Description |
|---|---|---|
| `score` | number | Points awarded for a correct answer. Can be any positive number — questions can be weighted differently |
| `answer` | string | Correct answer for single-select elements (`radio-buttons`, `input-text`, `dropdown`). For `radio-buttons` and `dropdown`, must match the option's `value` exactly. For `input-text`, matching is case-insensitive |
| `answer` | array of strings | All correct answers for `checkbox-buttons` — respondent must select exactly this set of values |

### Quiz Variables

When quiz mode is active, four variables are automatically available for use in logic rules and answer piping:

| Variable ID | Description |
|---|---|
| `quiz:quiz-score` | Total points scored by the respondent |
| `quiz:max-score` | Maximum possible score (sum of all `quiz.score` values) |
| `quiz:correct-answers` | Number of questions answered correctly |
| `quiz:total-quiz-questions` | Total number of quiz questions in the form |

### Score-Based Conditional Endings

Use quiz variables in logic rules to direct respondents to different ending pages based on their score:

```json
{
  "id": "string (UUID)",
  "name": "High score ending",
  "logicalOperator": "any",
  "conditions": [
    {
      "id": "string (UUID)",
      "variable": "quiz:quiz-score",
      "operator": "greaterThanOrEqual",
      "value": "5"
    }
  ],
  "actions": [
    {
      "id": "string (UUID)",
      "name": "setEnding",
      "data": {
        "elementId": "string (ending-page UUID)"
      }
    }
  ]
}
```

All standard logic rule actions are available (`hideElement`, `showElement`, `hidePage`, `skipToPage`, `setEnding`).

### Showing Results to Respondents

Pipe quiz variables into paragraph labels using `{{variable_id}}` syntax. Element labels support HTML markup:

```html
<div>Thanks for completing the quiz!</div>
<div><br></div>
<div>Score: {{quiz:quiz-score}} / {{quiz:max-score}}</div>
<div>Correct answers: {{quiz:correct-answers}} / {{quiz:total-quiz-questions}}</div>
```

---

## Logic Rules Reference

Logic rules enable conditional behavior based on field values.

### Structure

```json
{
  "id": "string (UUID)",
  "name": "string",
  "logicalOperator": "any" | "all",
  "conditions": [{
    "id": "string (UUID)",
    "variable": "field:{elementId}",
    "operator": "isEmpty" | "isEqual" | "contains" | ...,
    "value": null | string | number
  }],
  "actions": [{
    "id": "string (UUID)",
    "name": "hideElement" | "showElement" | "skipToPage" | ...,
    "data": { "elementId": "string (UUID)" }
  }]
}
```

### Logical Operators

- `any` - OR logic: trigger actions if ANY condition is true
- `all` - AND logic: trigger actions if ALL conditions are true

### Condition Operators

**Universal (all field types):**

- `isEmpty` - Check if field is empty/null
- `isNotEmpty` - Check if field has a value
- `isEqual` - Check if field equals a specific value
- `isNotEqual` - Check if field does not equal a specific value

**String operators (text fields):**

- `contains` - Check if field contains a substring
- `doesNotContain` - Check if field does not contain a substring
- `startsWith` - Check if field starts with a string
- `endsWith` - Check if field ends with a string

**Numeric operators (number fields and quiz variables):**

- `lessThan` - Check if field is less than a value
- `lessThanOrEqual` - Check if field is less than or equal to a value
- `greaterThan` - Check if field is greater than a value
- `greaterThanOrEqual` - Check if field is greater than or equal to a value

### Available Actions

- `hideElement` - Hide a specific element
- `showElement` - Show a specific element
- `hidePage` - Hide a specific page
- `skipToPage` - Navigate to a specific page
- `setEnding` - Set which ending page to display

---

## Event Triggers Reference

Event triggers execute actions in response to form events.

### Structure

```json
{
  "id": "string (UUID)",
  "name": "string",
  "trigger": {
    "name": "formSubmitted" | "formLoaded" | "formPageShown"
  },
  "actions": [{
    "id": "string (UUID)",
    "name": "openUrl" | "restartForm",
    "data": { "url": "string" }
  }]
}
```

### Available Triggers

- `formSubmitted` - Triggered when form is successfully submitted
- `formLoaded` - Triggered when form initially loads
- `formPageShown` - Triggered when a form page is displayed

### Available Actions

- `openUrl` - Redirect to a URL
  - Requires `data.url` field
- `restartForm` - Restart the form from the beginning
  - No additional data required

---

## Internationalisation Reference

Set the form's language via `settings.i18n.language`. The server automatically injects the correct system message translations (button labels, placeholders, error messages) for the chosen language.

```json
{
  "settings": {
    "i18n": {
      "language": "fr"
    }
  }
}
```

### Supported Languages

| Language | Code |
|---|---|
| Arabic | `ar` |
| Catalan | `ca` |
| Chinese (Simplified) | `zh-Hans` |
| Chinese (Traditional) | `zh-Hant` |
| Croatian | `hr` |
| Czech | `cs` |
| Danish | `da` |
| Dutch | `nl` |
| English | `en` |
| Estonian | `et` |
| Finnish | `fi` |
| French | `fr` |
| German (Formal) | `de` |
| German (Informal) | `di` |
| Greek | `el` |
| Hebrew | `he` |
| Hindi | `hi` |
| Hungarian | `hu` |
| Indonesian | `id` |
| Italian | `it` |
| Japanese | `ja` |
| Korean | `ko` |
| Norwegian | `no` |
| Polish | `pl` |
| Portuguese | `pt` |
| Russian | `ru` |
| Spanish | `es` |
| Swedish | `sv` |
| Turkish | `tr` |
| Ukrainian | `uk` |
| Vietnamese | `vi` |

Note: German uses custom codes — `de` for formal ("Sie") and `di` for informal ("du").
