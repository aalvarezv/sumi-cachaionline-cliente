import {
    LOGIN_EXITO,
    LOGIN_ERROR,
    CERRAR_SESION
} from '../types';

//localStorage.setItem('token', action.payload.token)
//localStorage.removeItem('token')

const AuthReducer = (state, action) => {

    switch (action.type) {

        case LOGIN_EXITO:
            return{
                ...state,
                usuario: action.payload,
                autenticado: true,
                mensaje: null
            }
        case LOGIN_ERROR:
            return{
                ...state,
                usuario: null,
                autenticado: false,
                mensaje: action.payload,
            }
        case CERRAR_SESION:
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