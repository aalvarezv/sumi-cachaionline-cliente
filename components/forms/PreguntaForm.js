import React from 'react';
import { Container, Row, Col, Form, 
        Accordion, Card, Image, Button } from 'react-bootstrap';
import Uploader from '../ui/Uploader';


const PreguntaForm = () => {


    //funcion que recibe el componente Uploader donde retorna los archivos a subir.
    const getArchivos = async archivos => {
    
        const base64 = await getBase64(archivos[0]);
        setFormulario({
            ...formulario,
            imagen: base64
        })

    }

    return ( 
    <Container>

        <Row>
            <Col sm={8}>
                <Form.Group>
                    <Form.Control 
                        id="descripcion"
                        name="descripcion"
                        as="textarea" 
                        rows="3"
                        placeholder="PREGUNTA"
                        //value={formulario.descripcion}
                        // onChange={e => {
                        //     setFormulario({
                        //         ...formulario,
                        //         [e.target.name]: e.target.value.toUpperCase()
                        //     })
                        // }}
                        // isInvalid={errores.hasOwnProperty('descripcion')}
                        // onBlur={validarFormulario}
                    />
                    <Form.Control.Feedback type="invalid">
                        {/* {errores.hasOwnProperty('descripcion') && errores.descripcion} */}
                    </Form.Control.Feedback>
                </Form.Group>
            </Col>
            <Col sm={2}>
                Opción Función Matemática.
            </Col>
            <Col sm={2}>
                Modal Carga Imagen.
            </Col>
        </Row>
                {/* <Form.Group as={Row}>
                    <Col>
                        <Image 
                            //src={formulario.imagen.trim() === '' ? '/static/no-image.png' : formulario.imagen.trim()} 
                            thumbnail
                        />
                    </Col>    
                    <Col md={9}>
                        <Uploader 
                            titulo={"HAZ CLICK O ARRASTRA Y SUELTA UNA IMAGEN"}
                            getArchivos={getArchivos}
                        />
                    </Col>
                </Form.Group>         */}
            
       
                 
          
       {/* <Form>
            <Form.Group>
                <Form.Label>Codigo</Form.Label>
                <Form.Control 
                    id="codigo"
                    name="codigo"
                    type="text" 
                    placeholder="CODIGO" 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Pregunta</Form.Label>
                <Form.Control
                    id="pregunta"
                    name="pregunta"
                    type="text" 
                        placeholder="¿...........?" 
                />
            </Form.Group>
            <Form.Group>
                <Form.File 
                    id="pregunta_imagen" 
                    label="Imagen de la pregunta" 
                />
            </Form.Group>
            <Form.Group>
                <Form.File 
                    id="pregunta_audio" 
                    label="Audio de la pregunta" 
                />
            </Form.Group>
            <Form.Group>
                <Form.File 
                    id="pregunta_video" 
                    label="Video de la pregunta" 
                />
            </Form.Group>   
            <Form.Group>
                <Form.Label>Respuesta</Form.Label>
                <Form.Control
                    id="respuesta"
                    name="respuesta"
                    type="text" 
                        placeholder="......" 
                />
            </Form.Group> 
            <Form.Group>
                <Form.File 
                    id="respuesta_imagen" 
                    label="Imagen de la respuesta" 
                />
            </Form.Group> 
            <Form.Group>
                <Form.File 
                    id="respuesta_audio" 
                    label="Audio de la respuesta" 
                />
            </Form.Group>  
            <Form.Group>
                <Form.File 
                    id="respuesta_video" 
                    label="Video de la respuesta" 
                />
            </Form.Group>       
            <Form.Check 
                    id="inactivo"
                    name="inactivo"
                    type="checkbox"
                    label="Inactivo"
                    className="mb-3"
            />
            <Button variant="info">Aceptar</Button>
        </Form> */}
    </Container> );
}
 
export default PreguntaForm;