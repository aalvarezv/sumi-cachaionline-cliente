import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import { Container, Form, Button, Row, Col, Nav } from 'react-bootstrap'
import { handleError } from '../../helpers'
import clienteAxios from '../../config/axios'

const RolForm = ({rolEnProceso, setRolEnProceso}) => {
  
    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        sys_admin: false,
        ver_menu_administrar: false,
        ver_submenu_instituciones:false,
        ver_submenu_niveles_academicos:false,
        ver_submenu_roles:false,
        ver_submenu_usuarios:false,
        ver_submenu_cursos: false,
        ver_menu_asignaturas:false,
        ver_submenu_materias:false,
        ver_submenu_unidades:false,
        ver_submenu_modulos:false,
        ver_submenu_contenidos:false,
        ver_menu_carga_masiva:false,
        ver_submenu_carga_masiva_unidades:false,
        ver_submenu_carga_masiva_usuarios:false,
        ver_submenu_temas:false,
        ver_submenu_conceptos:false,
        ver_menu_rings: false,
        ver_menu_preguntas: false,
        ver_menu_cuestionarios: false,
        inactivo: false
    })

    useEffect(() => {

        if(rolEnProceso){
            setFormulario({
                codigo: rolEnProceso.codigo,
                descripcion: rolEnProceso.descripcion,
                sys_admin: rolEnProceso.sys_admin,
                ver_menu_administrar: rolEnProceso.ver_menu_administrar,
                ver_submenu_instituciones: rolEnProceso.ver_submenu_instituciones,
                ver_submenu_niveles_academicos: rolEnProceso.ver_submenu_niveles_academicos,
                ver_submenu_roles: rolEnProceso.ver_submenu_roles,
                ver_submenu_usuarios: rolEnProceso.ver_submenu_usuarios,
                ver_submenu_cursos: rolEnProceso.ver_submenu_cursos,
                ver_menu_asignaturas: rolEnProceso.ver_menu_asignaturas,
                ver_submenu_materias: rolEnProceso.ver_submenu_materias,
                ver_submenu_unidades: rolEnProceso.ver_submenu_unidades,
                ver_submenu_modulos: rolEnProceso.ver_submenu_modulos,
                ver_submenu_contenidos: rolEnProceso.ver_submenu_contenidos,
                ver_submenu_temas: rolEnProceso.ver_submenu_temas,
                ver_submenu_conceptos: rolEnProceso.ver_submenu_conceptos,
                ver_menu_carga_masiva: rolEnProceso.ver_menu_carga_masiva,
                ver_submenu_carga_masiva_unidades: rolEnProceso.ver_submenu_carga_masiva_unidades,
                ver_submenu_carga_masiva_usuarios: rolEnProceso.ver_submenu_carga_masiva_usuarios,
                ver_menu_rings: rolEnProceso.ver_menu_rings,
                ver_menu_preguntas: rolEnProceso.ver_menu_preguntas,
                ver_menu_cuestionarios: rolEnProceso.ver_menu_cuestionarios,
                inactivo: rolEnProceso.inactivo
            })
        }else{
            reseteaFormulario()
        }

    }, [rolEnProceso])

    const validarFormulario = () => {
        
        if(formulario.descripcion.trim() === ''){
            toast.error('Ingrese descripción', {containerId: 'sys_msg'})
            return false
        }

        return true

    }

    const reseteaFormulario = () => {
        setFormulario({
            codigo: '',
            descripcion: '',
            sys_admin: false,
            ver_menu_administrar: false,
            ver_submenu_instituciones:false,
            ver_submenu_niveles_academicos:false,
            ver_submenu_roles:false,
            ver_submenu_usuarios:false,
            ver_submenu_cursos: false,
            ver_menu_asignaturas:false,
            ver_submenu_materias:false,
            ver_submenu_unidades:false,
            ver_submenu_modulos:false,
            ver_submenu_contenidos:false,
            ver_submenu_temas:false,
            ver_submenu_conceptos:false,
            ver_menu_carga_masiva:false,
            ver_submenu_carga_masiva_unidades:false,
            ver_submenu_carga_masiva_usuarios:false,
            ver_menu_rings: false,
            ver_menu_preguntas: false,
            ver_menu_cuestionarios: false,
            inactivo: false,
        })
    }

    const handleClickCrear = async e => {
        
        try{
            //valida el formulario
            if(!validarFormulario()) return    
            //rol a enviar
            let rol = {
                ...formulario,
                codigo : uuidv4(),
            }
            await clienteAxios.post('/api/roles/crear', rol)
            setRolEnProceso(rol)
            toast.success('Rol creado', {containerId: 'sys_msg'})
        
        }catch(e){
            handleError(e)
        }                                                
    }

    const handleClickActualizar = async e => {
        
        try{
            //valida el formulario
            if(!validarFormulario()) return

            await clienteAxios.put('/api/roles/actualizar', formulario)
            toast.success('Rol actualizado', {containerId: 'sys_msg'})

        }catch(e){
            handleError(e)
        }
    }
         
    return (
        <Container>
        <Form>
            <Row className="mb-4">
                <Col>
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                        id="descripcion"
                        name="descripcion"
                        type="text" 
                        placeholder="DESCRIPCIÓN" 
                        value={formulario.descripcion}
                        onChange={e => {setFormulario({
                                ...formulario,
                            [e.target.name]: e.target.value
                            })
                        }}
                    />
                </Col>
                {/* <Col className="">
                    
                    <Form.Check 
                        id="sys_admin"
                        name="sys_admin"
                        type="checkbox"
                        label="Es administrador de sistema"
                        checked={formulario.sys_admin}
                        onChange={e => {
                            setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.checked
                            })
                        }}
                    />
                </Col> */}
            </Row>
            <Nav variant="tabs" activeKey="opciones-menu">
                <Nav.Item>
                    <Nav.Link 
                        eventKey="opciones-menu"
                        className="font-weight-bold"
                    >Opciones de menú que puede ver el rol</Nav.Link>
                    <Container>                 
                        <Row className="mt-2">
                            <Col xs={12} className="mb-1">
                                <Form.Check 
                                    id="ver_menu_administrar"
                                    name="ver_menu_administrar"
                                    type="checkbox"
                                    label="Menú Administrar"
                                    className="font-weight-bold text-info"
                                    checked={formulario.ver_menu_administrar}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs={12} sm="auto">
                                <Form.Check 
                                    id="ver_submenu_instituciones"
                                    name="ver_submenu_instituciones"
                                    type="checkbox"
                                    label="Instituciones"
                                    checked={formulario.ver_submenu_instituciones}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                            </Col>
                            <Col xs={12} sm="auto">
                                <Form.Check 
                                    id="ver_submenu_niveles_academicos"
                                    name="ver_submenu_niveles_academicos"
                                    type="checkbox"
                                    label="Niveles Académicos"
                                    checked={formulario.ver_submenu_niveles_academicos}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                            </Col>
                            <Col xs={12} sm="auto">
                                <Form.Check 
                                    id="ver_submenu_roles"
                                    name="ver_submenu_roles"
                                    type="checkbox"
                                    label="Roles"
                                    checked={formulario.ver_submenu_roles}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                            </Col>
                            <Col xs={12} sm="auto">
                                <Form.Check 
                                    id="ver_submenu_usuarios"
                                    name="ver_submenu_usuarios"
                                    type="checkbox"
                                    label="Usuarios"
                                    checked={formulario.ver_submenu_usuarios}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                            </Col>
                            <Col xs={12} sm="auto">
                                <Form.Check 
                                    id="ver_submenu_cursos"
                                    name="ver_submenu_cursos"
                                    type="checkbox"
                                    label="Cursos"
                                    checked={formulario.ver_submenu_cursos}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} className="mb-1">
                                <Form.Check 
                                    id="ver_menu_asignaturas"
                                    name="ver_menu_asignaturas"
                                    type="checkbox"
                                    label="Menú Asignaturas"
                                    className="font-weight-bold text-info"
                                    checked={formulario.ver_menu_asignaturas}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs={12} sm="auto">
                                <Form.Check 
                                    id="ver_submenu_materias"
                                    name="ver_submenu_materias"
                                    type="checkbox"
                                    label="Materias"
                                    checked={formulario.ver_submenu_materias}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                            </Col>
                            <Col xs={12} sm="auto">
                                <Form.Check 
                                    id="ver_submenu_unidades"
                                    name="ver_submenu_unidades"
                                    type="checkbox"
                                    label="Unidades"
                                    checked={formulario.ver_submenu_unidades}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                            </Col>
                            <Col xs={12} sm="auto">
                                <Form.Check 
                                    id="ver_submenu_modulos"
                                    name="ver_submenu_modulos"
                                    type="checkbox"
                                    label="Módulos"
                                    checked={formulario.ver_submenu_modulos}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                            </Col>
                            <Col xs={12} sm="auto">
                                <Form.Check 
                                    id="ver_submenu_contenidos"
                                    name="ver_submenu_contenidos"
                                    type="checkbox"
                                    label="Contenidos"
                                    checked={formulario.ver_submenu_contenidos}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                                
                            </Col>
                            <Col xs={12} sm="auto">
                                <Form.Check 
                                    id="ver_submenu_temas"
                                    name="ver_submenu_temas"
                                    type="checkbox"
                                    label="Temas"
                                    checked={formulario.ver_submenu_temas}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                            </Col>
                            <Col xs={12} sm="auto">
                                <Form.Check 
                                    id="ver_submenu_conceptos"
                                    name="ver_submenu_conceptos"
                                    type="checkbox"
                                    label="Conceptos"
                                    checked={formulario.ver_submenu_conceptos}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} className="mb-1">
                                <Form.Check 
                                    id="ver_menu_carga_masiva"
                                    name="ver_menu_carga_masiva"
                                    type="checkbox"
                                    label="Menú Carga Masiva"
                                    className="font-weight-bold text-info"
                                    checked={formulario.ver_menu_carga_masiva}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs={12} sm="auto">
                                <Form.Check 
                                    id="ver_submenu_carga_masiva_unidades"
                                    name="ver_submenu_carga_masiva_unidades"
                                    type="checkbox"
                                    label="Unidades"
                                    checked={formulario.ver_submenu_carga_masiva_unidades}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                            </Col>
                            <Col xs={12} sm="auto">
                                <Form.Check 
                                    id="ver_submenu_carga_masiva_usuarios"
                                    name="ver_submenu_carga_masiva_usuarios"
                                    type="checkbox"
                                    label="Usuarios"
                                    checked={formulario.ver_submenu_carga_masiva_usuarios}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs={12} className="mb-1">
                                <Form.Check 
                                    id="ver_menu_preguntas"
                                    name="ver_menu_preguntas"
                                    type="checkbox"
                                    label="Menú Preguntas"
                                    className="font-weight-bold text-info"
                                    checked={formulario.ver_menu_preguntas}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs={12} className="mb-1">
                                <Form.Check 
                                    id="ver_menu_rings"
                                    name="ver_menu_rings"
                                    type="checkbox"
                                    label="Menú Rings"
                                    className="font-weight-bold text-info"
                                    checked={formulario.ver_menu_rings}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs={12} className="mb-1">
                                <Form.Check 
                                    id="ver_menu_cuestionarios"
                                    name="ver_menu_cuestionarios"
                                    type="checkbox"
                                    label="Menú Cuestionarios"
                                    className="font-weight-bold text-info"
                                    checked={formulario.ver_menu_cuestionarios}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        })
                                    }}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Nav.Item>
            </Nav>
            <Form.Check 
                id="inactivo"
                name="inactivo"
                type="checkbox"
                label="Inactivo"
                className="my-3"
                checked={formulario.inactivo}
                onChange={e => {
                    setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.checked
                    })
                }}
            />
            <Row className="justify-content-center">
                <Col className="mb-3 mb-sm-0" xs={12} sm={"auto"}>
                    {rolEnProceso
                    ?
                        <Button 
                            variant="outline-info"
                            size="lg"
                            className="btn-block"
                            onClick={handleClickActualizar}
                        >Actualizar</Button>
                    :
                        <Button 
                            variant="info"
                            size="lg"
                            className="btn-block"
                            onClick={handleClickCrear}
                        >Crear</Button>
                    }
                </Col>
            </Row>
        </Form>
     </Container> )
}
 
export default RolForm