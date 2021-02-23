import React, { useContext, useState, useEffect } from 'react'
import {Modal, Container, Row, Form, Col, Button, Tabs, Tab} from 'react-bootstrap'
import AuthContext from '../../context/auth/AuthContext'
import Logo from './Logo'
import InputSelectCursosUsuarioNivelAcademicoInstitucion from './InputSelectCursosUsuarioNivelAcademicoInstitucion'
import TableRingUsuariosCurso from './TableRingUsuariosCurso'
import InvitarRing from './InvitarRing'
import clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'
import TableRingUsuarios from './TableRingUsuarios'



const ModalRingUsuarios = ({show, handleClose, ring}) =>{

    const { usuario, institucion_select } = useContext(AuthContext)
    const [codigo_curso, setCodigoCurso] = useState('0')
    const [showInvitarRing, setShowInvitarRing] = useState(false)
    const [activeTab, setActiveTab] = useState('administrar');
    const [usuariosRing, setUsuariosRing] = useState([])

    useEffect(() => {

      listarUsuariosRing()
      setCodigoCurso('0')
      setActiveTab('administrar')

      if(!show){
          setShowInvitarRing(false)
      }

    }, [show])

    let nivelesAcademicos = []
    if(ring.ring_nivel_academicos){
      
       nivelesAcademicos = ring.ring_nivel_academicos.map(nivelAcademico => ({
         codigo: nivelAcademico.nivel_academico.codigo,
         descripcion: nivelAcademico.nivel_academico.descripcion,
      }))
      
    }
    
    const listarUsuariosRing = async() =>{
      try {
        
        const resp = await clienteAxios.get('/api/ring-usuarios/listar/usuarios-ring',{
          params: {
            codigoRing: ring.codigo
          }
        })
        console.log(resp.data.usuariosRing)
        setUsuariosRing(resp.data.usuariosRing)

      } catch (e) {
        handleError(e)
      }

    }

    const handleShowInvitarRing = () => {
      setShowInvitarRing(!showInvitarRing)
    }

    const handleSelectTab = tab => {
      if(tab === 'usuarios'){
        listarUsuariosRing()
      }
      setActiveTab(tab)
    }

    

    return (
    
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
        <Modal.Title>
            <Row className="ml-3">
                <Logo />
                <h4 className="ml-2">
                {!showInvitarRing 
                ?
                'Agregar alumnos al evento' 
                :
                'Invitar a otros profesores'
                } </h4>
            </Row>
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Container>
            <Tabs 
              defaultActiveKey="profile" 
              id="uncontrolled-tab-example"
              activeKey={activeTab}
              onSelect={handleSelectTab}
            >
              <Tab eventKey="administrar" title="Administrar usuarios">
              
                {!showInvitarRing
                ?
                <>
                  <Row>
                    <Col xs={12} lg={8} className="mb-2 mb-lg-0">
                      <Row>
                        <Col>
                            <Form.Label>Mis Cursos</Form.Label>
                            <InputSelectCursosUsuarioNivelAcademicoInstitucion
                                as="select"
                                rut_usuario={usuario.rut}
                                niveles_academicos={nivelesAcademicos.map(nivelAcademico => nivelAcademico.codigo)}
                                codigo_institucion={institucion_select.codigo}
                                value={codigo_curso}
                                onChange={e => {
                                  setCodigoCurso(e.target.value)
                                }}
                            />
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={12} lg={4} className="d-flex align-items-end">
                        <Button
                          variant={"info"}
                          className="btn-block"
                          onClick={handleShowInvitarRing}
                        >
                          Invitar otros profesores
                        </Button>
                    </Col>
                  </Row>
                  {codigo_curso !== '0' &&        
                      <TableRingUsuariosCurso 
                        ring={ring}
                        codigo_curso={codigo_curso}
                      />
                  }
                </>
                :
                  <InvitarRing 
                    ring ={ring}
                    nivelesAcademicos={nivelesAcademicos}
                    handleShowInvitarRing={handleShowInvitarRing}
                  />
                }
              </Tab>
              {usuariosRing.length > 0 &&
                <Tab eventKey="usuarios" title="Usuarios">
                  <TableRingUsuarios 
                    usuariosRing={usuariosRing}
                  />
                </Tab>
              }
            </Tabs>
            </Container>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
  )
}

export default ModalRingUsuarios