import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap'
import AuthContext from '../context/auth/AuthContext'
import { Formik } from "formik"
import LoginSchema from '../yup/LoginSchema'
import Layout from '../components/layout/Layout'
import Logo from '../components/ui/Logo'



const Login = () => {

    const router = useRouter()

    const { autenticado, iniciarSesion } = useContext(AuthContext)
    
    useEffect(() => {
        //si está autenticado envía al HOME
        if(autenticado){
            router.push('/')
        }
    }, [autenticado])
    

    return ( 
        <Layout>
            <Container className="mt-5">
           
                <Row className="justify-content-sm-center">
                    <Col sm={8} md={6} lg={5} xl={4}>
                        <Card style={{ width: 'auto' }}>
                        <Card.Body>
                            <Formik
                                initialValues={{ rut: "", clave: "" }}
                                validationSchema={LoginSchema}
                                onSubmit={ (values, {resetForm}) => {
                                    //await new Promise(resolve => setTimeout(resolve, 1000))
                                    iniciarSesion(values)               
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
                                <Row className="mb-3">
                                    <Col className="d-flex justify-content-center">
                                        <Logo w={36} h={30} />
                                    </Col>
                                </Row>
                                <h4 className="mb-4 text-center">Iniciar Sesión</h4>
                                <Form
                                    noValidate
                                    onSubmit={handleSubmit}
                                > 
                                    <Form.Group>
                                        <Form.Label>RUT</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            name="rut"
                                            placeholder="Ingresa tu RUT"
                                            className="text-center"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.rut}
                                            autoComplete="off"
                                            isInvalid={!!errors.rut}
                                        />                                   
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Clave</Form.Label>
                                        <Form.Control 
                                            type="password"  
                                            name="clave"
                                            placeholder="Ingresa tu Clave"
                                            className="text-center"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.clave}
                                            autoComplete="off"
                                            isInvalid={!!errors.clave}
                                        />
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
                        </Card.Body>
                        </Card>
                    </Col>
               </Row>
            
            </Container>
       </Layout>
    )
}
 
export default Login
