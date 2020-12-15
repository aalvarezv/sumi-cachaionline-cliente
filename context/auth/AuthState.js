import React, { useReducer } from 'react';
import { 
    LOGIN_EXITO,
    LOGIN_ERROR,
    CERRAR_SESION,
    USUARIO_AUTH_EXITO,
    USUARIO_AUTH_ERROR,
    SELECT_INSTITUCION,
    SELECT_ROL,
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
        instituciones: [],
        institucion_select: {},
        roles: [],
        rol_select: {},
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
                
                const usuario = resp.data.usuario;

                let new_instituciones = [];
                if(usuario){ 
                    //Creamos un arreglo para guardar las distintas instituciones que pertenece el usuario,
                    //cabe destacar que un usuario que tenga 2 roles, la institución se repetirá 2 veces, por ello 
                    //se crea esta logica.           
                    //Se recorren los registros de usuario_institucion_rols.
                    for(let usuario_institucion_rol of usuario.usuario_institucion_rols){
                        //Si no hay ningún registro en el new_instituciones, lo agrega.
                        if(new_instituciones.length === 0){
                            new_instituciones.push(usuario_institucion_rol.institucion);
                        }else{
                            //Verifica si en new_instituciones existe el codigo de la institucion iterada, que se encuentra en:usuario_institucion_rol.institucion.codigo 
                            if(new_instituciones.filter(institucion => institucion.codigo === usuario_institucion_rol.institucion.codigo).length === 0){
                                //Si no existe entonces la agrega al arreglo.
                                new_instituciones.push(usuario_institucion_rol.institucion);
                            }
                        }
                    }
                              
                }
                
                let new_roles = [];  
                //filtra las instituciones de acuerdo a la institucion_select.
                let new_roles_institucion = usuario.usuario_institucion_rols.filter(usuario_institucion_rol => usuario_institucion_rol.codigo_institucion === new_instituciones[0].codigo);
                //recorre y agrega los roles al arreglo.
                for(let roles_institucion of new_roles_institucion){
                    new_roles.push(roles_institucion.rol)
                }

                dispatch({
                    type: USUARIO_AUTH_EXITO,
                    payload: {
                        usuario,
                        instituciones: new_instituciones,
                        institucion_select: new_instituciones[0],
                        roles: new_roles,
                        rol_select: new_roles[0],
                    }
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
        });
    }

    const selectInstitucion = codigo_institucion => {
        dispatch({
            type: SELECT_INSTITUCION,
            payload: codigo_institucion,
        });
    }

    const selectRol = codigo_rol => {
        dispatch({
            type: SELECT_ROL,
            payload: codigo_rol,
        });
    }

    return (
        <AuthContext.Provider
            value={{
                usuario: state.usuario,
                autenticado: state.autenticado,
                instituciones: state.instituciones,
                institucion_select: state.institucion_select,
                roles: state.roles,
                rol_select: state.rol_select,
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