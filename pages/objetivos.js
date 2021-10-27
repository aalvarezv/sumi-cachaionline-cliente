import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify'
import Layout from '../components/layout/Layout'
import AuthContext from '../context/auth/AuthContext'
import { Row, Container, Button, Col } from 'react-bootstrap'
import { handleError } from '../helpers'
import clienteAxios from '../config/axios'
import InputSelectNivelAcademico from '../components/ui/InputSelectNivelAcademico'
import InputSelectCursos from '../components/ui/InputSelectCursosNivelAcademicoInstitucion'
import ListUnidadesMineducNivelAcademicoObjetivos from '../components/ui/ListUnidadesMineducNivelAcademicoObjetivos'



const objetivos = () =>{

  /* const { autenticado, institucion_select } = useContext(AuthContext)
  const [codigo_ring, setCodigoRing] = useState('')
  const [preguntas_ring, setPreguntasRing] = useState([])
  const [numero_pregunta_actual, setNumeroPreguntaActual] = useState(0)
  const [codigo_pregunta, setCodigoPregunta] = useState(null)
  const [respuestas, setRespuestas] = useState([])
  const [mostrar_resultados, setMostrarResultados] = useState(false) */

  const { institucion_select } = useContext(AuthContext)
  const [codigo_nivel_academico, setCodigoNivelAcademico] = useState('0')
  const [codigo_curso, setCodigoCurso] = useState('0')

  if (!institucion_select){
    return null
 }



  return (
    
     <>
     <Container>
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
        <ListUnidadesMineducNivelAcademicoObjetivos
          codigoCurso={codigo_curso}
        />
      </Row>
     </Container>
      </>
  
  )
}

export default objetivos