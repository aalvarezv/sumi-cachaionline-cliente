import React, {useState, useRef} from 'react';
import {Table, Button, Badge, Overlay, Popover, Row, Col} from 'react-bootstrap';
import ModalUsuariosRing from '../ui/ModalUsuariosRing';

const TableRing = ({rings, handleEliminarRing, handleModificarRing}) => {

    const [show_confirm_eliminar, setShowConfirmEliminar] = useState(false);
    const [target_confirm_eliminar, setTargetConfirmEliminar] = useState(null);
    const ref_confirm_eliminar = useRef(null);

    const [show_modal_usuarios, setShowModalUsuarios] = useState(false);
    const handleCloseModalUsuarios = () => setShowModalUsuarios(false);
    const handleShowModalUsuarios = () => setShowModalUsuarios(true);

    const [codigo_ring_usuario, setCodigoRingUsuario] = useState('')

    const [codigo_eliminar, setCodigoEliminar] = useState('');
    
    const handleClickAgregarUsuario = (codigo) => {
        setCodigoRingUsuario(codigo);
    };

    const handleClickEliminar = (e, codigo) => {
        setShowConfirmEliminar(!show_confirm_eliminar);
        setTargetConfirmEliminar(e.target);
        setCodigoEliminar(codigo);
    };

    return (
        <>
            <ModalUsuariosRing
                show = {show_modal_usuarios}
                handleClose = {handleCloseModalUsuarios}
                codigo_ring = {codigo_ring_usuario}
            />
            <Table striped bordered hover variant="light"> 
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Creador</th>
                    <th>Creado</th>
                    <th>Privado</th>
                    <th></th>
                    <th></th>
                    </tr>
    
                </thead>
                <tbody>
                    {rings.length > 0 && 
                        rings.map((ring, index) =>{
                            const {codigo, nombre, privado, createdAt, usuario} = ring
                           
                            return(
                                <tr key={codigo}>
                                <td>{index+1}</td>
                                <td>{nombre}</td>
                                <td>{usuario.nombre}</td>
                                <td><small>{createdAt}</small></td>
                                <td>
                                    <Badge variant={privado ? 'danger' : 'success'}>{privado ? 'Privado' : 'Público'}</Badge></td>
                                <td>
                                    <Button 
                                        variant="outline-info"
                                        onClick={e => {
                                            handleShowModalUsuarios(2)
                                            handleClickAgregarUsuario(codigo)
                                            }  
                                        }
                                        
                                    >
                                     Agregar
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
                            );
                        }) 
                        
                    }

                    
                </tbody>
            </Table>
        </>
    )
}

export default TableRing