import { createRoot } from 'react-dom/client'
import './index.css'
import FormGeneratorApp from './FormGeneratorApp'

const scriptTag = document.currentScript || document.querySelector('script[src*="form-generator"]')
const apiUrl = scriptTag?.getAttribute('data-api-url') || ''
const interceptSelector = scriptTag?.getAttribute('data-intercept-selector') || ''

// Create a hidden container for the form generator React app
const container = document.createElement('div')
container.id = 'form-generator-root'
document.body.appendChild(container)

createRoot(container).render(
  <FormGeneratorApp apiUrl={apiUrl} interceptSelector={interceptSelector} />
)
