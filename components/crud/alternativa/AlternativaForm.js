import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const AlternativaForm = () => {
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
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                    id="descripcion"
                    name="descripcion"
                    type="text" 
                    placeholder="DESCRIPCIÓN" 
                />
            </Form.Group>
            <Form.Check 
                id="correcta"
                name="correcta"
                type="checkbox"
                label="¿Es correcta?"
                className="mb-3"
            />
            <Form.Group>
            <Form.Label>Pregunta</Form.Label>
                <Form.Control
                    id="pregunta"
                    name="pregunta"
                    as="select"
                >
                    <option>SELECCIONE UNA PREGUNTA</option>
                    <option>¿......?</option>
                </Form.Control>
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
 
export default AlternativaForm;