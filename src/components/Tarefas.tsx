import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Tarefa } from '../types'
import styles from './Tarefas.module.css'

interface TarefasProps {
  tarefas: Tarefa[]
  onRemove: (id: string) => void
}

const REMOVE_DELAY_MS = 500

const Tarefas = ({ tarefas, onRemove }: TarefasProps) => {
  const { t } = useTranslation()
  const [removingIds, setRemovingIds] = useState<Set<string>>(() => new Set())
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    const timeouts = timeoutsRef.current
    return () => {
      timeouts.forEach((handle) => clearTimeout(handle))
      timeouts.clear()
    }
  }, [])

  const handleClick = (id: string) => {
    if (timeoutsRef.current.has(id)) return
    setRemovingIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    const handle = setTimeout(() => {
      timeoutsRef.current.delete(id)
      onRemove(id)
    }, REMOVE_DELAY_MS)
    timeoutsRef.current.set(id, handle)
  }

  if (tarefas.length === 0) {
    return <p className={styles.empty}>{t('tarefas.empty')}</p>
  }

  return (
    <ul className={styles.list}>
      {tarefas.map((tarefa) => {
        const isRemoving = removingIds.has(tarefa.id)
        const itemClass = isRemoving ? `${styles.item} ${styles.deleted}` : styles.item
        return (
          <li key={tarefa.id} data-id={tarefa.id} className={itemClass}>
            <button
              type="button"
              className={styles.itemButton}
              aria-label={t('tarefas.deleteAria', { conteudo: tarefa.conteudo })}
              onClick={() => handleClick(tarefa.id)}
            >
              <span className={styles.conteudo}>{tarefa.conteudo}</span>
              <span className={styles.excluir}>{t('tarefas.delete')}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default Tarefas
