import React, { useState } from 'react'
import { Alert, Badge, Button, Col, Container, Image, Row } from 'react-bootstrap'


const PreguntaInfo = ({pregunta}) => {

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

    if(!pregunta) return null

    return (  
        <Container>
            <Row>
                <Col>
                    <Alert className="mb-2" variant={"secondary"}>
                        <h6 className="my-0">
                            Modulos, Contenidos, Temas y Conceptos...
                        </h6>
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col className="d-flex flex-wrap">
                    {pregunta.pregunta_modulos.map(pregunta_modulo => {
                        const { modulo } = pregunta_modulo
                        return (
                            <Badge 
                                key={modulo.codigo}
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
                                key={modulo_contenido.codigo}
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
                                key={modulo_contenido_tema.codigo}
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
                                key={modulo_contenido_tema_concepto.codigo}
                                variant="secondary"
                                className="mr-1 mb-1"
                            >{modulo_contenido_tema_concepto.descripcion}</Badge>
                        )
                    })}
                </Col>    
            </Row>
            <Row>
                <Col>
                    <Alert className="mt-2 mb-1" variant={"secondary"}>
                        <h6 className="my-0">
                            Pregunta
                        </h6>
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col className="text-center">
                    {pregunta.imagen.trim() !== '' &&
                        <Image 
                            src={pregunta.imagen} 
                            style={{width: '300px', background: 'black'}} 
                        />
                    }
                    {pregunta.audio.trim() !== '' &&
                        <audio 
                            style={{width: '500px'}}
                            controls
                        >
                            <source src={pregunta.audio.trim()} />
                        </audio>
                    }
                    {pregunta.video.trim() !== '' &&
                        <video 
                            style={{width: '500px'}}
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
                    <Alert className="mt-2 mb-1 d-flex justify-content-between" variant={"secondary"}>
                        <div className="d-flex align-items-center">
                            <h6 className="my-0">
                                Soluciones
                            </h6>
                        </div>
                        <div className="d-flex align-items-center">
                            <h6 className="my-0 mr-3">
                                {`${pregunta.pregunta_solucion.length === 0 ? indexSolucion : indexSolucion + 1}/${pregunta.pregunta_solucion.length}`}
                            </h6>
                            <Button 
                                variant="info"
                                className="mr-2"
                                size="sm"
                                onClick={handlePrevSolucion}
                                disabled={indexSolucion === 0 ? true : false}
                            >{'<'}</Button>
                            
                            <Button
                                variant="info"
                                size="sm"
                                onClick={handleNextSolucion}
                                disabled={indexSolucion === soluciones ? true : false}
                            >{'>'}</Button>
                        </div>
                    </Alert>
                </Col>
            </Row>
            {(pregunta.pregunta_solucion.length > 0) &&
                <Row>
                    <Col className="d-flex justify-content-center">
                        {pregunta.pregunta_solucion[indexSolucion].texto.trim() !== '' &&
                            <h6>{pregunta.pregunta_solucion[indexSolucion].texto}</h6>
                        }

                        {pregunta.pregunta_solucion[indexSolucion].imagen.trim() !== '' &&
                            <Image 
                                src={pregunta.pregunta_solucion[indexSolucion].imagen} 
                                style={{width: '300px', background: 'black'}}
                            />
                        }

                        {pregunta.pregunta_solucion[indexSolucion].audio.trim() !== '' &&
                            <audio 
                                style={{width: '500px'}}
                                controls
                            >
                                <source 
                                    src={pregunta.pregunta_solucion[indexSolucion].audio.trim()} 
                                />
                            </audio>
                        }

                        {pregunta.pregunta_solucion[indexSolucion].video.trim() !== '' &&
                            <video 
                                style={{width: '500px'}}
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
                    <Alert className="mt-2 mb-1 d-flex justify-content-between" variant={"secondary"}>
                        <div className="d-flex align-items-center">
                            <h6 className="my-0">
                                Pistas
                            </h6>
                        </div>
                        <div className="d-flex align-items-center">
                            <h6 className="my-0 mr-3">
                                {`${pregunta.pregunta_pista.length === 0 ? indexPista : indexPista + 1}/${pregunta.pregunta_pista.length}`}
                            </h6>
                            <Button 
                                variant="info"
                                size="sm"
                                className="mr-2"
                                onClick={handlePrevPista}
                                disabled={indexPista === 0 ? true : false}
                            >{'<'}</Button>
                            
                            <Button
                                variant="info"
                                size="sm"
                                onClick={handleNextPista}
                                disabled={indexPista === pistas ? true : false}
                            >{'>'}</Button>
                        </div>
                    </Alert>
                </Col>
            </Row>
            {(pregunta.pregunta_pista.length > 0) &&
                <Row>
                    <Col className="d-flex justify-content-center text-center">

                        {pregunta.pregunta_pista[indexPista].texto.trim() !== '' &&
                            <h6>{pregunta.pregunta_pista[indexPista].texto}</h6>
                        }

                        {pregunta.pregunta_pista[indexPista].imagen.trim() !== '' &&
                            <Image 
                                src={pregunta.pregunta_pista[indexPista].imagen} 
                                style={{width: '300px', background: 'black'}}
                            />
                        }

                        {pregunta.pregunta_pista[indexPista].audio.trim() !== '' &&
                            <audio 
                                style={{width: '500px'}}
                                controls
                            >
                                <source 
                                    src={pregunta.pregunta_pista[indexPista].audio.trim()} 
                                />
                            </audio>
                        }

                        {pregunta.pregunta_pista[indexPista].video.trim() !== '' &&
                            <video 
                                style={{width: '500px'}}
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
        </Container>

    );
}
 
export default PreguntaInfo;