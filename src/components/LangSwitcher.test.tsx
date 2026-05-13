import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import i18n, { LANG_STORAGE_KEY } from '../i18n'
import LangSwitcher from './LangSwitcher'

describe('LangSwitcher', () => {
  it('renders the trigger collapsed by default, panel hidden', () => {
    render(<LangSwitcher />)
    const trigger = screen.getByRole('button', { name: /idioma/i })
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('group', { name: /idioma/i })).not.toBeInTheDocument()
  })

  it('clicking the trigger opens the panel with both languages', async () => {
    const user = userEvent.setup()
    render(<LangSwitcher />)

    await user.click(screen.getByRole('button', { name: /idioma/i }))

    expect(screen.getByRole('button', { name: /idioma/i })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('group', { name: /idioma/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Português (Brasil)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument()
  })

  it('marks the active language with aria-current', async () => {
    const user = userEvent.setup()
    render(<LangSwitcher />)

    await user.click(screen.getByRole('button', { name: /idioma/i }))

    expect(screen.getByRole('button', { name: 'Português (Brasil)' })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByRole('button', { name: 'English' })).not.toHaveAttribute('aria-current')
  })

  it('selecting a language updates i18n, persists, sets <html lang>, closes the panel', async () => {
    const user = userEvent.setup()
    render(<LangSwitcher />)

    await user.click(screen.getByRole('button', { name: /idioma/i }))
    await user.click(screen.getByRole('button', { name: 'English' }))

    expect(i18n.language).toBe('en')
    expect(window.localStorage.getItem(LANG_STORAGE_KEY)).toBe('en')
    expect(document.documentElement.lang).toBe('en')

    expect(screen.queryByRole('group', { name: /language/i })).not.toBeInTheDocument()
    const trigger = screen.getByRole('button', { name: /language/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })

  it('Escape closes the panel and restores focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<LangSwitcher />)

    const trigger = screen.getByRole('button', { name: /idioma/i })
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })
})
