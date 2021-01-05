import React, {useState, useRef} from 'react';
import {Table, Button, Row, Col, Form, Popover, Overlay} from 'react-bootstrap';

const TableConcepto = ({conceptos, handleClickModificarConcepto, handleClickEliminarConcepto}) => {  
    

    const [show_confirm_eliminar, setShowConfirmEliminar] = useState(false);
    const [target_confirm_eliminar, setTargetConfirmEliminar] = useState(null);
    const ref_confirm_eliminar = useRef(null);

    const [codigo_eliminar, setCodigoEliminar] = useState('');


    const handleClickEliminar = (e, codigo) => {
        setShowConfirmEliminar(!show_confirm_eliminar);
        setTargetConfirmEliminar(e.target);
        setCodigoEliminar(codigo);
    };

    return (
        <>
            <Table striped bordered hover variant="light"> 
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Codigo</th>
                    <th>Descripcion</th>
                    <th></th>
                    <th></th>
                    </tr>
    
                </thead>
                <tbody>
                    {conceptos.length > 0 &&
                        conceptos.map((concepto, index) =>{
                            const {codigo, descripcion} = concepto
                            return(
                                <tr >
                                <td>{index+1}</td>    
                                <td>{codigo}</td>  
                                <td>{descripcion}</td>                      
                                <td>
                                    <Button 
                                        variant="outline-info"
                                        onClick={() => {
                                            handleClickModificarConcepto(codigo);    
                                        }}
                                    >
                                     Modificar
                                    </Button>
                                </td>
                                <td
                                    ref={ref_confirm_eliminar}
                                >
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
                                <Popover.Title as="h3"><small>¿Desea eliminar el concepto?</small></Popover.Title>
                                <Popover.Content>
                                    <Row>
                                        <Col>
                                            <Button
                                                variant={"success"}
                                                size={"md"}
                                                onClick={e => {
                                                    setShowConfirmEliminar(!show_confirm_eliminar);
                                                    handleClickEliminarConcepto(codigo);
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

export default TableConcepto;