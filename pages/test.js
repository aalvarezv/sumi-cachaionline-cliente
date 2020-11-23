import React, { useContext, useState } from 'react';
//import ListSelectCursoModulos from '../components/ui/ListSelectCursoModulos';
import Layout from '../components/layout/Layout';
import AuthContext from '../context/auth/AuthContext';
import {InputGroup, Form, Button, FormControl, Row, Col, div, Modal} from 'react-bootstrap';
//import InputSelectRol from '../components/ui/InputSelectRol';
//import TableRing from '../components/ui/TableRing';
import Privado from '../components/layout/Privado';
//import InputSelectModuloContenidoTemaConcepto from '../components/ui/InputSelectModuloContenidoTemaConcepto';
//import InputSelectModuloContenidoTema from '../components/ui/InputSelectModulosContenidoTema';
import InputSelectTipoDuracionPregunta from '../components/ui/InputSelectTipoDuracionPregunta';
import TableUsuarios from '../components/ui/TableUsuario';


/* const Test = () => {

    const { autenticado } = useContext(AuthContext);
        
        
        return ( 
          <TableUsuarios/>
        );
}

export default Test;  */


const Test = () =>{

  const { autenticado } = useContext(AuthContext);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Layout>
    <Privado
      propiedad="bla bla"
    >
     
      <Button variant="primary" onClick={handleShow}>
        Abrir Modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Test Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body><TableUsuarios/></Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

</Privado>
</Layout>
  );
}


//Preguntarle al alan para que sirve la siguiente sentencia.
//render(<Example />);

export default Test;