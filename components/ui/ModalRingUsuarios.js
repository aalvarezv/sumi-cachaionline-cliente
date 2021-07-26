import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import Logo from './Logo'
import { RingUsuario } from './RingUsuario'



const ModalRingUsuarios = ({ring, show, setShowModalUsuariosRing }) =>{
    
    const handleCloseModal = () => {
      setShowModalUsuariosRing(false)
    }

    return (
    
      <Modal 
        show={show} 
        size="lg"
        onHide={handleCloseModal} 
      >
        <Modal.Header closeButton>
          <div className="d-flex">
              <Logo />
              <h4 className="ml-2">
                Administrar usuarios del ring
              </h4>
          </div>
        </Modal.Header>
        <Modal.Body>
            <RingUsuario
                ring={ring}
            />
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
  )
}

export default ModalRingUsuarios