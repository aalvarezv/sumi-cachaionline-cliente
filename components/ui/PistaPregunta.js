import React from 'react';
import { Container, Row, Col, Form, Image } from 'react-bootstrap';
import { TiDelete } from 'react-icons/ti';
import { getBase64 } from '../../helpers';
import Uploader from './Uploader';
import { RiDeleteBin5Line } from 'react-icons/ri';


const PistaPregunta = ({pistas, errores, setPistas}) => { 


    const handleChangeTextoPista = (numero_pista, texto) => {
        const new_pistas = pistas.map(pista => pista.numero === numero_pista ? ({
            ...pista,
            texto,
        }): pista);
        setPistas(new_pistas);
    } 
    
    const handleChangeImagenPista = (numero_pista, base64) => {
        const new_pistas = pistas.map(pista => pista.numero === numero_pista ? ({
            ...pista,
            imagen: base64
        }): pista);
        setPistas(new_pistas);
    }

    const handleQuitarPista = (numero_pista) => {
        //quita la pista
        let new_pistas = pistas.filter(pista => pista.numero !== numero_pista);
        //ordena los numeros de pista en caso que se quite ejemplo el 2 cuando tengo [1, 2, 3]
        new_pistas = new_pistas.map((pista, index) => (
            {
                ...pista,
                numero: index + 1
            }
        ))
        setPistas(new_pistas);
    }

    const handleQuitarImagen = (numero_pista) => {
        const new_pistas = pistas.map(pista => pista.numero === numero_pista ? ({
            ...pista,
            imagen: ''
        }): pista);
        setPistas(new_pistas);
    }

    //funcion que recibe el componente Uploader donde retorna los archivos a subir.
    const getMultimediaPista = async  (numero_pista, archivo) => {
        const base64 = await getBase64(archivo[0]);
        handleChangeImagenPista(numero_pista, base64);
    }

    return (

        <Container className= {`border-bottom border-light mt-2`}>
        {pistas.map((pista) => {

            const {numero, texto, imagen} = pista;
    
            return (
            <Row
                key={numero}
                className={`d-flex align-items-center mb-3
                    ${errores.length > 0 
                        ? errores.filter(error => error.numero === numero).length > 0 ? 'text-danger' : 'text-secondary'
                        : 'text-secondary'
                    }
                `}  
            >
                <Col 
                    xs="auto"
                >
                    <h4>#{numero}</h4>
                </Col>
                <Col>
                    <Form.Control 
                        id="descripcion"
                        name="descripcion"
                        as="textarea" 
                        rows="3"
                        placeholder={`Pista ${numero}`}
                        value={texto}
                        onChange={e => {
                            handleChangeTextoPista(numero, e.target.value.toUpperCase());
                        }}
                        isInvalid={errores.length > 0 ? errores.filter(error => error.numero === numero).length > 0 : false}
                    />
                </Col>
                <Col>       
                    <Row>
                        <Col>
                            <Uploader 
                                titulo={"HAZ CLICK O ARRASTRA Y SUELTA UNA IMAGEN"}
                                index={numero}
                                getArchivos={getMultimediaPista}
                            />
                        </Col>
                        <Col xs="auto">
                            <div
                                 style={{width: 86, position:"relative"}}
                            >
                                <Image 
                                    src={imagen.trim() === '' ? '/static/no-image.png' : imagen.trim()} 
                                    thumbnail
                                />
                                {imagen.trim() !== '' &&
                                    <span
                                        onClick={() => handleQuitarImagen(numero)}
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
                                }
                            </div>
                           
                        </Col>
                    </Row>  
                </Col>
                <Col 
                    xs="auto" 
                >
                    <a  href="#"
                        className="nav-link"
                        onClick={() => {
                            handleQuitarPista(numero)
                        }}
                    >
                        <RiDeleteBin5Line size={"1.5rem"} color={"gray"}/>
                    </a>
                </Col>
            </Row>
        )
        })}
        </Container>
    )
}

export default PistaPregunta;
