import React, { useContext, useState, useEffect } from 'react'
import {Modal, Container, Row, Col} from 'react-bootstrap'
import AuthContext from '../../context/auth/AuthContext'
import TableRingUsuariosCurso from './TableRingUsuariosCurso'
import InputSelectCursosUsuarioNivelAcademicoInstitucion from './InputSelectCursosUsuarioNivelAcademicoInstitucion'
import InputSelectInstitucionesUsuario from './InputSelectInstitucionesUsuario'
import Logo from './Logo'

const ModalRingUsuarios = ({show, handleClose, ring}) =>{

    const { usuario } = useContext(AuthContext)
    const [codigo_curso, setCodigoCurso] = useState('0')
    const [codigo_institucion, setCodigoInstitucion] = useState('0')

    useEffect(() => {
      setCodigoCurso('0')
      setCodigoInstitucion('0')
    }, [show])

    return (
    
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
        <Modal.Title>
            <Row className="ml-3">
                <Logo />
                <h4 className="ml-2">Agregar usuarios a ring </h4> 
            </Row>
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Container>
              <Row className="mb-2">
                <Col>
                    <InputSelectInstitucionesUsuario
                        as="select"
                        value={codigo_institucion}
                        onChange={e => {
                            setCodigoInstitucion(e.target.value)
                        }}
                    />
                </Col>
              </Row>
              <Row>
                <Col>
                    <InputSelectCursosUsuarioNivelAcademicoInstitucion
                        as="select"
                        rut_usuario={usuario.rut}
                        codigo_nivel_academico={ring.codigo_nivel_academico}
                        codigo_institucion={codigo_institucion}
                        value={codigo_curso}
                        onChange={e => {
                          setCodigoCurso(e.target.value)
                        }}
                    />
                </Col>
              </Row>
              <Row className="mt-3">
                  <Col>
                    <TableRingUsuariosCurso 
                      ring={ring}
                      codigo_curso={codigo_curso}
                    />
                  </Col>
              </Row>
            </Container>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
  )
}

export default ModalRingUsuarios