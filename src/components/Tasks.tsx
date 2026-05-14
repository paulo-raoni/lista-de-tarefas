import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Task } from '../types'
import styles from './Tasks.module.css'

interface TasksProps {
  tasks: Task[]
  onRemove: (id: string) => void
}

const REMOVE_DELAY_MS = 500

const Tasks = ({ tasks, onRemove }: TasksProps) => {
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

  if (tasks.length === 0) {
    return <p className={styles.empty}>{t('tasks.empty')}</p>
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => {
        const isRemoving = removingIds.has(task.id)
        const itemClass = isRemoving ? `${styles.item} ${styles.deleted}` : styles.item
        return (
          <li key={task.id} data-id={task.id} className={itemClass}>
            <button
              type="button"
              className={styles.itemButton}
              aria-label={t('tasks.deleteAria', { content: task.content })}
              onClick={() => handleClick(task.id)}
            >
              <span className={styles.content}>{task.content}</span>
              <span className={styles.delete}>{t('tasks.delete')}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default Tasks
