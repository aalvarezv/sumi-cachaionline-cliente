import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Layout from '../../components/layout/Layout'
import Privado from '../../components/layout/Privado'

import PreguntaForm from '../../components/forms/PreguntaForm'
import TablePregunta from '../../components/ui/TablePregunta'
import AlertText from '../../components/ui/AlertText'
import Paginador from '../../components/ui/Paginador'
import { handleError } from '../../helpers'
import clienteAxios from '../../config/axios'
import InputSelectMateria from '../../components/ui/InputSelectMateria'
import InputSelectUnidadesMateria from '../../components/ui/InputSelectUnidadesMateria'
import InputSelectModulosUnidad from '../../components/ui/InputSelectModulosUnidad'
import InputSelectModulosContenido from '../../components/ui/InputSelectModulosContenido'
import InputSelectModulosContenidoTema from '../../components/ui/InputSelectModulosContenidoTema'
import InputSelectModulosContenidoTemaConcepto from '../../components/ui/InputSelectModulosContenidoTemaConcepto'


const Preguntas = () => {

   const [preguntas, setPreguntas] = useState([])
   const [pregunta_modificar, setPreguntaModificar] = useState(null)
   const [filtros, setFiltros] = useState({
      codigo_materia: '0',
      codigo_unidad: '0',
      codigo_modulo: '0',
      codigo_modulo_contenido: '0',
      codigo_modulo_contenido_tema: '0',
      codigo_modulo_contenido_tema_concepto: '0',
      nombre_usuario_creador: ''
   })
   const [mostrar_busqueda, setMostrarBusqueda] = useState(true)
   const [textAlert, setTextAlert] = useState('')

   const { codigo_materia, codigo_unidad, codigo_modulo, codigo_modulo_contenido,
          codigo_modulo_contenido_tema, codigo_modulo_contenido_tema_concepto,
          nombre_usuario_creador } = filtros
   /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1)
   const [resultados_por_pagina, setResultadosPorPagina] = useState(5)

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina
   const resultados_pagina = preguntas.slice(indice_primer_resultado, indice_ultimo_resultado)
   /*************************************/
   
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
      
      listarPreguntas({
         codigo_materia,
         codigo_unidad,
         codigo_modulo,
         codigo_modulo_contenido,
         codigo_modulo_contenido_tema,
         codigo_modulo_contenido_tema_concepto,
         nombre_usuario_creador,
      })
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
                     <Row className="d-flex justify-content-center">
                        <Col className="mb-2 mb-lg-0" xs={12} lg={6}>
                           <Row className="mb-2">
                              <Col className="mb-2 mb-lg-0" xs={12} lg={6}>
                                 <InputSelectMateria
                                    id="codigo_materia"
                                    name="codigo_materia"
                                    as="select"
                                    size="sm"
                                    label="TODAS LAS MATERIAS"
                                    value={codigo_materia}
                                    onChange={e => setFiltros({
                                          ...filtros,
                                          codigo_unidad: '0',
                                          codigo_modulo: '0',
                                          codigo_modulo_contenido: '0',
                                          codigo_modulo_contenido_tema: '0',
                                          codigo_modulo_contenido_tema_concepto: '0',
                                          [e.target.name]: e.target.value,
                                    })}
                                 />
                              </Col>
                              <Col>
                                 <InputSelectUnidadesMateria
                                    id="codigo_unidad"
                                    name="codigo_unidad"
                                    /*codigo materia se le pasa a las props del componente
                                    para filtrar las unidades de la materia seleccionada.*/
                                    codigo_materia= {codigo_materia}
                                    as="select"
                                    size="sm"
                                    label="TODAS LAS UNIDADES"
                                    value={codigo_unidad}
                                    onChange={e => setFiltros({
                                          ...filtros,
                                          codigo_modulo: '0',
                                          codigo_modulo_contenido: '0',
                                          codigo_modulo_contenido_tema: '0',
                                          codigo_modulo_contenido_tema_concepto: '0',
                                          [e.target.name]: e.target.value,
                                    })}
                                 />
                              </Col>
                           </Row>
                           <Row className="mb-2">
                              <Col className="mb-2 mb-lg-0" xs={12} lg={6}>
                                 <InputSelectModulosUnidad
                                    id="codigo_modulo"
                                    name="codigo_modulo"
                                    /*codigo unidad se le pasa a las props del componente
                                    para filtrar los modulos de la unidad seleccionada.*/
                                    codigo_unidad= {codigo_unidad}
                                    as="select"
                                    size="sm"
                                    label="TODOS LOS MÓDULOS"
                                    value={codigo_modulo}
                                    onChange={e => setFiltros({
                                          ...filtros,
                                          codigo_modulo_contenido: '0',
                                          codigo_modulo_contenido_tema: '0',
                                          codigo_modulo_contenido_tema_concepto: '0',
                                          [e.target.name]: e.target.value
                                    })}
                                 /> 
                              </Col>
                              <Col>
                                 <InputSelectModulosContenido
                                    id="codigo_modulo_contenido"
                                    name="codigo_modulo_contenido"
                                 
                                    /*codigo modulo se le pasa a las props del componente
                                    para filtrar las propiedades del modulo seleccionado.*/
                                    codigo_modulo={codigo_modulo}
                                    as="select"
                                    size="sm"
                                    label="TODOS LOS CONTENIDOS"
                                    value={codigo_modulo_contenido}
                                    onChange={e => setFiltros({
                                          ...filtros,
                                          codigo_modulo_contenido_tema: '0',
                                          codigo_modulo_contenido_tema_concepto: '0',
                                          [e.target.name]: e.target.value
                                    })}
                                 />
                              </Col>
                           </Row>
                           <Row className="mb-2">
                              <Col className="mb-2 mb-lg-0" xs={12} lg={6}>
                                 <InputSelectModulosContenidoTema
                                    id="codigo_modulo_contenido_tema"
                                    name="codigo_modulo_contenido_tema"
                                    
                                    /*codigo contenido se le pasa a las props del componente
                                    para filtrar las propiedades del modulo seleccionado.*/
                                    codigo_modulo_contenido={codigo_modulo_contenido}
                                    as="select"
                                    size="sm"
                                    label="TODOS LOS TEMAS"
                                    value={codigo_modulo_contenido_tema}
                                    onChange={e => setFiltros({
                                          ...filtros,
                                          codigo_modulo_contenido_tema_concepto: '0',
                                          [e.target.name]: e.target.value
                                    })}
                                 />
                              </Col>
                              <Col>
                                 <InputSelectModulosContenidoTemaConcepto
                                    id="codigo_modulo_contenido_tema_concepto"
                                    name="codigo_modulo_contenido_tema_concepto"

                                    /*codigo contenido se le pasa a las props del componente
                                    para filtrar las propiedades del modulo seleccionado.*/
                                    codigo_modulo_contenido_tema={codigo_modulo_contenido_tema}
                                    as="select"
                                    size="sm"
                                    label="TODOS LOS CONCEPTOS"
                                    value={codigo_modulo_contenido_tema_concepto}
                                    onChange={e => setFiltros({
                                    ...filtros,
                                    [e.target.name]: e.target.value
                                    })}
                                 />
                              </Col>
                           </Row>
                           <Row>
                              <Col>
                                 <Form.Control
                                    id="nombre_usuario_creador"
                                    name="nombre_usuario_creador"
                                    type="text" 
                                    size="sm"
                                    placeholder="CREADA POR USUARIO..." 
                                    value={nombre_usuario_creador}
                                    onChange={e => {
                                    setFiltros({
                                          ...filtros,
                                          [e.target.name]: e.target.value
                                    })
                                    }} 
                                 />
                              </Col>
                           </Row>
                        </Col>  
                        <Col className="d-flex align-items-end mb-2 mb-lg-0" xs={12} lg="auto">
                           <Button
                              variant="info"
                              className="align-self-end"
                              onClick={handleClickBuscar}
                              block
                           >
                              Buscar
                           </Button>
                        </Col>
                        <Col className="d-flex align-items-end mb-2 mb-lg-0" xs={12} lg="auto">
                        <Button 
                           variant="info"
                           className="btn-block"
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