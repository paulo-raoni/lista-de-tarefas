import { renderHook, act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTodos, migrateLegacyTasksKey } from './useTodos'

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
    expect(result.current.tasks).toEqual([
      { id: 'seed-1', content: 'Tarefa exemplo 1' },
      { id: 'seed-2', content: 'Tarefa exemplo 2' },
    ])
  })

  it('addTask trims input and appends with a fresh UUID', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTask('  buy milk  '))
    expect(result.current.tasks.at(-1)).toEqual({ id: 'uuid-1', content: 'buy milk' })
  })

  it('addTask ignores empty / whitespace-only input', () => {
    const { result } = renderHook(() => useTodos())
    const before = result.current.tasks.length
    act(() => result.current.addTask('   '))
    expect(result.current.tasks).toHaveLength(before)
  })

  it('removeTask filters by id without renumbering survivors', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.removeTask('seed-1'))
    expect(result.current.tasks).toEqual([{ id: 'seed-2', content: 'Tarefa exemplo 2' }])
  })

  it('persists state to lista-de-tarefas:v1:tasks', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTask('persisted'))
    const stored = window.localStorage.getItem('lista-de-tarefas:v1:tasks')
    expect(stored).toContain('persisted')
    expect(stored).toContain('uuid-1')
  })
})

describe('migrateLegacyTasksKey', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('does nothing when neither key has data', () => {
    migrateLegacyTasksKey()
    expect(window.localStorage.getItem('lista-de-tarefas:v1:tasks')).toBeNull()
    expect(window.localStorage.getItem('lista-de-tarefas:v1:tarefas')).toBeNull()
  })

  it('does nothing when the new key already has data', () => {
    window.localStorage.setItem('lista-de-tarefas:v1:tasks', '[{"id":"new","content":"x"}]')
    window.localStorage.setItem('lista-de-tarefas:v1:tarefas', '[{"id":"old","conteudo":"y"}]')

    migrateLegacyTasksKey()

    expect(window.localStorage.getItem('lista-de-tarefas:v1:tasks')).toBe(
      '[{"id":"new","content":"x"}]',
    )
    expect(window.localStorage.getItem('lista-de-tarefas:v1:tarefas')).toBe(
      '[{"id":"old","conteudo":"y"}]',
    )
  })

  it('moves legacy data to the new key and remaps conteudo to content', () => {
    const legacy = JSON.stringify([
      { id: 'a', conteudo: 'first' },
      { id: 'b', conteudo: 'second' },
    ])
    window.localStorage.setItem('lista-de-tarefas:v1:tarefas', legacy)

    migrateLegacyTasksKey()

    expect(window.localStorage.getItem('lista-de-tarefas:v1:tarefas')).toBeNull()
    const migrated = JSON.parse(window.localStorage.getItem('lista-de-tarefas:v1:tasks') ?? '[]')
    expect(migrated).toEqual([
      { id: 'a', content: 'first' },
      { id: 'b', content: 'second' },
    ])
  })

  it('copies verbatim and removes the legacy key when the data is malformed', () => {
    window.localStorage.setItem('lista-de-tarefas:v1:tarefas', '{ not valid json')

    migrateLegacyTasksKey()

    expect(window.localStorage.getItem('lista-de-tarefas:v1:tasks')).toBe('{ not valid json')
    expect(window.localStorage.getItem('lista-de-tarefas:v1:tarefas')).toBeNull()
  })
})
