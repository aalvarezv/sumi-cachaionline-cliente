import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import AuthContext from '../context/auth/AuthContext';
import { Formik } from "formik";
import LoginSchema from '../yup/LoginSchema';
import Layout from '../components/layout/Layout';


const Login = () => {

    const router = useRouter();

    const { autenticado, iniciarSesion } = useContext(AuthContext);
    
    useEffect(() => {
        if(autenticado){
            router.push('/');
        }
    }, [autenticado]);
    
    return ( 
        <Layout>
            <Container className="mt-5" fluid>
                <Row className="justify-content-sm-center">
                    <Col xl="3" lg="4" md="5" sm="10">
                        <Formik
                            initialValues={{ rut: "", clave: "" }}
                            validationSchema={LoginSchema}
                            onSubmit={ async (values, {resetForm}) => {
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                await iniciarSesion(values);               
                            }}
                        >
                        {({
                        values,
                        touched,
                        errors,
                        dirty,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        handleReset
                        }) => (
                            <>
                            <h4 className="mb-4 text-center">Iniciar Sesión</h4>
                            <Form
                                noValidate
                                onSubmit={handleSubmit}
                            > 
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>RUT</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        name="rut"
                                        placeholder="Ingresa tu RUT"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.rut}
                                        autoComplete="off"
                                        isInvalid={!!errors.rut}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.rut}
                                    </Form.Control.Feedback>
                                   
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Clave</Form.Label>
                                    <Form.Control 
                                        type="password"  
                                        name="clave"
                                        placeholder="Ingresa tu Clave"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.clave}
                                        autoComplete="off"
                                        isInvalid={!!errors.clave}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.clave}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Button 
                                    variant="info" 
                                    type="submit"
                                    block
                                >
                                    {isSubmitting ? 'Ingresando...' : 'Ingresar'}
                                </Button>
                            </Form>
                            </>
                        )}
                        </Formik>
                    </Col>
               </Row>
           </Container>
       </Layout>
    );
}
 
export default Login;
