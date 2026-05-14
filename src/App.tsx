import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import LangSwitcher from './components/LangSwitcher'
import ThemeSwitcher from './components/ThemeSwitcher'
import Tasks from './components/Tasks'
import { useTodos } from './hooks/useTodos'
import styles from './App.module.css'

const App = () => {
  const { t, i18n } = useTranslation()
  const { tasks, addTask, removeTask } = useTodos()

  useEffect(() => {
    document.title = t('app.title')
  }, [t, i18n.language])

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('app.title')}</h1>
        <div className={styles.controls}>
          <ThemeSwitcher />
          <LangSwitcher />
        </div>
      </header>
      <AddTask onAdd={addTask} />
      <Tasks tasks={tasks} onRemove={removeTask} />
      <Footer />
    </div>
  )
}

export default App
