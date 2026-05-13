import { beforeEach, describe, expect, it } from 'vitest'
import { isSupportedLang, readStoredLang, STORAGE_KEY } from './storage'

describe('isSupportedLang', () => {
  it.each([
    ['pt-BR', true],
    ['en', true],
    ['es', false],
    ['EN', false],
    ['', false],
  ])('isSupportedLang(%j) → %j', (input, expected) => {
    expect(isSupportedLang(input)).toBe(expected)
  })

  it('rejects non-string values', () => {
    expect(isSupportedLang(null)).toBe(false)
    expect(isSupportedLang(undefined)).toBe(false)
    expect(isSupportedLang(42)).toBe(false)
    expect(isSupportedLang({})).toBe(false)
  })
})

describe('readStoredLang', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns pt-BR when no value is stored', () => {
    expect(readStoredLang()).toBe('pt-BR')
  })

  it('returns the stored value when supported', () => {
    window.localStorage.setItem(STORAGE_KEY, 'en')
    expect(readStoredLang()).toBe('en')
  })

  it('falls back to pt-BR when stored value is unsupported', () => {
    window.localStorage.setItem(STORAGE_KEY, 'es')
    expect(readStoredLang()).toBe('pt-BR')
  })
})
