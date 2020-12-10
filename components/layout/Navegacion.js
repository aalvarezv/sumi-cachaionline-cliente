import React,{ useContext, useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';
import AuthContext from '../../context/auth/AuthContext';
import MenuInstitucionPerfil from './MenuInstitucionPerfil';
import { Navbar, Nav, Button, NavDropdown,  Row, Col } from 'react-bootstrap';

const Navegacion = () => {

    const { usuario, autenticado, rol, cerrarSesion} = useContext(AuthContext);

    const [permisos_menu, setPermisosMenu] = useState({
        ver_menu_administrar: false,
        ver_submenu_instituciones:false,
        ver_submenu_niveles_academicos:false,
        ver_submenu_roles:false,
        ver_submenu_usuarios:false,
        ver_menu_asignaturas:false,
        ver_submenu_materias:false,
        ver_submenu_unidades:false,
        ver_submenu_modulos:false,
        ver_submenu_temas:false,
        ver_submenu_conceptos:false,
        ver_menu_preguntas:false,
        ver_menu_rings:false,
    })

    useEffect(() => {
        if(rol){
            setPermisosMenu(rol);
        }
    },[rol]);

    

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
                {autenticado
                && 
                <> 
                    { permisos_menu.ver_menu_administrar &&  
                        <NavDropdown title="Administrar" id="administrar-nav-dropdown">
                            {permisos_menu.ver_submenu_instituciones &&
                                <Link href="/administrar/instituciones" passHref>
                                    <NavDropdown.Item>Instituciones</NavDropdown.Item>
                                </Link>
                            }
                            {permisos_menu.ver_submenu_niveles_academicos &&
                                <Link href="/administrar/niveles-academicos" passHref>
                                    <NavDropdown.Item>Niveles Académicos</NavDropdown.Item>
                                </Link>
                            }
                            {permisos_menu.ver_submenu_roles &&
                                <Link href="/administrar/roles" passHref>
                                    <NavDropdown.Item>Roles</NavDropdown.Item>
                                </Link>
                            }
                            {permisos_menu.ver_submenu_usuarios && 
                                <Link href="/administrar/usuarios" passHref>
                                    <NavDropdown.Item>Usuarios</NavDropdown.Item>
                                </Link>
                            }
                        </NavDropdown>
                    }
                    {permisos_menu.ver_menu_asignaturas &&
                        <NavDropdown title="Asignaturas" id="asignaturas-nav-dropdown">
                            {permisos_menu.ver_submenu_materias && 
                                <Link href="/administrar/materias" passHref>
                                    <NavDropdown.Item>Materias</NavDropdown.Item>
                                </Link>
                            }
                            {permisos_menu.ver_submenu_unidades && 
                                <Link href="/administrar/unidades" passHref>
                                    <NavDropdown.Item>Unidades</NavDropdown.Item>
                                </Link>
                            }
                            {permisos_menu.ver_submenu_modulos &&
                                <Link href="/administrar/modulos" passHref>
                                    <NavDropdown.Item>Módulos</NavDropdown.Item>
                                </Link>
                            }
                    </NavDropdown>
                    }
                    {permisos_menu.ver_menu_preguntas &&
                        <Link href="/administrar/preguntas" passHref>
                            <Nav.Link>Preguntas</Nav.Link>
                        </Link>
                    }
                    {permisos_menu.ver_menu_rings &&
                        <Link href="/administrar/rings" passHref>
                            <Nav.Link>Rings</Nav.Link>
                        </Link>
                    }
                    <Link href="/testalan" passHref>
                        <Nav.Link>Test</Nav.Link>
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
                                <FaUserCircle 
                                    size={"1.5rem"} 
                                    color={"teal"}
                                />
                                </Row>
                                <Row>
                                    <NavDropdown title={usuario.nombre} id="usuario-nav-dropdown" className="d-flex">
                                        
                                        <MenuInstitucionPerfil />
                                        <NavDropdown.Divider />
                                        <Row className="m-2">
                                            <Col className="d-flex justify-content-center">
                                                <Button 
                                                    variant="info"
                                                    size="sm"
                                                    onClick={() => cerrarSesion()}
                                                >Cerrar Sesión
                                                </Button>    
                                            </Col>
                                        </Row>
                                        
                                    </NavDropdown>
                                </Row>
                            </Col>
                        </Row>
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