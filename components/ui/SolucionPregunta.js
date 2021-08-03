import React from 'react'
import { Container, Row, Col, Form, Image } from 'react-bootstrap'
import { TiDelete } from 'react-icons/ti'
import { getBase64, getMeta } from '../../helpers'
import Uploader from './Uploader'
import { RiDeleteBin5Line } from 'react-icons/ri'


const SolucionPregunta = ({soluciones, errores, setSoluciones}) => { 


    const handleChangeTextoSolucion = (numero_solucion, texto) => {
        const new_soluciones = soluciones.map(solucion => solucion.numero === numero_solucion ? ({
            ...solucion,
            texto,
        }): solucion)
        setSoluciones(new_soluciones)
    } 
    
    const handleChangeArchivoSolucion = async (numero_solucion, tipo_archivo, base64) => {

        let newSoluciones = []
        for(let solucion of soluciones){

            if(solucion.numero === numero_solucion){
                switch (tipo_archivo) {
                    case 'image':
                        const meta = await getMeta(base64)
                        newSoluciones.push({
                            ...solucion,
                            imagen: base64,
                            imagen_ancho: meta.width,
                            imagen_alto: meta.height,
                            audio: '',
                            video: '',
                        })
                        break
                    case 'audio':
                        newSoluciones.push({
                            ...solucion,
                            imagen: '',
                            imagen_ancho: 0,
                            imagen_alto: 0,
                            audio: base64,
                            video: '',
                        })
                        break
                    case 'video':
                        newSoluciones.push({
                            ...solucion,
                            imagen: '',
                            imagen_ancho: 0,
                            imagen_alto: 0,
                            audio: '',
                            video: base64,
                        })
                        break
                }
            }else{
                newSoluciones.push(solucion)
            }

        }

        setSoluciones(newSoluciones)

    }

    const handleQuitarSolucion = (numero_solucion) => {
        //quita la solucion
        let new_soluciones = soluciones.filter(solucion => solucion.numero !== numero_solucion)
        //ordena los numeros de solucion en caso que se quite ejemplo el 2 cuando tengo [1, 2, 3]
        new_soluciones = new_soluciones.map((solucion, index) => (
            {
                ...solucion,
                numero: index + 1
            }
        ))
        setSoluciones(new_soluciones)
    }

    const handleQuitarArchivo = (numero_solucion) => {
        const new_soluciones = soluciones.map(solucion => solucion.numero === numero_solucion ? ({
            ...solucion,
            imagen: '',
            imagen_ancho: 0,
            imagen_alto: 0,
            audio: '',
            video: '',
        }): solucion)
        setSoluciones(new_soluciones)
    }

    //funcion que recibe el componente Uploader donde retorna los archivos a subir.
    const getMultimediaSolucion = async  (numero_solucion, archivo) => {
        const base64 = await getBase64(archivo[0])
        const tipo_archivo = archivo[0].type.split('/')[0]
        handleChangeArchivoSolucion(numero_solucion, tipo_archivo, base64)
    }

    return (

        <Container className= {`border-bottom border-light mt-2`}>
         {soluciones.map((solucion) => {
            
            const {codigo, numero, texto, imagen, video, audio} = solucion
            
            return (
            <Row
                key={codigo}
                //d-flex align-items-center mb-3
                className={` mb-3
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
                <Col
                    className="d-flex justify-content-center"
                >
                    <Form.Control 
                        id="descripcion"
                        name="descripcion"
                        as="textarea" 
                        rows="3"
                        placeholder={`Solución ${numero}`}
                        value={texto}
                        onChange={e => {
                            handleChangeTextoSolucion(numero, e.target.value)
                        }}
                        isInvalid={errores.length > 0 ? errores.filter(error => error.numero === numero).length > 0 : false}
                        // onBlur={validarFormulario}
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
                                        style={{opacity: 0.5}} 
                                        thumbnail
                                    />
                                :
                                    null
                                }
                                
                                {imagen.trim() !== '' &&
                                    <Image 
                                        src={imagen.trim() === '' ? '/static/no-image.png' : imagen.trim()} 
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
                        formatosValidos={["image/*","audio/*","video/*"]}
                        getArchivos={getMultimediaSolucion}
                    />
                </Col>
                <Col 
                    xs="auto" 
                    className="d-flex justify-content-center align-items-center"
                >
                    <a  href="#"
                        className="nav-link"
                        onClick={() => {
                            handleQuitarSolucion(numero)
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

export default SolucionPregunta
