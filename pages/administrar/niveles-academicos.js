import React, { useState } from 'react'
import {Container, Row, Col, Button, Form, Card} from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { toast } from 'react-toastify'
import AlertText from '../../components/ui/AlertText'
import {handleError} from '../../helpers'
import Paginador from '../../components/ui/Paginador'
import Layout from '../../components/layout/Layout'
import Privado from '../../components/layout/Privado'
import NivelAcademicoForm from '../../components/forms/NivelAcademicoForm'
import TableNivelAcademico from '../../components/ui/TableNivelAcademico'
import AlertMostrarBusqueda from '../../components/ui/AlertMostrarBusqueda'


const NivelesAcademicos = () => {

   const [filtro, setFiltroBusqueda] = useState ('')
   const [niveles_academicos, setNivelesAcademicos] = useState ([])
   const [nivelAcademicoEnProceso, setNivelAcademicoEnProceso] = useState(null)
   const [mostrar_busqueda, setMostrarBusqueda] = useState(true)
   const [textAlert, setTextAlert] = useState('')
   /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1)
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10)

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina
   const resultados_pagina = niveles_academicos.slice(indice_primer_resultado, indice_ultimo_resultado)
   /*************************************/

    const handleClickBuscar = async () => {

       try{
          
            const resp = await clienteAxios.get('/api/nivel-academico/busqueda',{
               params: {
                  filtro,
               }
            })
            setNivelesAcademicos(resp.data.nivelesAcademicos)
            if(resp.data.nivelesAcademicos.length > 0){
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
      
      const nivel_academico = niveles_academicos.filter(nivel_academico => nivel_academico.codigo === codigo)
      if(nivel_academico.length > 0){
         setMostrarBusqueda(false)
         setNivelAcademicoEnProceso(nivel_academico[0])
      }

   }

   const handleClickMostrarBusqueda = () =>{
      setMostrarBusqueda(true)
      setFiltroBusqueda('')
   }

   const handleSetPaginaActual = numero_pagina => {
      setPaginaActual(numero_pagina)
   }

   const handleClickEliminarNivelAcademico = async codigo => {

      try {

         await clienteAxios.delete(`/api/nivel-academico/eliminar/${codigo}`)
         const new_niveles_academicos = niveles_academicos.filter(nivelAcademico => nivelAcademico.codigo !== codigo)
         setNivelesAcademicos(new_niveles_academicos)
         toast.success('Nivel académico eliminado', {containerId: 'sys_msg'})

      } catch (e) {
         handleError(e)
      }

   }

        
   return ( 
         <Layout>
         <Privado>
            <Container>
            {mostrar_busqueda
            ?
               <h5 className="text-center my-4">Administrar Niveles Académicos</h5> 
            :
               <AlertMostrarBusqueda
                  label={nivelAcademicoEnProceso ? 'Modificar nivel académico' : 'Crear nuevo nivel académico'}
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
                     placeholder="Búsqueda por código ó descripción del nivel académico..."
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
                        setNivelAcademicoEnProceso(null)
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
               <NivelAcademicoForm
                  nivelAcademicoEnProceso={nivelAcademicoEnProceso}
                  setNivelAcademicoEnProceso={setNivelAcademicoEnProceso}
               />
            </Row>
            }
            </Card.Body>
            </Card>
            </Container>

            <Container>
               <Row>
               {niveles_academicos.length > 0 && mostrar_busqueda
                  ?
                  <Col className="mt-5 d-flex flex-column">
                     
                     <div className="align-self-end">
                        <Paginador
                           resultados_por_pagina = {resultados_por_pagina}
                           total_resultados = {niveles_academicos.length}
                           handleSetPaginaActual = {handleSetPaginaActual}
                           pagina_activa = {pagina_actual}
                        />
                     </div>
                     
                     <TableNivelAcademico 
                        niveles_academicos={resultados_pagina}
                        pagina_actual = {pagina_actual}
                        resultados_por_pagina = {resultados_por_pagina}
                        handleClickModificar = {handleClickModificar}
                        handleClickEliminarNivelAcademico={handleClickEliminarNivelAcademico}
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
 
export default NivelesAcademicos