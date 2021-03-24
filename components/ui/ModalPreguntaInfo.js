import { useState, useEffect } from 'react';
import { Modal, Row, Col, Image, Badge, Alert, Button } from 'react-bootstrap'
import Logo from './Logo';

const ModalPreguntaInfo = ({pregunta, show, handleCloseModalPreguntaInfo}) => {

    const [indexSolucion, setIndexSolucion] = useState(0)
    const [indexPista, setIndexPista] = useState(0)

    const handleNextSolucion = () => {
        setIndexSolucion(indexSolucion + 1)
    }

    const handlePrevSolucion = () => {
        setIndexSolucion(indexSolucion - 1)
    }

    const handleNextPista = () => {
        setIndexPista(indexPista + 1)
    }

    const handlePrevPista = () => {
        setIndexPista(indexPista - 1)
    }

    
    let pistas = 0
    let soluciones = 0
    if(pregunta){
        pistas = pregunta.pregunta_pista.length
        if(pregunta.pregunta_pista.length === 1){
            pistas = 0
        }else if(pregunta.pregunta_pista.length > 1){
            pistas = pregunta.pregunta_pista.length - 1
        }

        soluciones = pregunta.pregunta_solucion.length
        if(pregunta.pregunta_solucion.length === 1){
            soluciones = 0
        }else if(pregunta.pregunta_solucion.length > 1){
            soluciones = pregunta.pregunta_solucion.length - 1
        }
    }        

    const handleCloseModal = () => {

        handleCloseModalPreguntaInfo()
        setIndexSolucion(0)
        setIndexPista(0)

    }

    if(!pregunta) return null

    return (
        <Modal 
            show={show} 
            size="xl"
            onHide={() => {}}
        >
            <Modal.Header>
                <div className="d-flex">
                    <Logo />
                    <h4 className="ml-2">Detalle Pregunta</h4> 
                </div>
                <Button 
                    variant="info"
                    onClick={handleCloseModal}
                >
                    Volver
                </Button>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <Alert className="mb-2" variant={"info"}>
                            <div className="d-flex align-items-center">
                                <h4 className="my-0">
                                    Modulos, Contenidos, Temas y Conceptos...
                                </h4>
                            </div>
                        </Alert>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex flex-wrap">
                        {pregunta.pregunta_modulos.map(pregunta_modulo => {
                            const { modulo } = pregunta_modulo
                            return (
                                <Badge 
                                    pill 
                                    variant="info"
                                    className="mr-1 mb-1"
                                >{modulo.descripcion}</Badge>
                            )
                        })}
                    </Col>    
                </Row>
                <Row>
                    <Col className="d-flex flex-wrap">
                        {pregunta.pregunta_modulo_contenidos.map(pregunta_modulo_contenido => {
                            const { modulo_contenido } = pregunta_modulo_contenido
                            return (
                                <Badge 
                                    variant="secondary"
                                    className="mr-1 mb-1"
                                >{modulo_contenido.descripcion}</Badge>
                            )
                        })}
                    </Col>    
                </Row>
                <Row>
                    <Col className="d-flex flex-wrap">
                        {pregunta.pregunta_modulo_contenido_temas.map(pregunta_modulo_contenido_tema => {
                            const { modulo_contenido_tema } = pregunta_modulo_contenido_tema
                            return (
                                <Badge 
                                    pill
                                    variant="info"
                                    className="mr-1 mb-1"
                                >{modulo_contenido_tema.descripcion}</Badge>
                            )
                        })}
                    </Col>    
                </Row>
                <Row>
                    <Col className="d-flex flex-wrap">
                        {pregunta.pregunta_modulo_contenido_tema_conceptos.map(pregunta_modulo_contenido_tema_concepto => {
                            const { modulo_contenido_tema_concepto } = pregunta_modulo_contenido_tema_concepto
                            return (
                                <Badge 
                                    variant="secondary"
                                    className="mr-1 mb-1"
                                >{modulo_contenido_tema_concepto.descripcion}</Badge>
                            )
                        })}
                    </Col>    
                </Row>
                <Row>
                    <Col>
                        <Alert className="mt-2 mb-1" variant={"info"}>
                            <div className="d-flex align-items-center">
                                <h4 className="my-0">
                                   Pregunta
                                </h4>
                            </div>
                        </Alert>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {pregunta.imagen.trim() !== '' &&
                            <Image 
                                src={pregunta.imagen} 
                                style={{width: '100%'}} 
                            />
                        }
                        {pregunta.audio.trim() !== '' &&
                            <audio 
                                style={{width: '100%'}}
                                controls
                            >
                                <source src={pregunta.audio.trim()} />
                            </audio>
                        }
                        {pregunta.video.trim() !== '' &&
                            <video 
                                style={{width: '100%'}}
                                controls
                            >
                                <source src={pregunta.video.trim()} />
                            </video>
                        }
                    </Col>
                </Row>  
                <Row className="mt-2">
                    <Col className="d-flex justify-content-center">
                        {pregunta.pregunta_alternativa.map( (alternativa, index) => {
                
                            const {letra, correcta} = alternativa

                            return (
                                <div
                                    key={index}
                                    className="mr-1"
                                >
                                    <button
                                        className={`btn ${correcta ? 'btn-info' : 'btn-outline-info'}`}
                                    >
                                        {letra}
                                    </button>
                                </div>
                            )
                        })}
                    </Col>
                </Row> 
                <Row>
                    <Col>
                        <Alert className="mt-2 mb-1 d-flex justify-content-between" variant={"info"}>
                            <div className="d-flex align-items-center">
                                <h4 className="my-0">
                                    Soluciones
                                </h4>
                            </div>
                            <div className="d-flex align-items-center">
                                <h5 className="my-0 mr-3">
                                    {`${pregunta.pregunta_solucion.length === 0 ? indexSolucion : indexSolucion + 1}/${pregunta.pregunta_solucion.length}`}
                                </h5>
                                <Button 
                                    variant="info"
                                    className="mr-2"
                                    onClick={handlePrevSolucion}
                                    disabled={indexSolucion === 0 ? true : false}
                                >{'<'}</Button>
                                
                                <Button
                                    variant="info"
                                    onClick={handleNextSolucion}
                                    disabled={indexSolucion === soluciones ? true : false}
                                >{'>'}</Button>
                            </div>
                        </Alert>
                    </Col>
                </Row>
                {(pregunta.pregunta_solucion.length > 0) &&
                    <Row>
                        <Col>
                            {pregunta.pregunta_solucion[indexSolucion].texto.trim() !== '' &&
                                <h6>{pregunta.pregunta_solucion[indexSolucion].texto}</h6>
                            }

                            {pregunta.pregunta_solucion[indexSolucion].imagen.trim() !== '' &&
                                <Image 
                                    src={pregunta.pregunta_solucion[indexSolucion].imagen} 
                                    style={{width: '100%'}}
                                />
                            }

                            {pregunta.pregunta_solucion[indexSolucion].audio.trim() !== '' &&
                                <audio 
                                    style={{width: '100%'}}
                                    controls
                                >
                                    <source 
                                        src={pregunta.pregunta_solucion[indexSolucion].audio.trim()} 
                                    />
                                </audio>
                            }

                            {pregunta.pregunta_solucion[indexSolucion].video.trim() !== '' &&
                                <video 
                                    style={{width: '100%'}}
                                    controls
                                >
                                    <source 
                                        src={pregunta.pregunta_solucion[indexSolucion].video.trim()} 
                                    />
                                </video>
                            }
                        </Col>
                    </Row>
                } 
                <Row>
                    <Col>
                        <Alert className="mt-2 mb-1 d-flex justify-content-between" variant={"info"}>
                            <div className="d-flex align-items-center">
                                <h4 className="my-0">
                                    Pistas
                                </h4>
                            </div>
                            <div className="d-flex align-items-center">
                                <h5 className="my-0 mr-3">
                                    {`${pregunta.pregunta_pista.length === 0 ? indexPista : indexPista + 1}/${pregunta.pregunta_pista.length}`}
                                </h5>
                                <Button 
                                    variant="info"
                                    className="mr-2"
                                    onClick={handlePrevPista}
                                    disabled={indexPista === 0 ? true : false}
                                >{'<'}</Button>
                                
                                <Button
                                    variant="info"
                                    onClick={handleNextPista}
                                    disabled={indexPista === pistas ? true : false}
                                >{'>'}</Button>
                            </div>
                        </Alert>
                    </Col>
                </Row>
                {(pregunta.pregunta_pista.length > 0) &&
                    <Row>
                        <Col>

                            {pregunta.pregunta_pista[indexPista].texto.trim() !== '' &&
                                <h6>{pregunta.pregunta_pista[indexPista].texto}</h6>
                            }

                            {pregunta.pregunta_pista[indexPista].imagen.trim() !== '' &&
                                <Image 
                                    src={pregunta.pregunta_pista[indexPista].imagen} 
                                    style={{width: '100%'}}
                                />
                            }

                            {pregunta.pregunta_pista[indexPista].audio.trim() !== '' &&
                                <audio 
                                    style={{width: '100%'}}
                                    controls
                                >
                                    <source 
                                        src={pregunta.pregunta_pista[indexPista].audio.trim()} 
                                    />
                                </audio>
                            }

                            {pregunta.pregunta_pista[indexPista].video.trim() !== '' &&
                                <video 
                                    style={{width: '100%'}}
                                    controls
                                >
                                    <source 
                                        src={pregunta.pregunta_pista[indexPista].video.trim()} 
                                    />
                                </video>
                            }
                        </Col>
                    </Row>
                }
            </Modal.Body>
        </Modal>
      );
}
 
export default ModalPreguntaInfo;