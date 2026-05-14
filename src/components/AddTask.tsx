import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './AddTask.module.css'

interface AddTaskProps {
  onAdd: (content: string) => void
}

const INPUT_ID = 'add-task-input'

const AddTask = ({ onAdd }: AddTaskProps) => {
  const { t } = useTranslation()
  const [content, setContent] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setContent(e.target.value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed) {
      setContent('')
      return
    }
    onAdd(trimmed)
    setContent('')
  }

  const isDisabled = content.trim().length === 0

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor={INPUT_ID}>
        {t('addTask.label')}
      </label>
      <div className={styles.row}>
        <input
          id={INPUT_ID}
          className={styles.input}
          type="text"
          placeholder={t('addTask.placeholder')}
          onChange={handleChange}
          value={content}
        />
        <button type="submit" className={styles.button} disabled={isDisabled}>
          {t('addTask.button')}
        </button>
      </div>
    </form>
  )
}

export default AddTask
