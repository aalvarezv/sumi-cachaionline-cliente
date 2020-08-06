import React, { useReducer } from 'react';
import {
    LISTAR_UNIDADES_MATERIA_NA_EXITO,
    LISTAR_UNIDADES_MATERIA_NA_ERROR
} from '../types';
import {handleError} from '../../helpers';

import UnidadReducer from './UnidadReducer';
import UnidadContext from './UnidadContext';
import clienteAxios from '../../config/axios';

const UnidadState = props => {

    const initialState = {
        unidades_materia: null,
        mensaje: null
    }

    const [state, dispatch] = useReducer(UnidadReducer, initialState);
    
    const listarUnidadesMateriaNA = async (codigo_materia, niveles_academicos) => {

        try{
            
            const resp = await clienteAxios.get('/api/unidades/materia-nivel-academico/',{ params: {
                codigo_materia,
                niveles_academicos
            }});
            
            dispatch({
                type: LISTAR_UNIDADES_MATERIA_NA_EXITO,
                payload: resp.data.unidades
            })

        }catch(e){
            console.log(e);
            const mensaje = handleError(e);
            dispatch({
                type: LISTAR_UNIDADES_MATERIA_NA_ERROR,
                payload: mensaje
            });
        }

    }

    return ( 
        <UnidadContext.Provider
            value={{
                unidades_materia: state.unidades_materia,
                listarUnidadesMateriaNA
            }}
        >
            {props.children}
        </UnidadContext.Provider>

     );
}
 
export default UnidadState;