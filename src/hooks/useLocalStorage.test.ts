import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns the initial value when the key is missing', () => {
    const { result } = renderHook(() => useLocalStorage('missing', 42))
    expect(result.current[0]).toBe(42)
  })

  it('reads an existing JSON value from storage under the versioned prefix', () => {
    window.localStorage.setItem('lista-de-tarefas:v1:hello', JSON.stringify('world'))
    const { result } = renderHook(() => useLocalStorage<string>('hello', 'fallback'))
    expect(result.current[0]).toBe('world')
  })

  it('writes updates back to storage', () => {
    const { result } = renderHook(() => useLocalStorage<number>('counter', 0))
    act(() => result.current[1](7))
    expect(window.localStorage.getItem('lista-de-tarefas:v1:counter')).toBe('7')
  })

  it('supports the functional updater form', () => {
    const { result } = renderHook(() => useLocalStorage<number>('counter', 1))
    act(() => result.current[1]((prev) => prev + 1))
    expect(result.current[0]).toBe(2)
  })

  it('falls back to the initial value when stored JSON is corrupted', () => {
    window.localStorage.setItem('lista-de-tarefas:v1:broken', '{not json')
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { result } = renderHook(() => useLocalStorage('broken', 'safe'))
    expect(result.current[0]).toBe('safe')
    warn.mockRestore()
  })
})
