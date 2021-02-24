import React, { useReducer } from 'react'
import { 
    LOGIN_EXITO,
    LOGIN_ERROR,
    CERRAR_SESION,
    USUARIO_AUTH_EXITO,
    USUARIO_AUTH_ERROR,
    SELECT_INSTITUCION,
    SELECT_ROL,
} from '../types'
import {handleError} from '../../helpers'

import AuthContext from './AuthContext'
import AuthReducer from './AuthReducer'

import clienteAxios from '../../config/axios'
import tokenAuth from '../../config/token'

const AuthState = (props) => {

    const initialState = {
        usuario: null,
        autenticado: false,
        institucion_select: null,
        rol_select: null,
        roles_institucion: [],
        mensaje: null
    }

    const [state, dispatch] = useReducer(AuthReducer, initialState)
 
    const iniciarSesion = async datos => {
        
        try {

            let resp = await clienteAxios.post('/api/auth/', datos)
            //obtiene el token de la respuesta
            const token = resp.data.token
            
            if(token){
                //almacena el token en el localstorage.
                localStorage.setItem('token', token)
                //Obtiene los datos del usuario autenticado.
                usuarioAuth()
            
            }else{

                const mensaje = handleError(e)
                dispatch({
                    type: LOGIN_ERROR,
                    payload: mensaje
                })

            }

        } catch (e) {
            
            const mensaje = handleError(e)
            dispatch({
                type: LOGIN_ERROR,
                payload: mensaje
            })
            
        }
       
    }

    const usuarioAuth = async () => {
        try {
            //verifica si hay un token almacenado
            let token = localStorage.getItem('token')
            if(token){
                //agrega el token al request de axios.
                tokenAuth(token) 
                
                const resp = await clienteAxios.get('/api/auth/datos/')
                
                const usuario = resp.data
                console.log(usuario)
                //Si el usuario no tiene roles asignados.
                if(!usuario.institucion_roles.length === 0){
                    //cerrarSesion()
                }
                
                dispatch({
                    type: USUARIO_AUTH_EXITO,
                    payload: {
                        usuario,
                    }
                })
              
            }

        } catch (e) {

            const mensaje = handleError(e)
            dispatch({
                type: USUARIO_AUTH_ERROR,
                payload: mensaje
            })

        }
    }

    const cerrarSesion = () => {
        dispatch({
            type: CERRAR_SESION
        })
    }

    const selectInstitucion = codigo_institucion => {
        dispatch({
            type: SELECT_INSTITUCION,
            payload: codigo_institucion,
        })
    }

    const selectRol = codigo_rol => {
     
        dispatch({
            type: SELECT_ROL,
            payload: codigo_rol,
        })
    }

    return (
        <AuthContext.Provider
            value={{
                usuario: state.usuario,
                autenticado: state.autenticado,
                institucion_select: state.institucion_select,
                rol_select: state.rol_select,
                roles_institucion: state.roles_institucion,
                mensaje: state.mensaje,
                iniciarSesion,
                cerrarSesion,
                usuarioAuth,
                selectInstitucion,
                selectRol,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )

}

export default AuthState