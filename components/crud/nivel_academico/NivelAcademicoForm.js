import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const NivelAcademicoForm = () => {
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
                    id="nombre"
                    name="nombre"
                    type="text" 
                    placeholder="DESCRIPCIÓN" 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Nivel</Form.Label>
                <Form.Control
                    id="nombre"
                    name="nombre"
                    type="text" 
                    placeholder="NIVEL" 
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
 
export default NivelAcademicoForm;