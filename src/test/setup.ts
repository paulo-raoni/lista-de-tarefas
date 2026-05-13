import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import i18n from '../i18n'

afterEach(async () => {
  cleanup()
  if (i18n.language !== 'pt-BR') {
    await i18n.changeLanguage('pt-BR')
  }
  window.localStorage.clear()
})
