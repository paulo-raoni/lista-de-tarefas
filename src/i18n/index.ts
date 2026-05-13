import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ptBR from './pt-BR.json'
import en from './en.json'
import { DEFAULT_LNG, isSupportedLang, readStoredLang, STORAGE_KEY } from './storage'

void i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: ptBR },
    en: { translation: en },
  },
  lng: readStoredLang(),
  fallbackLng: DEFAULT_LNG,
  interpolation: { escapeValue: false },
  returnNull: false,
})

i18n.on('languageChanged', (lng) => {
  if (!isSupportedLang(lng)) return
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, lng)
  } catch {
    // localStorage may be disabled; swallow silently
  }
  document.documentElement.lang = lng
})

export default i18n
export { DEFAULT_LNG, STORAGE_KEY as LANG_STORAGE_KEY } from './storage'
