import '@testing-library/jest-dom/vitest'
import { afterEach, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import i18n from '../i18n'

beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: (query: string) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }) as unknown as MediaQueryList,
    })
  }
})

afterEach(async () => {
  cleanup()
  if (i18n.language !== 'pt-BR') {
    await i18n.changeLanguage('pt-BR')
  }
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.style.colorScheme = ''
  window.localStorage.clear()
})
