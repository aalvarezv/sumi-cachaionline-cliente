import React from 'react'
import { Table, Button } from 'react-bootstrap'
import {getNumeroFilaTabla} from '../../helpers'
import BadgeEstadoInvitacionRing from './BadgeEstadoInvitacionRing'

const TableUsuariosInvitarRing = ({usuariosInvitarRing, pagina_actual, resultados_por_pagina, handleInvitarRing, handleCancelarInvitarRing}) => {
  

    return (
        <Table striped bordered hover variant="light" responsive> 
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Rut</th>
                    <th>Nombre</th>
                    <th></th>
                    <th className="text-center">Estado Invitación</th>
                    </tr>
                </thead>
                <tbody>
                    {usuariosInvitarRing.length > 0 && 
                        usuariosInvitarRing.map((usuarioInvitarRing, index) =>{
                           
                            const { usuario, usuario : {rut, nombre}, invitacion_enviada, invitacion_estado } = usuarioInvitarRing
                            let numFila = getNumeroFilaTabla(index, pagina_actual, resultados_por_pagina)

                            return(
                                <tr key={rut}>
                                    <td>{numFila}</td>
                                    <td>{rut}</td>
                                    <td>{nombre}</td>
                                    <td>
                                        
                                        {(invitacion_estado === null || invitacion_estado == 0) //si no ha enviado invitación o está pendiente para aceptar o rechazar.
                                        &&  
                                            <Button 
                                                variant={invitacion_enviada === 0 ? "info" : "danger"}
                                                onClick={e => {
                                                    if(invitacion_enviada === 0){
                                                        handleInvitarRing(usuario)
                                                    }else{
                                                        handleCancelarInvitarRing(usuario)
                                                    }
                                                    
                                                }}
                                            >
                                                {invitacion_enviada === 0 ? "Enviar Invitación" : "Cancelar Invitación"}
                                            </Button>
                                        }
                                       
                                    </td>
                                    <td className="text-center">
                                       <BadgeEstadoInvitacionRing
                                            estado={invitacion_estado}
                                       />
                                    </td>
                                </tr>
                            )
                        }) 
                    }
                </tbody>
            </Table>
    )
}

export default TableUsuariosInvitarRing