import { useEffect, useId, useRef, useState, type SVGProps } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './LangSwitcher.module.css'

const LANGUAGES = ['pt-BR', 'en'] as const
type Lang = (typeof LANGUAGES)[number]

const LANG_CODE: Record<Lang, string> = {
  'pt-BR': 'PT',
  en: 'EN',
}

const GlobeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const LangSwitcher = () => {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  const currentLang = (LANGUAGES as readonly string[]).includes(i18n.language)
    ? (i18n.language as Lang)
    : 'pt-BR'

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null
      if (target && !triggerRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const handleSelect = (lng: Lang) => {
    void i18n.changeLanguage(lng)
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <div className={styles.wrapper}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label={t('lang.label')}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <GlobeIcon />
        <span className={styles.code}>{LANG_CODE[currentLang]}</span>
      </button>
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          className={styles.panel}
          role="group"
          aria-label={t('lang.label')}
        >
          {LANGUAGES.map((lng) => {
            const isActive = lng === currentLang
            return (
              <button
                key={lng}
                type="button"
                className={isActive ? `${styles.option} ${styles.optionActive}` : styles.option}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => handleSelect(lng)}
              >
                {t(`lang.${lng}` as const)}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LangSwitcher
