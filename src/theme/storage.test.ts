import { beforeEach, describe, expect, it } from 'vitest'
import {
  isThemeChoice,
  readStoredTheme,
  resolveSystemTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
} from './storage'

describe('isThemeChoice', () => {
  it.each([
    ['light', true],
    ['dark', true],
    ['system', true],
    ['LIGHT', false],
    ['', false],
    ['auto', false],
  ])('isThemeChoice(%j) → %j', (input, expected) => {
    expect(isThemeChoice(input)).toBe(expected)
  })

  it('rejects non-string values', () => {
    expect(isThemeChoice(null)).toBe(false)
    expect(isThemeChoice(undefined)).toBe(false)
    expect(isThemeChoice(42)).toBe(false)
  })
})

describe('readStoredTheme', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns "system" when no value is stored', () => {
    expect(readStoredTheme()).toBe('system')
  })

  it('returns a valid stored choice', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    expect(readStoredTheme()).toBe('dark')
  })

  it('falls back to "system" when stored value is invalid', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'pink')
    expect(readStoredTheme()).toBe('system')
  })
})

describe('resolveSystemTheme + resolveTheme', () => {
  it('resolveTheme passes through explicit choices', () => {
    expect(resolveTheme('light')).toBe('light')
    expect(resolveTheme('dark')).toBe('dark')
  })

  it('resolveTheme for "system" uses matchMedia', () => {
    expect(['light', 'dark']).toContain(resolveTheme('system'))
    expect(resolveSystemTheme()).toBe(resolveTheme('system'))
  })
})
