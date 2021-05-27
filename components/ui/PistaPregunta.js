import React from 'react'
import { Container, Row, Col, Form, Image } from 'react-bootstrap'
import { TiDelete } from 'react-icons/ti'
import { getBase64 } from '../../helpers'
import Uploader from './Uploader'
import { RiDeleteBin5Line } from 'react-icons/ri'


const PistaPregunta = ({pistas, errores, setPistas}) => { 


    const handleChangeTextoPista = (numero_pista, texto) => {
        const new_pistas = pistas.map(pista => pista.numero === numero_pista ? ({
            ...pista,
            texto,
        }): pista)
        setPistas(new_pistas)
    } 
    
    const handleChangeArchivoPista = (numero_pista, tipo_archivo, base64) => {
    
        const new_pistas = pistas.map(pista => {

            if(pista.numero === numero_pista){
                switch (tipo_archivo) {
                    case 'image':
                        return {
                            ...pista,
                            imagen: base64,
                            audio: '',
                            video: '',
                        }
                    case 'audio':
                        return {
                            ...pista,
                            imagen: '',
                            audio: base64,
                            video: '',
                        }
                    case 'video':
                        return {
                            ...pista,
                            imagen: '',
                            audio: '',
                            video: base64,
                        }
                }
            }else{
                return pista
            }  

        })
        
        setPistas(new_pistas)

    }

    const handleQuitarPista = (numero_pista) => {
        //quita la pista
        let new_pistas = pistas.filter(pista => pista.numero !== numero_pista)
        //ordena los numeros de pista en caso que se quite ejemplo el 2 cuando tengo [1, 2, 3]
        new_pistas = new_pistas.map((pista, index) => (
            {
                ...pista,
                numero: index + 1
            }
        ))
        setPistas(new_pistas)
    }

    const handleQuitarArchivo = (numero_pista) => {
        const new_pistas = pistas.map(pista => pista.numero === numero_pista ? ({
            ...pista,
            imagen: '',
            audio: '',
            video: '',
        }): pista)
        setPistas(new_pistas)
    }

    //funcion que recibe el componente Uploader donde retorna los archivos a subir.
    const getMultimediaPista = async  (numero_pista, archivo) => {
        const base64 = await getBase64(archivo[0])
        const tipo_archivo = archivo[0].type.split('/')[0]
        handleChangeArchivoPista(numero_pista, tipo_archivo, base64)
    }

    return (

        <Container className= {`border-bottom border-light mt-2`}>
        {pistas.map((pista) => {
            
            const {numero, texto, imagen, audio, video} = pista
    
            return (
            <Row
                key={numero}
                className={`
                    mb-3
                    ${errores.length > 0 
                        ? errores.filter(error => error.numero === numero).length > 0 ? 'text-danger' : 'text-secondary'
                        : 'text-secondary'
                    }
                `}  
            >
                <Col 
                    xs="auto"
                    className="d-flex justify-content-center"
                >
                    <h4>#{numero}</h4>
                </Col>
                <Col className="d-flex justify-content-center">
                    <Form.Control 
                        id="descripcion"
                        name="descripcion"
                        as="textarea" 
                        rows="3"
                        placeholder={`Pista ${numero}`}
                        value={texto}
                        onChange={e => {
                            handleChangeTextoPista(numero, e.target.value.toUpperCase())
                        }}
                        isInvalid={errores.length > 0 ? errores.filter(error => error.numero === numero).length > 0 : false}
                    />
                </Col>
                <Col className="d-flex justify-content-center">       
                    <Row>
                        <Col xs="auto" className="d-flex align-items-center">
                            <div
                                 style={{maxWidth: "150px", position:"relative"}}
                            >   
                                {imagen.trim() === '' && audio.trim() === '' && video.trim() === ''
                                ?
                                    <Image 
                                        src={'/static/img-pregunta.png'} 
                                        thumbnail
                                        style={{opacity: 0.5}}
                                    />
                                :
                                    null
                                }

                                {imagen.trim() !== '' &&
                                    <Image 
                                        src={imagen.trim()} 
                                        style={{background: 'black'}}
                                        thumbnail
                                    />
                                }
                                {audio.trim() !== '' &&
                                    <audio 
                                        style={{maxWidth: '100%'}}
                                        controls
                                    >
                                        <source src={audio.trim()} />
                                    </audio>
                                }
                                {video.trim() !== '' &&
                                    <video 
                                        style={{maxWidth: '100%'}}
                                        controls
                                    >
                                        <source src={video.trim()} />
                                    </video>
                                }

                                {imagen.trim() !== '' ||
                                 audio.trim() !== '' ||
                                 video.trim() !== ''
                                ?
                                    <span
                                        onClick={() => handleQuitarArchivo(numero)}
                                        style={{
                                            position: 'absolute', 
                                            top: -15, 
                                            right: -10,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <TiDelete 
                                            size={"1.2rem"} 
                                            color={"red"}
                                        />
                                    </span>
                                :
                                    null
                                }
                            </div>
                           
                        </Col>
                    </Row>  
                </Col>
                <Col className="d-flex justify-content-center p-0">
                    <Uploader 
                        titulo={"HAZ CLICK O ARRASTRA Y SUELTA UNA IMAGEN"}
                        index={numero}
                        getArchivos={getMultimediaPista}
                    />
                </Col>
                <Col 
                    xs="auto" 
                    className="d-flex justify-content-center  align-items-center"
                >
                    <a  href="#"
                        className="nav-link"
                        onClick={() => {
                            handleQuitarPista(numero)
                        }}
                    >
                        <RiDeleteBin5Line size={"1.5rem"} color={"red"}/>
                    </a>
                </Col>
            </Row>
        )
        })}
        </Container>
    )
}

export default PistaPregunta
