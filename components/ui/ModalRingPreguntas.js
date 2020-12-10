import React, {useState, useEffect} from 'react';
import {Modal, Container, Row, Col} from 'react-bootstrap';
import FiltrosBusquedaPregunta from './FiltrosBusquedaPregunta';
import TableRingPreguntas from './TableRingPreguntas';
import Logo from './Logo';


const ModalRingPreguntas = ({show, handleClose, ring}) => {


    return ( 
        <Modal 
            show={show} 
            onHide={handleClose} 
            size="xl"
        >
        <Modal.Header closeButton>
            <Modal.Title>
                <Row className="ml-3">
                    <Logo />
                    <h4 className="ml-2">Agregar preguntas a ring </h4> 
                </Row>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Container>
                <Row>
                    <Col>                     
                        <TableRingPreguntas
                            ring={ring}
                        />
                    </Col>
                </Row>
            </Container> 
        </Modal.Body>
       
      </Modal>
     );
}
 
export default ModalRingPreguntas;
