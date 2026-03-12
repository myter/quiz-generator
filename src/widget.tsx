import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const scriptTag = document.currentScript || document.querySelector('script[src*="quiz-generator"]')
const apiUrl = scriptTag?.getAttribute('data-api-url') || ''

const container = document.getElementById('quiz-generator')
if (container) {
  createRoot(container).render(<App apiUrl={apiUrl} />)
}
