import React, { useContext, useState } from 'react';
import {Modal, Button} from 'react-bootstrap';
import TableUsuarios from '../ui/TableUsuario';



const ModalUsuariosRing = ({show, handleClose, codigo_ring}) =>{
    
  return (
    
      <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
  <Modal.Title>codigo:{codigo_ring}</Modal.Title>
        </Modal.Header>
  <Modal.Body><TableUsuarios codigoring={codigo_ring}/></Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Cerrar
          </Button> 
        </Modal.Footer>
      </Modal>
  );
}

export default ModalUsuariosRing;