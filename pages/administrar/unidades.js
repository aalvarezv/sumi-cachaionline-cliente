import React, { useState } from 'react'
import {Container, Row, Col, Button, Card, Form} from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { toast } from 'react-toastify'
import AlertText from '../../components/ui/AlertText'
import {handleError} from '../../helpers'
import Layout from '../../components/layout/Layout'
import Privado from '../../components/layout/Privado'
import Paginador from '../../components/ui/Paginador'
import InputSelectMateria from '../../components/ui/InputSelectMateria'
import UnidadForm from '../../components/forms/UnidadForm'
import TableUnidad from '../../components/ui/TableUnidad'


const Unidades = () => {

   const [filtro, setFiltroBusqueda] = useState('')
   const [unidades, setUnidades] = useState([])
   const [unidad_modificar, setUnidadModificar] = useState(null)
   const [mostrar_busqueda, setMostrarBusqueda] = useState(true)
   const [codigo_materia, setCodigoMateria] = useState('0')
   const [textAlert, setTextAlert] = useState('')
   /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1)
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10)

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina
   const resultados_pagina = unidades.slice(indice_primer_resultado, indice_ultimo_resultado)
   /*************************************/

   const handleClickBuscar = async () => {
     
      try{
         
         const resp = await clienteAxios.get(`/api/unidades/busqueda/descripcion-materia/`, {
            params: {
               codigo_materia,
               descripcion: filtro
            }
         })
         setUnidades(resp.data.unidades)
         if(resp.data.unidades.length > 0){
            setTextAlert("")
         }else{
            setTextAlert("No se encontraron resultados")
         }
         setPaginaActual(1)

      }catch(e){
         handleError(e)
      }
   }

   const handleClickModificarUnidad = async codigo => {
      
      const unidad = unidades.filter(unidad => unidad.codigo === codigo)
      if(unidad.length > 0){
         setMostrarBusqueda(false)
         setUnidadModificar(unidad[0])
      }
   }

   const handleClickEliminarUnidad = async codigo => {
      try {
        await clienteAxios.delete(`/api/unidades/eliminar/${codigo}`)
        const new_unidades = unidades.filter(unidad => unidad.codigo !== codigo)
        setUnidades(new_unidades)
        toast.success('UNIDAD ELIMINADA', {containerId: 'sys_msg'})
     } catch (e) {
        handleError(e)
     }
   }

   const handleClickVolver = () =>{
      setMostrarBusqueda(true)
      setUnidades([])
      setCodigoMateria('0')
      setFiltroBusqueda('')
   }

   const handleSetPaginaActual = numero_pagina => {
      setPaginaActual(numero_pagina)
   }
   
   return ( 
         <Layout>
         <Privado>
            <Container>
            <h5 className="text-center my-4">Administrar Unidades</h5>
            <Card>
            <Card.Body>
            
            {mostrar_busqueda 
            ?
            <> 
            <Row className="d-flex justify-content-center">
               <Col className="mb-2 mb-sm-0" xs={12} sm={6}>
                  <Row className="mb-2">
                     <Col>
                        <InputSelectMateria
                           id="codigo_materia"
                           name="codigo_materia"
                           as="select"
                           size="sm"
                           label="TODAS LAS MATERIAS"
                           value={codigo_materia}
                           onChange={e => setCodigoMateria(e.target.value)}
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
                           placeholder="Búsqueda por descripción de la unidad..."
                           onChange={e => {
                              setFiltroBusqueda(e.target.value)
                           }}
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
                        setUnidadModificar(null)
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
               <UnidadForm
                  unidad_modificar = {unidad_modificar}
                  handleClickVolver = {handleClickVolver}
               />
            </Row>
            }
            </Card.Body>
            </Card>
            </Container>
            
            <Container>
               <Row>
                  {unidades.length > 0 && mostrar_busqueda
                  ?
                  <Col className="mt-5 d-flex flex-column">
                     <div className="align-self-end">
                        <Paginador
                           resultados_por_pagina = {resultados_por_pagina}
                           total_resultados = {unidades.length}
                           handleSetPaginaActual = {handleSetPaginaActual}
                           pagina_activa = {pagina_actual}
                        />
                     </div>
                     <TableUnidad
                        unidades={resultados_pagina}
                        pagina_actual = {pagina_actual}
                        resultados_por_pagina = {resultados_por_pagina}
                        handleClickModificarUnidad = {handleClickModificarUnidad}
                        handleClickEliminarUnidad = {handleClickEliminarUnidad}
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
 
export default Unidades