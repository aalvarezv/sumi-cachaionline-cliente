import React, {useState, useRef} from 'react';
import {Table, Button, Row, Col, Form, Overlay, Popover} from 'react-bootstrap';


const TableUsuario = ({usuarios, handleClickModificar, handleClickEliminarUsuario}) => {

    const [show_confirm_eliminar, setShowConfirmEliminar] = useState(false);
    const [target_confirm_eliminar, setTargetConfirmEliminar] = useState(null);
    const ref_confirm_eliminar = useRef(null);

    const [rut_eliminar, setRutEliminar] = useState('');


    const handleClickEliminar = (e, rut) => {
        setShowConfirmEliminar(!show_confirm_eliminar);
        setTargetConfirmEliminar(e.target);
        setRutEliminar(rut);
    };

 
    return (
        <>
            
            <Table striped bordered hover variant="light"> 
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Rut</th>
                    <th>Nombre</th>
                    <th></th>
                    </tr>
    
                </thead>
                <tbody>
                    {usuarios.length > 0 &&
                        usuarios.map((usuario, index) =>{
                            const {rut, nombre} = usuario
                            return(
                                <tr >
                                <td>{index+1}</td>  
                                <td>{rut}</td>    
                                <td>{nombre}</td> 

                                <td>
                                    <Button 
                                        variant="outline-info"
                                        onClick={() => {
                                            handleClickModificar(rut);
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
                                                variant={"success"}
                                                size={"md"}
                                                onClick={e => {
                                                    setShowConfirmEliminar(!show_confirm_eliminar);
                                                    handleClickEliminarUsuario(rut);
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

export default TableUsuario;