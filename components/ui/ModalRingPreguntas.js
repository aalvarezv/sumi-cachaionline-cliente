import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Modal, Button } from 'react-bootstrap'
import Logo from './Logo'
import ModalPreguntaInfo from './ModalPreguntaInfo'
import { RingPregunta } from './RingPregunta'




const ModalRingPreguntas = ({
        showModalPreguntasRing, 
        setShowModalPreguntasRing, 
        ring
    }) => {
    
    
    

    //PREGUNTA Info.
    const [showModalPreguntaInfo, setShowModalPreguntaInfo] = useState(false)
    const [pregunta, setPregunta] = useState(null)
    

    const handleCloseModalPreguntasRing = () => {

        setShowModalPreguntasRing(false)

    }

    const handleShowModalPreguntaInfo = pregunta => {
        setShowModalPreguntaInfo(true)
        setPregunta(pregunta)
        setShowModalPreguntasRing(false)
    } 

    const handleCloseModalPreguntaInfo = () => {
        setShowModalPreguntaInfo(false)
        setPregunta(null)
        setCantPreguntasRing(0)
        setShowModalPreguntasRing(true)
    }     
    
    return (
        <>
        <ModalPreguntaInfo
            show={showModalPreguntaInfo}
            pregunta={pregunta}
            handleCloseModalPreguntaInfo={handleCloseModalPreguntaInfo}
        />   
        <Modal 
            show={showModalPreguntasRing} 
            onHide={() => {}} 
            size="xl"
        >
        <Modal.Header>
            <div className="d-flex">
                <Logo />
                <h4 className="ml-2">Agregar preguntas a ring</h4>
            </div> 
            <Button 
                variant="info"
                onClick={handleCloseModalPreguntasRing}
            >
                Volver
            </Button>
        </Modal.Header>
        <Modal.Body>
                <RingPregunta
                    showModalPreguntasRing={showModalPreguntasRing}
                    ring={ring}
                ></RingPregunta>
        </Modal.Body>
      </Modal>
      </>
     )
}
 
export default ModalRingPreguntas
