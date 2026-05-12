import { Component, type ChangeEvent, type FormEvent } from 'react'
import type { Tarefa } from '../types'

interface AddTarefaProps {
  addTarefa: (tarefa: Tarefa) => void
}

interface AddTarefaState {
  conteudo: string
}

class AddTarefa extends Component<AddTarefaProps, AddTarefaState> {
  state: AddTarefaState = {
    conteudo: '',
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ conteudo: e.target.value })
  }

  handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (this.state.conteudo) this.props.addTarefa(this.state as unknown as Tarefa)
    this.setState({ conteudo: '' })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Escreva abaixo uma tarefa e digite enter para adicionar:</label>
          <input type="text" onChange={this.handleChange} value={this.state.conteudo} />
        </form>
      </div>
    )
  }
}

export default AddTarefa
