import { renderHook, act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { THEME_STORAGE_KEY } from './storage'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.style.colorScheme = ''
    if (!window.matchMedia) {
      vi.stubGlobal(
        'matchMedia',
        () =>
          ({
            matches: false,
            media: '',
            addEventListener: () => {},
            removeEventListener: () => {},
          }) as unknown as MediaQueryList,
      )
    }
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('defaults to "system" and applies a resolved theme to <html>', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.choice).toBe('system')
    expect(['light', 'dark']).toContain(result.current.resolved)
    expect(document.documentElement.dataset.theme).toBe(result.current.resolved)
    expect(document.documentElement.style.colorScheme).toBe(result.current.resolved)
  })

  it('setChoice updates state, persists, and re-applies to <html>', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setChoice('dark'))
    expect(result.current.choice).toBe('dark')
    expect(result.current.resolved).toBe('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })

  it('updates <meta name="theme-color"> when theme changes', () => {
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.content = '#ffffff'
    document.head.appendChild(meta)

    const { result } = renderHook(() => useTheme())
    act(() => result.current.setChoice('dark'))
    expect(meta.content).toBe('#121212')

    act(() => result.current.setChoice('light'))
    expect(meta.content).toBe('#ffffff')

    meta.remove()
  })
})
