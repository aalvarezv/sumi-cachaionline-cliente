import React, { useReducer} from 'react'
import SocketInvitacionesRingContext from './SocketInvitacionesRingContext'
import SocketInvitacionesRingReducer from './SocketInvitacionesRingReducer'
import { SOCKET_RECIBIR_INVITACION_RING,
    SOCKET_ACEPTAR_RECHAZAR_INVITACION_RING } from '../types'

const SocketInvitacionesRingState = props => {
    
    const initialState = {
        cantidadInvitaciones : 0,
        aceptarRechazarInvitaciones: false,
    }

    const [state, dispatch] = useReducer(SocketInvitacionesRingReducer, initialState)

    const setCantidadInvitacionesRing = cantidad => {
        dispatch({
            type: SOCKET_RECIBIR_INVITACION_RING,
            payload: cantidad,
        })
    }

    const setAceptarRechazarInvitacionRing = () => {
        dispatch({
            type: SOCKET_ACEPTAR_RECHAZAR_INVITACION_RING,
        })
    }

    return (
        <SocketInvitacionesRingContext.Provider
            value={{
                cantidadInvitaciones: state.cantidadInvitaciones,
                aceptarRechazarInvitaciones: state.aceptarRechazarInvitaciones,
                setCantidadInvitacionesRing,
                setAceptarRechazarInvitacionRing,
            }}
        >
            {props.children}
        </SocketInvitacionesRingContext.Provider>
    )
}
 
export default SocketInvitacionesRingState;

