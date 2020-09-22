import React, { useContext } from 'react';
import ListSelectCursoModulos from '../components/ui/ListSelectCursoModulos';
import Layout from '../components/layout/Layout';
import AuthContext from '../context/auth/AuthContext';
import {InputGroup, Form, Button, FormControl, Row, Col} from 'react-bootstrap';
import InputSelectRol from '../components/ui/InputSelectRol';

const Test = () => {

    const { autenticado } = useContext(AuthContext);
    
    return (   
       
        <Layout>
             <Form.Group>
                <Row>
                    <Col xs={9}>
                        <Form.Label>Unidad</Form.Label>
                    </Col>
                    <Col xs={3}>
                    </Col>
                </Row>
                
                <Row>
                    <Col xs={9}>
                        <InputSelectRol
                            id="codigo_rol"
                            name="codigo_rol"
                            as="select"
                        />
                        <Form.Control.Feedback type="invalid">
                            
                        </Form.Control.Feedback>
                    
                    </Col>
                    <Col xs={3} >
                        <Button 
                            variant="outline-success"
                            onClick={()=>{
                                router.push('/administrar/roles')
                            }}
                            size="md"
                            block
                        >+</Button>
                    </Col>
                </Row>
            </Form.Group>
        </Layout>
        
    
    );
}
 
export default Test;