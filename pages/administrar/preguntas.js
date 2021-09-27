import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col, Button, Form, Card, Accordion } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Layout from '../../components/layout/Layout'
import Privado from '../../components/layout/Privado'

import PreguntaForm from '../../components/forms/PreguntaForm'
import TablePregunta from '../../components/ui/TablePregunta'
import AlertText from '../../components/ui/AlertText'
import Paginador from '../../components/ui/Paginador'
import { handleError } from '../../helpers'
import clienteAxios from '../../config/axios'
import AuthContext from '../../context/auth/AuthContext'
import FiltrosBusquedaClasificacionPregunta from '../../components/forms/FiltrosBusquedaClasificacionPregunta'
import FiltrosBusquedaHabilidadesPregunta from '../../components/forms/FiltrosBusquedaHabilidadesPregunta'


const Preguntas = () => {

   const { usuario, rol_select } = useContext(AuthContext)
   const [preguntas, setPreguntas] = useState([])
   const [pregunta_modificar, setPreguntaModificar] = useState(null)

   const [filtrosClasificacion, setFiltrosClasificacion] = useState({
      materias: [],
      unidades: [],
      modulos: [],
      contenidos: [],
      temas: [],
      conceptos: [],
   })
   const [filtrosHabilidades, setFiltrosHabilidades] = useState({
      recordar: 0,
      comprender: 0,
      aplicar: 0,
      analizar: 0,
      evaluar: 0,
      crear: 0
   })

   const [mostrar_busqueda, setMostrarBusqueda] = useState(true)
   const [textAlert, setTextAlert] = useState('')


   /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1)
   const [resultados_por_pagina, setResultadosPorPagina] = useState(5)

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina
   const resultados_pagina = preguntas.slice(indice_primer_resultado, indice_ultimo_resultado)
   /*************************************/
   
   const listarPreguntas = async () => {
    
      try{
         
         const resp = await clienteAxios.get('/api/preguntas/listar', {
               params: {
                  rut_usuario_creador: rol_select.sys_admin === 0 ? usuario.rut : null,
                  materias: filtrosClasificacion.materias,
                  unidades: filtrosClasificacion.unidades,
                  modulos: filtrosClasificacion.modulos,
                  contenidos: filtrosClasificacion.contenidos,
                  temas: filtrosClasificacion.temas,
                  conceptos: filtrosClasificacion.conceptos,
                  recordar: filtrosHabilidades.recordar, 
                  comprender: filtrosHabilidades.comprender,
                  aplicar: filtrosHabilidades.aplicar, 
                  analizar: filtrosHabilidades.analizar, 
                  evaluar: filtrosHabilidades.evaluar, 
                  crear: filtrosHabilidades.crear,
               }
         })
         if(resp.data.preguntas.length > 0){
            setTextAlert("")
         }else{
            setTextAlert("No se encontraron resultados")
         }
         setPreguntas(resp.data.preguntas)
         
         setPaginaActual(1)
       
      }catch(e){
         handleError(e)
      }

   }

   const handleClickBuscar = () => {
      listarPreguntas()
   }

   const handleEliminaPregunta = async codigo => {

      try{
          //Elimina de la base de datos.
          await clienteAxios.delete(`/api/preguntas/eliminar/${codigo}`)
          //Si no hay error, entonces quita del state la pregunta eliminada.
          const new_preguntas = preguntas.filter(pregunta => pregunta.codigo !== codigo)
          setPreguntas(new_preguntas)

          toast.success('PREGUNTA ELIMINADA', {containerId: 'sys_msg'})

      }catch(e){
          handleError(e)
      }

   }

   const handleModificaPregunta = async codigo => {
      try{
         const resp = await clienteAxios.get(`/api/preguntas/datos/${codigo}`)
         setPreguntaModificar(resp.data.pregunta)
         setMostrarBusqueda(false)
      }catch(e){
         handleError(e)
      }
   }

   const handleCrearPregunta = () => {
      setPreguntaModificar(null)
      setMostrarBusqueda(false)
      setTextAlert('')
   }

   const handleMostrarBusquedaPreguntas = () => {
      setPreguntaModificar(null)
      setMostrarBusqueda(true)
   }

   const handleSetPaginaActual = numero_pagina => {
      setPaginaActual(numero_pagina)
   }

   const handleFiltrosClasificacion = value => {
      setFiltrosClasificacion(value)
   }

   const handleFiltrosHabilidades = value => {
      setFiltrosHabilidades(value)
   }
   
   return ( 
      <Layout>
         <Privado>
               <Container>
               <h5 className="text-center my-4">Administrar Preguntas</h5>
               <Card>
               <Card.Body> 
               {mostrar_busqueda 
               ?
                  <>
                     <Accordion defaultActiveKey="0">
                        <Card>
                           <Card.Header>
                           <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                 Mostrar u ocultar filtros...
                           </Accordion.Toggle>
                           </Card.Header>
                           <Accordion.Collapse eventKey="0">
                              <Card.Body>
                                 <Row>
                                    <Col>
                                       <h6 className="text-muted">Clasificación</h6>
                                    </Col>
                                 </Row>
                                 <Row>
                                    <Col>
                                       <FiltrosBusquedaClasificacionPregunta
                                          handleClasificacion={handleFiltrosClasificacion}
                                       />
                                    </Col>
                                 </Row>
                                 <Row className="mt-3">
                                    <Col>
                                       <h6 className="text-muted">Habilidades</h6>
                                    </Col>
                                 </Row>
                                 <Row>
                                    <Col>
                                       <FiltrosBusquedaHabilidadesPregunta
                                          handleHabilidades={handleFiltrosHabilidades}
                                       />
                                    </Col>
                                 </Row>
                                 
                              </Card.Body>
                           </Accordion.Collapse>
                        </Card>
                     </Accordion>
                     <Row className="mt-3">
                        <Col className="d-flex justify-content-end">
                           <Button
                              variant="info"
                              onClick={handleClickBuscar}
                           >
                              Buscar
                           </Button>
                           <Button 
                              variant="info"
                              className="ml-3"
                              onClick={handleCrearPregunta}
                           >
                              + Crear Pregunta
                           </Button>
                        </Col>
                     </Row>
                  </> 
               :
                  <Row>
                     <PreguntaForm
                        pregunta_modificar = {pregunta_modificar}
                        handleMostrarBusquedaPreguntas = {handleMostrarBusquedaPreguntas}
                     />
                  </Row>
               } 
               </Card.Body> 
               </Card>
               </Container>   

               <Container>   
                  <Row className="mx-0">
                     {preguntas.length > 0 && mostrar_busqueda
                     ?
                        <Col className="mt-4 d-flex flex-column">
                           <div className="align-self-end">
                              <Paginador
                                    resultados_por_pagina = {resultados_por_pagina}
                                    total_resultados = {preguntas.length}
                                    handleSetPaginaActual = {handleSetPaginaActual}
                                    pagina_activa = {pagina_actual}
                              />
                           </div>
                           <TablePregunta 
                              preguntas={resultados_pagina}
                              pagina_actual = {pagina_actual}
                              resultados_por_pagina = {resultados_por_pagina}
                              handleEliminaPregunta = {handleEliminaPregunta}
                              handleModificaPregunta = {handleModificaPregunta}
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
 
export default Preguntas