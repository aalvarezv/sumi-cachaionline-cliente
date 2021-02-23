import React, { useState } from 'react'
import {Container, Row, Col, Button, Form, Card} from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { toast } from 'react-toastify'
import AlertText from '../../components/ui/AlertText'
import {handleError} from '../../helpers'
import Layout from '../../components/layout/Layout'
import Privado from '../../components/layout/Privado'
import Paginador from '../../components/ui/Paginador'
import ConceptoForm from '../../components/forms/ConceptoForm'
import TableConcepto from '../../components/ui/TableConcepto'
import InputSelectMateria from '../../components/ui/InputSelectMateria'
import InputSelectUnidadesMateria from '../../components/ui/InputSelectUnidadesMateria'
import InputSelectModulosUnidad from '../../components/ui/InputSelectModulosUnidad'
import InputSelectModulosContenido from '../../components/ui/InputSelectModulosContenido'
import InputSelectModulosContenidoTema from '../../components/ui/InputSelectModulosContenidoTema'


const Conceptos = () => {

   const [filtro, setFiltroBusqueda] = useState('')
   const [conceptos, setConceptos] = useState([])
   const [concepto_modificar, setConceptoModificar] = useState({})
   const [mostrar_busqueda, setMostrarBusqueda] = useState(true)
   const [codigo_materia, setCodigoMateria] = useState('0')
   const [codigo_unidad, setCodigoUnidad] = useState('0')
   const [codigo_modulo, setCodigoModulo] = useState('0')
   const [codigo_modulo_contenido, setCodigoContenido] = useState('0')
   const [codigo_modulo_contenido_tema, setCodigoContenidoTema] = useState('0')
   const [textAlert, setTextAlert] = useState('')
   /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1)
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10)

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina
   const resultados_pagina = conceptos.slice(indice_primer_resultado, indice_ultimo_resultado)
   /*************************************/

   const handleClickBuscar = async () => {
      
       try{

            const resp = await clienteAxios.get('/api/conceptos/busqueda/descripcion-tema-contenido-modulo-unidad-materia/',{
               params: {
                  codigo_modulo_contenido_tema,
                  codigo_modulo_contenido,
                  codigo_modulo,
                  codigo_unidad,
                  codigo_materia,
                  descripcion: filtro,
               }
            })

            setConceptos(resp.data.conceptos)
            if(resp.data.conceptos.length > 0){
               setTextAlert("")
            }else{
               setTextAlert("No se encontraron resultados")
            }
            setPaginaActual(1)
            
       }catch(e){
           handleError(e)
       }
   }

   const handleClickModificarConcepto = async codigo => {
      
      const concepto = conceptos.filter(concepto => concepto.codigo === codigo)
      if(concepto.length > 0){
         setMostrarBusqueda(false)
         setConceptoModificar(concepto[0])
      }

   }

    const handleClickEliminarConcepto = async codigo => {
       try {
         await clienteAxios.delete(`/api/conceptos/eliminar/${codigo}`)
         const new_conceptos = conceptos.filter(concepto => concepto.codigo !== codigo)
         setConceptos(new_conceptos)
         toast.success('CONCEPTO ELIMINADO', {containerId: 'sys_msg'})
      } catch (e) {
         handleError(e)
      }
    }

    const handleClickVolver = () =>{
       setMostrarBusqueda(true)
       setConceptos([])
       setCodigoMateria('0')
       setCodigoUnidad('0')
       setCodigoModulo('0')
       setCodigoContenido('0')
       setCodigoContenidoTema('0')
       setFiltroBusqueda('')
    }

   const handleSetPaginaActual = numero_pagina => {
      setPaginaActual(numero_pagina)
   }

    return ( 
         <Layout>
         <Privado>
            <Container>
            <h5 className="text-center my-4">Administrar Conceptos</h5>
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
                           onChange={e =>{
                              setCodigoMateria(e.target.value)
                              setCodigoUnidad('0')
                              setCodigoModulo('0')
                              setCodigoContenido('0')
                              setCodigoContenidoTema('0')                              
                           }}
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
                           onChange={e => {
                              setCodigoUnidad(e.target.value)
                              setCodigoModulo('0')
                              setCodigoContenido('0')
                              setCodigoContenidoTema('0')
                           }}
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
                           label="TODOS LOS MODULOS"
                           value={codigo_modulo}
                           onChange={e => {
                              setCodigoModulo(e.target.value)
                              setCodigoContenido('0')
                              setCodigoContenidoTema('0')
                           }}
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
                           onChange={e => {
                              setCodigoContenido(e.target.value)
                              setCodigoContenidoTema('0')
                           }}
                        />
                     </Col>
                  </Row>
                  <Row className="mb-2">
                     <Col>
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
                           onChange={e => setCodigoContenidoTema(e.target.value)}
                        />
                     </Col>
                  </Row>
                  <Row>
                     <Col>
                        <Form.Control 
                           id="descripcion"
                           name="descripcion"
                           type="text"
                           value={filtro} 
                           placeholder="Búsqueda por descripción del concepto..."
                           onChange={e => {
                              setFiltroBusqueda(e.target.value)
                           }}
                        />
                     </Col>
                  </Row>
               </Col>
               <Col className="d-flex align-items-end mb-2 mb-lg-0" xs={12} lg="auto">
                  <Button 
                     variant="info"
                     className="btn-block "
                     onClick={e =>{
                        handleClickBuscar()
                     }}>
                     Buscar
                  </Button>
               </Col>
               <Col className="d-flex align-items-end mb-2 mb-lg-0" xs={12} lg="auto">
                  <Button 
                     variant="info"
                     className="btn-block"
                     onClick={e =>{
                        setConceptoModificar(null)
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
               <ConceptoForm
                  concepto_modificar = {concepto_modificar}
                  handleClickVolver = {handleClickVolver}
               />
            </Row>
            }   
            </Card.Body>
            </Card>
            </Container> 
            
            <Container>
               <Row>
               {conceptos.length > 0 && mostrar_busqueda
                  ?
                  <Col className="mt-5 d-flex flex-column">
                     <div className="align-self-end">
                        <Paginador
                           resultados_por_pagina = {resultados_por_pagina}
                           total_resultados = {conceptos.length}
                           handleSetPaginaActual = {handleSetPaginaActual}
                           pagina_activa = {pagina_actual}
                        />
                     </div>
                     <TableConcepto
                        conceptos={resultados_pagina}
                        pagina_actual = {pagina_actual}
                        resultados_por_pagina = {resultados_por_pagina}
                        handleClickModificarConcepto = {handleClickModificarConcepto}
                        handleClickEliminarConcepto = {handleClickEliminarConcepto}
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
 
export default Conceptos