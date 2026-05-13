import React from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import App from './App'
import './styles/global.css'

const container = document.getElementById('root')
if (!container) throw new Error('Root container missing in index.html')
createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
