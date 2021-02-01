import React, { useReducer } from 'react'
import {
    LISTAR_NA_EXITO,
    LISTAR_NA_ERROR
} from '../types'
import { handleError } from '../../helpers'
import NivelAcademicoContext from './NivelAcademicoContext'
import NivelAcademicoReducer from './NivelAcademicoReducer'
import clienteAxios from '../../config/axios'

const NivelAcademicoState = props => {

    const initialState = {
        niveles_academicos: null,
        mensaje: null
    }

    const [state, dispatch] = useReducer(NivelAcademicoReducer, initialState)

    const listarNievelesAcademicos = async () => {
      
        try {
            
            const resp = await clienteAxios.get('/api/nivel-academico/listar')
            dispatch({
                type: LISTAR_NA_EXITO,
                payload: resp.data.niveles_academicos
            })

        }catch(e){
            console.log(e)
            const mensaje = handleError(e)
            dispatch({
                type: LISTAR_NA_ERROR,
                payload: mensaje
            })
        }
    
    }


    return ( 
        <NivelAcademicoContext.Provider
            value={{
                niveles_academicos: state.niveles_academicos,
                listarNievelesAcademicos
            }}
        >
            {props.children}
        </NivelAcademicoContext.Provider>

     )
}
 
export default NivelAcademicoState