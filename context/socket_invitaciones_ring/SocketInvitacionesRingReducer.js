import {
SOCKET_RECIBIR_INVITACION_RING,
SOCKET_ACEPTAR_RECHAZAR_INVITACION_RING,
} from '../types'

const SocketInvitacionesRingReducer = (state, action) =>{

    switch (action.type) {    
         
        case SOCKET_RECIBIR_INVITACION_RING:
            return {
                ...state,
                cantidadInvitaciones: action.payload
            }
        case SOCKET_ACEPTAR_RECHAZAR_INVITACION_RING:
            return{
                ...state,
                aceptarRechazarInvitaciones: !state.aceptarRechazarInvitaciones,
            }
        default:
            return state
    }

}

export default SocketInvitacionesRingReducer