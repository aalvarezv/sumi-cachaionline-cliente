import React, {useState, useRef} from 'react'
import {getNumeroFilaTabla} from '../../helpers'
import {Table, Button, Badge, Overlay, Popover, Row, Col} from 'react-bootstrap'
import ModalRingUsuarios from '../ui/ModalRingUsuarios'
import ModalRingPreguntas from '../ui/ModalRingPreguntas'

const TableRing = ({
        rings, 
        pagina_actual, 
        resultados_por_pagina, 
        handleEliminarRing, 
        handleConfigurarRing
    }) => {

    const [show_confirm_eliminar, setShowConfirmEliminar] = useState(false)
    const [target_confirm_eliminar, setTargetConfirmEliminar] = useState(null)
    const ref_confirm_eliminar = useRef(null)

    const [showModalUsuariosRing, setShowModalUsuariosRing] = useState(false)
    const [showModalPreguntasRing, setShowModalPreguntasRing] = useState(false)
    const [ring, setRing] = useState(null)
    const [codigo_eliminar, setCodigoEliminar] = useState('')
    
  
    const handleClickAgregarUsuarioRing = ring => {
        setShowModalUsuariosRing(true)
        setRing(ring)
    }

    const handleClickAgregarPreguntaRing = ring => {
        setShowModalPreguntasRing(true)
        setRing(ring)
    }

    const handleClickEliminar = (e, codigo) => {
        setShowConfirmEliminar(!show_confirm_eliminar)
        setTargetConfirmEliminar(e.target)
        setCodigoEliminar(codigo)
    }

    return (
        <>
            {ring &&
                <>
                    <ModalRingUsuarios
                        show={showModalUsuariosRing}
                        setShowModalUsuariosRing={setShowModalUsuariosRing}
                        ring={ring}
                    />
                    <ModalRingPreguntas 
                        showModalPreguntasRing={showModalPreguntasRing}
                        setShowModalPreguntasRing={setShowModalPreguntasRing}
                        ring={ring}
                    />    
                </>
            }
            <Table striped bordered hover variant="light" responsive> 
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Creado por</th>
                    <th>Fecha hora</th>
                    <th>Privado</th>
                    <th></th>
                    <th></th>
                    </tr>
    
                </thead>
                <tbody>
                    {rings.length > 0 && 
                        rings.map((ring, index) =>{
                           
                            const {codigo, nombre, privado, createdAt, usuario_creador} = ring
                            let numFila = getNumeroFilaTabla(index, pagina_actual, resultados_por_pagina)

                            return(
                                <tr key={codigo}>
                                <td>{numFila}</td>
                                <td>{nombre}</td>
                                <td>{usuario_creador.nombre}</td>
                                <td><small>{createdAt}</small></td>
                                <td>
                                    <Badge variant={privado ? 'danger' : 'success'}>{privado ? 'Privado' : 'Público'}</Badge>
                                </td>
                                {/* <td>
                                    <Button 
                                        variant="info"
                                        onClick={e => {
                                            handleClickAgregarUsuarioRing(ring)
                                        }}
                                    >
                                     Alumnos
                                    </Button>
                                </td> */}
                                {/* <td>
                                    <Button 
                                        variant="info"
                                        onClick={e => {
                                            
                                            handleClickAgregarPreguntaRing(ring)
                                            }  
                                        }
                                    >
                                     Preguntas
                                    </Button>
                                </td>                                  */}
                                <td>
                                    <Button 
                                        variant="info"
                                        size={"sm"}
                                        onClick={e => handleConfigurarRing(codigo)}
                                    >
                                     Configurar
                                    </Button>
                                </td>
                                <td>
                                    <Button 
                                        variant="secondary"
                                        size={"sm"}
                                        onClick={e => handleClickEliminar(e, codigo)}
                                    >
                                        Eliminar
                                    </Button>
                                    <Overlay
                                        show={show_confirm_eliminar}
                                        target={target_confirm_eliminar}
                                        placement="bottom"
                                        container={ref_confirm_eliminar.current}
                                        containerPadding={20}
                                    >
                                        <Popover id="popover-contained">
                                        <Popover.Title as="h3"><small>¿Desea eliminar el ring?</small></Popover.Title>
                                        <Popover.Content>
                                            <Row>
                                                <Col>
                                                    <Button
                                                        variant={"success"}
                                                        size={"md"}
                                                        onClick={e => {
                                                            handleEliminarRing(codigo_eliminar)
                                                            setShowConfirmEliminar(!show_confirm_eliminar)
                                                        }}
                                                        block
                                                    >
                                                        Si
                                                    </Button>
                                                </Col>
                                                <Col>
                                                    <Button
                                                        variant={"info"}
                                                        size={"md"}
                                                        onClick={() => setShowConfirmEliminar(!show_confirm_eliminar)}
                                                        block
                                                    >
                                                        No
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Popover.Content>
                                        </Popover>
                                    </Overlay>
                                </td>
                                </tr>
                            )
                        }) 
                        
                    }

                    
                </tbody>
            </Table>
        </>
    )
}

export default TableRing