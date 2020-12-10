import React, { useContext } from 'react';
import Layout from '../components/layout/Layout';
import AuthContext from '../context/auth/AuthContext';
import {Image, Button, Row, Col, Container} from 'react-bootstrap';
import Privado from '../components/layout/Privado';



const Test = () =>{

  const { autenticado } = useContext(AuthContext);

  return (
    // <Layout>
    // <Privado>
      <Container fluid>
      <Row >
        <Col  xs={12}>
          <Row>
          <Image src="/static/img-pregunta.jpg" style={{width: '100%'}} fluid />
          </Row>
          <Row className="mt-2">
            <Col>
              <Row className="d-flex justify-content-around">
                <Button variant="outline-info" size="sm">A</Button>
                <Button variant="outline-info" size="sm">B</Button>  
                <Button variant="outline-info" size="sm">C</Button>
                <Button variant="outline-info" size="sm">D</Button>  
                <Button variant="outline-info" size="sm">E</Button>
              </Row>
            </Col>
            <Col>
              <Row className="d-flex justify-content-center">
                  <Button variant="warning" className="mr-1" size="sm">Pistas</Button>
                  <Button variant="success" size="sm">Solución</Button>
              </Row>
            </Col>
            <Col>
                <Row className="d-flex justify-content-end">
                    <Button variant="secondary" className="mr-1" size="sm">Omitir</Button>
                    <Button variant="info" size="sm">Continuar</Button>
                </Row>
            </Col>
            
          </Row> 
      </Col>
     
      </Row>
      </Container>
    // </Privado>
    // </Layout>
  );
}

export default Test;