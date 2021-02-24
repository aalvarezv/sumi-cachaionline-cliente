import React,{ useContext, useEffect, useState } from 'react'
import AuthContext from '../../context/auth/AuthContext'
import { Row, Col, Form } from 'react-bootstrap'

const MenuInstitucionPerfil = () => {

    const { institucion_select, rol_select, usuario,
            selectInstitucion, selectRol, roles_institucion } = useContext(AuthContext)

    return ( 
        <>
            <Row className="m-2">
                <Col>
                    <Form.Control
                        name="institucion"
                        as="select"
                        size="sm"
                        value={institucion_select.codigo}
                        onChange={e => {
                            selectInstitucion(e.target.value)
                        }}
                    >
                    {usuario.institucion_roles.map(institucion => {
                        const {codigo_institucion, descripcion_institucion} = institucion
                        return <option key={codigo_institucion} value={codigo_institucion}>{descripcion_institucion}</option>
                    })}
                    </Form.Control>
                </Col>
            </Row>
            {rol_select && 
                <Row className="m-2">
                    <Col>
                        <Form.Control
                            name="rol"
                            as="select"
                            size="sm"
                            value={rol_select.codigo_rol}
                            onChange={e => {
                                selectRol(e.target.value)
                            }}
                        >
                            {roles_institucion.map(rol => {
                                const {codigo_rol, descripcion} = rol
                                return <option key={codigo_rol} value={codigo_rol}>{descripcion}</option>
                            })}
                        </Form.Control> 
                    </Col>
                </Row>
            }
        </>

     )
}
 
export default MenuInstitucionPerfil