import React, {useState, useEffect} from 'react'
import {Container, Row, Col, Image, Button} from 'react-bootstrap'
import clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'

const Pregunta = ({codigo_pregunta, respuestas, total_preguntas, numero_pregunta_actual, handleSetRespuesta, handlePreguntaAnterior, handlePreguntaSiguiente}) => {

    const [pregunta, setPregunta] = useState(null)
    const [alternativa_correcta, setAlternativaCorrecta] = useState('')

    const getDatosPregunta = async codigo => {
      try{
            const resp = await clienteAxios.get(`/api/preguntas/datos/${codigo}`)
            setPregunta(resp.data.pregunta)
            const {pregunta_alternativa } = resp.data.pregunta
            setAlternativaCorrecta(pregunta_alternativa.filter(alternativa => alternativa.correcta === true)[0].letra)
      }catch(e){
        handleError(e)
      }
      
    }

    useEffect(() => {
      if(codigo_pregunta){
          getDatosPregunta(codigo_pregunta)
      }
    }, [codigo_pregunta])

    return ( 
        <Container>
        {pregunta &&
        <Row>
            <Col>
                <Row className="mb-2">
                {pregunta.imagen.trim() !== '' &&
                    <Image 
                        src={pregunta.imagen} 
                        style={{width: '100%'}} 
                        fluid
                    />
                }
                {pregunta.audio.trim() !== '' &&
                    <audio 
                        style={{width: '100%', cursor: 'pointer'}}
                        controls
                    >
                        <source src={pregunta.audio.trim()} />
                    </audio>
                }
                {pregunta.video.trim() !== '' &&
                    <video 
                        style={{width: '100%', cursor: 'pointer'}}
                        controls
                    >
                        <source src={pregunta.video.trim()} />
                    </video>
                }
                
                </Row>
                <Row className="bg-light d-flex justify-content-between">
                    <Col xs="2">
                        {numero_pregunta_actual > 0 &&
                            <Button 
                            variant="info" 
                            size="md"
                            onClick={handlePreguntaAnterior}
                            block
                            >Anterior</Button>
                        }
                    </Col>
                    <Col xs="7" className="d-flex justify-content-center">
                        {pregunta.pregunta_alternativa.map(alternativa => {
                            return <Button 
                                        variant={respuestas && respuestas.filter(respuesta => respuesta.codigo_pregunta === pregunta.codigo && respuesta.alternativa_select === alternativa.letra).length > 0 ? 'info' : 'outline-info'} 
                                        size="md" 
                                        className="mr-2"
                                        onClick={() => handleSetRespuesta(pregunta.codigo, alternativa.letra, alternativa_correcta, false)}
                                    >{alternativa.letra}</Button>
                        })}
                    </Col>
                    
                    <Col xs="3">       
                    
                        <Row>
                            <Col>
                                <Button 
                                    variant="secondary" 
                                    size="md"
                                    onClick={() => handleSetRespuesta(pregunta.codigo, '', alternativa_correcta, true)}
                                    block
                                >Omitir</Button>
                            </Col>
                            <Col>
                                <Button 
                                    variant="info" 
                                    size="md"
                                    onClick={() => handlePreguntaSiguiente(pregunta.codigo)}
                                    block
                                >{numero_pregunta_actual < total_preguntas - 1 ? 'Continuar' : 'Terminar'}</Button>
                            </Col>
                        </Row>
                    
                    </Col>
                
                </Row>
            </Col>
        </Row>
        }
        
        </Container>

     )
}
 
export default Pregunta