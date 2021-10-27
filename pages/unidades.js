import React, { useState, useContext } from 'react'
import AuthContext from '../context/auth/AuthContext'
import { Container, Col, Row, Tab, Tabs } from 'react-bootstrap'
import InputSelectNivelAcademico from '../components/ui/InputSelectNivelAcademico'
import InputSelectCursos from '../components/ui/InputSelectCursosNivelAcademicoInstitucion'
import ListUnidadesMineducNivelAcademicoObjetivos from '../components/ui/ListUnidadesMineducNivelAcademicoObjetivos'
import ListUnidadesMineducNivelAcademicoHabilidades from '../components/ui/ListUnidadesMineducNivelAcademicoHabilidades'
import Layout from '../components/layout/Layout'

const Unidades = () =>{

    const [tabSelect, setTabSelect] = useState('objetivos')
    const { institucion_select } = useContext(AuthContext)
    const [codigo_nivel_academico, setCodigoNivelAcademico] = useState('0')
    const [codigo_curso, setCodigoCurso] = useState('0')

    if (!institucion_select){
        return null
    }

    


    return (
    <Layout>
        <Container className="mt-5">
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
                    <InputSelectCursos
                        id="codigo_curso"
                        name="codigo_curso"
                        as="select"
                        size="sm"
                        label="SELECCIONE CURSO"
                        value={codigo_curso}
                        codigo_nivel_academico={codigo_nivel_academico}
                        codigo_institucion={institucion_select.codigo}
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
                >
                    <Tab eventKey="objetivos" title="Objetivos">
                        <ListUnidadesMineducNivelAcademicoObjetivos
                            codigoCurso={codigo_curso}
                        />
                    </Tab>
                    <Tab eventKey="habilidades" title="Habilidades">
                        <ListUnidadesMineducNivelAcademicoHabilidades
                            codigoCurso={codigo_curso}
                        />
                    </Tab>
                </Tabs>
            </Col>
        </Row>
        </Container>  
    </Layout>
  )
}

export default Unidades