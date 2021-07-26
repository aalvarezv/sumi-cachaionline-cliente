import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import AuthContext from '../../context/auth/AuthContext'
import { Button, Col, Form, OverlayTrigger, Popover, Row } from 'react-bootstrap'

const MenuInstitucionPerfil = () => {

    const { institucion_select, rol_select, usuario,
            selectInstitucion, selectRol, roles_institucion, cerrarSesion } = useContext(AuthContext)

    const router = useRouter()

    const handleChangeInstitucion = e => {
        selectInstitucion(e.target.value)
        router.push('/')
    }

    const handleChangeRol = e => {
        selectRol(e.target.value)
        router.push('/')
    }

    return ( 
        <>  
            <Row
                className="d-flex justify-content-md-between"
            >
                <Col 
                    sm={12} 
                    md={"auto"}
                    className="mt-2 mt-lg-0"
                >
                    <OverlayTrigger
                        rootClose
                        trigger={'click'}
                        key={'bottom'}
                        placement={'bottom'}
                        overlay={
                            <Popover 
                                id={`popover-positioned-bottom}`}
                                className="pb-5"
                            >
                                <Popover.Content> 
                                    <Form.Label>
                                        <small>
                                            <strong>Institución</strong>
                                        </small>
                                    </Form.Label>
                                    <Form.Control
                                        name="institucion"
                                        as="select"
                                        size="sm"
                                        value={institucion_select.codigo}
                                        onChange={handleChangeInstitucion}
                                    >
                                        {usuario.institucion_roles.map((institucion, index) => {
                                            const {codigo_institucion, descripcion_institucion} = institucion
                                            return <option key={index} value={codigo_institucion}>{descripcion_institucion}</option>
                                        })}
                                    </Form.Control>
                                    {rol_select &&
                                        <>
                                            <Form.Label className="mt-1">
                                                <small>
                                                    <strong>Perfil</strong>
                                                </small>
                                            </Form.Label>
                                            <Form.Control
                                                name="rol"
                                                as="select"
                                                size="sm"
                                                value={rol_select.codigo_rol}
                                                onChange={handleChangeRol}
                                            >
                                                {roles_institucion.map((rol, index) => {
                                                    const {codigo_rol, descripcion} = rol
                                                    return <option key={index} value={codigo_rol}>{descripcion}</option>
                                                })}
                                            </Form.Control>
                                        </>
                                    }
                                </Popover.Content>
                            </Popover>
                        }
                    >
                        <Button
                            className="btn-block"
                            variant="outline-info"
                        >{usuario.nombre}</Button>
                    </OverlayTrigger>
                </Col> 
                <Col 
                    sm={12}
                    md={"auto"}
                    className="p-0 mr-3 ml-3 ml-md-0 mt-2 mt-lg-0"
                >
                    <Button 
                        variant="danger"
                        className="btn-block"
                        onClick={() => {
                            cerrarSesion()
                            router.push('/login')
                        }}
                    >Salir
                    </Button>    
                </Col>
            </Row>
        </>

     )
}
 
export default MenuInstitucionPerfil