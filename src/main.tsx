import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('quiz-generator')!).render(
  <StrictMode>
    <App apiUrl="http://100.96.51.8:3002" />
  </StrictMode>,
)
