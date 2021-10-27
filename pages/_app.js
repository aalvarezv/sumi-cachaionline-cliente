import React from 'react'
import io from 'socket.io-client'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/styles.css'
import { ToastContainer, Slide, Zoom, Flip, Bounce } from 'react-toastify'
import 'react-datepicker/dist/react-datepicker.css'
import AuthState from '../context/auth/AuthState'
import MateriaState from '../context/materias/MateriaState'
import UnidadState from '../context/unidades/UnidadState'
import NivelAcademicoState from '../context/niveles_academicos/NivelAcademicoState'
import SocketInvitacionesRingState from '../context/socket_invitaciones_ring/SocketInvitacionesRingState'
import SocketContext from '../context/socket/SocketContext'


const socket = io.connect(process.env.NEXT_PUBLIC_SOCKET_URL, {
  path: process.env.NEXT_PUBLIC_SOCKET_PATH,
  transports: ['websocket'], 
  upgrade: false,
  reconnection: true,
  reconnectionDelay: 3000,
  reconnectionAttempts: 20,
  forceNew: false,
})
 
function MyApp({ Component, pageProps }) {

  return (
    <>
    <SocketContext.Provider
      value={{
        socket,
      }}
    > 
      <SocketInvitacionesRingState>
        <AuthState>
          <MateriaState>
            <UnidadState>
              <NivelAcademicoState>
                <Component {...pageProps} />
              </NivelAcademicoState>
            </UnidadState>
          </MateriaState>
        </AuthState>
      </SocketInvitacionesRingState>
    </SocketContext.Provider>
    </>
  )
}

export default React.memo(MyApp)

