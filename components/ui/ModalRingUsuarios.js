import React, { useContext, useState, useEffect } from 'react'
import {Modal, Container, Row, Form, Col, Button, Tabs, Tab} from 'react-bootstrap'
import Logo from './Logo'
import { RingUsuario } from './RingUsuario'



const ModalRingUsuarios = ({show, setShowModalUsuariosRing, ring}) =>{

    
  const [showInvitarRing, setShowInvitarRing] = useState(false)  


    return (
    
      <Modal 
        show={show} 
        size="lg"
        onHide={() => {}} 
      >
        <Modal.Header>
       
          <div className="d-flex">
                <Logo />
                <h4 className="ml-2">
                  {!showInvitarRing 
                  ?
                    'Agregar alumnos al evento' 
                  :
                    'Invitar a otros profesores'
                  } 
                </h4>
            </div>

            <Button 
                variant="info"
                onClick={() => {
                  setShowModalUsuariosRing(false)
                }}
            >
                Volver
            </Button>
        </Modal.Header>
        <Modal.Body>
            <RingUsuario
                show={show}
                ring={ring}
                showInvitarRing={showInvitarRing}
                setShowInvitarRing={setShowInvitarRing}
            ></RingUsuario>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
  )
}

export default ModalRingUsuarios