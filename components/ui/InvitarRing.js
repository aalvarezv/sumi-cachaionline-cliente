import React, { useState, useContext, useEffect } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { handleError } from '../../helpers'
import SocketContext from '../../context/socket/SocketContext'
import clienteAxios from '../../config/axios'
import AuthContext from '../../context/auth/AuthContext'
import Paginador from './Paginador'
import AlertText from './AlertText'

import InputSelectInstitucion from './InputSelectInstitucion'
import TableUsuariosInvitarRing from './TableUsuariosInvitarRing'
import SocketInvitacionesRingContext from '../../context/socket_invitaciones_ring/SocketInvitacionesRingContext'

const InvitarRing = ({ring, nivelesAcademicos, handleShowInvitarRing}) => {

    const { usuario } = useContext(AuthContext)
    const { socket } = useContext(SocketContext)
    const { aceptarRechazarInvitaciones, setAceptarRechazarInvitacionRing } = useContext(SocketInvitacionesRingContext)

    const [codigoInstitucion, setCodigoInstitucion] = useState('0')
    const [codigoNivelAcademico, setCodigoNivelAcademico] = useState('0')
    const [usuariosInvitarRing, setUsuariosInvitarRing] = useState([])
    const [textAlert, setTextAlert] = useState('')

    /**** Variables para paginación *****/
    const [pagina_actual, setPaginaActual] = useState(1)
    const [resultados_por_pagina, setResultadosPorPagina] = useState(1)

    const indice_ultimo_resultado = pagina_actual * resultados_por_pagina
    const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina
    const resultados_pagina = usuariosInvitarRing.slice(indice_primer_resultado, indice_ultimo_resultado)
    /*************************************/
    
    useEffect(() => {
        
        const listarUsuariosInvitarRing = async () => {

            try{
            
                const resp = await clienteAxios.get('/api/ring-invitaciones/listar-usuarios',{
                    params:{
                        rut_usuario: usuario.rut,
                        codigo_institucion: codigoInstitucion,
                        codigo_nivel_academico: codigoNivelAcademico,
                        roles: ['3'], //Sólo profesores.
                        codigo_ring: ring.codigo,
                    }
                })
                
                setUsuariosInvitarRing(resp.data.usuarios_invitar_ring)
                if(resp.data.usuarios_invitar_ring > 0){
                    setTextAlert("")
                }else{
                    setTextAlert("No se encontraron resultados")
                }
                 setPaginaActual(1)
                
            }catch(e){
                handleError(e)
            }

        }

        listarUsuariosInvitarRing()       

    }, [codigoInstitucion, codigoNivelAcademico, aceptarRechazarInvitaciones])


    useEffect(() => {
        
        if(usuario){
            socket.off(`aceptar-rechazar-invitacion-ring-${usuario.rut}`).on(`aceptar-rechazar-invitacion-ring-${usuario.rut}`, data => {
                setAceptarRechazarInvitacionRing()
            })
        }

    }, [usuario])


    const handleSetPaginaActual = numero_pagina => {
        setPaginaActual(numero_pagina)
    }

    const handleInvitarRing = receptor => {
        
        socket.emit('enviar-invitacion-ring', {
            remitente: usuario,
            receptor,
            ring
        })

        const newUsuariosInvitarRing = usuariosInvitarRing.map(usuarioInvitaRing => {
            if(usuarioInvitaRing.rut_usuario === receptor.rut){
                return {
                    ...usuarioInvitaRing,
                    invitacion_enviada: 1,
                    invitacion_estado: 0,
                }
            }else{
                return usuarioInvitaRing
            }
        })

        setUsuariosInvitarRing(newUsuariosInvitarRing)

    }

    const handleCancelarInvitarRing = receptor => {

        socket.emit('cancelar-invitacion-ring', {
            remitente: usuario,
            receptor,
            ring
        })

        const newUsuariosInvitarRing = usuariosInvitarRing.map(usuarioInvitaRing => {
            if(usuarioInvitaRing.rut_usuario === receptor.rut){
                return {
                    ...usuarioInvitaRing,
                    invitacion_enviada: 0,
                    invitacion_estado: null,
                }
            }else{
                return usuarioInvitaRing
            }
        })

        setUsuariosInvitarRing(newUsuariosInvitarRing)

    }

    return ( 
        <>
        <Row>
            <Col xs={12} lg={8} className="mb-2 mb-lg-0">
                <Row className="mb-2">
                    <Col>
                        <Form.Label>Buscar profesores por...</Form.Label>
                        <InputSelectInstitucion
                            as="select"
                            label="POR INSTITUCIÓN"
                            value={codigoInstitucion}
                            onChange={e => {
                                setCodigoInstitucion(e.target.value)
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Control 
                            as="select" 
                            value={codigoNivelAcademico}
                            onChange={e => {
                                setCodigoNivelAcademico(e.target.value)
                            }}
                        >
                            <option value={"0"}>
                                Y NIVEL ACADEMICO
                            </option>
                            {nivelesAcademicos.map(nivelAcademico => {
                                const { codigo, descripcion } = nivelAcademico
                                return (<option key={codigo} value={codigo}>
                                            {descripcion}
                                        </option>)
                            })}
                        </Form.Control>
                    </Col>
                </Row>
            </Col>
            <Col xs={12} lg={"auto"} className="d-flex align-items-end">
                <Button
                    variant={"info"}
                    className="btn-block"
                    onClick={handleShowInvitarRing}
                >
                    Volver
                </Button>
            </Col>
        </Row>
        <Row>
            {usuariosInvitarRing.length > 0 
            ?
                <Col className="mt-5 d-flex flex-column">
                    <div className="align-self-end">
                        <Paginador
                            resultados_por_pagina = {resultados_por_pagina}
                            total_resultados = {usuariosInvitarRing.length}
                            handleSetPaginaActual = {handleSetPaginaActual}
                            pagina_activa = {pagina_actual}
                        />
                    </div>
                    <TableUsuariosInvitarRing 
                        usuariosInvitarRing={resultados_pagina}
                        pagina_actual = {pagina_actual}
                        resultados_por_pagina = {resultados_por_pagina}
                        handleInvitarRing={handleInvitarRing}
                        handleCancelarInvitarRing={handleCancelarInvitarRing}
                    />
                </Col>
            :
                <Col className="my-5">
                    <AlertText
                    text={textAlert}
                    />
                </Col>
                  
            }
        </Row>
        </>
     );
}
 
export default InvitarRing;