import { 
    LISTAR_MATERIAS_EXITO,
    LISTAR_MATERIAS_ERROR,
    SELECCIONA_MATERIA
} from '../types'

const MateriaReducer = (state, action) => {

    switch(action.type)
    {
        case LISTAR_MATERIAS_EXITO:
            return {
                ...state,
                materias: action.payload,
                materia_select: null,
                mensaje: null,
            }
        case LISTAR_MATERIAS_ERROR:
            return{
                ...state,
                materias: null,
                materia_select: null,
                mensaje: action.payload
            }
        case SELECCIONA_MATERIA:
            return{
                ...state,
                materia_select: state.materias.filter(materia => materia.codigo === action.payload)
            }
        default:
            return state
    }

}

export default MateriaReducer