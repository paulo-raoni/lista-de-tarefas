import { Component, type MouseEvent } from 'react'
import Tarefas from './components/tarefas'
import AddTarefa from './components/add-tarefa'
import Footer from './components/footer'
import styled from 'styled-components'
import type { Tarefa } from './types'

interface AppState {
  tarefas: Tarefa[]
}

class App extends Component<Record<string, never>, AppState> {
  state: AppState = {
    tarefas: [
      { id: 1, conteudo: 'Tarefa exemplo 1' },
      { id: 2, conteudo: 'Tarefa exemplo 2' },
    ],
  }

  getLastId = (): number => {
    const idList = this.state.tarefas.map((tarefa) => tarefa.id)
    return typeof idList[0] !== 'number' ? 1 : Math.max(...idList) + 1
  }

  setClassDeleted = (e: MouseEvent<HTMLDivElement>): void => {
    ;(e.target as HTMLElement).classList.add('deleted')
  }

  deleteTarefa = (e: MouseEvent<HTMLDivElement>, id: number): void => {
    this.setClassDeleted(e)
    const tarefas = this.state.tarefas.filter((tarefa) => tarefa.id !== id)
    tarefas.forEach((tarefa, index) => (tarefa.id = index + 1))
    console.log(tarefas)
    setTimeout(() => this.setState({ tarefas }), 500)
  }

  addTarefa = (tarefa: Tarefa): void => {
    tarefa.id = this.getLastId()
    const tarefas = [...this.state.tarefas, tarefa]
    this.setState({ tarefas })
  }

  render() {
    const StyledDiv = styled.div`
      color: #39a9dc;
    `

    return (
      <div className="lista-tarefa-app container">
        <h1 className="center green-text">Lista de Tarefas App</h1>
        <AddTarefa addTarefa={this.addTarefa} />
        <StyledDiv className="center">
          {/* <small>Clique na tarefa para deletar</small> */}
        </StyledDiv>
        <Tarefas tarefas={this.state.tarefas} deleteTarefa={this.deleteTarefa} />
        <Footer />
      </div>
    )
  }
}

export default App
