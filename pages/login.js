import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap'
import AuthContext from '../context/auth/AuthContext'
import { toast } from 'react-toastify'
import Layout from '../components/layout/Layout'
import Logo from '../components/ui/Logo'
import Link from 'next/link'



const Login = () => {

    const router = useRouter()
    const { autenticado, iniciarSesion } = useContext(AuthContext)
    const [formulario, setFormulario] = useState({ 
        rut: '', 
        clave: '' 
    })

    const { rut, clave } = formulario

    useEffect(() => {
        if(autenticado){
            router.push('/')
        }
    }, [autenticado])


    const handleIngresar = () => {

        if(rut.trim() === ''){
            toast.error('Ingrese RUT', {containerId: 'sys_msg'})
            return
        }
        if(clave.trim() === ''){
            toast.error('Ingrese Clave', {containerId: 'sys_msg'})
            return
        }

        iniciarSesion(formulario)   

    }

    return ( 
        <Layout>
            <Container className="mt-5">
                <Row className="justify-content-sm-center">
                    <Col sm={8} md={6} lg={5} xl={4}>
                        <Card>
                        <Card.Body>
                            <Row className="mb-3">
                                <Col className="d-flex justify-content-center">
                                    <Logo w={36} h={30} />
                                </Col>
                            </Row>
                            <h4 className="mb-4 text-center">Iniciar Sesión</h4>
                            <Form.Group>
                                <Form.Label>RUT</Form.Label>
                                <Form.Control 
                                    type="text"
                                    name="rut"
                                    placeholder="Ingresa tu RUT"
                                    className="text-center" 
                                    value={rut}
                                    onChange={e => setFormulario({
                                        ...formulario,
                                        [e.target.name]: e.target.value
                                    })}
                                    autoComplete="off"
                                />                                   
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Clave</Form.Label>
                                <Form.Control 
                                    type="password"  
                                    name="clave"
                                    placeholder="Ingresa tu Clave"
                                    className="text-center"
                                    value={clave}
                                    onChange={e => setFormulario({
                                        ...formulario,
                                        [e.target.name]: e.target.value
                                    })}
                                    
                                    autoComplete="off"
                                />
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Button 
                                        variant="info" 
                                        className="mb-2"
                                        block
                                        onClick={handleIngresar}
                                    >
                                        Ingresar
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="d-flex justify-content-center">
                                    <Link href="/recupera-clave">
                                        <a>Olvide mi contraseña</a>
                                    </Link>
                                </Col>
                            </Row>
                        </Card.Body>
                        </Card>
                    </Col>
               </Row>
            </Container>
       </Layout>
    )
}
 
export default Login
