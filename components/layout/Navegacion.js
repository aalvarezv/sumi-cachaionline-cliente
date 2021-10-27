import React,{ useState, useContext, useEffect } from 'react'
import { toast } from 'react-toastify'
import SocketContext from '../../context/socket/SocketContext'
import SocketInvitacionesRingContext from '../../context/socket_invitaciones_ring/SocketInvitacionesRingContext'
import Link from 'next/link'
import AuthContext from '../../context/auth/AuthContext'
import MenuInstitucionPerfil from './MenuInstitucionPerfil'
import clienteAxios from '../../config/axios'
import { Button, 
    Nav, 
    Navbar, 
    NavDropdown,
} from 'react-bootstrap'
import ModalCargaMasivaUsuario from '../ui/ModalCargaMasivaUsuario'
import useWindowDimensions from '../../hooks/useWindowDimensions'


const Navegacion = () => {

    const { usuario, autenticado, rol_select } = useContext(AuthContext)
    const { socket } = useContext(SocketContext)
    const [showCargaMasivaUsuarios, setShowCargaMasivaUsuarios] = useState(false)
    const [navbarExpand, setNavbarExpand] = useState(true)

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

    const windowDimensions = useWindowDimensions()
    
    if(windowDimensions.width > 989 && windowDimensions.width < 991 && !navbarExpand){
        setNavbarExpand(true)
    }
    
    return (
        <>
        <ModalCargaMasivaUsuario
            show={showCargaMasivaUsuarios}
        />
        <Navbar 
            defaultExpanded={true}
            expand="lg" 
            expanded={navbarExpand}
            bg="white" 
            text="light"
            onToggle={next => setNavbarExpand(next)}
            //className="d-block"
        >
            <Navbar.Brand>
                <img
                    src="/static/logo.png"
                    width="30"
                    height="24"
                    className="d-inline-block align-top mr-1"
                    alt="CachaiOnline"
                />{' '}<span className="text-info">CachaiOnline</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    
                    {(autenticado && rol_select)
                    && 
                    <>  
                        { rol_select.ver_menu_administrar 
                        ?  
                            <NavDropdown title="Administrar" id="administrar-nav-dropdown">
                                {rol_select.ver_submenu_instituciones 
                                ?
                                    <Link href="/administrar/instituciones" passHref>
                                        <NavDropdown.Item>Instituciones</NavDropdown.Item>
                                    </Link>
                                :
                                    null
                                }
                                {rol_select.ver_submenu_niveles_academicos
                                ?
                                    <Link href="/administrar/niveles-academicos" passHref>
                                        <NavDropdown.Item>Niveles Académicos</NavDropdown.Item>
                                    </Link>
                                :
                                    null
                                }
                                {rol_select.ver_submenu_roles
                                ?
                                    <Link href="/administrar/roles" passHref>
                                        <NavDropdown.Item>Roles</NavDropdown.Item>
                                    </Link>
                                :
                                    null
                                }
                                {rol_select.ver_submenu_usuarios
                                ? 
                                    <Link href="/administrar/usuarios" passHref>
                                        <NavDropdown.Item>Usuarios</NavDropdown.Item>
                                    </Link>
                                :
                                    null
                                }
                                {rol_select.ver_submenu_cursos
                                ?
                                    <Link href="/administrar/cursos" passHref>
                                        <NavDropdown.Item>Cursos</NavDropdown.Item>
                                    </Link>
                                :
                                    null
                                }
                                
                            </NavDropdown>
                        :
                            null
                        }
                        {rol_select.ver_menu_asignaturas 
                        ?
                            <NavDropdown title="Asignaturas" id="asignaturas-nav-dropdown">
                                {rol_select.ver_submenu_materias 
                                ? 
                                    <Link href="/administrar/materias" passHref>
                                        <NavDropdown.Item>Materias</NavDropdown.Item>
                                    </Link>
                                :
                                    null
                                }
                                {rol_select.ver_submenu_unidades
                                ? 
                                    <Link href="/administrar/unidades" passHref>
                                        <NavDropdown.Item>Unidades</NavDropdown.Item>
                                    </Link>
                                :
                                    null
                                }
                                {rol_select.ver_submenu_modulos
                                ?
                                    <Link href="/administrar/modulos" passHref>
                                        <NavDropdown.Item>Módulos</NavDropdown.Item>
                                    </Link>
                                :
                                    null
                                }
                                {rol_select.ver_submenu_contenidos
                                ?
                                    <Link href="/administrar/contenidos" passHref>
                                        <NavDropdown.Item>Contenidos</NavDropdown.Item>
                                    </Link>
                                :
                                    null
                                }
                                {rol_select.ver_submenu_temas
                                ?
                                    <Link href="/administrar/temas" passHref>
                                        <NavDropdown.Item>Temas</NavDropdown.Item>
                                    </Link>
                                :
                                    null
                                }
                                {rol_select.ver_submenu_conceptos
                                ?
                                    <Link href="/administrar/conceptos" passHref>
                                        <NavDropdown.Item>Conceptos</NavDropdown.Item>
                                    </Link>
                                :
                                    null
                                }
                            </NavDropdown>
                        :
                            null
                        }
                        {rol_select.ver_menu_carga_masiva
                        ?
                            <NavDropdown title="Carga masiva" id="cargaMasiva-nav-dropdown">
                                {rol_select.ver_submenu_carga_masiva_unidades
                                ?
                                    <Link href="/carga-masiva/unidades" passHref>
                                        <Nav.Link>Unidades</Nav.Link>
                                    </Link>
                                :
                                    null
                                }
                                {rol_select.ver_submenu_carga_masiva_usuarios
                                ?
                                    <Link href="/carga-masiva/usuarios" passHref>
                                        <Nav.Link>Usuarios</Nav.Link>
                                    </Link>
                                :
                                    null
                                }
                            </NavDropdown>
                        :
                            null
                        }
                        
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
                                <Link href="/administrar/rings" passHref>
                                    <NavDropdown.Item>Administrar</NavDropdown.Item>
                                </Link>
                                <Link href="/administrar/ring-invitaciones" passHref>
                                    <NavDropdown.Item>
                                        {`Invitaciones [${cantidadInvitaciones}]`}
                                    </NavDropdown.Item>
                                </Link>
                            </NavDropdown>
                        :
                            null
                        }
                        {rol_select.ver_menu_cuestionarios 
                        ?
                            <Link href="/cuestionarios" passHref>
                                <Nav.Link>Cuestionarios</Nav.Link>
                            </Link>
                        :
                            null
                        }
                        
                       
                        <Link href="/unidades" passHref>
                            <Nav.Link>Unidades</Nav.Link>
                        </Link>
                       
                    </>
                    }
                </Nav> 
                <Nav>
                {autenticado && rol_select
                ?
                    <MenuInstitucionPerfil />
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