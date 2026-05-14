import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { THEME_STORAGE_KEY } from '../theme/storage'
import ThemeSwitcher from './ThemeSwitcher'

const setMatchMedia = (matchesDark: boolean) => {
  vi.stubGlobal('matchMedia', (() => ({
    matches: matchesDark,
    media: '(prefers-color-scheme: dark)',
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia)
}

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    setMatchMedia(false) // OS light by default
  })

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme')
    vi.unstubAllGlobals()
  })

  it('trigger reflects the resolved theme, not the choice (system + OS light → Sun)', () => {
    render(<ThemeSwitcher />)
    const trigger = screen.getByRole('button', { name: /tema/i })
    expect(trigger.querySelector('[data-icon="sun"]')).toBeInTheDocument()
    expect(trigger.querySelector('[data-icon="moon"]')).not.toBeInTheDocument()
  })

  it('shows the auto indicator dot when choice is system', () => {
    render(<ThemeSwitcher />)
    // default choice is system
    const trigger = screen.getByRole('button', { name: /tema/i })
    expect(trigger).toHaveAttribute('data-choice', 'system')
    // indicator is a span with aria-hidden inside the trigger
    expect(trigger.querySelector('[aria-hidden="true"]:not(svg)')).toBeInTheDocument()
  })

  it('selecting light hides the auto indicator and keeps a Sun trigger', async () => {
    const user = userEvent.setup()
    render(<ThemeSwitcher />)
    await user.click(screen.getByRole('button', { name: /tema/i }))
    await user.click(screen.getByRole('button', { name: 'Claro' }))

    const trigger = screen.getByRole('button', { name: /tema/i })
    expect(trigger).toHaveAttribute('data-choice', 'light')
    expect(trigger.querySelector('[data-icon="sun"]')).toBeInTheDocument()
    expect(trigger.querySelector('[aria-hidden="true"]:not(svg)')).not.toBeInTheDocument()
  })

  it('selecting dark swaps the trigger to a Moon icon', async () => {
    const user = userEvent.setup()
    render(<ThemeSwitcher />)
    await user.click(screen.getByRole('button', { name: /tema/i }))
    await user.click(screen.getByRole('button', { name: 'Escuro' }))

    const trigger = screen.getByRole('button', { name: /tema/i })
    expect(trigger.querySelector('[data-icon="moon"]')).toBeInTheDocument()
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('opening reveals all three options with the active one marked', async () => {
    const user = userEvent.setup()
    render(<ThemeSwitcher />)
    await user.click(screen.getByRole('button', { name: /tema/i }))

    expect(screen.getByRole('button', { name: 'Claro' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Escuro' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sistema' })).toHaveAttribute('aria-current', 'true')
  })

  it('Escape closes the panel and restores focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<ThemeSwitcher />)
    const trigger = screen.getByRole('button', { name: /tema/i })
    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })
})
