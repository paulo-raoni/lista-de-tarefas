import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_THEME,
  isThemeChoice,
  readStoredTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemeChoice,
} from './storage'

const THEME_COLORS: Record<ResolvedTheme, string> = {
  light: '#ffffff',
  dark: '#121212',
}

const applyTheme = (resolved: ResolvedTheme): void => {
  document.documentElement.dataset.theme = resolved
  document.documentElement.style.colorScheme = resolved

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) meta.content = THEME_COLORS[resolved]
}

export interface UseTheme {
  choice: ThemeChoice
  resolved: ResolvedTheme
  setChoice: (next: ThemeChoice) => void
}

export const useTheme = (): UseTheme => {
  const [choice, setChoiceState] = useState<ThemeChoice>(() => readStoredTheme())
  const [resolved, setResolved] = useState<ResolvedTheme>(() => resolveTheme(readStoredTheme()))

  useEffect(() => {
    const next = resolveTheme(choice)
    setResolved(next)
    applyTheme(next)
  }, [choice])

  useEffect(() => {
    if (choice !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const next: ResolvedTheme = mq.matches ? 'dark' : 'light'
      setResolved(next)
      applyTheme(next)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [choice])

  const setChoice = useCallback((next: ThemeChoice) => {
    if (!isThemeChoice(next)) return
    setChoiceState(next)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      /* localStorage may be disabled */
    }
  }, [])

  return { choice, resolved, setChoice }
}

export { DEFAULT_THEME, THEME_STORAGE_KEY }
