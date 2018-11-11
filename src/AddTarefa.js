import React, { Component } from 'react'

class AddTarefa extends Component {
    state = {
        conteudo: ''
    }

    handleChange = (e) => {
        this.setState({conteudo: e.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault()
        if(this.state.conteudo) 
            this.props.addTarefa(this.state)
        this.setState({conteudo: ""})
    }
    
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Escreva abaixo uma tarefa e digite enter para adicionar:</label>
                    <input type="text" onChange={this.handleChange} value={this.state.conteudo}/>   
                </form>
            </div>
        )
    }
}

export default AddTarefa