import React, {useState, useRef} from 'react'
import {getNumeroFilaTabla} from '../../helpers'
import {Table, Button, Row, Col, Badge, Overlay, Popover} from 'react-bootstrap'


const TableUsuario = ({usuarios, pagina_actual, resultados_por_pagina, handleClickModificar, handleClickEliminarUsuario}) => {

    const [show_confirm_eliminar, setShowConfirmEliminar] = useState(false)
    const [target_confirm_eliminar, setTargetConfirmEliminar] = useState(null)
    const ref_confirm_eliminar = useRef(null)

    const [rut_eliminar, setRutEliminar] = useState('')

    const handleClickEliminar = (e, rut) => {
        setShowConfirmEliminar(!show_confirm_eliminar)
        setTargetConfirmEliminar(e.target)
        setRutEliminar(rut)
    }
 
    return (
        <>
            <Table striped bordered hover variant="light" responsive> 
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Rut</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th className="text-center">Estado</th>
                    <th></th>
                    </tr>
    
                </thead>
                <tbody>
                    {usuarios.length > 0 &&
                        usuarios.map((usuario, index) =>{

                            const {rut, nombre, email, inactivo} = usuario
                            let numFila = getNumeroFilaTabla(index, pagina_actual, resultados_por_pagina)

                            return(
                                <tr key={index}>
                                <td>{numFila}</td>  
                                <td>{rut}</td>    
                                <td>{nombre}</td> 
                                <td>{email}</td>
                                <td className="text-center"><Badge variant={inactivo ? 'danger' : 'info'} >{inactivo ? 'Inactivo': 'Activo'}</Badge></td>
                                <td className="text-center">
                                    <Button 
                                        variant="outline-info"
                                        onClick={() => {
                                            handleClickModificar(rut)
                                        }}
                                    >
                                     Modificar
                                    </Button>
                                </td>
                                <td className="text-center"
                                    ref={ref_confirm_eliminar}
                                >
                                    <Button 
                                        variant="danger"
                                        size={"md"}
                                        onClick={e => handleClickEliminar(e, rut)}
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
                                <Popover.Title as="h3"><small>¿Desea eliminar el usuario?</small></Popover.Title>
                                <Popover.Content>
                                    <Row>
                                        <Col>
                                            <Button
                                                variant={"danger"}
                                                size={"md"}
                                                onClick={e => {
                                                    setShowConfirmEliminar(!show_confirm_eliminar)
                                                    handleClickEliminarUsuario(rut_eliminar)
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

export default TableUsuario