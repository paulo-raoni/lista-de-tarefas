export const STORAGE_KEY = 'lista-de-tarefas:v1:lang'
export const DEFAULT_LNG = 'pt-BR' as const

export const SUPPORTED_LANGS = ['pt-BR', 'en'] as const
export type SupportedLang = (typeof SUPPORTED_LANGS)[number]

export const isSupportedLang = (value: unknown): value is SupportedLang =>
  typeof value === 'string' && (SUPPORTED_LANGS as readonly string[]).includes(value)

export const readStoredLang = (): SupportedLang => {
  if (typeof window === 'undefined') return DEFAULT_LNG
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return isSupportedLang(raw) ? raw : DEFAULT_LNG
  } catch {
    return DEFAULT_LNG
  }
}
