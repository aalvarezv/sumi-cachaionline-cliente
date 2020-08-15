import {
    LOGIN_EXITO,
    LOGIN_ERROR,
    CERRAR_SESION,
    USUARIO_AUTH_EXITO,
    USUARIO_AUTH_ERROR
} from '../types';

//localStorage.setItem('token', action.payload.token)
//localStorage.removeItem('token')

const AuthReducer = (state, action) => {
   
    switch (action.type) {
      
        case LOGIN_EXITO:
        case USUARIO_AUTH_EXITO:
            return{
                ...state,
                usuario: action.payload,
                autenticado: true,
                mensaje: null
            }
        case LOGIN_ERROR:
        case USUARIO_AUTH_ERROR:
            console.log('aqui, remueve el token');
            localStorage.removeItem('token');
            return{
                ...state,
                usuario: null,
                autenticado: false,
                mensaje: action.payload,
            } 
        case CERRAR_SESION:
            localStorage.removeItem('token');
            return{
                ...state,
                usuario: null,
                autenticado: false,
                mensaje: null
            }
       
      
        default:
            return state
    }

}

export default AuthReducer;