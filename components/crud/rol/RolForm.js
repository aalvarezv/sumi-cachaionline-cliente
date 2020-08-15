import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';


const rolForm = () => {
    return ( <Container>
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
                 <Form.Label>Descripcion</Form.Label>
                 <Form.Control
                     id="descripcion"
                     name="descripcion"
                     type="text" 
                     placeholder="Descripcion" 
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
 
export default rolForm;