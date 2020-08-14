import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const ModuloForm = () => {
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
            <Form.Label>Unidad</Form.Label>
                <Form.Control
                    id="unidad"
                    name="unidad"
                    as="select"
                >
                    <option>SELECCIONE UNA UNIDAD</option>
                    <option>NÚMEROS</option>
                    <option>ALGEBRA</option>
                    <option>GEOMETRÍA</option>
                </Form.Control>
            </Form.Group>
            <Form.Group>
            <Form.Label>Nivel Academico</Form.Label>
                <Form.Control
                    id="nivel_academico"
                    name="nivel_academico"
                    as="select"
                >
                    <option>SELECCIONE UN NIVEL ACADEMICO</option>
                    <option>PRIMERO MEDIO</option>
                    <option>SEGUNDO MEDIO</option>
                    <option>TERCERO MEDIO</option>
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
 
export default ModuloForm;