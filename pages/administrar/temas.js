import React, { useState } from 'react'
import {Container, Row, Col, Button, Form, Card} from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { toast } from 'react-toastify'
import AlertText from '../../components/ui/AlertText'
import {handleError} from '../../helpers'
import Layout from '../../components/layout/Layout'
import Privado from '../../components/layout/Privado'
import Paginador from '../../components/ui/Paginador'
import TemaForm from '../../components/forms/TemaForm'
import TableTema from '../../components/ui/TableTema'
import InputSelectMateria from '../../components/ui/InputSelectMateria'
import InputSelectUnidadesMateria from '../../components/ui/InputSelectUnidadesMateria'
import InputSelectModulosUnidad from '../../components/ui/InputSelectModulosUnidad'
import InputSelectModulosContenido from '../../components/ui/InputSelectModulosContenido'
import AlertMostrarBusqueda from '../../components/ui/AlertMostrarBusqueda'


const Temas = () => {

   const [filtro, setFiltroBusqueda] = useState('')
   const [temas, setTemas] = useState([])
   const [temaEnProceso, setTemaEnProceso] = useState({})
   const [mostrar_busqueda, setMostrarBusqueda] = useState(true)
   const [codigo_materia, setCodigoMateria] = useState('0')
   const [codigo_unidad, setCodigoUnidad] = useState('0')
   const [codigo_modulo, setCodigoModulo] = useState('0')
   const [codigo_modulo_contenido, setCodigoContenido] = useState('0')
   const [textAlert, setTextAlert] = useState('')
    /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1)
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10)

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina
   const resultados_pagina = temas.slice(indice_primer_resultado, indice_ultimo_resultado)
   /*************************************/


   const handleClickBuscar = async () => {
      
       try{

            const resp = await clienteAxios.get('/api/temas/busqueda/descripcion-contenido-modulo-unidad-materia/',{
               params: {
                  codigo_modulo_contenido,
                  codigo_modulo,
                  codigo_unidad,
                  codigo_materia,
                  descripcion: filtro,
            }})

            setTemas(resp.data.contenido_tema)

            if(resp.data.contenido_tema.length > 0){
               setTextAlert("")
            }else{
               setTextAlert("No se encontraron resultados")
            }
            setPaginaActual(1)

       }catch(e){
           handleError(e)
       }

   }

   const handleClickModificarTema = async codigo => {
      
      const tema = temas.filter(tema => tema.codigo === codigo)
      if(tema.length > 0){
         setMostrarBusqueda(false)
         setTemaEnProceso(tema[0])
      }
   }

   const handleClickEliminarTema = async codigo => {
       try {
         await clienteAxios.delete(`/api/temas/eliminar/${codigo}`)
         const new_temas = temas.filter(tema => tema.codigo !== codigo)
         setTemas(new_temas)
         toast.success('Tema eliminado', {containerId: 'sys_msg'})
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
               <h5 className="text-center my-4">Administrar Temas</h5> 
            :
               <AlertMostrarBusqueda
                  label={temaEnProceso ? 'Modificar tema' : 'Crear nuevo tema'}
                  handleClickMostrarBusqueda={handleClickMostrarBusqueda}
               />
            }
            <Card>
            <Card.Body>    
            {mostrar_busqueda 
            ?
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
                           onChange={e => {
                              setCodigoMateria(e.target.value)
                              setCodigoUnidad('0')
                              setCodigoModulo('0')
                              setCodigoContenido('0')
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
                           onChange={e => setCodigoContenido(e.target.value)}
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
                           placeholder="Búsqueda por descripción del tema..."
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
                        setTemaEnProceso(null)
                        setMostrarBusqueda(false)
                        setTextAlert('')
                     }}>
                     + Agregar
                  </Button>
               </Col>
            </Row>
            :
            <Row>
               <TemaForm
                  temaEnProceso = {temaEnProceso}
                  setTemaEnProceso = {setTemaEnProceso}
               />
            </Row>
            }   
            
            </Card.Body>
            </Card>
            </Container>
             
            <Container>
               <Row>
               {temas.length > 0 && mostrar_busqueda
               ?
                  <Col className="mt-5 d-flex flex-column">
                     <div className="align-self-end">
                        <Paginador
                           resultados_por_pagina = {resultados_por_pagina}
                           total_resultados = {temas.length}
                           handleSetPaginaActual = {handleSetPaginaActual}
                           pagina_activa = {pagina_actual}
                        />
                     </div>
                     <TableTema
                        temas={resultados_pagina}
                        pagina_actual = {pagina_actual}
                        resultados_por_pagina = {resultados_por_pagina}
                        handleClickModificarTema = {handleClickModificarTema}
                        handleClickEliminarTema = {handleClickEliminarTema}

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
 
export default Temas