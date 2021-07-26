import React, { useState, useContext } from 'react'
import { Button, Col, Container, Row, Card } from 'react-bootstrap'
import { Stepper, Step } from 'react-form-stepper'
import { toast } from 'react-toastify'
import AuthContext from '../../context/auth/AuthContext'
import Layout from '../../components/layout/Layout'
import Privado from '../../components/layout/Privado'
import TableRing from '../../components/ui/TableRing'
import AlertText from '../../components/ui/AlertText'
import Paginador from '../../components/ui/Paginador'
import RingForm from '../../components/forms/RingForm'
import { handleError } from '../../helpers'
import clienteAxios from '../../config/axios'
import FiltrosBusquedaRing from '../../components/ui/FiltrosBusquedaRing'
import { RingUsuario } from '../../components/ui/RingUsuario'
import { RingPregunta } from '../../components/ui/RingPregunta'
import AlertMostrarBusqueda from '../../components/ui/AlertMostrarBusqueda'



const Rings = () => {

   const { institucion_select, usuario } = useContext(AuthContext)
   const fecha = new Date()
   const [filtros, setFiltros] = useState({
      fecha_desde: new Date(fecha.getFullYear(), fecha.getMonth(), 1),
      fecha_hasta: new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0),
      codigo_materia: '0',
      nombre_ring: '',
      privado: true,
   })

   const [rings, setRings] = useState([])
   const [mostrar_busqueda, setMostrarBusqueda] = useState(true)
   const [ringEnProceso, setRingEnProceso] = useState(null)
   const [textAlert, setTextAlert] = useState('')
   const [step, setStep] = useState(0)

   const [pagina_actual, setPaginaActual] = useState(1)
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10)

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina
   const resultados_pagina = rings.slice(indice_primer_resultado, indice_ultimo_resultado)
   /*************************************/

   const handleClickBuscar = async () => {
      
      try{
         const resp = await clienteAxios.get('/api/rings/listar', {
            params : { 
               fecha_desde: filtros.fecha_desde.toDateString(),
               fecha_hasta: filtros.fecha_hasta.toDateString(),
               codigo_materia: filtros.codigo_materia,
               codigo_institucion: institucion_select.codigo,
               nombre_ring: filtros.nombre_ring,
               rut_usuario_creador: usuario.rut,
               privado: filtros.privado,
             }
         })
         setRings(resp.data.ring)

         if(resp.data.ring.length === 0){
            setTextAlert('No hay resultados')
         }else{
            setTextAlert('')
         } 
         setPaginaActual(1)

      }catch(e){
         handleError(e)
      }
      
   }

   const handleConfigurarRing = async codigo => {

      const ring = rings.filter(ring => ring.codigo === codigo)
      if(ring.length > 0){
         setRingEnProceso(ring[0])
         setMostrarBusqueda(false)
      }

   }

   const handleEliminarRing = async codigo => {

      try {
         await clienteAxios.delete(`/api/rings/eliminar/${codigo}`)
         const new_rings = rings.filter(ring => ring.codigo !== codigo)
         setRings(new_rings)
         toast.success('Ring eliminado', {containerId: 'sys_msg'})
      } catch (e) {
         handleError(e)
      }

   }
 
   const handleClickMostrarBusqueda = () => {
      setStep(0)
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
             <h5 className="text-center my-4">Administrar Rings</h5> 
            :
            <>
                <AlertMostrarBusqueda
                  label={ringEnProceso ? 'Modificar ring' : 'Crear nuevo ring'}
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
                     disabled={ringEnProceso === null}
                     onClick={() => {
                        if(step < 2){
                           setStep(step + 1)
                        }else{
                           setStep(0)
                           setMostrarBusqueda(true)
                        }
                     }}
                  >
                     {step < 2 ? 'Siguiente' : 'Finalizar'}
                  </Button>
                           
               </AlertMostrarBusqueda>
            
               <Stepper activeStep={step}>
                  <Step label="Completar datos del ring" />
                  <Step label="Agregar o quitar usuarios" />
                  <Step label="Agregar o quitar preguntas" />
               </Stepper>

            </>
            }
            <Card>
            <Card.Body>
            {mostrar_busqueda 
            ?   
               <FiltrosBusquedaRing
                  filtros={filtros}
                  setFiltros={setFiltros}
                  setRingEnProceso={setRingEnProceso}
                  setMostrarBusqueda={setMostrarBusqueda}
                  setTextAlert={setTextAlert}
                  handleClickBuscar={handleClickBuscar}
               />
            : step === 0
            ?
               <RingForm 
                  ringEnProceso = {ringEnProceso}
                  setRingEnProceso={setRingEnProceso}
               />

            : step === 1 && ringEnProceso
            ? 
               <RingUsuario
                  ring={ringEnProceso}
               />
            : step === 2 && ringEnProceso
            &&
               <RingPregunta
                  ring={ringEnProceso}
               />
            }
            
            </Card.Body>
            </Card>
            </Container> 
            <Container>
               <Row>
               {rings.length > 0 && mostrar_busqueda
               ?
                  <Col className="mt-4 d-flex flex-column">
                     <div className="align-self-end">
                        <Paginador
                           resultados_por_pagina = {resultados_por_pagina}
                           total_resultados = {rings.length}
                           handleSetPaginaActual = {handleSetPaginaActual}
                           pagina_activa = {pagina_actual}
                        />
                     </div>
                     <TableRing 
                        rings={resultados_pagina}
                        pagina_actual = {pagina_actual}
                        resultados_por_pagina = {resultados_por_pagina}
                        handleEliminarRing = {handleEliminarRing}
                        handleConfigurarRing = {handleConfigurarRing}
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
            <style type="text/css">{`
               .react-datepicker__input-container {
                  width: inherit;
               }
               
               .react-datepicker-wrapper {
                  width: 100%;
               }                  
            `}</style> 
         </Privado>
      </Layout>
     )
}
 
export default Rings