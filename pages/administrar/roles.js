import React, { useState } from 'react'
import {Container, Row, Col, Button, Form, Card} from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { toast } from 'react-toastify'
import AlertText from '../../components/ui/AlertText'
import {handleError} from '../../helpers'
import Layout from '../../components/layout/Layout'
import Privado from '../../components/layout/Privado'
import Paginador from '../../components/ui/Paginador'
import RolForm from '../../components/forms/RolForm'
import TableRol from '../../components/ui/TableRol'
import AlertMostrarBusqueda from '../../components/ui/AlertMostrarBusqueda'


const Roles = () => {

   const [filtro, setFiltroBusqueda] = useState('')
   const [roles, setRoles] = useState([])
   const [rolEnProceso, setRolEnProceso] = useState(null)
   const [mostrar_busqueda, setMostrarBusqueda] = useState(true)
   const [textAlert, setTextAlert] = useState('')
   /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1)
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10)

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina
   const resultados_pagina = roles.slice(indice_primer_resultado, indice_ultimo_resultado)
   /*************************************/

   
   const handleClickBuscar = async () => {

      try{

         const resp = await clienteAxios.get('/api/roles/busqueda',{
            params: {
               filtro,
            }
         })

         setRoles(resp.data.roles)
         if(resp.data.roles.length > 0){
            setTextAlert("")
         }else{
            setTextAlert("No se encontraron resultados")
         }
         setPaginaActual(1)

      }catch(e){
         handleError(e)
      }

   }

   const handleClickModificar = async codigo => {
      
      const rol = roles.filter(rol => rol.codigo === codigo)
      if(rol.length > 0){
         setMostrarBusqueda(false)
         setRolEnProceso(rol[0])
      }

    }

    const handleClickEliminarRol = async codigo => {

      try {

         await clienteAxios.delete(`/api/roles/eliminar/${codigo}`)
         const new_roles = roles.filter(rol => rol.codigo !== codigo)
         setRoles(new_roles)
         toast.success('Rol eliminado', {containerId: 'sys_msg'})

      } catch (e) {
         handleError(e)
      }

   }

    const handleClickMostrarBusqueda = () =>{
       setMostrarBusqueda(true)
       setFiltroBusqueda('')
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
               <h5 className="text-center my-4">Administrar Roles</h5> 
            :
               <AlertMostrarBusqueda
                  label={rolEnProceso ? 'Modificar rol' : 'Crear nuevo rol'}
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
                     placeholder="Búsqueda por código ó descripción del rol..."
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
                        setRolEnProceso(null)
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
               <RolForm
                  rolEnProceso={rolEnProceso}
                  setRolEnProceso={setRolEnProceso}
               />
            </Row>
            }
            
            </Card.Body>
            </Card>
            </Container>
         
            <Container>
               <Row>
               {roles.length > 0 && mostrar_busqueda
               ?
               <Col className="mt-5 d-flex flex-column">
                  <div className="align-self-end">
                     <Paginador
                        resultados_por_pagina = {resultados_por_pagina}
                        total_resultados = {roles.length}
                        handleSetPaginaActual = {handleSetPaginaActual}
                        pagina_activa = {pagina_actual}
                     />
                  </div>
                  <TableRol 
                     roles={resultados_pagina}
                     pagina_actual = {pagina_actual}
                     resultados_por_pagina = {resultados_por_pagina}
                     handleClickModificar = {handleClickModificar}
                     handleClickEliminarRol = {handleClickEliminarRol}
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
 
export default Roles