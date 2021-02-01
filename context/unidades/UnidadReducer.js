import {
    LISTAR_UNIDADES_MATERIA_NA_EXITO,
    LISTAR_UNIDADES_MATERIA_NA_ERROR
} from '../types'


const UnidadReducer = (state, action) => {

        switch (action.type) {
            case LISTAR_UNIDADES_MATERIA_NA_EXITO:
                return{
                    ...state,
                    unidades_materia: action.payload,
                    mensaje: null
                }
            case LISTAR_UNIDADES_MATERIA_NA_ERROR:
                return{
                    ...state,
                    unidades_materia: null,
                    mensaje: action.payload
                }
            default:
                return state
        }
} 

export default UnidadReducer