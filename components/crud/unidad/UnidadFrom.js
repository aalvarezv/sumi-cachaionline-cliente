import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const UnidadForm = () => {
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
            <Form.Group>
            <Form.Label>Materia</Form.Label>
                <Form.Control
                    id="materia"
                    name="materia"
                    as="select"
                >
                    <option>SELECCIONE UNA MATERIA</option>
                    <option>MATEMÁTICAS</option>
                    <option>LENGUAJE Y COMUNICACIÓN</option>
                    <option>CIENCIAS</option>
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
 
export default UnidadForm;