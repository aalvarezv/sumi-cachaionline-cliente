import React, { useState, useContext } from 'react'
import AuthContext from '../../context/auth/AuthContext'
import { Card, Container, Col, Row, Tab, Tabs } from 'react-bootstrap'
import InputSelectNivelAcademico from './InputSelectNivelAcademico'
import InputSelectCursosUsuarioNivelAcademicoInstitucion from './InputSelectCursosUsuarioNivelAcademicoInstitucion'
import ListUnidadesMineducNivelAcademicoObjetivos from './ListUnidadesMineducNivelAcademicoObjetivos'
import ListUnidadesMineducNivelAcademicoHabilidades from './ListUnidadesMineducNivelAcademicoHabilidades'


const UnidadesMineduc = () =>{

    const [tabSelect, setTabSelect] = useState('objetivos')
    const { usuario, institucion_select } = useContext(AuthContext)
    const [codigo_nivel_academico, setCodigoNivelAcademico] = useState('0')
    const [codigo_curso, setCodigoCurso] = useState('0')

    return (
        <Container className="mt-5">
            <Card>
            <Card.Body>
                <h4 className="mb-4 text-center">Unidades Mineduc</h4>
                <Row className="mb-2">
                    <Col>
                        <InputSelectNivelAcademico
                            id="codigo_nivel_academico"
                            name="codigo_nivel_academico"
                            as="select"
                            size="sm"
                            label="SELECCIONE NIVEL ACADEMICO"
                            value={codigo_nivel_academico}
                            onChange={e => {
                            setCodigoNivelAcademico(e.target.value)
                            setCodigoCurso('0')
                            }}
                        />
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col>
                        <InputSelectCursosUsuarioNivelAcademicoInstitucion
                            id="codigo_curso"
                            name="codigo_curso"
                            as="select"
                            size="sm"
                            label="SELECCIONE CURSO"
                            value={codigo_curso}
                            rut_usuario={usuario ? usuario.rut : null}
                            niveles_academicos={[codigo_nivel_academico]}
                            codigo_institucion={institucion_select ? institucion_select.codigo : null}
                            onChange={e => setCodigoCurso(e.target.value)}
                        /> 
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Tabs
                            id="unidades"
                            activeKey={tabSelect}
                            onSelect={(key) => setTabSelect(key)}
                            className="px-2"
                        >
                            <Tab eventKey="objetivos" title="Objetivos" className="pt-3">
                                <ListUnidadesMineducNivelAcademicoObjetivos
                                    codigoCurso={codigo_curso}
                                />
                            </Tab>
                            <Tab eventKey="habilidades" title="Habilidades" className="pt-3">
                                <ListUnidadesMineducNivelAcademicoHabilidades
                                    codigoCurso={codigo_curso}
                                />
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Card.Body>
            </Card>
        </Container>  
  )
}

export default UnidadesMineduc