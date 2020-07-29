import React, { useReducer } from 'react'
import MateriaContext from './MateriaContext'
import MateriaReducer from './MateriaReducer'
import { 
       } from '../../types/'
import clienteAxios from '../../config/axios'

const MateriaState = props => {

    const initialState = {
        
    }

    //reducer retorna stateinicial y dispatch para ejecutar las acciones.
    const [state, dispatch] = useReducer(MateriaReducer, initialState)

  
     //serie de funciones para el crud.
    const obtenerMaterias = async () => {
       
    }
   
    return (
        <MateriaContext.Provider
            value = {{
             
            }}
        >
            {props.children}
        </MateriaContext.Provider>
    )

}

export default MateriaState