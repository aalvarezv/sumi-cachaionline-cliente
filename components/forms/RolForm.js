import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import ToastMultiline from '../ui/ToastMultiline';
import { Container, Form, Button, Row, Col, Nav } from 'react-bootstrap';
import {handleError } from '../../helpers';
import clienteAxios from '../../config/axios';
import ButtonBack from '../ui/ButtonBack';

const RolForm = ({rol_modificar, handleClickVolver}) => {

    const router = useRouter();
    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
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
        ver_menu_rings: false,
        ver_menu_preguntas: false,
        inactivo: false
    });

    const [errores, setErrores] = useState({});

    useEffect(() => {

        if(rol_modificar){
            setFormulario({
                codigo: rol_modificar.codigo,
                descripcion: rol_modificar.descripcion,
                ver_menu_administrar: rol_modificar.ver_menu_administrar,
                ver_submenu_instituciones: rol_modificar.ver_submenu_instituciones,
                ver_submenu_niveles_academicos: rol_modificar.ver_submenu_niveles_academicos,
                ver_submenu_roles: rol_modificar.ver_submenu_roles,
                ver_submenu_usuarios: rol_modificar.ver_submenu_usuarios,
                ver_menu_asignaturas: rol_modificar.ver_menu_asignaturas,
                ver_submenu_materias: rol_modificar.ver_submenu_materias,
                ver_submenu_unidades: rol_modificar.ver_submenu_unidades,
                ver_submenu_modulos: rol_modificar.ver_submenu_modulos,
                ver_submenu_temas: rol_modificar.ver_submenu_temas,
                ver_submenu_conceptos: rol_modificar.ver_submenu_conceptos,
                ver_menu_rings: rol_modificar.ver_menu_rings,
                ver_menu_preguntas: rol_modificar.ver_menu_preguntas,
                inactivo: rol_modificar.inactivo
            });
        }else{
            reseteaFormulario();
        }
        setErrores({});

    }, [rol_modificar])

    const validarFormulario = () => {
        
        let errors = {}

        if(formulario.descripcion.trim() === ''){
            errors = {
                ...errors,
                descripcion: 'Requerido'
            }
        }

        setErrores(errors);

        return errors;

    }

    const reseteaFormulario = () => {
        setFormulario({
            codigo: '',
            descripcion: '',
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
            ver_menu_rings: false,
            ver_menu_preguntas: false,
            inactivo: false,
        });
    }

    const handleClickCrear = async e => {
        
        try{
            //previne el envío
            e.preventDefault();
            //valida el formulario
            const errors = validarFormulario();
            //verifica que no hayan errores
            if(Object.keys(errors).length > 0){
                return;
            }
            //Unidad a enviar
            let rol = {
                ...formulario,
                codigo : uuidv4(),
            }

            const resp = await clienteAxios.post('/api/roles/crear', rol);
            
            rol = resp.data;
            reseteaFormulario();
            toast.success(<ToastMultiline mensajes={[{msg: 'ROL CREADO'}]}/>, {containerId: 'sys_msg'});
        
        }catch(e){
            handleError(e);
        }                                                
    }

    const handleClickActualizar = async e => {
        
        try{
            e.preventDefault();
            //valida el formulario
            const errors = validarFormulario();
            //verifica que no hayan errores
            if(Object.keys(errors).length > 0){
                return;
            }
            let rol = formulario;
            await clienteAxios.put('/api/roles/actualizar', rol);
            toast.success(<ToastMultiline mensajes={[{msg: 'ROL ACTUALIZADO'}]}/>, {containerId: 'sys_msg'});
        }catch(e){
            handleError(e);
        }
    }

    return (
        <Container>
        <Form>
            <Form.Group>
                <Form.Label>Descripcion</Form.Label>
                <Form.Control
                    id="descripcion"
                    name="descripcion"
                    type="text" 
                    placeholder="DESCRIPCIÓN" 
                    value={formulario.descripcion}
                    onChange={e => {setFormulario({
                            ...formulario,
                        [e.target.name]: e.target.value.toUpperCase()
                        })
                    }}
                    isInvalid={errores.hasOwnProperty('descripcion')}
                    onBlur={validarFormulario}
                />
                <Form.Control.Feedback type="invalid">
                {errores.hasOwnProperty('descripcion') && errores.descripcion}
                </Form.Control.Feedback>
            </Form.Group>
            <Nav variant="tabs" activeKey="opciones-menu">
                <Nav.Item>
                    <Nav.Link eventKey="opciones-menu">Habilitar opciones de menú</Nav.Link>
                    <Container>                 
                        <Row className="mt-2">
                            <Col xs="auto">
                                <Form.Check 
                                    id="ver_menu_administrar"
                                    name="ver_menu_administrar"
                                    type="checkbox"
                                    label="Menú Administrar"
                                    checked={formulario.ver_menu_administrar}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        });
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs="auto">
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
                                        });
                                    }}
                                />
                            </Col>
                            <Col xs="auto">
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
                                        });
                                    }}
                                />
                            </Col>
                            <Col xs="auto">
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
                                        });
                                    }}
                                />
                            </Col>
                            <Col xs="auto">
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
                                        });
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="auto">
                                <Form.Check 
                                    id="ver_menu_asignaturas"
                                    name="ver_menu_asignaturas"
                                    type="checkbox"
                                    label="Menú Asignaturas"
                                    checked={formulario.ver_menu_asignaturas}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        });
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs="auto">
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
                                        });
                                    }}
                                />
                            </Col>
                            <Col xs="auto">
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
                                        });
                                    }}
                                />
                            </Col>
                            <Col xs="auto">
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
                                        });
                                    }}
                                />
                            </Col>
                            <Col xs="auto">
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
                                        });
                                    }}
                                />
                            </Col>
                            <Col xs="auto">
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
                                        });
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs="auto">
                                <Form.Check 
                                    id="ver_menu_preguntas"
                                    name="ver_menu_preguntas"
                                    type="checkbox"
                                    label="Menú Preguntas"
                                    checked={formulario.ver_menu_preguntas}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        });
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs="auto">
                                <Form.Check 
                                    id="ver_menu_rings"
                                    name="ver_menu_rings"
                                    type="checkbox"
                                    label="Menú Rings"
                                    checked={formulario.ver_menu_rings}
                                    onChange={e => {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.checked
                                        });
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
                className="mt-3"
                checked={formulario.inactivo}
                onChange={e => {
                    setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.checked
                    });
                }}
            />
            <Row className="justify-content-center">
                <Col className="mb-3 mb-sm-0" xs={12} sm={"auto"}>
                    {rol_modificar
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
                <Col className="mb-3 mb-sm-0" xs={12} sm={"auto"}>
                    <Button 
                        variant="success"
                        disabled={!rol_modificar}
                        size="lg"
                        className="btn-block"
                        onClick={() => {
                            router.push({
                                pathname: '/administrar/usuarios',
                                query: { 
                                    rol: formulario.codigo
                                },
                            })
                        }}
                    >+ Agregar Usuarios</Button>
                </Col>
                <Col>
                    <Button 
                        variant="info"
                        size="lg"
                        onClick={handleClickVolver}
                    >Volver</Button>
                </Col>
            </Row>
        </Form>
     </Container> );
}
 
export default RolForm;