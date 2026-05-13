import { useCallback, useEffect, useState } from 'react'

const KEY_PREFIX = 'lista-de-tarefas:v1:'

let warned = false
const warnOnce = (err: unknown): void => {
  if (warned) return
  warned = true
  console.warn('[useLocalStorage] storage unavailable, persistence disabled', err)
}

const readStored = <T>(storageKey: string, initial: T): T => {
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (raw === null) return initial
    return JSON.parse(raw) as T
  } catch (err) {
    warnOnce(err)
    return initial
  }
}

export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const storageKey = KEY_PREFIX + key
  const [value, setValue] = useState<T>(() => readStored(storageKey, initial))

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value))
    } catch (err) {
      warnOnce(err)
    }
  }, [storageKey, value])

  const set = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) => (typeof next === 'function' ? (next as (prev: T) => T)(prev) : next))
  }, [])

  return [value, set]
}
