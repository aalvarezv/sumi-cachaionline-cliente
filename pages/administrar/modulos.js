import React, { useState } from 'react'
import {Container, Row, Col, Button, Form, Card} from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { toast } from 'react-toastify'
import AlertText from '../../components/ui/AlertText'
import {handleError} from '../../helpers'
import Layout from '../../components/layout/Layout'
import Privado from '../../components/layout/Privado'
import Paginador from '../../components/ui/Paginador'
import ModuloForm from '../../components/forms/ModuloForm'
import TableModulo from '../../components/ui/TableModulo'
import InputSelectMateria from '../../components/ui/InputSelectMateria'
import InputSelectUnidadesMateria from '../../components/ui/InputSelectUnidadesMateria'
import AlertMostrarBusqueda from '../../components/ui/AlertMostrarBusqueda'


const Modulos = () => {

   const [filtro, setFiltroBusqueda] = useState('')
   const [modulos, setModulos] = useState([])
   const [moduloEnProceso, setModuloEnProceso] = useState(null)
   const [mostrar_busqueda, setMostrarBusqueda] = useState(true)
   const [codigo_materia, setCodigoMateria] = useState('0')
   const [codigo_unidad, setCodigoUnidad] = useState('0')
   const [textAlert, setTextAlert] = useState('')
    /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1)
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10)

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina
   const resultados_pagina = modulos.slice(indice_primer_resultado, indice_ultimo_resultado)   
   /*************************************/


   const handleClickBuscar = async () => {
     
       try{

            const resp = await clienteAxios.get('/api/modulos/busqueda/descripcion-unidad-materia/',{
               params: {
                  codigo_materia,
                  codigo_unidad,
                  descripcion: filtro
               }
            })

            setModulos(resp.data.modulos)
            if(resp.data.modulos.length > 0){
               setTextAlert("")
            }else{
               setTextAlert("No se encontraron resultados")
            }
            setPaginaActual(1)

       }catch(e){
           handleError(e)
       }

   }

   const handleClickModificarModulo = async codigo => {
      
      const modulo = modulos.filter(modulo => modulo.codigo === codigo)
      if(modulo.length > 0){
         setMostrarBusqueda(false)
         setModuloEnProceso(modulo[0])
      }

   }

   const handleClickEliminarModulo = async codigo => {

      try {
         await clienteAxios.delete(`/api/modulos/eliminar/${codigo}`)
         const new_modulos = modulos.filter(modulo => modulo.codigo !== codigo)
         setModulos(new_modulos)
         toast.success('Módulo eliminado', {containerId: 'sys_msg'})
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
               <h5 className="text-center my-4">Administrar Módulos</h5> 
            :
               <AlertMostrarBusqueda
                  label={moduloEnProceso ? 'Modificar módulo' : 'Crear nuevo módulo'}
                  handleClickMostrarBusqueda={handleClickMostrarBusqueda}
               />
            }
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
                           onChange={e => {
                              setCodigoMateria(e.target.value)
                              setCodigoUnidad('0')
                              
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
                           onChange={e => setCodigoUnidad(e.target.value)}
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
                           placeholder="Búsqueda por descripción del módulo..."
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
                        setModuloEnProceso(null)
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
               <ModuloForm
                  moduloEnProceso = {moduloEnProceso}
                  setModuloEnProceso = {setModuloEnProceso}
               />
            </Row>
            }
            </Card.Body>
            </Card>   
            </Container>
             
            <Container>
            <Row>
               {modulos.length > 0 && mostrar_busqueda
                  ?
                  <Col className="mt-5 d-flex flex-column">
                     <div className="align-self-end">
                        <Paginador
                           resultados_por_pagina = {resultados_por_pagina}
                           total_resultados = {modulos.length}
                           handleSetPaginaActual = {handleSetPaginaActual}
                           pagina_activa = {pagina_actual}
                        />
                     </div>
                     <TableModulo
                        modulos={resultados_pagina}
                        pagina_actual = {pagina_actual}
                        resultados_por_pagina = {resultados_por_pagina}
                        handleClickModificarModulo = {handleClickModificarModulo}
                        handleClickEliminarModulo = {handleClickEliminarModulo}

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
 
export default Modulos