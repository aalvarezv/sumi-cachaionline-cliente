import React, { useState } from 'react'
import {Container, Row, Col, Button, Form, Card} from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { toast } from 'react-toastify'
import AlertText from '../../components/ui/AlertText'
import {handleError} from '../../helpers'
import Layout from '../../components/layout/Layout'
import Privado from '../../components/layout/Privado'
import Paginador from '../../components/ui/Paginador'
import UsuarioForm from '../../components/forms/UsuarioForm'
import TableUsuario from '../../components/ui/TableUsuario'


const Usuarios = () => {

   const [filtro, setFiltroBusqueda] = useState('')
   const [usuarios, setUsuarios] = useState([])
   const [usuario_modificar, setUsuarioModificar] = useState(null)
   const [mostrar_busqueda, setMostrarBusqueda] = useState(true)
   const [textAlert, setTextAlert] = useState('')
   /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1)
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10)

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina
   const resultados_pagina = usuarios.slice(indice_primer_resultado, indice_ultimo_resultado)
   /*************************************/


    const handleClickBuscar = async () => {

      try{

         const resp = await clienteAxios.get('/api/usuarios/busqueda',{
            params:{
               filtro,
            }
         })
         setUsuarios(resp.data.usuarios)
         if(resp.data.usuarios.length > 0){
            setTextAlert("")
         }else{
            setTextAlert("No se encontraron resultados")
         }
         setPaginaActual(1)

      }catch(e){
         handleError(e)
      }

   }

   const handleClickModificar = async rut => {
     
     const usuario = usuarios.filter(usuario => usuario.rut === rut)
     if(usuario.length > 0){
        setMostrarBusqueda(false)
        setUsuarioModificar(usuario[0])
     }

   }

   const handleClickEliminarUsuario = async rut => {

      try {

         await clienteAxios.delete(`/api/usuarios/eliminar/${rut}`)
         const new_usuarios = usuarios.filter(usuario => usuario.rut !== rut)
         setUsuarios(new_usuarios)
         toast.success('USUARIO ELIMINADO', {containerId: 'sys_msg'})

      } catch (e) {
         handleError(e)
      }

   }

   const handleClickVolver = () =>{
      setMostrarBusqueda(true)
      setUsuarios([])
      setFiltroBusqueda('')
   }

   const handleSetPaginaActual = numero_pagina => {
      setPaginaActual(numero_pagina)
   }
        
   return ( 
         <Layout>
         <Privado>  
            <Container>
            <h5 className="text-center my-4">Administrar Usuarios</h5>
            <Card className=" ">
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
                     placeholder="Búsqueda por RUT ó Nombre del usuario..."
                     onChange={e => {
                        setFiltroBusqueda(e.target.value.toUpperCase())
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
                        setUsuarioModificar(null)
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
               <UsuarioForm
                  usuario_modificar={usuario_modificar}
                  handleClickVolver={handleClickVolver}
               />
            </Row>
            }
            </Card.Body>
            </Card>
            </Container>

            <Container>
               <Row>
               {usuarios.length > 0 && mostrar_busqueda
               ?
               <Col className="mt-5 d-flex flex-column">
                  <div className="align-self-end">
                     <Paginador
                        resultados_por_pagina = {resultados_por_pagina}
                        total_resultados = {usuarios.length}
                        handleSetPaginaActual = {handleSetPaginaActual}
                        pagina_activa = {pagina_actual}
                     />
                  </div>
                  <TableUsuario 
                     usuarios={resultados_pagina}
                     pagina_actual = {pagina_actual}
                     resultados_por_pagina = {resultados_por_pagina}
                     handleClickModificar = {handleClickModificar}
                     handleClickEliminarUsuario = {handleClickEliminarUsuario}
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
 
export default Usuarios