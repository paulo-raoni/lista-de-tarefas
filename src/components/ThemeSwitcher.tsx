import { useEffect, useId, useRef, useState, type SVGProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../theme/useTheme'
import { THEME_CHOICES, type ThemeChoice } from '../theme/storage'
import styles from './ThemeSwitcher.module.css'

const SunIcon = (props: SVGProps<SVGSVGElement>) => (
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
    data-icon="sun"
    {...props}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
)

const MoonIcon = (props: SVGProps<SVGSVGElement>) => (
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
    data-icon="moon"
    {...props}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const MonitorIcon = (props: SVGProps<SVGSVGElement>) => (
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
    data-icon="monitor"
    {...props}
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
)

const OPTION_ICONS: Record<ThemeChoice, (p: SVGProps<SVGSVGElement>) => JSX.Element> = {
  light: SunIcon,
  dark: MoonIcon,
  system: MonitorIcon,
}

const ThemeSwitcher = () => {
  const { t } = useTranslation()
  const { choice, resolved, setChoice } = useTheme()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

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

  const handleSelect = (next: ThemeChoice) => {
    setChoice(next)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const TriggerIcon = resolved === 'dark' ? MoonIcon : SunIcon

  return (
    <div className={styles.wrapper}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        data-choice={choice}
        aria-label={t('theme.label')}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <TriggerIcon />
        {choice === 'system' && <span className={styles.autoIndicator} aria-hidden="true" />}
      </button>
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          className={styles.panel}
          role="group"
          aria-label={t('theme.label')}
        >
          {THEME_CHOICES.map((value) => {
            const Icon = OPTION_ICONS[value]
            const isActive = value === choice
            return (
              <button
                key={value}
                type="button"
                className={isActive ? `${styles.option} ${styles.optionActive}` : styles.option}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => handleSelect(value)}
              >
                <Icon />
                <span>{t(`theme.${value}` as const)}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ThemeSwitcher
