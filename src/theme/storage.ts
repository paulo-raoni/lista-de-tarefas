export const THEME_STORAGE_KEY = 'lista-de-tarefas:v1:theme'
export const DEFAULT_THEME = 'system' as const

export const THEME_CHOICES = ['light', 'dark', 'system'] as const
export type ThemeChoice = (typeof THEME_CHOICES)[number]

export type ResolvedTheme = 'light' | 'dark'

export const isThemeChoice = (value: unknown): value is ThemeChoice =>
  typeof value === 'string' && (THEME_CHOICES as readonly string[]).includes(value)

export const readStoredTheme = (): ThemeChoice => {
  if (typeof window === 'undefined') return DEFAULT_THEME
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isThemeChoice(raw) ? raw : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

export const resolveSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const resolveTheme = (choice: ThemeChoice): ResolvedTheme =>
  choice === 'system' ? resolveSystemTheme() : choice
