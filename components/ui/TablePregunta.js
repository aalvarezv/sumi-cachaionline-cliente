import React, {useState, useRef} from 'react';
import { useRouter } from 'next/router';
import { Table, Image, Button, Overlay, Popover, Row, Col } from 'react-bootstrap';
import ModalImageView from './ModalImageView';

const TablePregunta = ({preguntas, handleEliminaPregunta, handleModificaPregunta}) => {
    
    const [show_imagen, setShowImagen] = useState(false);
    const [img_url, setImagenUrl] = useState('');

    const [show_confirm_eliminar, setShowConfirmEliminar] = useState(false);
    const [target_confirm_eliminar, setTargetConfirmEliminar] = useState(null);
    const ref_confirm_eliminar = useRef(null);

    const [codigo_eliminar, setCodigoEliminar] = useState('');


    const handleClickEliminar = (e, codigo) => {
        setShowConfirmEliminar(!show_confirm_eliminar);
        setTargetConfirmEliminar(e.target);
        setCodigoEliminar(codigo);
    };

    const handleShowImageView = img_url => {
        setShowImagen(true);
        setImagenUrl(img_url);
    } 

    const handleCloseImageView = () => {
        setShowImagen(false);
        setImagenUrl('');
    }

    return (
        <>
        <ModalImageView
            img_url = {img_url}
            show={show_imagen}
            handleClose={handleCloseImageView}
        />
        {preguntas.length > 0 &&
        <Table striped bordered hover variant="light">
        <thead>
            <tr>
            <th>#</th>
            <th>Imagen</th>
            <th>Creador</th>
            <th>Creada</th>
            <th></th>
            <th></th>
            </tr>
        </thead>
        <tbody>
            {
                preguntas.map((pregunta, index) => {
                    
                    const { codigo, imagen, usuario, 
                        createdAt, updatedAt} = pregunta;
                        
                        return (
                        <tr
                            key={codigo}
                        >
                        <td>{index+1}</td>
                        <td>
                            <Image 
                                src={imagen} 
                                style={{width: 40, height: 40, cursor: 'pointer'}} 
                                onClick={() => handleShowImageView(imagen)}
                                thumbnail
                            />
                        </td>
                        <td>{usuario.nombre}</td>
                        <td><small>{createdAt}</small></td>
                        <td>
                            <Button
                                variant={"outline-info"}
                                size={"md"}
                                onClick={() => handleModificaPregunta(codigo)}
                                >
                                Modificar
                            </Button>
                        </td>
                        <td ref={ref_confirm_eliminar}>
                            <Button
                                variant={"danger"}
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
                            <Popover.Title as="h3"><small>¿Desea eliminar la pregunta?</small></Popover.Title>
                                <Popover.Content>
                                    <Row>
                                        <Col>
                                            <Button
                                                variant={"success"}
                                                size={"md"}
                                                onClick={e => {
                                                    handleEliminaPregunta(codigo_eliminar);
                                                    setShowConfirmEliminar(!show_confirm_eliminar);
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
                    </tr>)
                })
            }
            
        </tbody>
        </Table>
    }
    </>
    )
}

export default TablePregunta
