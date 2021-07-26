import React, { useContext, useState } from 'react'
import {Alert, Container, Row, Col, Button, Card } from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { toast } from 'react-toastify'
import AlertText from '../../components/ui/AlertText'
import {handleError} from '../../helpers'
import Layout from '../../components/layout/Layout'
import Privado from '../../components/layout/Privado'
import Paginador from '../../components/ui/Paginador'
import InputSelectNivelAcademico from '../../components/ui/InputSelectNivelAcademico'
import CursoForm from '../../components/forms/CursoForm'
import TableCursos from '../../components/ui/TableCursos'
import AuthContext from '../../context/auth/AuthContext'
import AlertMostrarBusqueda from '../../components/ui/AlertMostrarBusqueda'


const Cursos = () => {

   const { institucion_select } = useContext(AuthContext)
      
   const [cursos, setCursos] = useState([])
   const [cursoEnProceso, setCursoEnProceso] = useState(null)
   const [mostrar_busqueda, setMostrarBusqueda] = useState(true)
   const [codigo_nivel_academico, setCodigoNivelAcademico] = useState('0')
   const [textAlert, setTextAlert] = useState('')
   /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1)
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10)

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina
   const resultados_pagina = cursos.slice(indice_primer_resultado, indice_ultimo_resultado)
   /*************************************/

   const handleClickBuscar = async () => {
     
      try{
         const resp = await clienteAxios.get(`/api/cursos/busqueda/institucion-nivel-academico/`, {
            params: {
               codigo_institucion: institucion_select.codigo,
               codigo_nivel_academico,
            }
         })
   
         setCursos(resp.data.cursos)
         if(resp.data.cursos.length > 0){
            setTextAlert("")
         }else{
            setTextAlert("No se encontraron resultados")
         }
         setPaginaActual(1)
      
      }catch(e){
         handleError(e)
      }
   }

   const handleClickModificarCurso = async codigo => {
      
      const curso = cursos.filter(curso => curso.codigo === codigo)
      if(curso.length > 0){
         setMostrarBusqueda(false)
         setCursoEnProceso(curso[0])
      }
   }

   const handleClickEliminarCurso = async codigo => {
      try {
        await clienteAxios.delete(`/api/cursos/eliminar/${codigo}`)
        const new_cursos = cursos.filter(curso => curso.codigo !== codigo)
        setCursos(new_cursos)
        toast.success('Curso eliminado', {containerId: 'sys_msg'})
     } catch (e) {
        handleError(e)
     }
   }

   const handleClickMostrarBusqueda = () =>{
      setMostrarBusqueda(true)
   }

   const handleSetPaginaActual = numero_pagina => {
      setPaginaActual(numero_pagina)
   }
   
   
   return ( 
         <Layout>
         <Privado>
            <Container>
            {mostrar_busqueda
            ?
               <h5 className="text-center my-4">Administrar Cursos</h5> 
            :
               <AlertMostrarBusqueda
                  label={cursoEnProceso ? 'Modificar curso' : 'Crear nuevo curso'}
                  handleClickMostrarBusqueda={handleClickMostrarBusqueda}
               />
            }
            <Card>
            <Card.Body>
            
            {mostrar_busqueda 
            ?
            <> 
            <Row className="d-flex justify-content-center">
               <Col className="mb-2 mb-sm-0" xs={12} sm={6}>
                  <Row className="mb-2">
                     <Col>
                        <InputSelectNivelAcademico
                           id="codigo_nivel_academico"
                           name="codigo_nivel_academico"
                           as="select"
                           size="sm"
                           label="TODAS LOS NIVELES ACADEMICOS"
                           value={codigo_nivel_academico}
                           onChange={e => setCodigoNivelAcademico(e.target.value)}
                        />
                     </Col>
                  </Row>
               </Col>
               <Col className="d-flex align-items-end mb-2 mb-sm-0" xs={12} sm="auto">
                  <Button 
                     variant="info"
                     className="btn-block "
                     onClick={e =>{
                        handleClickBuscar()
                     }}>
                     Buscar
                  </Button>
               </Col>
               <Col className="d-flex align-items-end mb-2 mb-sm-0" xs={12} sm="auto">
                  <Button 
                     variant="info"
                     className="btn-block"
                     onClick={e =>{
                        setCursoEnProceso(null)
                        setMostrarBusqueda(false)
                        setTextAlert('')
                     }}>
                     + Agregar
                  </Button>
               </Col>
            </Row> 
            </>
            :
            <Row>
               <CursoForm
                  cursoEnProceso = {cursoEnProceso}
                  setCursoEnProceso={setCursoEnProceso}
               />
            </Row>
            }
            </Card.Body>
            </Card>
            </Container>
            
            <Container>
               <Row>
                  {cursos.length > 0 && mostrar_busqueda
                  ?
                  <Col className="mt-5 d-flex flex-column">
                     <div className="align-self-end">
                        <Paginador
                           resultados_por_pagina = {resultados_por_pagina}
                           total_resultados = {cursos.length}
                           handleSetPaginaActual = {handleSetPaginaActual}
                           pagina_activa = {pagina_actual}
                        />
                     </div>
                     <TableCursos
                        cursos = {resultados_pagina}
                        pagina_actual = {pagina_actual}
                        resultados_por_pagina = {resultados_por_pagina}
                        handleClickModificarCurso = {handleClickModificarCurso}
                        handleClickEliminarCurso = {handleClickEliminarCurso}
                     /> 
                  </Col>
                  :
                  <Col className="mt-5">
                     <AlertText
                        text={textAlert}
                     />
                  </Col>
                     
                  }
               </Row>
            </Container>
         </Privado>
         </Layout>
     )
}
 
export default Cursos