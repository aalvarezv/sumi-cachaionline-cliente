import React from 'react';
import { Container, Row, Col, Form, Image } from 'react-bootstrap';
import { TiDelete } from 'react-icons/ti';
import { getBase64 } from '../../helpers';
import Uploader from './Uploader';
import { RiDeleteBin5Line } from 'react-icons/ri';


const SolucionPregunta = ({soluciones, errores, setSoluciones}) => { 


    const handleChangeTextoSolucion = (numero_solucion, texto) => {
        const new_soluciones = soluciones.map(solucion => solucion.numero === numero_solucion ? ({
            ...solucion,
            texto,
        }): solucion);
        setSoluciones(new_soluciones);
    } 
    
    const handleChangeImagenSolucion = (numero_solucion, base64) => {
        const new_soluciones = soluciones.map(solucion => solucion.numero === numero_solucion ? ({
            ...solucion,
            imagen: base64
        }): solucion);
        setSoluciones(new_soluciones);
    }

    const handleQuitarSolucion = (numero_solucion) => {
        //quita la solucion
        let new_soluciones = soluciones.filter(solucion => solucion.numero !== numero_solucion);
        //ordena los numeros de solucion en caso que se quite ejemplo el 2 cuando tengo [1, 2, 3]
        new_soluciones = new_soluciones.map((solucion, index) => (
            {
                ...solucion,
                numero: index + 1
            }
        ))
        setSoluciones(new_soluciones);
    }

    const handleQuitarImagen = (numero_solucion) => {
        const new_soluciones = soluciones.map(solucion => solucion.numero === numero_solucion ? ({
            ...solucion,
            imagen: ''
        }): solucion);
        setSoluciones(new_soluciones);
    }

    //funcion que recibe el componente Uploader donde retorna los archivos a subir.
    const getMultimediaSolucion = async  (numero_solucion, archivo) => {
        const base64 = await getBase64(archivo[0]);
        handleChangeImagenSolucion(numero_solucion, base64);
    }

    return (

        <Container className= {`border-bottom border-light mt-2`}>
         {soluciones.map((solucion) => {
            
            const {numero, texto, imagen} = solucion;
            
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
                        placeholder={`Solución ${numero}`}
                        value={texto}
                        onChange={e => {
                            handleChangeTextoSolucion(numero, e.target.value.toUpperCase());
                        }}
                        isInvalid={errores.length > 0 ? errores.filter(error => error.numero === numero).length > 0 : false}
                        // onBlur={validarFormulario}
                    />
                </Col>
                <Col>       
                    <Row>
                        <Col>
                            <Uploader 
                                titulo={"HAZ CLICK O ARRASTRA Y SUELTA UNA IMAGEN"}
                                index={numero}
                                getArchivos={getMultimediaSolucion}
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
                            handleQuitarSolucion(numero)
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

export default SolucionPregunta;
