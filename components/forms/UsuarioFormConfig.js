import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Container, Row, Col, Table, Button } from 'react-bootstrap'
import InputSelectRol from '../ui/InputSelectRol'
import InputSelectInstitucion from '../ui/InputSelectInstitucion'
import clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'
import ModalUsuarioCursoConfig from '../ui/ModalUsuarioCursoConfig'
import AuthContext from '../../context/auth/AuthContext'
import { useContext } from 'react'

const UsuarioFormConfig = ({rut_usuario, nombre_usuario}) => {

    const {institucion_select, rol_select} = useContext(AuthContext)
    const [usuario_instituciones_roles, setUsuarioInstitucionesRoles] = useState([])
    const [formulario, setFormulario] = useState({
        rut_usuario: rut_usuario,
        codigo_institucion: institucion_select.codigo,
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

    //al iniciar el componente carga las instituciones y roles a los que pertenece el usuario.
    useEffect(() => {

        setFormulario({
            ...formulario,
            codigo_rol: ''
        })

        const listarUsuarioInstitucionesRoles = async () => {
           
            const resp = await clienteAxios.get(`/api/usuario-instituciones-roles/listar/`, {
                params: {
                    rut_usuario: formulario.rut_usuario,
                    codigo_institucion: formulario.codigo_institucion
                }
            })
            setUsuarioInstitucionesRoles(resp.data.usuario_instituciones_roles)

        }

        if(formulario.rut_usuario && formulario.codigo_institucion){
            listarUsuarioInstitucionesRoles()
        }

    }, [formulario.rut_usuario, formulario.codigo_institucion])


    const handleClickAgregarUsuarioInstitucionRol = async () => {

        try{

            //valida el formulario
            if(!validarFormulario()){
                return
            }
            
            const resp = await clienteAxios.post('/api/usuario-instituciones-roles/crear', formulario)
            setUsuarioInstitucionesRoles(resp.data.usuario_instituciones_roles)
            toast.success('Rol asociado al usuario', {containerId: 'sys_msg'})
        
        }catch(e){
            handleError(e)
        }

    }

    const handleClickEliminarUsuarioInstitucionRol = async (e, codigo_rol) => {

        try{
           
            const resp = await clienteAxios.delete(`/api/usuario-instituciones-roles/eliminar`,{
                params:{
                    rut_usuario: formulario.rut_usuario,
                    codigo_institucion: formulario.codigo_institucion,
                    codigo_rol,
                }
            })
           
            setUsuarioInstitucionesRoles(resp.data.usuario_instituciones_roles)
            toast.success('Rol eliminado del usuario', {containerId: 'sys_msg'}) 
        }catch(e){
            handleError(e)
        }

    }

    const validarFormulario = () => {
       
        //valida el rol.
        if(formulario.codigo_rol.trim() === '' || formulario.codigo_rol.trim() === '0'){
            toast.error('Seleccione un rol.', {containerId: 'sys_msg'}) 
            return false
        }
        
        return true
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
                                disabled={!rol_select.sys_admin}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2 mb-md-0">
                        <Col>
                            <InputSelectRol
                                id="codigo_rol"
                                name="codigo_rol"
                                as="select"
                                codigos={[]}
                                value={formulario.codigo_rol}
                                onChange={e => setFormulario({
                                    ...formulario,
                                    [e.target.name]: e.target.value
                                })}
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
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Rol</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuario_instituciones_roles.map(usuarioInstitucionRol => {
                               
                                return (
                                <tr key={usuarioInstitucionRol.codigo}>
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
                                            variant="secondary"
                                            size="sm"
                                            onClick={e => {handleClickEliminarUsuarioInstitucionRol(e, usuarioInstitucionRol.rol.codigo)}}
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

export default React.memo(UsuarioFormConfig)