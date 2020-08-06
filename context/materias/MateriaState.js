import React, { useReducer } from 'react';
import { 
    LISTAR_MATERIAS_EXITO,
    LISTAR_MATERIAS_ERROR,
    SELECCIONA_MATERIA
} from '../types';
import {handleError} from '../../helpers';

import MateriaContext from './MateriaContext';
import MateriaReducer from './MateriaReducer';
import clienteAxios from '../../config/axios';

const MateriaState = props => {

    const initialState = {
        materias: null,
        mensaje: null,
        materia_select: null,
    }

    //reducer retorna state actual y dispatch para ejecutar las acciones.
    const [state, dispatch] = useReducer(MateriaReducer, initialState)


    const listarMaterias = async () => {
        
        try{
            const resp = await clienteAxios.get('/api/materias/listar');
            dispatch({
                type: LISTAR_MATERIAS_EXITO,
                payload: resp.data.materias
            })

        }catch(e){
            console.log(e);
            const mensaje = handleError(e);
            dispatch({
                type: LISTAR_MATERIAS_ERROR,
                payload: mensaje
            });
        }

    }

    const seleccionarMateria = codigo_materia => {
        dispatch({
            type: SELECCIONA_MATERIA,
            payload: codigo_materia
        })
    }
   
    return (
        <MateriaContext.Provider
            value = {{
                materias: state.materias,
                materia_select: state.materia_select,
                listarMaterias,
                seleccionarMateria
            }}
        >
            {props.children}
        </MateriaContext.Provider>
    )

}

export default MateriaState