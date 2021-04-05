import React, {useState, useRef} from 'react'
import {getNumeroFilaTabla} from '../../helpers'
import {Table, Button, Row, Col, Badge, Popover, Overlay} from 'react-bootstrap'
import ModalUsuariosDisponiblesCurso from '../ui/ModalUsuariosDisponibleCurso'


const TableCursos = ({cursos, pagina_actual, resultados_por_pagina, 
    codigo_institucion, handleClickModificarCurso, handleClickEliminarCurso}) => { 

    const [show_confirm_eliminar, setShowConfirmEliminar] = useState(false)
    const [target_confirm_eliminar, setTargetConfirmEliminar] = useState(null)
    const ref_confirm_eliminar = useRef(null)
    const [codigo_eliminar, setCodigoEliminar] = useState('')

    const [show_modal_usuarios, setShowModalUsuarios] = useState(false)
    const [curso, setCurso] = useState(null)

    const handleCloseModalUsuarios = () => setShowModalUsuarios(false)

    const handleClickAgregarUsuarioCurso = curso => {
        setShowModalUsuarios(true)
        setCurso(curso)
    }

    const handleClickEliminar = (e, codigo) => {
        setShowConfirmEliminar(!show_confirm_eliminar)
        setTargetConfirmEliminar(e.target)
        setCodigoEliminar(codigo)
    }

    return (
        <>
            {curso &&
                <ModalUsuariosDisponiblesCurso
                    show = {show_modal_usuarios}
                    curso = {curso}
                    handleCloseModalUsuarios = {handleCloseModalUsuarios}
                />
            }
            <Table striped bordered hover variant="light" responsive> 
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Institución</th>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th></th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {cursos.length > 0 &&
                        cursos.map((curso, index) =>{
                            
                            const {codigo, nivel_academico, letra, institucion} = curso
                            let numFila = getNumeroFilaTabla(index, pagina_actual, resultados_por_pagina)
                            return(
                                <tr key={index}>
                                <td>{numFila}</td> 
                                <td>{institucion.descripcion}</td>
                                <td>{codigo}</td> 
                                <td>{`${nivel_academico.descripcion} ${letra}`}</td> 
                                <td className="text-center">
                                    <Button 
                                        variant="info"
                                        onClick={() => {   
                                            handleClickAgregarUsuarioCurso(curso)
                                        }}
                                    >
                                     + Usuarios
                                    </Button>
                                </td>
                                <td className="text-center"
                                    ref={ref_confirm_eliminar}
                                >
                                    <Button 
                                        variant="outline-info"
                                        onClick={() => {
                                            handleClickModificarCurso(codigo)    
                                        }}
                                    >
                                     Modificar
                                    </Button>
                                </td>
                                <td className="text-center">
                                    <Button 
                                        variant="danger"
                                        size={"md"}
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
                                    <Popover.Title as="h3"><small>¿Desea eliminar el curso?</small></Popover.Title>
                                    <Popover.Content>
                                        <Row>
                                            <Col>
                                                <Button
                                                    variant={"danger"}
                                                    size={"md"}
                                                    onClick={e => {
                                                        setShowConfirmEliminar(!show_confirm_eliminar)
                                                        handleClickEliminarCurso(codigo_eliminar)
                                                    }}
                                                    block
                                                >
                                                    Si
                                                </Button>
                                            </Col>
                                            <Col>
                                                <Button
                                                    variant={"secondary"}
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

export default TableCursos