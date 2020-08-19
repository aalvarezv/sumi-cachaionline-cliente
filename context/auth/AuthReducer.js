import {
    LOGIN_EXITO,
    LOGIN_ERROR,
    CERRAR_SESION,
    USUARIO_AUTH_EXITO,
    USUARIO_AUTH_ERROR
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
                mensaje: action.payload,
            } 
        case CERRAR_SESION:
            tokenAuth(null);
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