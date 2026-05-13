import AddTarefa from './components/AddTarefa'
import Footer from './components/Footer'
import Tarefas from './components/Tarefas'
import { useTodos } from './hooks/useTodos'
import styles from './App.module.css'

const App = () => {
  const { tarefas, addTarefa, removeTarefa } = useTodos()

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Lista de Tarefas App</h1>
      <AddTarefa onAdd={addTarefa} />
      <Tarefas tarefas={tarefas} onRemove={removeTarefa} />
      <Footer />
    </div>
  )
}

export default App
