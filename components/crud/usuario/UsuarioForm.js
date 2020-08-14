import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const UsuarioForm = () => {
    return ( 
    <Container>
       <Form>
            <Form.Group>
                <Form.Label>Rut</Form.Label>
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
                    id="nombre"
                    name="nombre"
                    type="text" 
                    placeholder="NOMBRE COMPLETO" 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control 
                    id="email"
                    name="email"
                    type="email" 
                    placeholder="TU.EMAIL@GMAIL.COM" 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control 
                    id="telefono"
                    name="telefono"
                    type="tel" 
                    placeholder="(+56)945678323" 
                />
            </Form.Group>
            <Form.Group>
            <Form.Label>Rol</Form.Label>
                <Form.Control
                    id="rol"
                    name="rol"
                    as="select"
                >
                    <option>SELECCIONE UN ROL</option>
                    <option>ADMINISTRADOR</option>
                    <option>ALUMNO</option>
                    <option>PROFESOR</option>
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