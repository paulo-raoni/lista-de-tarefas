import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { THEME_STORAGE_KEY } from '../theme/storage'
import ThemeSwitcher from './ThemeSwitcher'

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders collapsed and shows the trigger', () => {
    render(<ThemeSwitcher />)
    const trigger = screen.getByRole('button', { name: /tema/i })
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('opening reveals the three choices with the active one marked', async () => {
    const user = userEvent.setup()
    render(<ThemeSwitcher />)
    await user.click(screen.getByRole('button', { name: /tema/i }))

    expect(screen.getByRole('button', { name: 'Claro' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Escuro' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sistema' })).toHaveAttribute('aria-current', 'true')
  })

  it('selecting dark applies data-theme=dark and persists', async () => {
    const user = userEvent.setup()
    render(<ThemeSwitcher />)
    await user.click(screen.getByRole('button', { name: /tema/i }))
    await user.click(screen.getByRole('button', { name: 'Escuro' }))

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(screen.getByRole('button', { name: /tema/i })).toHaveAttribute('aria-expanded', 'false')
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
