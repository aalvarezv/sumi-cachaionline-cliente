import React, { useState, useEffect, useContext } from 'react'
import { Container, Form, ButtonGroup, ToggleButton, Row, Col, Button, Badge, Card } from 'react-bootstrap'
import DatePicker from 'react-datepicker'

import { toast } from 'react-toastify'
import AuthContext from '../../context/auth/AuthContext'
import Layout from '../../components/layout/Layout'
import Privado from '../../components/layout/Privado'
import TableRing from '../../components/ui/TableRing'
import AlertText from '../../components/ui/AlertText'
import Paginador from '../../components/ui/Paginador'
import RingForm from '../../components/forms/RingForm'
import CustomDateInput from '../../components/ui/CustomDateInput'
import InputSelectMateria from '../../components/ui/InputSelectMateria'
import InputSelectNivelAcademico from '../../components/ui/InputSelectNivelAcademico'
import { handleError } from '../../helpers'
import clienteAxios from '../../config/axios'


const Rings = () => {

   const { institucion_select } = useContext(AuthContext)

   const [filtros, setFiltros] = useState({
      fecha_desde: new Date(),
      fecha_hasta: new Date(),
      codigo_materia: '0',
      codigo_nivel_academico: '0',
      nombre_ring: '',
      nombre_usuario_creador: '',
      privado: true,
   })

   const { fecha_desde, fecha_hasta, codigo_materia, 
          codigo_nivel_academico, nombre_ring, 
          nombre_usuario_creador, privado } = filtros
  
   const ref_custom_date_desde = React.createRef()
   const ref_custom_date_hasta = React.createRef()

   const radios_estado_ring = [
      { name: 'Privado', value: true },
      { name: 'Público', value: false },
   ]
   const [rings, setRings] = useState([])
   const [mostrar_busqueda, setMostrarBusqueda] = useState(true)
   const [ring_modificar, setRingModificar] = useState(null)
   const [textAlert, setTextAlert] = useState('')

   /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1)
   const [resultados_por_pagina, setResultadosPorPagina] = useState(1)

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
               codigo_nivel_academico: filtros.codigo_nivel_academico,
               codigo_institucion: institucion_select.codigo,
               nombre_ring: filtros.nombre_ring,
               nombre_usuario_creador: filtros.nombre_usuario_creador,
               privado: filtros.privado,
             }
         })
         console.log(resp.data.ring)
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

   const handleModificarRing = async codigo => {

      const ring = rings.filter(ring => ring.codigo === codigo)
      if(ring.length > 0){
         setRingModificar(ring[0])
         setMostrarBusqueda(false)
      }

   }

   const handleEliminarRing = async codigo => {

      try {
         await clienteAxios.delete(`/api/rings/eliminar/${codigo}`)
         const new_rings = rings.filter(ring => ring.codigo !== codigo)
         setRings(new_rings)
         toast.success('RING ELIMINADO', {containerId: 'sys_msg'})
      } catch (e) {
         handleError(e)
      }

   }
 
   const handleClickVolver = () => {
      setMostrarBusqueda(true)
      setRings([])
      setRingModificar(null)
   }

   const handleSetPaginaActual = numero_pagina => {
      setPaginaActual(numero_pagina)
   }
        
   return ( 
      <Layout>
         <Privado>
            <Container>
            <h5 className="text-center my-4">Administrar Rings</h5>
            <Card>
            <Card.Body>
            {mostrar_busqueda 
            ?   
            <Row className="d-flex justify-content-center">
               <Col xs={12} lg={8}>
                  <Row>
                     <Col xs={12} className="d-flex justify-content-end"> 
                        <ButtonGroup toggle>
                           {radios_estado_ring.map((radio, idx) => (
                              <ToggleButton
                                 key={idx}
                                 type="radio"
                                 variant="outline-info"
                                 name="privado"
                                 size="md"
                                 value={radio.value}
                                 checked={privado === radio.value}
                                 onChange={e => {
                                    setFiltros({
                                          ...filtros,
                                          [e.target.name]: radio.value,
                                    })
                                 }}
                              >
                                 {radio.name}
                              </ToggleButton>
                           ))}
                        </ButtonGroup>
                     </Col>
                  </Row>
                  <Row className="mb-2">
                     <Col xs={12} md={6} className="mb-2 mb-md-0">
                        <DatePicker
                           selected={fecha_desde}
                           dateFormat="dd/MM/yyyy"
                           popperPlacement="top-end"
                           popperModifiers={{
                                 offset: {
                                 enabled: true,
                                 offset: "5px, 10px"
                                 },
                                 preventOverflow: {
                                    enabled: true,
                                    escapeWithReference: false,
                                    boundariesElement: "viewport"
                                 }
                           }}
                           onChange={date => setFiltros({
                                 ...filtros,
                                 fecha_desde: date,
                           })}
                           customInput={
                              <CustomDateInput 
                                 label="Creación Desde"
                                 ref = {ref_custom_date_desde}
                              />
                           }
                        />
                     </Col>
                     <Col xs={12} md={6}>
                        <DatePicker
                           selected={fecha_hasta}
                           dateFormat="dd/MM/yyyy"
                           popperPlacement="top-end"
                           popperModifiers={{
                                 offset: {
                                 enabled: true,
                                 offset: "5px, 5px"
                                 },
                                 preventOverflow: {
                                    enabled: true,
                                    escapeWithReference: false,
                                    boundariesElement: "viewport"
                                 }
                           }}
                           onChange={date => setFiltros({
                                 ...filtros,
                                 fecha_hasta: date,
                           })}
                           customInput={
                              <CustomDateInput 
                                 label="Hasta"
                                 ref = {ref_custom_date_hasta}
                              />
                           }
                        /> 
                     </Col>
                  </Row>
                  <Row className="mb-2">
                     <Col xs={12} md={6} className="mb-2 mb-md-0">
                        <InputSelectMateria
                           id="codigo_materia"
                           name="codigo_materia"
                           as="select"
                           size="sm"
                           value={codigo_materia}
                           onChange={e => {
                           setFiltros({
                              ...filtros,
                              [e.target.name]: e.target.value,
                           })
                           }}
                        />
                     </Col>
                     <Col xs={12} md={6}>
                        <InputSelectNivelAcademico
                           id="codigo_nivel_academico"
                           name="codigo_nivel_academico"
                           as="select"
                           size="sm"
                           value={codigo_nivel_academico}
                           onChange={e => {
                           setFiltros({
                                 ...filtros,
                                 [e.target.name]: e.target.value,
                           })
                           }}
                        />
                     </Col>
                  </Row> 
                  <Row className="mb-2 mb-lg-0">
                     <Col xs={12} md={6} className="mb-2 mb-md-0">
                        <Form.Control
                           id="nombre_ring"
                           name="nombre_ring"
                           type="text" 
                           size="md"
                           placeholder="NOMBRE RING..." 
                           value={nombre_ring}
                           onChange={e => {
                           setFiltros({
                              ...filtros,
                              [e.target.name]: e.target.value.toUpperCase()
                           })
                           }} 
                        />
                     </Col>
                     <Col xs={12} md={6}>
                        <Form.Control
                           id="nombre_usuario_creador"
                           name="nombre_usuario_creador"
                           type="text"
                           size="md" 
                           placeholder="CREADA POR USUARIO..." 
                           value={nombre_usuario_creador}
                           onChange={e => {
                           setFiltros({
                              ...filtros,
                              [e.target.name]: e.target.value.toUpperCase()
                           })
                           }} 
                        />
                     </Col>
                  </Row>     
               </Col>
               <Col className="d-flex align-items-end mb-2 mb-md-0" xs={12} md={3} lg="auto">
                  <Button
                     variant="info"
                     className="align-self-end"
                     onClick={() => {
                           handleClickBuscar()
                     }}
                     block
                  >
                     Buscar
                  </Button>                 
               </Col>
               <Col className="d-flex align-items-end mb-2 mb-md-0" xs={12} md={3} lg="auto">
                  <Button 
                     variant="info"
                     className="btn-block"
                     onClick={e =>{
                        setRingModificar(null)
                        setMostrarBusqueda(false)
                        setTextAlert('')
                     }}>
                     + Agregar
                  </Button>
               </Col>
            </Row>
            :
            <RingForm 
               ring_modificar = {ring_modificar}
               handleClickVolver = {handleClickVolver}
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
                        handleModificarRing = {handleModificarRing}
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