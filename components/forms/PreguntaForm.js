import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const MateriaForm = () => {
    return ( 
    <Container>
       <Form>
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
        </Form>
    </Container> );
}
 
export default MateriaForm;