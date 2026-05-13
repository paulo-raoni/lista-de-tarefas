import { renderHook, act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTodos } from './useTodos'

describe('useTodos', () => {
  let uuidCounter: number

  beforeEach(() => {
    window.localStorage.clear()
    uuidCounter = 0
    vi.stubGlobal('crypto', {
      randomUUID: () => `uuid-${++uuidCounter}`,
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('seeds two example items on the first run', () => {
    const { result } = renderHook(() => useTodos())
    expect(result.current.tarefas).toEqual([
      { id: 'seed-1', conteudo: 'Tarefa exemplo 1' },
      { id: 'seed-2', conteudo: 'Tarefa exemplo 2' },
    ])
  })

  it('addTarefa trims input and appends with a fresh UUID', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTarefa('  buy milk  '))
    const list = result.current.tarefas
    expect(list[list.length - 1]).toEqual({ id: 'uuid-1', conteudo: 'buy milk' })
  })

  it('addTarefa ignores empty / whitespace-only input', () => {
    const { result } = renderHook(() => useTodos())
    const before = result.current.tarefas.length
    act(() => result.current.addTarefa('   '))
    expect(result.current.tarefas).toHaveLength(before)
  })

  it('removeTarefa filters by id without renumbering survivors', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.removeTarefa('seed-1'))
    expect(result.current.tarefas).toEqual([{ id: 'seed-2', conteudo: 'Tarefa exemplo 2' }])
  })

  it('persists state to lista-de-tarefas:v1:tarefas', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTarefa('persisted'))
    const stored = window.localStorage.getItem('lista-de-tarefas:v1:tarefas')
    expect(stored).toContain('persisted')
    expect(stored).toContain('uuid-1')
  })
})
