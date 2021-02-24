import React, { useState, useEffect, useContext } from 'react'
import {Container, Table, Button, Badge, Card } from 'react-bootstrap'
import Layout from '../../components/layout/Layout'
import Privado from '../../components/layout/Privado'
import AuthContext from '../../context/auth/AuthContext'
import { handleError } from '../../helpers'
import clienteAxios from '../../config/axios'
import AlertText from '../../components/ui/AlertText'
import BadgeEstadoInvitacionRing from '../../components/ui/BadgeEstadoInvitacionRing'
import ModalRingUsuarios from '../../components/ui/ModalRingUsuarios'
import SocketInvitacionesRingContext from '../../context/socket_invitaciones_ring/SocketInvitacionesRingContext'
import SocketContext from '../../context/socket/SocketContext'
    

const RingInvitaciones = () => {

    
    const { usuario } = useContext(AuthContext)
    const { socket } = useContext(SocketContext)
    const { cantidadInvitaciones } = useContext(SocketInvitacionesRingContext)
    const [ring, setRing] = useState(null)
    const [show_modal_usuarios, setShowModalUsuarios] = useState(false)
    const [invitacionesRingUsuario, setInvitacionesRingUsuario] = useState([])

    useEffect(() => {
        
        const listarInvitacionesRing = async () => {

            try {

                const resp = await clienteAxios.get('/api/ring-invitaciones/listar-invitaciones-usuario',{
                    params: {
                        rut_usuario: usuario.rut
                    }
                })
                setInvitacionesRingUsuario(resp.data.invitaciones_ring_usuario)
            
            } catch (e) {
                handleError(e)
            }

        }
        
        if(usuario){
            listarInvitacionesRing()
        }
       

    }, [usuario, cantidadInvitaciones])

    const handleAceptaRechazaInvitacionRing = async (invitacion, estado) => {

        try{

            socket.emit('aceptar-rechazar-invitacion-ring', {
                codigo: invitacion.codigo,
                estado,
                emisor: invitacion.usuario_emisor,
            })

           
            const newInvitacionesRingUsuario = invitacionesRingUsuario.map(invitacionRingUsuario => {

                if(invitacionRingUsuario.codigo === invitacion.codigo){

                    return {
                        ...invitacionRingUsuario,
                        estado: estado,
                    }
                }else{
                    return invitacionRingUsuario
                }

            })

            setInvitacionesRingUsuario(newInvitacionesRingUsuario)
            

        } catch (e) {
            handleError(e)
        }

    }

    const handleCloseModalUsuarios = () => setShowModalUsuarios(false)

    const handleAgregarUsuariosRing = ring => {
        setShowModalUsuarios(true)
        setRing(ring)
    }
    
    return (  
    <Layout>
        <Privado>
            {ring &&
                <ModalRingUsuarios
                    show = {show_modal_usuarios}
                    handleClose = {handleCloseModalUsuarios}
                    ring = {ring}
                />
            }
            <Container fluid>
            <h5 className="text-center my-4">Invitaciones Ring</h5>
            <Card>
            <Card.Body>
                {invitacionesRingUsuario.length > 0
                ?
                <Table striped bordered hover variant="light" responsive> 
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Invitado Por</th>
                    <th>Evento</th>
                    <th>Fecha</th>
                    <th></th>
                    <th></th>
                    <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {invitacionesRingUsuario.map((invitacionUsuarioRing, index) =>{
                            
                        const { codigo, usuario_emisor, ring, estado } = invitacionUsuarioRing

                            return(
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{usuario_emisor.nombre}</td>
                                    <td>{ring.nombre}</td>
                                    <td>
                                        <small>
                                            {ring.fecha_hora_inicio} <br /> {ring.fecha_hora_fin}
                                        </small>
                                    </td>
                                    <td>
                                        {estado === 0 //pendiente
                                        &&
                                        <Button
                                            variant="info"
                                            onClick={() => handleAceptaRechazaInvitacionRing(invitacionUsuarioRing, 1)}
                                        >
                                            Aceptar Invitación
                                        </Button>
                                        }
                                        
                                        {estado === 1 //aceptado
                                        && 
                                        <Button
                                            variant="info"
                                            onClick={() => handleAgregarUsuariosRing(ring, 1)}
                                        >
                                            Agregar Usuarios
                                        </Button>
                                        }
                                    </td>
                                    <td>
                                        {estado === 0 //pendiente
                                        &&
                                            <Button
                                                variant="danger"
                                                onClick={() => handleAceptaRechazaInvitacionRing(invitacionUsuarioRing, 2)}
                                            >
                                                Rechazar Invitación
                                            </Button>
                                        }
                                        {estado === 1 //aceptado
                                        && 
                                        <Button
                                            variant="primary"
                                            onClick={() => handleAgregarUsuariosRing(ring, 1)}
                                        >
                                            Info
                                        </Button>
                                        }
                                        
                                    </td>
                                    <td>
                                        <BadgeEstadoInvitacionRing
                                            estado={estado}
                                        />
                                    </td>
                                </tr>
                            )
                        }) 
                    }
                </tbody>
                </Table>
                :
                <AlertText
                    text="No tiene invitaciones a eventos"
                />
                }
            </Card.Body>
            </Card>
            </Container>
        </Privado>
    </Layout>

    );
}
 
export default RingInvitaciones;
