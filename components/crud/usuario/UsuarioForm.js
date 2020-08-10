import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const UsuarioForm = () => {
    return ( 
    <Container>
       <Form>
            <Form.Group>
                <Form.Label>RUT</Form.Label>
                <Form.Control 
                    id="rut"
                    name="rut"
                    type="text" 
                    placeholder="RUT" 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                    id="rut"
                    name="rut"
                    type="text" 
                    placeholder="Nombre Completo" 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control 
                    id="email"
                    name="email"
                    type="email" 
                    placeholder="tu.email@ejemplo.com" 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control 
                    id="telefono"
                    name="telefono"
                    type="tel" 
                    placeholder="" 
                />
            </Form.Group>
            <Form.Group>
            <Form.Label>ROL</Form.Label>
                <Form.Control
                    id="rol"
                    name="rol"
                    as="select"
                >
                    <option>1</option>
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
 
export default UsuarioForm;