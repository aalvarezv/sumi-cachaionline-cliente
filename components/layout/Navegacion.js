import React,{ useContext, useEffect } from 'react';
import Link from 'next/link';
import AuthContext from '../../context/auth/AuthContext';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';

const Navegacion = () => {

    const { usuario, autenticado, cerrarSesion } = useContext(AuthContext); 
    
    return ( 
        <Navbar  collapseOnSelect expand="lg" bg="white" text="light">
        <Navbar.Brand>
            <img
                src="/logo.png"
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
                <Link href="/" passHref>
                    <Nav.Link href="/materias">Materias</Nav.Link>
                </Link>
                {autenticado
                &&
                    <NavDropdown title="Administrar" id="basic-nav-dropdown">
                        <Link href="/administrar/materias" passHref>
                            <NavDropdown.Item href="/administrar/materias">Materias</NavDropdown.Item>
                        </Link>
                        <Link href="/administrar/modulos" passHref>
                            <NavDropdown.Item href="/administrar/modulos">Módulos</NavDropdown.Item>
                        </Link>
                        <Link href="/administrar/niveles-academicos" passHref>
                            <NavDropdown.Item href="/administrar/niveles-academicos">Niveles Académicos</NavDropdown.Item>
                        </Link>
                        <Link href="/administrar/roles" passHref>
                            <NavDropdown.Item href="/administrar/roles">Roles</NavDropdown.Item>
                        </Link>
                        <Link href="/administrar/unidades" passHref>
                            <NavDropdown.Item href="/administrar/unidades">Unidades</NavDropdown.Item>
                        </Link>
                        <Link href="/administrar/usuarios" passHref>
                            <NavDropdown.Item href="/administrar/usuarios">Usuarios</NavDropdown.Item>
                        </Link>
                        {/* <NavDropdown.Divider /> */}
                    </NavDropdown>
                }
            </Nav>
            <Nav>
                {autenticado
                ?   
                    <>
                        <h6 className="mt-2 mr-2">
                            {usuario.nombre}
                        </h6>
                        <Button 
                            variant="info"
                            onClick={() => cerrarSesion()}
                        >Cerrar Sesión</Button>
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