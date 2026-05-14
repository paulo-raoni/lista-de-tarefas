import { useCallback } from 'react'
import type { Task } from '../types'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_PREFIX = 'lista-de-tarefas:v1:'
const TASKS_KEY = 'tasks'
const LEGACY_TASKS_KEY = 'tarefas'

const DEFAULT_SEED: Task[] = [
  { id: 'seed-1', content: 'Tarefa exemplo 1' },
  { id: 'seed-2', content: 'Tarefa exemplo 2' },
]

/**
 * One-time migration: previous versions stored tasks under
 * `lista-de-tarefas:v1:tarefas` (Phase 2 → 8). Phase 9 renamed the key to
 * `lista-de-tarefas:v1:tasks`. If the new key is empty and the legacy key
 * has data, move it over and delete the legacy entry. Idempotent.
 */
export function migrateLegacyTasksKey(): void {
  if (typeof window === 'undefined') return
  try {
    const newKey = STORAGE_PREFIX + TASKS_KEY
    const oldKey = STORAGE_PREFIX + LEGACY_TASKS_KEY
    if (window.localStorage.getItem(newKey) !== null) return
    const legacy = window.localStorage.getItem(oldKey)
    if (legacy === null) return
    try {
      const parsed = JSON.parse(legacy) as Array<{
        id: string
        conteudo?: string
        content?: string
      }>
      const remapped = parsed.map((item) => ({
        id: item.id,
        content: item.content ?? item.conteudo ?? '',
      }))
      window.localStorage.setItem(newKey, JSON.stringify(remapped))
    } catch {
      window.localStorage.setItem(newKey, legacy)
    }
    window.localStorage.removeItem(oldKey)
  } catch {
    /* localStorage unavailable */
  }
}

migrateLegacyTasksKey()

export interface UseTodos {
  tasks: Task[]
  addTask: (content: string) => void
  removeTask: (id: string) => void
}

export function useTodos(): UseTodos {
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_KEY, DEFAULT_SEED)

  const addTask = useCallback(
    (content: string) => {
      const trimmed = content.trim()
      if (!trimmed) return
      const novo: Task = { id: crypto.randomUUID(), content: trimmed }
      setTasks((prev) => [...prev, novo])
    },
    [setTasks],
  )

  const removeTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id))
    },
    [setTasks],
  )

  return { tasks, addTask, removeTask }
}
