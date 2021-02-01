import React, {useState, useRef} from 'react'
import {getNumeroFilaTabla} from '../../helpers'
import {Table, Button, Row, Col, Badge, Popover, Overlay} from 'react-bootstrap'


const TableUnidad = ({unidades, pagina_actual, resultados_por_pagina, handleClickModificarUnidad, handleClickEliminarUnidad}) => { 

    const [show_confirm_eliminar, setShowConfirmEliminar] = useState(false)
    const [target_confirm_eliminar, setTargetConfirmEliminar] = useState(null)
    const ref_confirm_eliminar = useRef(null)

    const [codigo_eliminar, setCodigoEliminar] = useState('')

    const handleClickEliminar = (e, codigo) => {
        setShowConfirmEliminar(!show_confirm_eliminar)
        setTargetConfirmEliminar(e.target)
        setCodigoEliminar(codigo)
    }

    return (
        <>
            <Table striped bordered hover variant="light" responsive> 
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th className="text-center">Estado</th>
                    <th></th>
                    <th></th>
                    </tr>
    
                </thead>
                <tbody>
                    {unidades.length > 0 &&
                        unidades.map((unidad, index) =>{

                            const {codigo, descripcion, inactivo} = unidad
                            let numFila = getNumeroFilaTabla(index, pagina_actual, resultados_por_pagina)

                            return(
                                <tr key={index}>
                                <td>{numFila}</td> 
                                <td>{codigo}</td> 
                                <td>{descripcion}</td> 
                                <td className="text-center"><Badge variant={inactivo ? 'danger' : 'info'} >{inactivo ? 'Inactivo': 'Activo'}</Badge></td>  
                                <td className="text-center"
                                    ref={ref_confirm_eliminar}
                                >
                                    <Button 
                                        variant="outline-info"
                                        onClick={() => {
                                            handleClickModificarUnidad(codigo)    
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
                                    <Popover.Title as="h3"><small>¿Desea eliminar la unidad?</small></Popover.Title>
                                    <Popover.Content>
                                        <Row>
                                            <Col>
                                                <Button
                                                    variant={"danger"}
                                                    size={"md"}
                                                    onClick={e => {
                                                        setShowConfirmEliminar(!show_confirm_eliminar)
                                                        handleClickEliminarUnidad(codigo_eliminar)
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

export default TableUnidad