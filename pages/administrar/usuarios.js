import React, { useContext, useState } from 'react'
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
import AlertMostrarBusqueda from '../../components/ui/AlertMostrarBusqueda'
import { Stepper, Step } from 'react-form-stepper'
import UsuarioFormConfig from '../../components/forms/UsuarioFormConfig'
import AuthContext from '../../context/auth/AuthContext'


const Usuarios = () => {

   const { institucion_select } = useContext(AuthContext)
   const [filtro, setFiltroBusqueda] = useState('')
   const [usuarios, setUsuarios] = useState([])
   const [usuarioEnProceso, setUsuarioEnProceso] = useState(null)
   const [mostrar_busqueda, setMostrarBusqueda] = useState(true)
   const [textAlert, setTextAlert] = useState('')
   const [step, setStep] = useState(0)

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
               codigo_institucion: institucion_select.codigo
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
        setUsuarioEnProceso(usuario[0])
     }

   }

   const handleClickEliminarUsuario = async rut => {

      try {

         await clienteAxios.delete('/api/usuarios/eliminar', {
            params: {
               rut,
               codigo_institucion: institucion_select.codigo
            }
         })
         const new_usuarios = usuarios.filter(usuario => usuario.rut !== rut)
         setUsuarios(new_usuarios)
         toast.success('Usuario eliminado', {containerId: 'sys_msg'})

      } catch (e) {
         handleError(e)
      }

   }

   const handleClickMostrarBusqueda = () =>{
      setMostrarBusqueda(true)
      setStep(0)
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
               <h5 className="text-center my-4">Administrar Usuarios</h5> 
            :
               <>
               <AlertMostrarBusqueda
                  label={usuarioEnProceso ? 'Modificar usuario' : 'Crear nuevo usuario'}
                  handleClickMostrarBusqueda={handleClickMostrarBusqueda}
               >
                  <Button
                     variant="info"
                     size="sm"
                     className="mr-2"
                     disabled={step === 0}
                     onClick={() => setStep(step - 1)}
                  >
                     Anterior
                  </Button>
                  <Button
                     variant="info"
                     size="sm"
                     className="mr-2"
                     disabled={usuarioEnProceso === null}
                     onClick={() => {
                        if(step < 1){
                           setStep(step + 1)
                        }else{
                           setStep(0)
                           setMostrarBusqueda(true)
                        }
                     }}
                  >
                     {step < 1 ? 'Siguiente' : 'Finalizar'}
                  </Button>
               </AlertMostrarBusqueda>
               <Stepper activeStep={step}>
                  <Step label="Completar datos usuario" />
                  <Step label="Configurar perfiles y cursos" />
               </Stepper>
               </>
            }
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
                        setUsuarioEnProceso(null)
                        setMostrarBusqueda(false)
                        setTextAlert('')
                     }}>
                     + Agregar
                  </Button>
               </Col>
            </Row>
            </>
            : step === 0 
              
            ?
               <Row>
                  <UsuarioForm
                     usuarioEnProceso={usuarioEnProceso}
                     setUsuarioEnProceso={setUsuarioEnProceso}
                  />
               </Row>
            : step === 1 && usuarioEnProceso 
            
            &&
               <UsuarioFormConfig
                     rut_usuario = {usuarioEnProceso.rut}
                     nombre_usuario = {usuarioEnProceso.nombre}
               />
            
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