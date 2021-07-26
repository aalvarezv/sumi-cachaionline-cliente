import React, { useState } from 'react'
import {Container, Row, Col, Button, Form, Card} from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { toast } from 'react-toastify'
import AlertText from '../../components/ui/AlertText'
import {handleError} from '../../helpers'
import Layout from '../../components/layout/Layout'
import Privado from '../../components/layout/Privado'
import Paginador from '../../components/ui/Paginador'
import InstitucionForm from '../../components/forms/InstitucionForm'
import TableInstitucion from '../../components/ui/TableInstitucion'
import AlertMostrarBusqueda from '../../components/ui/AlertMostrarBusqueda'


const Instituciones = () => {

   const [filtro, setFiltroBusqueda] = useState('')
   const [instituciones, setInstituciones] = useState([])
   const [institucionEnProceso, setInstitucionEnProceso] = useState(null)
   const [mostrar_busqueda, setMostrarBusqueda] = useState(true)
   const [textAlert, setTextAlert] = useState('')
    /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1)
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10)

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina
   const resultados_pagina = instituciones.slice(indice_primer_resultado, indice_ultimo_resultado)
   /*************************************/


   const handleClickBuscar = async () => {

      try{

         const resp = await clienteAxios.get('/api/instituciones/busqueda', {
            params: {
               filtro,
            }
         })
         setInstituciones(resp.data.instituciones)
         if(resp.data.instituciones.length > 0){
            setTextAlert("")
         }else{
            setTextAlert("No se encontraron resultados")
         }
         setPaginaActual(1)
            
      }catch(e){
            handleError(e)
      }
   }

   const handleClickModificarInstitucion = async codigo => {
   
      const institucion = instituciones.filter(institucion => institucion.codigo === codigo)
      if(institucion.length > 0){
         setMostrarBusqueda(false)
         setInstitucionEnProceso(institucion[0])
      }

   }

   const handleClickEliminarInstitucion = async codigo => {
      try {
         await clienteAxios.delete(`/api/instituciones/eliminar/${codigo}`)
         const new_instituciones = instituciones.filter(institucion => institucion.codigo !== codigo)
         setInstituciones(new_instituciones)
         toast.success('Institución eliminada', {containerId: 'sys_msg'})
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
               <h5 className="text-center my-4">Administrar Instituciones</h5> 
            :
               <AlertMostrarBusqueda
                  label={institucionEnProceso ? 'Modificar institucion' : 'Crear nueva institucion'}
                  handleClickMostrarBusqueda={handleClickMostrarBusqueda}
               />
            }
            <Card>
            <Card.Body>
            {mostrar_busqueda 
            ?
            <>   
            <Row className="d-flex justify-content-center mt-3">
               <Col className="mb-2 mb-sm-0" xs={12} sm={6}>
                  <Form.Control 
                     id="descripcion"
                     name="descripcion"
                     type="text" 
                     value={filtro} 
                     placeholder="Búsqueda por código ó nombre de institución..."
                     onChange={e => {
                        setFiltroBusqueda(e.target.value)
                     }}
                  />
               </Col>
               <Col className="mb-2 mb-sm-0" xs={12} sm="auto">
                  <Button 
                     variant="info"
                     className="btn-block"
                     onClick={e =>{
                        handleClickBuscar()
                     }}>
                     Buscar
                  </Button>
               </Col>
               <Col className="mb-2 mb-sm-0" xs={12} sm="auto">      
                  <Button 
                     variant="info"
                     className="btn-block"
                     onClick={e =>{
                        setInstitucionEnProceso(null)
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
               <InstitucionForm
                  institucionEnProceso={institucionEnProceso}
                  setInstitucionEnProceso={setInstitucionEnProceso}
               />
            </Row>
            }
            </Card.Body>
            </Card>
            </Container>
            <Container>
               <Row>
               {instituciones.length > 0 && mostrar_busqueda
               ?
                  <Col className="mt-3 d-flex flex-column">
                     <div className="align-self-end">
                        <Paginador
                           resultados_por_pagina = {resultados_por_pagina}
                           total_resultados = {instituciones.length}
                           handleSetPaginaActual = {handleSetPaginaActual}
                           pagina_activa = {pagina_actual}
                        />
                     </div>
                     <TableInstitucion 
                        instituciones={resultados_pagina}
                        pagina_actual = {pagina_actual}
                        resultados_por_pagina = {resultados_por_pagina}
                        handleClickModificarInstitucion = {handleClickModificarInstitucion}
                        handleClickEliminarInstitucion = {handleClickEliminarInstitucion}
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
 
export default Instituciones