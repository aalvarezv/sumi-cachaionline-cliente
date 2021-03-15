import React, {useState} from 'react'
import { toast } from 'react-toastify'
import Uploader from '../ui/Uploader'
import {Modal, Container, Row, Col, Button, Badge} from 'react-bootstrap'
import ToastMultiline from '../ui/ToastMultiline'
import { getBase64, handleError } from '../../helpers'
import clienteAxios from '../../config/axios'

const ModalCargaMasivaUsuario = ({ show, handleClose}) => {

    const [cargaMasivaBase64, setCargaMasivaBase64] = useState('')

    //funcion que recibe el componente Uploader donde retorna los archivos a subir.
    const getArchivos = async archivos => {
        const base64 = await getBase64(archivos[0])
        setCargaMasivaBase64(base64)
    }

    const handleCargaMasivaUsuarios = async () => {
        try{

            const resp = await clienteAxios.post('/api/usuarios/carga-masiva', {
                archivoBase64 : cargaMasivaBase64
            })
            //respuesta del usuario recibido.
            toast.success(<ToastMultiline mensajes={[{msg: 'USUARIOS CREADOS'}]}/>, {containerId: 'sys_msg'})
 

        }catch(e){
            handleError(e)
       }
    }

    
    return ( 
        <Modal show={show}  size="lg">
        <Modal.Header closeButton>
        <Modal.Title>
            <Row className="ml-3">
                <h4 className="ml-2"> CARGA MASIVA USUARIOS </h4> 
            </Row>
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Container>
            <Row className="d-flex justify-content-center">
                <Col className="mb-2 mb-sm-0" xs={12} sm={6}>
                    <Row className="mb-2">
                        {cargaMasivaBase64 === ''
                        ?
                        <Col className="d-flex align-items-end  mb-sm-0" xs={12} sm="auto">
                        <Uploader
                            titulo={"HAZ CLICK O ARRASTRA Y SUELTA EL ARCHIVO"}
                            getArchivos={getArchivos}
                        >
                        </Uploader>
                        </Col>
                        :
                        <Col className="d-flex align-items-end  mb-sm-0" xs={12} sm="auto">
                         <Badge variant="success">ARCHIVO CARGADO</Badge>{' '}
                        <Uploader
                            titulo={"HAZ CLICK O ARRASTRA Y SUELTA EL ARCHIVO"}
                            getArchivos={getArchivos}
                        >
                        </Uploader>
                        </Col> 
                        }
                    </Row>
                    <Col className="d-flex align-items-end  mb-sm-0" xs={12} sm="auto">
                        <Button 
                            variant="info"
                            className="btn-block "
                            onClick={handleCargaMasivaUsuarios}
                        >
                            Cargar
                        </Button>
                    </Col>
                </Col>
            </Row>
             
            </Container>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
     )
}
export default ModalCargaMasivaUsuario