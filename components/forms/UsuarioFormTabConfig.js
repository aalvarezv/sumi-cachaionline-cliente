import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Container, Row, Col, Form, Table, Button, Alert } from 'react-bootstrap'
import InputSelectRol from '../ui/InputSelectRol'
import InputSelectInstitucion from '../ui/InputSelectInstitucion'
import clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'

const UsuarioFormTabConfig = ({rut_usuario}) => {

    const [usuario_instituciones_roles, setUsuarioInstitucionesRoles] = useState([])
    const [formulario, setFormulario] = useState({
        rut_usuario: rut_usuario,
        codigo_institucion: '',
        codigo_rol: '',
    })

    const [errores, setErrores] = useState({})

    //al iniciar el componente carga las instituciones y roles a los que pertenece el usuario.
    useEffect(() => {
        
        const listarUsuarioInstitucionesRoles = async () => {

            const resp = await clienteAxios.get(`/api/usuario-instituciones-roles/listar/${rut_usuario}`)
            setUsuarioInstitucionesRoles(resp.data.usuario_instituciones_roles)

        }

        if(rut_usuario){
            listarUsuarioInstitucionesRoles()
        }

    }, [rut_usuario])

    const handleClickAgregarUsuarioInstitucionRol = async e => {

        try{
            //previne el envío
            e.preventDefault()
            //valida el formulario
            const errors = validarFormulario()
            //verifica que no hayan errores
            if(Object.keys(errors).length > 0){
                return
            }
            //modulo a enviar
            let usuario_institucion_rol = {
                ...formulario, 
                codigo : uuidv4(),
            }
            
            const resp = await clienteAxios.post('/api/usuario-instituciones-roles/crear', usuario_institucion_rol)
            setUsuarioInstitucionesRoles(resp.data.usuario_instituciones_roles)

        }catch(e){
            handleError(e)
        }

    }

    const handleClickEliminarUsuarioInstitucionRol = async (e, codigo) => {

        try{
            //previne el envío
            e.preventDefault()

            const resp = await clienteAxios.delete(`/api/usuario-instituciones-roles/eliminar/${codigo}`,{
                params:{
                    rut_usuario
                }
            })
           
            setUsuarioInstitucionesRoles(resp.data.usuario_instituciones_roles)
          
        }catch(e){
            handleError(e)
        }

    }

    const validarFormulario = () => {
        //setea los errores para que no exista ninguno.
        let errors = {}
        
        //valida la institución.
        if(formulario.codigo_institucion.trim() === '' || formulario.codigo_institucion.trim() === '0'){
            errors = {
                ...errors,
                codigo_institucion: 'Requerida'
            }
        }
        //valida el rol.
        if(formulario.codigo_rol.trim() === '' || formulario.codigo_rol.trim() === '0'){
            errors = {
                ...errors,
                codigo_rol: 'Requerido'
            }
        }
        setErrores(errors)

        return errors
    }

    return (
        <Container className="mt-3">
            <Form className="p-3">
            <Row className="mb-3">
                <Col>
                    <Alert variant="info" className="text-center text-uppercase">
                        Asignar usuario a una Institución
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col xs={5}>
                    <Form.Group>
                        <InputSelectInstitucion
                            id="codigo_institucion"
                            name="codigo_institucion"
                            as="select"
                            value={formulario.codigo_institucion}
                            onChange={e => setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value
                            })}
                            isInvalid={errores.hasOwnProperty('codigo_institucion')}
                            onBlur={validarFormulario}
                        />
                    </Form.Group>
                </Col>
                <Col xs={5}>
                    <Form.Group>
                        <InputSelectRol
                            id="codigo_rol"
                            name="codigo_rol"
                            as="select"
                            value={formulario.codigo_rol}
                            onChange={e => setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value
                            })}
                            isInvalid={errores.hasOwnProperty('codigo_rol')}
                            onBlur={validarFormulario}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Button 
                            variant="info"
                            size="sm"
                            className="btn-block"
                            onClick={handleClickAgregarUsuarioInstitucionRol}
                        >Agregar</Button>
                    </Form.Group>
                </Col>
            </Row>
            </Form>
            {usuario_instituciones_roles.length > 0 &&
            <Row>
                <Table striped bordered hover >
                    <thead>
                        <tr>
                            <th>Institución</th>
                            <th>Perfil</th>
                            <th className="w-25"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuario_instituciones_roles.map(item => {
                            return (
                            <tr key={item.codigo}>
                                <td>{item.institucion.descripcion}</td>
                                <td>{item.rol.descripcion}</td>
                                <td className="d-flex justify-content-center">
                                    <Button 
                                        variant="danger"
                                        size="sm"
                                        onClick={e => {handleClickEliminarUsuarioInstitucionRol(e, item.codigo)}}
                                    >Quitar</Button>
                                </td>
                            </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Row>
            }
        </Container>                    
        
    )
}

export default React.memo(UsuarioFormTabConfig)