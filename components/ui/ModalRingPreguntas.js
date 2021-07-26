import React from 'react'
import { Modal } from 'react-bootstrap'
import Logo from './Logo'
import { RingPregunta } from './RingPregunta'

const ModalRingPreguntas = ({
        showModalPreguntasRing, 
        setShowModalPreguntasRing, 
        ring
    }) => {
    
    const handleCloseModal = () => {
        setShowModalPreguntasRing(false)
    }

    return (
       
        <Modal 
            show={showModalPreguntasRing} 
            onHide={handleCloseModal} 
            size="xl"
        >
            <Modal.Header closeButton>
                <div className="d-flex">
                    <Logo />
                    <h4 className="ml-2">Agregar preguntas a ring</h4>
                </div> 
            </Modal.Header>
            <Modal.Body>
                <RingPregunta
                    ring={ring}
                />
            </Modal.Body>
        </Modal>
     )
}
 
export default ModalRingPreguntas
