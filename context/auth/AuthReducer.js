import {
    LOGIN_EXITO,
    LOGIN_ERROR,
    CERRAR_SESION,
    USUARIO_AUTH_EXITO,
    USUARIO_AUTH_ERROR,
    SELECT_INSTITUCION,
    SELECT_ROL,
} from '../types'
import tokenAuth from '../../config/token'


const AuthReducer = (state, action) => {

   
    switch (action.type) {
    
        case LOGIN_EXITO:
        case USUARIO_AUTH_EXITO:
            return{
                ...state,
                usuario: action.payload.usuario,
                institucion_select: {
                    codigo: action.payload.usuario.institucion_roles[0].codigo_institucion,
                    descripcion: action.payload.usuario.institucion_roles[0].descripcion_institucion,
                },
                roles_institucion: action.payload.usuario.institucion_roles[0].roles,
                rol_select: action.payload.usuario.institucion_roles[0].roles[0],
                autenticado: true,
                mensaje: null
            }
        case LOGIN_ERROR:
        case USUARIO_AUTH_ERROR:
            tokenAuth(null)
            localStorage.removeItem('token')
            return{
                ...state,
                usuario: null,
                institucion_select: null,
                rol_select: null,
                autenticado: false,
                mensaje: action.payload,
            } 
        case CERRAR_SESION:
            tokenAuth(null)
            localStorage.removeItem('token')
            return{
                ...state,
                usuario: null,
                institucion_select: null,
                rol_select: null,
                autenticado: false,
                mensaje: null,
            }
        case SELECT_INSTITUCION:
            
            return {
                ...state,
                institucion_select: {
                    codigo: state.usuario.institucion_roles.filter(i => i.codigo_institucion === action.payload)[0].codigo_institucion,
                    descripcion: state.usuario.institucion_roles.filter(i => i.codigo_institucion === action.payload)[0].descripcion_institucion,
                },
                roles_institucion: state.usuario.institucion_roles.filter(i => i.codigo_institucion === action.payload)[0].roles,
                rol_select: state.usuario.institucion_roles.filter(i => i.codigo_institucion === action.payload)[0].roles[0]
            }

        case SELECT_ROL:
            
            return {
                ...state,
                rol_select: state.usuario.institucion_roles.filter(i => i.codigo_institucion === state.institucion_select.codigo)[0].roles.filter(r => r.codigo_rol === action.payload)[0]
            }
      
        default:
            return state
    }

}

export default AuthReducer