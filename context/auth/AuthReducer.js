import {
    LOGIN_EXITO,
    LOGIN_ERROR,
    CERRAR_SESION,
    USUARIO_AUTH_EXITO,
    USUARIO_AUTH_ERROR,
    SETEA_INSTITUCION,
    SETEA_ROL,
} from '../types';
import tokenAuth from '../../config/token';


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
            tokenAuth(null);
            localStorage.removeItem('token');
            return{
                ...state,
                usuario: null,
                autenticado: false,
                institucion: null,
                rol: null,
                mensaje: action.payload,
            } 
        case CERRAR_SESION:
            tokenAuth(null);
            localStorage.removeItem('token');
            return{
                ...state,
                usuario: null,
                autenticado: false,
                institucion: null,
                rol: null,
                mensaje: null,
            }
        case SETEA_INSTITUCION:
            return {
                ...state,
                institucion: action.payload,
            }
        case SETEA_ROL:
            return {
                ...state,
                rol: action.payload,
            }
      
        default:
            return state
    }

}

export default AuthReducer;