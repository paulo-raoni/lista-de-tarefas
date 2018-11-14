import React, { Component } from 'react';
import Tarefas from "./components/Tarefas";
import AddTarefa from './components/AddTarefa';
import Footer from  './components/Footer'
import styled from 'styled-components';

class App extends Component {
  
  state = {
    tarefas: [
      {id: 1, conteudo: "Tarefa exemplo 1"},
      {id: 2, conteudo: "Tarefa exemplo 2"}
    ],
    
  }

  getLastId = () => {
    const idList = this.state.tarefas.map(tarefa => tarefa.id)
    return typeof idList[0] !== 'number' ? 1 : Math.max(...idList) + 1
  }

  setClassDeleted = (e) => {
    e.target.classList.add("deleted")
  }

  deleteTarefa = (e, id) => {
    this.setClassDeleted(e)
    const tarefas = this.state.tarefas.filter(tarefa => tarefa.id !== id)
    tarefas.forEach((tarefa, index) => tarefa.id = index + 1)
    console.log(tarefas)
    setTimeout(()=>this.setState({tarefas}), 500)
  }  

  addTarefa = (tarefa) => {
    tarefa.id = this.getLastId()
    const tarefas = [...this.state.tarefas, tarefa]
    this.setState({tarefas})
  }
  
  render() {

    const  StyledDiv = styled.div`
      color: #39a9dc;
    `

    return (
      <div className="lista-tarefa-app container">
        <h1 className="center green-text">Lista de Tarefas App</h1>
        <AddTarefa addTarefa={this.addTarefa}/>
        <StyledDiv className="center">
          {/* <small>Clique na tarefa para deletar</small> */}
        </StyledDiv>
        <Tarefas tarefas={this.state.tarefas} deleteTarefa={this.deleteTarefa}/>
        <Footer/>
      </div>
    );
  }
}

export default App;
