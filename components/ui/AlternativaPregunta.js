import React from 'react'
import { TiDelete } from 'react-icons/ti'

const AlternativaPregunta = ({alternativas, setAlternativas}) => { 


    const handleQuitarAlternativa = letra => {
       let new_alternativas = [
            ...alternativas
        ]
        new_alternativas.splice(alternativas.findIndex(alternativa => alternativa.letra === letra), new_alternativas.length)
        setAlternativas(new_alternativas)
    }

    const handleSetAlternativaCorrecta = letra => {
        const new_alternativas = alternativas.map(alternativa => alternativa.letra === letra ? { ...alternativa, correcta : !alternativa.correcta } : alternativa)
        setAlternativas(new_alternativas)
    }
    
    return ( 
        <>
            {alternativas.map( (alternativa, index) => {
                
                const {letra, correcta} = alternativa

                return (
                    <div
                        key={index}
                    >
                        <button
                            className={`btn ${correcta ? 'btn-info' : 'btn-outline-info'}`}
                            onClick={() => handleSetAlternativaCorrecta(letra)}
                        >
                            {letra}
                        </button>
                        <span
                            onClick={() => handleQuitarAlternativa(letra)}
                        >
                            <TiDelete 
                                size={"1.2rem"} 
                                color={"red"}
                            />
                        </span>
                    </div>
                )
            })}
            <style jsx>{`
                div{
                    position: relative;
                    margin: 10px;
                    width: 40px; 
                    height: 40px;
                }
                span{
                    position: absolute; 
                    top: -17px;
                    right: -9px;
                    cursor: pointer;
                }
            `}</style>
        </>
    )
}

export default AlternativaPregunta
