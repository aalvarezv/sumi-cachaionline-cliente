import {
    LOGIN_EXITO,
    LOGIN_ERROR,
    CERRAR_SESION,
    USUARIO_AUTH_EXITO,
    USUARIO_AUTH_ERROR,
    SELECT_INSTITUCION,
    SELECT_ROL,
} from '../types';
import tokenAuth from '../../config/token';


const AuthReducer = (state, action) => {

   
    switch (action.type) {
    
        case LOGIN_EXITO:
        case USUARIO_AUTH_EXITO:
            return{
                ...state,
                usuario: action.payload.usuario,
                instituciones: action.payload.instituciones,
                institucion_select: action.payload.institucion_select,
                roles: action.payload.roles,
                rol_select: action.payload.rol_select,
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
                instituciones: [],
                institucion_select: {},
                roles: [],
                rol_select: {},
                mensaje: action.payload,
            } 
        case CERRAR_SESION:
            tokenAuth(null);
            localStorage.removeItem('token');
            return{
                ...state,
                usuario: null,
                autenticado: false,
                instituciones: [],
                institucion_select: {},
                roles: [],
                rol_select: {},
                mensaje: null,
            }
        case SELECT_INSTITUCION:

            //filtra las instituciones de acuerdo a la institucion_select.
            let new_roles_institucion = state.usuario.usuario_institucion_rols.filter(usuario_institucion_rol => usuario_institucion_rol.codigo_institucion === action.payload);
           
            let new_roles = [];  
            for(let roles_institucion of new_roles_institucion){
                new_roles.push(roles_institucion.rol)
            }

            return {
                ...state,
                institucion_select: state.instituciones.filter(institucion => institucion.codigo === action.payload),
                roles: new_roles,
                rol_select: new_roles[0],
            }

        case SELECT_ROL:
            return {
                ...state,
                rol_select: state.roles.filter(rol => rol.codigo === action.payload)[0],
            }
      
        default:
            return state
    }

}

export default AuthReducer;