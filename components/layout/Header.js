import React,{ useContext, useEffect } from 'react';
import Link from 'next/link';
import AuthContext from '../../context/auth/AuthContext';
import { Navbar, Nav, Button } from 'react-bootstrap';

const Header = () => {

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
            </Nav>
            <Nav>
                {autenticado
                ?   
                    <>
                        <h6 className="mt-auto mr-2">
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
 
export default Header;