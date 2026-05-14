import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('renders a copyright range from 2018 to the current year', () => {
    render(<Footer />)
    const text = screen.getByRole('contentinfo').textContent ?? ''
    const currentYear = new Date().getFullYear().toString()
    expect(text).toContain('2018')
    expect(text).toContain(currentYear)
    expect(text).toMatch(/2018[–-]\d{4}/) // – is en-dash
  })

  it('links to the author profile', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /paulo raoni/i })
    expect(link).toHaveAttribute('href', 'https://github.com/paulo-raoni')
  })
})
