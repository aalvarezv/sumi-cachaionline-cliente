import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Container, Row, Col, Table, Button, Alert } from 'react-bootstrap'
import InputSelectRol from '../ui/InputSelectRol'
import InputSelectInstitucion from '../ui/InputSelectInstitucion'
import clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'
import ModalUsuarioCursoConfig from '../ui/ModalUsuarioCursoConfig'

const UsuarioFormTabConfig = ({rut_usuario, nombre_usuario, handleClickVolver}) => {

    const [usuario_instituciones_roles, setUsuarioInstitucionesRoles] = useState([])
    const [formulario, setFormulario] = useState({
        rut_usuario: rut_usuario,
        codigo_institucion: '',
        codigo_rol: '',
    })
    const [showModalUsuarioCursoConfig, setShowModalUsuarioCursoConfig] = useState(false)
    const [paramsUsuarioCursoConfig, setParamsUsuarioCursoConfig] = useState({
        usuario: {
            rut_usuario,
            nombre_usuario,
        },
        institucion: null,
        rol: null,
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

    const handleConfigurarUsuarioCurso = (institucion, rol) => {

        setParamsUsuarioCursoConfig({
            ...paramsUsuarioCursoConfig,
            institucion: institucion,
            rol: rol,
        })

        setShowModalUsuarioCursoConfig(true)

    }

    return (
        <Container className="mt-4">
            <ModalUsuarioCursoConfig
                show={showModalUsuarioCursoConfig}
                paramsUsuarioCursoConfig={paramsUsuarioCursoConfig}
                setShowModalUsuarioCursoConfig={setShowModalUsuarioCursoConfig}
            />
            <Row>
                <Col>
                    <Alert variant="info" className="d-flex justify-content-between">
                        <h5>
                            Inscribir usuario en Institución
                        </h5>
                        <Button 
                            variant="info"
                            onClick={handleClickVolver}
                        >Volver</Button>
                    </Alert>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col sm={12} md={6}>
                    <Row className="mb-2">
                        <Col>
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
                        </Col>
                    </Row>
                    <Row className="mb-2 mb-md-0">
                        <Col>
                            <InputSelectRol
                                id="codigo_rol"
                                name="codigo_rol"
                                as="select"
                                codigos={[2,3,4,5]}
                                value={formulario.codigo_rol}
                                onChange={e => setFormulario({
                                    ...formulario,
                                    [e.target.name]: e.target.value
                                })}
                                isInvalid={errores.hasOwnProperty('codigo_rol')}
                                onBlur={validarFormulario}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col sm={12} md={"auto"} className="d-flex justify-content-start align-items-end">
                    <Button 
                        variant="info"
                        className="btn-block"
                        onClick={handleClickAgregarUsuarioInstitucionRol}
                    >Agregar</Button>
                </Col>
            </Row>
            {usuario_instituciones_roles.length > 0 &&
            <Row>
                <Col>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Institución</th>
                                <th>Perfil</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuario_instituciones_roles.map(usuarioInstitucionRol => {
                               
                                return (
                                <tr key={usuarioInstitucionRol.codigo}>
                                    <td>{usuarioInstitucionRol.institucion.descripcion}</td>
                                    <td>{usuarioInstitucionRol.rol.descripcion}</td>
                                    <td className="text-center">
                                        {(usuarioInstitucionRol.rol.codigo === '2' || usuarioInstitucionRol.rol.codigo === '3') &&
                                                                    
                                            <Button 
                                                variant="info"
                                                size="sm"
                                                onClick={() => {
                                                    handleConfigurarUsuarioCurso(
                                                    usuarioInstitucionRol.institucion,
                                                    usuarioInstitucionRol.rol
                                                )}}
                                            >Inscribir Cursos</Button>
                                        }
                                    </td>
                                    <td className="text-center">
                                        <Button 
                                            variant="danger"
                                            size="sm"
                                            onClick={e => {handleClickEliminarUsuarioInstitucionRol(e, usuarioInstitucionRol.codigo)}}
                                        >Eliminar</Button>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            }
        </Container>                    
        
    )
}

export default React.memo(UsuarioFormTabConfig)