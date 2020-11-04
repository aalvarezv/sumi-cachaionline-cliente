import React,{ useContext, useEffect } from 'react';
import Link from 'next/link';
import AuthContext from '../../context/auth/AuthContext';
import { Navbar, Nav, Button, NavDropdown, Dropdown, Row, Col, Image } from 'react-bootstrap';
import { has } from 'lodash';

const Navegacion = () => {

    const { usuario, autenticado, cerrarSesion } = useContext(AuthContext); 
    
    return ( 
        <Navbar collapseOnSelect expand="lg" bg="white" text="light">
        <Navbar.Brand>
            <img
                src="/static/logo.png"
                width="30"
                height="24"
                className="d-inline-block align-top mr-1"
                alt="CachaiOnline"
            />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
                <Link href="/" passHref>
                    <Nav.Link className="text-info">CachaiOnline</Nav.Link>
                </Link>
                {/* <Link href="/" passHref>
                    <Nav.Link href="/materias">Materias</Nav.Link>
                </Link> */}
                {autenticado
                && 
                <> 
                    <NavDropdown title="Administrar" id="administrar-nav-dropdown">
                        <Link href="/administrar/instituciones" passHref>
                            <NavDropdown.Item>Instituciones</NavDropdown.Item>
                        </Link>
                        <Link href="/administrar/niveles-academicos" passHref>
                            <NavDropdown.Item>Niveles Académicos</NavDropdown.Item>
                        </Link>
                        <Link href="/administrar/roles" passHref>
                            <NavDropdown.Item>Roles</NavDropdown.Item>
                        </Link>
                        <Link href="/administrar/usuarios" passHref>
                            <NavDropdown.Item>Usuarios</NavDropdown.Item>
                        </Link>
                    </NavDropdown>
                    <NavDropdown title="Asignaturas" id="asignaturas-nav-dropdown">
                        <Link href="/administrar/materias" passHref>
                            <NavDropdown.Item>Materias</NavDropdown.Item>
                        </Link>
                        <Link href="/administrar/unidades" passHref>
                            <NavDropdown.Item>Unidades</NavDropdown.Item>
                        </Link>
                        <Link href="/administrar/modulos" passHref>
                            <NavDropdown.Item>Módulos</NavDropdown.Item>
                        </Link>
                    </NavDropdown>
                    <Link href="/administrar/preguntas" passHref>
                        <Nav.Link>Preguntas</Nav.Link>
                    </Link>
                    <Link href="/administrar/rings" passHref>
                        <Nav.Link>Rings</Nav.Link>
                    </Link>
                    
                    </>
                }
            </Nav>
            <Nav>
                {autenticado
                ?   
                    <>
                       
                        <Row>
                            <Col className="d-flex flex-column align-items-center">
                                <Row>
                                    <Image src="holder.js/171x180" style={{width: 25, height: 25}} roundedCircle />
                                </Row>
                                <Row>
                                <small className="mt-2 mr-2">
                                    {usuario.nombre}
                                </small>
                                </Row>
                                <Row>
                                    <Button 
                                            variant="info"
                                            size="sm"
                                            onClick={() => cerrarSesion()}
                                        >Cerrar Sesión
                                    </Button>
                                </Row>
                            </Col>
                        </Row>
                        {/* <Col xs={6} md={4}>
                       
                        </Col> */}
                       
                    </>
                :   
                    <Link href="/login" passHref>
                        <Button variant="outline-info">Iniciar Sesión</Button>
                    </Link>
                }
            </Nav>
        </Navbar.Collapse>
        </Navbar>
     );
}
 
export default Navegacion;