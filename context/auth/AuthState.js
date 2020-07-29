import React, { useReducer } from 'react'
import { toast } from 'react-toastify';
import { 
    LOGIN_INIT,
    LOGIN_EXITOSO,
    LOGIN_ERROR,
} from '../types'
import AuthContext from './AuthContext'
import AuthReducer from './AuthReducer'

import clienteAxios from '../../config/axios'
import tokenAuth from '../../config/token'

const AuthState = (props) => {

    const initialState = {
        usuario: null, //objeto {}
        cargando: false, //boolean
        notificacion: null  
    }

    const [state, dispatch] = useReducer(AuthReducer, initialState) 
 

    const iniciarSesion = async datos => {
        
        console.log('Iniciando sesion', datos);
        dispatch({
            type: LOGIN_INIT,
            payload: true
        })

        try {

            const resp = await clienteAxios.post('/api/auth/', datos)
    
            dispatch({
                type: LOGIN_EXITOSO,
                payload: resp.data
            })

        } catch (e) {
            const {msg} = e.response.data;
            const notificacion = {
                tipo: "error",
                msg: msg,
            }
            toast.error(notificacion.msg, {containerId: 'A'})

            dispatch({
                type: LOGIN_ERROR,
                payload: notificacion
            })
            
        }
       
    }

    //trae los datos del usuario autenticado, cuando se genera el token, en su payload se agrega el usuario id y con eso se rescatan los datos del usuario de la base 
    const usuarioAutenticado = async () =>{

        /*
        const token = localStorage.getItem('token')
        if(token){
            //funcion para enviar el token por headers
            tokenAuth(token)
        }

        try {

            const respuesta = await clienteAxios.get('/api/auth/')
            //console.log(respuesta)
            dispatch({
                type: OBTENER_USUARIO,
                payload: respuesta.data.usuario
            })

        } catch (error) {

            const alerta = {
                msg: error.response.data.msg,
                categoria: 'alerta-error'
            }

            dispatch({
                type: LOGIN_ERROR,
                payload: alerta
            })
        }
        */
    }  

    const cerrarSesion = () => {
        /*
        dispatch({
            type: CERRAR_SESION
        })
        */
    }

    return (
        <AuthContext.Provider
            value={{
                usuario: state.usuario,
                cargando: state.cargando,
                notificacion: state.notificacion,
                iniciarSesion,
                usuarioAutenticado,
                cerrarSesion
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )

}

export default AuthState