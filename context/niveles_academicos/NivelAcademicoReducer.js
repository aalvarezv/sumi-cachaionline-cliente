import {
    LISTAR_NA_EXITO,
    LISTAR_NA_ERROR
} from '../types'

const NivelAcademicoReducer = (state, action) => {

    switch (action.type) {
        case LISTAR_NA_EXITO:
            return {
                ...state,
                niveles_academicos: action.payload,
                mensaje: null
            }
        case LISTAR_NA_ERROR:
            return{
                ...state,
                niveles_academicos: null,
                mensaje: action.payload
            }
        default:
            return state
    }


}

export default NivelAcademicoReducer