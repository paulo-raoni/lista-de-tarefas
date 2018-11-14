import React from 'react'
import styled from 'styled-components'

const Tarefas = ({tarefas, deleteTarefa}) => {
    const StyledDiv = styled.div`
        @keyframes slideSide {
            0% {
                transform: translateX(0);
            
            }
            100% {
                transform: translateX(1500px);
            }
        }

         @keyframes slideUp {
            0% {
                transform: translateY(0);
            
            }
            100% {
                transform: translateY(-50px);
            }
        }

        margin-bottom: 50px;
    
        > div {
            transition: .5s all;
            border: 1px solid #8bc34a;   
            &:hover {
                transform: scaleX(1.5);
                transform: translateX(20px);
                background-color: orange;
                
                .excluir {
                    display: block;
                    filter: grayscale();
                    right: 20px;
                }
            }
            
            &.deleted {
                color: #fff;
                background-color: red;
                animation-name: slideSide;
                animation-duration: 1s;

                & ~ div:not(.delete) {
                    animation-name: slideUp;
                    animation-duration: 1s;
                }
            }

            &:last-of-type {
                border-bottom: 2px solid #8bc34a !important;
            }

            span{
                &.conteudo {
                    font-weight: bold;
                }

                &.excluir {
                    display: none;
                    color: white;
                    font-size: 20px;
                    box-shadow: 2px 2px 15px lightgray;
                    position: absolute;
                    right: -100px;
                    top: 10px;
                    transition: .5s all;
                }
            }                      
        }
    `

    const listaTarefas = tarefas.length ? (
        tarefas.map( tarefa => {
            return (
                
                <div className={"collection-item"} onClick={(e) => deleteTarefa(e, tarefa.id)} key={tarefa.id}>
                    <span className="conteudo" >{tarefa.conteudo}</span>
                    <span className="excluir">EXCLUIR?</span>
                </div>
            )
        })
    ) : (
        <p className="center">Não há tarefas ainda.</p>
    )


    return (
        <StyledDiv className="tarefas collection" >
            {listaTarefas}
        </StyledDiv>
    )
}

export default Tarefas
