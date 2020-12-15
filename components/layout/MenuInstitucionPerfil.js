import React,{ useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import { Row, Col, Form } from 'react-bootstrap';

const MenuInstitucionPerfil = () => {

    const { instituciones, roles, 
            institucion_select, rol_select, 
            selectInstitucion, selectRol } = useContext(AuthContext);

    return ( 
        <>
            <Row className="m-2">
                <Col>
                    <Form.Control
                        name="institucion"
                        as="select"
                        size="sm"
                        value={institucion_select ? institucion_select.codigo : 0}
                        onChange={e => {
                            selectInstitucion(e.target.value);
                        }}
                    >
                    {instituciones.map(institucion => {
                        const {codigo, descripcion} = institucion;
                        return <option key={codigo} value={codigo}>{descripcion}</option>
                    })}
                    </Form.Control>
                </Col>
            </Row>
            <Row className="m-2">
                <Col>
                    <Form.Control
                        name="rol"
                        as="select"
                        size="sm"
                        value={rol_select ? rol_select.codigo : 0}
                        onChange={e => {
                            selectRol(e.target.value);
                        }}
                    >
                        {roles.map(rol => {
                            const {codigo, descripcion} = rol;
                            return <option key={codigo} value={codigo}>{descripcion}</option>
                        })}
                    </Form.Control>
                </Col>
            </Row>
        </>

     );
}
 
export default MenuInstitucionPerfil;