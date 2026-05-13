import { useCallback } from 'react'
import type { Tarefa } from '../types'
import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SEED: Tarefa[] = [
  { id: 'seed-1', conteudo: 'Tarefa exemplo 1' },
  { id: 'seed-2', conteudo: 'Tarefa exemplo 2' },
]

export interface UseTodos {
  tarefas: Tarefa[]
  addTarefa: (conteudo: string) => void
  removeTarefa: (id: string) => void
}

export function useTodos(): UseTodos {
  const [tarefas, setTarefas] = useLocalStorage<Tarefa[]>('tarefas', DEFAULT_SEED)

  const addTarefa = useCallback(
    (conteudo: string) => {
      const trimmed = conteudo.trim()
      if (!trimmed) return
      const novo: Tarefa = { id: crypto.randomUUID(), conteudo: trimmed }
      setTarefas((prev) => [...prev, novo])
    },
    [setTarefas],
  )

  const removeTarefa = useCallback(
    (id: string) => {
      setTarefas((prev) => prev.filter((t) => t.id !== id))
    },
    [setTarefas],
  )

  return { tarefas, addTarefa, removeTarefa }
}
