import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Badge } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Layout from '../../components/layout/Layout'
import Privado from '../../components/layout/Privado'
import FiltrosBusquedaPregunta from '../../components/ui/FiltrosBusquedaPregunta'
import PreguntaForm from '../../components/forms/PreguntaForm'
import TablePregunta from '../../components/ui/TablePregunta'
import AlertText from '../../components/ui/AlertText'
import Paginador from '../../components/ui/Paginador'
import { handleError } from '../../helpers'
import clienteAxios from '../../config/axios'

const Preguntas = () => {

   const [preguntas, setPreguntas] = useState([])
   const [crear_pregunta, setCrearPregunta] = useState(false)
   const [modificar_pregunta, setModificarPregunta] = useState(false)
   const [pregunta_modificar, setPreguntaModificar] = useState(null)
   const [mensajeAlerta, fnSetMensajeAlerta] = useState('')
   /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1)
   const [resultados_por_pagina, setResultadosPorPagina] = useState(5)

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina
   const resultados_pagina = preguntas.slice(indice_primer_resultado, indice_ultimo_resultado)
   /*************************************/

   useEffect(() => {
      fnSetMensajeAlerta('')
   }, [])
   
   const listarPreguntas = async filtros => {
      try{
    
         const resp = await clienteAxios.get('/api/preguntas/listar', {
               params: {
                  codigo_materia: filtros.codigo_materia,
                  codigo_unidad: filtros.codigo_unidad,
                  codigo_modulo: filtros.codigo_modulo,
                  codigo_modulo_contenido: filtros.codigo_modulo_contenido,
                  codigo_modulo_contenido_tema: filtros.codigo_modulo_contenido_tema,
                  codigo_modulo_contenido_tema_concepto: filtros.codigo_modulo_contenido_tema_concepto,
                  nombre_usuario_creador: filtros.nombre_usuario_creador,
               }
         })
    
         setPreguntas(resp.data.preguntas)

         if(resp.data.preguntas.length === 0){
            fnSetMensajeAlerta('No hay resultados')
         }

      }catch(e){
         handleError(e)
      }
   }

   const handleClickBuscar = filtros => {
      setPaginaActual(1)
      listarPreguntas(filtros)
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
         
         setModificarPregunta(true)
      }catch(e){
         handleError(e)
      }
   }

   const handleCrearPregunta = () => {
      setPreguntaModificar(null)
      setCrearPregunta(true)
   }

   const handleMostrarBusquedaPreguntas = () => {
      setPreguntaModificar(null)
      //setPreguntas([])
      setModificarPregunta(false)
      setCrearPregunta(false)
      setPaginaActual(1)
   }

   const handleSetPaginaActual = numero_pagina => {
      setPaginaActual(numero_pagina)
   }
    
     return ( 
        <Layout>
           <Privado>
               <>
                  <h5 className="my-4 text-center">Administrar Preguntas</h5>
                  {!modificar_pregunta && !crear_pregunta
                  ?
                  <Container>
                     <Row className="mx-0 mb-2">
                        <Col className="d-flex justify-content-end">     
                        <Button
                           variant="info"
                           onClick={handleCrearPregunta}
                        >
                           + Nueva Pregunta
                        </Button>
                        </Col>
                     </Row>
                     <Row className="mb-2">
                        <Col>           
                           <FiltrosBusquedaPregunta 
                              filtros_default= {{
                                 codigo_materia: '0',
                                 codigo_unidad: '0',
                                 codigo_modulo: '0',
                                 codigo_modulo_contenido: '0',
                                 codigo_modulo_contenido_tema: '0',
                                 codigo_modulo_contenido_tema_concepto: '0',
                                 nombre_usuario_creador: '',
                              }}
                              handleClickBuscar={handleClickBuscar}
                           /> 
                        </Col>
                     </Row>
                     <Row className="mx-0">
                        {/* <Col className={`d-flex flex-column align-items-center justify-content-center ${preguntas.length === 0 ? ' mt-5' : ''}`}> */}
                        {preguntas.length === 0
                        ?
                           <Col className="mt-5">
                              <AlertText  
                                 text={mensajeAlerta}
                              /> 
                           </Col>
                        :
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
                        }   
                        
                     </Row>
                  </Container>   
                  :
                  <PreguntaForm
                     pregunta_modificar = {pregunta_modificar}
                     handleMostrarBusquedaPreguntas = {handleMostrarBusquedaPreguntas}
                  />
                  }   
               </>
           </Privado>
        </Layout>
     )
}
 
export default Preguntas