import React, {useState, useRef} from 'react'
import {getNumeroFilaTabla} from '../../helpers'
import {Table, Button, Badge, Overlay, Popover, Row, Col} from 'react-bootstrap'
import ModalRingUsuarios from '../ui/ModalRingUsuarios'
import ModalRingPreguntas from '../ui/ModalRingPreguntas'

const TableRing = ({rings, pagina_actual, resultados_por_pagina, handleEliminarRing, handleModificarRing}) => {

    const [show_confirm_eliminar, setShowConfirmEliminar] = useState(false)
    const [target_confirm_eliminar, setTargetConfirmEliminar] = useState(null)
    const ref_confirm_eliminar = useRef(null)

    const [show_modal_usuarios, setShowModalUsuarios] = useState(false)
    const [show_modal_preguntas, setShowModalPreguntas] = useState(false)
    const [ring, setRing] = useState({})
    const [codigo_eliminar, setCodigoEliminar] = useState('')
    
    const handleCloseModalUsuarios = () => setShowModalUsuarios(false)
    const handleCloseModalPreguntas = () => setShowModalPreguntas(false)
  
    const handleClickAgregarUsuarioRing = ring => {
        setShowModalUsuarios(true)
        setRing(ring)
    }

    const handleClickAgregarPreguntaRing = ring => {
        setShowModalPreguntas(true)
        setRing(ring)
    }

    const handleClickEliminar = (e, codigo) => {
        setShowConfirmEliminar(!show_confirm_eliminar)
        setTargetConfirmEliminar(e.target)
        setCodigoEliminar(codigo)
    }

    return (
        <>
            <ModalRingUsuarios
                show = {show_modal_usuarios}
                handleClose = {handleCloseModalUsuarios}
                ring = {ring}
            />
            <ModalRingPreguntas 
                show = {show_modal_preguntas}
                handleClose = {handleCloseModalPreguntas}
                ring = {ring}
            />
            <Table striped bordered hover variant="light" responsive> 
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Creador</th>
                    <th>Creado</th>
                    <th>Privado</th>
                    <th>Nivel</th>
                    <th></th>
                    <th></th>
                    </tr>
    
                </thead>
                <tbody>
                    {rings.length > 0 && 
                        rings.map((ring, index) =>{
                           
                            const {codigo, nombre, privado, createdAt, usuario, nivel_academico} = ring
                            let numFila = getNumeroFilaTabla(index, pagina_actual, resultados_por_pagina)

                            return(
                                <tr key={codigo}>
                                <td>{numFila}</td>
                                <td>{nombre}</td>
                                <td>{usuario.nombre}</td>
                                <td><small>{createdAt}</small></td>
                                <td>
                                    <Badge variant={privado ? 'danger' : 'success'}>{privado ? 'Privado' : 'Público'}</Badge>
                                </td>
                                <td><small>{nivel_academico.descripcion}</small></td>
                                <td>
                                    <Button 
                                        variant="outline-info"
                                        onClick={e => {
                                            handleClickAgregarUsuarioRing(ring)
                                            }  
                                        }
                                    >
                                     Alumnos
                                    </Button>
                                </td>
                                <td>
                                    <Button 
                                        variant="outline-info"
                                        onClick={e => {
                                            
                                            handleClickAgregarPreguntaRing(ring)
                                            }  
                                        }
                                    >
                                     Preguntas
                                    </Button>
                                </td>                                 
                                <td>
                                    <Button 
                                        variant="outline-info"
                                        onClick={e => handleModificarRing(codigo)}
                                    >
                                     Modificar
                                    </Button>
                                </td>
                                <td>
                                    <Button 
                                        variant="danger"
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