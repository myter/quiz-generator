# Shadow Weavely — Methodology

## Overview

**Shadow Weavely** is a pattern for building AI-powered form/quiz generators that use Weavely as the underlying form engine — without requiring users to have a Weavely account.

The core idea: an external AI (GPT-4o, Claude, etc.) generates structured form data, which is silently created on a **team-owned Weavely account** for live preview. When the user is happy and wants to keep/share the form, an **anonymous copy** is created via the Weavely API, giving them full ownership.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  User-facing app (widget, ChatGPT App, bot, etc.)   │
└──────────────┬──────────────────────┬────────────────┘
               │                      │
          (1) Generate            (3) Publish
               │                      │
               ▼                      ▼
┌──────────────────────┐   ┌─────────────────────────┐
│   Your API server    │   │  Weavely API (no auth)   │
│                      │   │  POST /v1/forms          │
│  - LLM call (GPT-4o)│   │  Called from browser on   │
│  - Weavely API call  │   │  *.weavely.ai domain     │
│    (team-owned)      │   └─────────────────────────┘
└──────────────────────┘
```

---

## The Two-Phase Flow

### Phase 1: Shadow Preview (Team-Owned)

During the creation/iteration phase, forms are created under **your team's Weavely account**:

1. **AI generates structured content** — The LLM produces questions, options, correct answers, scoring, etc. as structured JSON.
2. **Form is built** — The structured output is transformed into Weavely's `formJSON` schema (pages, elements, quiz scoring, logic rules, theme, settings).
3. **Form is created via Weavely API with auth** — Your server calls `POST https://api.weavely.ai/v1/forms` with `Authorization: Bearer <token>` and `teamId`. This creates a real, published form.
4. **User previews via iframe** — The published form URL (`https://forms.weavely.ai/{id}`) is embedded in an iframe so the user can interact with the live form.

```
POST https://api.weavely.ai/v1/forms
Headers:
  Authorization: Bearer <your-team-token>
  Content-Type: application/json

Body:
{
  "name": "Generated Quiz",
  "teamId": "<your-team-id>",
  "publish": true,
  "formJSON": { ... },
  "themeJSON": { ... },
  "settings": { ... },
  "logicRules": [...]
}

Response:
{
  "id": "abc-123",
  "editor": "https://forms.weavely.ai/editor/abc-123",
  "url": "https://forms.weavely.ai/abc-123"
}
```

These shadow forms are disposable — they exist on your team account purely for preview.

### Phase 2: Publish (Anonymous Copy)

When the user is satisfied and wants to keep/edit/share the form:

1. **Browser calls Weavely API directly** — No auth headers. This works because the request originates from a `*.weavely.ai` domain.
2. **Same payload, no teamId** — The exact same `formJSON`, `themeJSON`, `settings`, and `logicRules` are sent, but without `teamId` or `Authorization`.
3. **User gets the editor URL** — The response includes an `editor` URL. The user is redirected there to claim the form and continue editing in Weavely.

```
POST https://api.weavely.ai/v1/forms
Headers:
  Content-Type: application/json
  (no Authorization header)

Body:
{
  "name": "My Quiz",
  "publish": true,
  "formJSON": { ... },
  "themeJSON": { ... },
  "settings": { ... },
  "logicRules": [...]
}

Response:
{
  "id": "def-456",
  "editor": "https://forms.weavely.ai/editor/def-456",
  "url": "https://forms.weavely.ai/def-456"
}
```

**Important:** This call MUST come from the browser (not server-to-server) and the page must be on a `*.weavely.ai` domain for the API to accept unauthenticated requests.

---

## Why "Shadow"?

The team account acts as a **shadow** — it powers the experience behind the scenes, but the user never interacts with it directly. They only see the live preview (iframe) and the final handoff (editor link).

| Aspect | Shadow (Phase 1) | Published (Phase 2) |
|--------|------------------|---------------------|
| Owner | Your team account | Anonymous / user claims |
| Auth | Bearer token + teamId | None (browser origin) |
| Purpose | Live preview during creation | User keeps & edits |
| Called from | Your server | User's browser |

---

## Requirements

- **API server** with your Weavely team credentials (token + teamId) — never exposed to client
- **Domain on `*.weavely.ai`** — required for the anonymous API call from the browser
- **HTTPS** — required for both the API server and the embedding page
- **LLM** that can produce structured JSON output (GPT-4o, Claude, etc.)
