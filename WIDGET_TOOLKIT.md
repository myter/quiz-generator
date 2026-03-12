# Weavely Widget Toolkit — Reusable Reference

## Tech Stack
- **React 19 + TypeScript + Vite 7**
- **Tailwind CSS v4** with `@tailwindcss/vite` plugin
- **`vite-plugin-css-injected-by-js`** — inlines CSS into the JS bundle for single-file distribution
- **No state management library** — `useReducer` is sufficient for widget-level state

## Webflow Embedding Pattern
```html
<div id="your-widget-id"></div>
<script defer src="https://your-cdn.com/your-widget.js"></script>
```

The widget entry point (`widget.tsx`) reads `data-*` attributes from the script tag for configuration, finds the container div, and mounts React into it.

## Vite Config (production builds as single IIFE file)
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(mode === 'production' ? [cssInjectedByJsPlugin()] : []),
  ],
  build: {
    rollupOptions: {
      input: mode === 'production' ? 'src/widget.tsx' : undefined,
      output: {
        entryFileNames: 'your-widget.js',
        inlineDynamicImports: true,
      },
    },
    cssCodeSplit: false,
    target: 'es2020',
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },
}))
```

## Tailwind CSS v4 Setup (`index.css`)

**Critical for Webflow:** Use `important` to beat Webflow's global styles:

```css
@import "tailwindcss" important;
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap');

@theme {
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, sans-serif;
  --color-wv-bg: #f9f7fc;
  --color-wv-primary: #310080;
  --color-wv-accent: #6200ff;
  --color-wv-text: #140033;
  --color-wv-muted: rgba(20, 0, 51, 0.55);
  --color-wv-border: rgba(20, 0, 51, 0.12);
  --color-wv-border-strong: rgba(20, 0, 51, 0.2);
  --color-wv-card: #ffffff;
  --color-wv-input-bg: #f9f7fc;
  --color-wv-green: #16a34a;
  --color-wv-red: #dc2626;
  --color-wv-accent-light: rgba(98, 0, 255, 0.08);
  --color-wv-accent-mid: rgba(98, 0, 255, 0.15);
}
```

## Scoped CSS Reset (prevents Webflow style leakage)

Scope all custom CSS under `#your-widget-id`:

```css
#your-widget-id *,
#your-widget-id *::before,
#your-widget-id *::after {
  box-sizing: border-box !important;
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  font-size: 100%;
  vertical-align: baseline;
  line-height: inherit;
  letter-spacing: normal;
  text-transform: none;
}

#your-widget-id {
  font-family: 'Satoshi', ui-sans-serif, system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #140033;
  -webkit-font-smoothing: antialiased;
}

#your-widget-id button {
  cursor: pointer;
  background: none;
  line-height: inherit;
}

#your-widget-id select {
  appearance: auto;
}

#your-widget-id a {
  text-decoration: none;
  color: inherit;
}
```

## Design Tokens (Tailwind utility to CSS value)

| Token | Utility class | Value |
|---|---|---|
| Page background | `bg-wv-bg` | `#f9f7fc` |
| Primary (deep purple) | `bg-wv-primary`, `text-wv-primary` | `#310080` |
| Accent (bright purple) | `bg-wv-accent`, `text-wv-accent` | `#6200ff` |
| Body text | `text-wv-text` | `#140033` |
| Muted text | `text-wv-muted` | `rgba(20,0,51,0.55)` |
| Border | `border-wv-border` | `rgba(20,0,51,0.12)` |
| Border strong | `border-wv-border-strong` | `rgba(20,0,51,0.2)` |
| Card background | `bg-wv-card` | `#ffffff` |
| Input background | `bg-wv-input-bg` | `#f9f7fc` |
| Active button bg (light) | `bg-wv-accent-light` | `rgba(98,0,255,0.08)` |
| Hover button bg (light) | `bg-wv-accent-mid` | `rgba(98,0,255,0.15)` |
| Success green | `text-wv-green` | `#16a34a` |
| Error red | `text-wv-red` | `#dc2626` |

## Component Patterns

### Cards
```html
<div className="bg-wv-card rounded-2xl border border-wv-border p-6 shadow-sm">
```

### Labels
```html
<label className="block text-sm font-medium text-wv-text mb-1">
```

### Text inputs
```html
<input className="w-full px-3 py-2.5 border border-wv-border rounded-xl text-sm text-wv-text bg-wv-input-bg focus:outline-none focus:ring-2 focus:ring-wv-accent/40 focus:border-wv-accent transition-colors" />
```

### Active/inactive toggle buttons
```html
<button className={isActive
  ? 'bg-wv-primary text-white'
  : 'bg-wv-accent-light text-wv-text hover:bg-wv-accent-mid'
}>
```

### Pill/chip buttons (quick-add style)
```html
<button className="px-3 py-1 text-xs bg-wv-accent-light text-wv-text rounded-full hover:bg-wv-accent-mid transition-colors">
```

### Section dividers
```html
<div className="border-t border-wv-border pt-4">
```

### Muted helper text
```html
<p className="text-xs text-wv-muted">
```

## CTA Glow Button

### CSS
```css
#your-widget-id .cta-glow-wrapper {
  position: relative;
  border-radius: 12px;
  padding: 2px;
  background: linear-gradient(135deg, #00d4ff, #6200ff, #b000ff);
  box-shadow:
    0 0 16px rgba(98, 0, 255, 0.2),
    0 0 32px rgba(0, 212, 255, 0.1);
  transition: box-shadow 0.3s ease;
}

#your-widget-id .cta-glow-wrapper:hover {
  box-shadow:
    0 0 20px rgba(98, 0, 255, 0.35),
    0 0 40px rgba(0, 212, 255, 0.18);
}

#your-widget-id .cta-glow-inner {
  display: block;
  background: white;
  border-radius: 10px;
  padding: 10px 20px;
  text-align: center;
  transition: background 0.3s ease;
}

#your-widget-id .cta-glow-wrapper:hover .cta-glow-inner {
  background: #faf8ff;
}
```

### JSX
```tsx
<a href={url} className="cta-glow-wrapper block no-underline">
  <span className="cta-glow-inner">
    <p className="text-sm text-wv-text mb-0.5">{text}</p>
    <span className="text-sm font-semibold bg-gradient-to-r from-[#00d4ff] via-[#6200ff] to-[#b000ff] bg-clip-text text-transparent">
      {linkText}
    </span>
  </span>
</a>
```

## Custom Form Controls

### Range slider (purple themed)
```css
#your-widget-id input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 999px;
  background: var(--color-wv-accent-mid);
  outline: none;
}

#your-widget-id input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-wv-accent);
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

#your-widget-id input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-wv-accent);
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}
```

### Checkbox (purple themed)
```css
#your-widget-id input[type="checkbox"] {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border: 1.5px solid var(--color-wv-border-strong) !important;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
}

#your-widget-id input[type="checkbox"]:checked {
  background: var(--color-wv-accent);
  border-color: var(--color-wv-accent) !important;
}

#your-widget-id input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid white !important;
  border-width: 0 2px 2px 0 !important;
  transform: rotate(45deg);
}

#your-widget-id input[type="checkbox"]:focus-visible {
  outline: 2px solid var(--color-wv-accent);
  outline-offset: 2px;
}
```

## Layout

### Two-column desktop, single-column mobile
```html
<div className="max-w-3xl mx-auto font-satoshi">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div><!-- inputs --></div>
    <div><!-- results (sticky) -->
      <div className="md:sticky md:top-4">...</div>
    </div>
  </div>
</div>
```

## Hosting for Webflow

Host the built JS file on **GitHub Pages** (free). Add `dist/` to git (remove from `.gitignore`), enable Pages from the master branch, then reference:
```
https://your-username.github.io/your-repo/dist/your-widget.js
```
