import React,{ useContext, useEffect } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'
import SocketContext from '../../context/socket/SocketContext'
import SocketInvitacionesRingContext from '../../context/socket_invitaciones_ring/SocketInvitacionesRingContext'
import Link from 'next/link'
import AuthContext from '../../context/auth/AuthContext'
import MenuInstitucionPerfil from './MenuInstitucionPerfil'
import clienteAxios from '../../config/axios'
import { Navbar, Nav, Button, NavDropdown,  Row, Col } from 'react-bootstrap'
import ModalCargaMasivaUsuario from '../ui/ModalCargaMasivaUsuario'



const Navegacion = () => {

    const { usuario, autenticado, rol_select, cerrarSesion} = useContext(AuthContext)
    const { socket } = useContext(SocketContext)
    const [showCargaMasivaUsuarios, setShowCargaMasivaUsuarios] = useState(false)
    
    const handleShowCargaMasivaUsuarios = () => {
        console.log('aqui')
    }
    

    const {cantidadInvitaciones, setCantidadInvitacionesRing} = useContext(SocketInvitacionesRingContext)


    const listarInvitacionesRing = async () => {
        const resp = await clienteAxios.get('/api/ring-invitaciones/cantidad-invitaciones-usuario',{
            params: {
                rut_usuario: usuario.rut
            }
        })
        setCantidadInvitacionesRing(resp.data.cantidad_invitaciones_ring)
    }

    useEffect(() => {
        
        if(usuario){
            
            socket.off(`recibir-invitacion-ring-${usuario.rut}`).on(`recibir-invitacion-ring-${usuario.rut}`, () => {
                listarInvitacionesRing()
                toast.dark('Ha recibido una invitación a un evento', {containerId: 'sys_msg'})
            })

            socket.off(`cancelar-invitacion-ring-${usuario.rut}`).on(`cancelar-invitacion-ring-${usuario.rut}`, () => {
                listarInvitacionesRing()
                toast.dark('Se ha cancelado la invitación a un evento', {containerId: 'sys_msg'})
            })
            
            listarInvitacionesRing()

        }
      
    }, [usuario])

    return (
        <>
        <ModalCargaMasivaUsuario
            show={showCargaMasivaUsuarios}
        />
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
                {(autenticado && rol_select)
                && 
                <>  
                    { rol_select.ver_menu_administrar 
                    ?  
                        <NavDropdown title="Administrar" id="administrar-nav-dropdown">
                            {rol_select.ver_submenu_instituciones &&
                                <Link href="/administrar/instituciones" passHref>
                                    <NavDropdown.Item>Instituciones</NavDropdown.Item>
                                </Link>
                            }
                            {rol_select.ver_submenu_niveles_academicos &&
                                <Link href="/administrar/niveles-academicos" passHref>
                                    <NavDropdown.Item>Niveles Académicos</NavDropdown.Item>
                                </Link>
                            }
                            {rol_select.ver_submenu_roles &&
                                <Link href="/administrar/roles" passHref>
                                    <NavDropdown.Item>Roles</NavDropdown.Item>
                                </Link>
                            }
                            {rol_select.ver_submenu_usuarios && 
                                <Link href="/administrar/usuarios" passHref>
                                    <NavDropdown.Item>Usuarios</NavDropdown.Item>
                                </Link>
                            }
                            {rol_select.ver_menu_rings &&
                                <Link href="/administrar/cursos" passHref>
                                    <NavDropdown.Item>Cursos</NavDropdown.Item>
                                </Link>
                            }
                            
                        </NavDropdown>
                    :
                        null
                    }
                    {rol_select.ver_menu_asignaturas 
                    ?
                        <NavDropdown title="Asignaturas" id="asignaturas-nav-dropdown">
                            {rol_select.ver_submenu_materias && 
                                <Link href="/administrar/materias" passHref>
                                    <NavDropdown.Item>Materias</NavDropdown.Item>
                                </Link>
                            }
                            {rol_select.ver_submenu_unidades && 
                                <Link href="/administrar/unidades" passHref>
                                    <NavDropdown.Item>Unidades</NavDropdown.Item>
                                </Link>
                            }
                            {rol_select.ver_submenu_modulos &&
                                <Link href="/administrar/modulos" passHref>
                                    <NavDropdown.Item>Módulos</NavDropdown.Item>
                                </Link>
                            }
                            {rol_select.ver_submenu_modulos &&
                                <Link href="/administrar/contenidos" passHref>
                                    <NavDropdown.Item>Contenidos</NavDropdown.Item>
                                </Link>
                            }
                            {rol_select.ver_submenu_modulos &&
                                <Link href="/administrar/temas" passHref>
                                    <NavDropdown.Item>Temas</NavDropdown.Item>
                                </Link>
                            }
                            {rol_select.ver_submenu_modulos &&
                                <Link href="/administrar/conceptos" passHref>
                                    <NavDropdown.Item>Conceptos</NavDropdown.Item>
                                </Link>
                            }
                        </NavDropdown>
                    :
                        null
                    }
                    <NavDropdown title="Carga masiva" id="cargaMasiva-nav-dropdown">
                        <Link href="#" passHref>
                            <Nav.Link onClick={() => {setShowCargaMasivaUsuarios(true)}}>Usuarios</Nav.Link>
                        </Link>
                    </NavDropdown>
                    {rol_select.ver_menu_preguntas 
                    ?
                        <Link href="/administrar/preguntas" passHref>
                            <Nav.Link>Preguntas</Nav.Link>
                        </Link>
                    :
                        null
                    }
                    {rol_select.ver_menu_rings
                    ?
                        <NavDropdown title="Rings" id="administrar-nav-dropdown">
                            <Link href="/administrar/ring-invitaciones" passHref>
                                <NavDropdown.Item>
                                    {`Invitaciones [${cantidadInvitaciones}]`}
                                </NavDropdown.Item>
                            </Link>
                            <Link href="/administrar/rings" passHref>
                                <NavDropdown.Item>Administrar</NavDropdown.Item>
                            </Link>
                        </NavDropdown>
                    :
                        null
                    }
                    
                    </>
                }
            </Nav> 
            <Nav>
                {autenticado && rol_select
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
        </>
     )
}
 
export default React.memo(Navegacion)