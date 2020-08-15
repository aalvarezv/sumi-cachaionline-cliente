import React, { useReducer } from 'react';
import { 
    LOGIN_EXITO,
    LOGIN_ERROR,
    CERRAR_SESION,
    USUARIO_AUTH_EXITO,
    USUARIO_AUTH_ERROR
} from '../types';
import {handleError} from '../../helpers';

import AuthContext from './AuthContext';
import AuthReducer from './AuthReducer';

import clienteAxios from '../../config/axios';
import tokenAuth from '../../config/token';

const AuthState = (props) => {

    const initialState = {
        usuario: null,
        autenticado: false,
        mensaje: null
    }

    const [state, dispatch] = useReducer(AuthReducer, initialState);
 
    const iniciarSesion = async datos => {
        
        try {

            let resp = await clienteAxios.post('/api/auth/', datos);
            //obtiene el token de la respuesta
            const token = resp.data.token;

            if(token){
                //almacena el token en el localstorage.
                localStorage.setItem('token', token);
                //agrega el token al request de axios.
                tokenAuth(token);
                resp = await clienteAxios.get('/api/auth/datos/');

                dispatch({
                    type: LOGIN_EXITO,
                    payload: resp.data.usuario
                });
            
            }else{

                const mensaje = handleError(e);
                dispatch({
                    type: LOGIN_ERROR,
                    payload: mensaje
                });

            }

        } catch (e) {
            
            const mensaje = handleError(e);
            
            dispatch({
                type: LOGIN_ERROR,
                payload: mensaje
            });
            
        }
       
    }

    const usuarioAuth = async () => {
        try {
            //verifica si hay un token almacenado
            let token = localStorage.getItem('token');
            if(token){
                //agrega el token al request de axios.
                tokenAuth(token); 
                
                const resp = await clienteAxios.get('/api/auth/datos/');
                
                dispatch({
                    type: USUARIO_AUTH_EXITO,
                    payload: resp.data.usuario
                });
            }

        } catch (e) {
            const mensaje = handleError(e);
            dispatch({
                type: USUARIO_AUTH_ERROR,
                payload: mensaje
            });
        }
    }

    const cerrarSesion = () => {
        dispatch({
            type: CERRAR_SESION
        })
    }

    return (
        <AuthContext.Provider
            value={{
                usuario: state.usuario,
                autenticado: state.autenticado,
                mensaje: state.mensaje,
                iniciarSesion,
                cerrarSesion,
                usuarioAuth
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )

}

export default AuthState