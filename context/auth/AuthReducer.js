import {
    LOGIN_INIT,
    LOGIN_EXITOSO,
    LOGIN_ERROR,
  
} from '../types';

//localStorage.setItem('token', action.payload.token)
//localStorage.removeItem('token')

const AuthReducer = (state, action) => {

    switch (action.type) {

        case LOGIN_INIT:
            return{
                ...state,
                cargando: action.payload
            }
        case LOGIN_ERROR:
            return{
                ...state,
                notificacion: action.payload
            }
      
        default:
            return state
    }

}

export default AuthReducer;