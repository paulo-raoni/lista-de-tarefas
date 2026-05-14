import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './AddTarefa.module.css'

interface AddTarefaProps {
  onAdd: (conteudo: string) => void
}

const INPUT_ID = 'add-tarefa-input'

const AddTarefa = ({ onAdd }: AddTarefaProps) => {
  const { t } = useTranslation()
  const [conteudo, setConteudo] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setConteudo(e.target.value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const trimmed = conteudo.trim()
    if (!trimmed) {
      setConteudo('')
      return
    }
    onAdd(trimmed)
    setConteudo('')
  }

  const isDisabled = conteudo.trim().length === 0

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor={INPUT_ID}>
        {t('addTarefa.label')}
      </label>
      <div className={styles.row}>
        <input
          id={INPUT_ID}
          className={styles.input}
          type="text"
          placeholder={t('addTarefa.placeholder')}
          onChange={handleChange}
          value={conteudo}
        />
        <button type="submit" className={styles.button} disabled={isDisabled}>
          {t('addTarefa.button')}
        </button>
      </div>
    </form>
  )
}

export default AddTarefa
