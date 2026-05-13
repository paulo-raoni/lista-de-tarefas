import { useState, type ChangeEvent, type FormEvent } from 'react'
import styles from './AddTarefa.module.css'

interface AddTarefaProps {
  onAdd: (conteudo: string) => void
}

const INPUT_ID = 'add-tarefa-input'

const AddTarefa = ({ onAdd }: AddTarefaProps) => {
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

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor={INPUT_ID}>
        Escreva abaixo uma tarefa e digite enter para adicionar:
      </label>
      <input
        id={INPUT_ID}
        className={styles.input}
        type="text"
        onChange={handleChange}
        value={conteudo}
      />
    </form>
  )
}

export default AddTarefa
