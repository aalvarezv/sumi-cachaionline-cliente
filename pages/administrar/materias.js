import React, { useState } from 'react'
import {Container, Row, Col, Button, Form, Card} from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { toast } from 'react-toastify'
import AlertText from '../../components/ui/AlertText'
import {handleError} from '../../helpers'
import Layout from '../../components/layout/Layout'
import Privado from '../../components/layout/Privado'
import Paginador from '../../components/ui/Paginador'
import MateriaForm from '../../components/forms/MateriaForm'
import TableMateria from '../../components/ui/TableMateria'


const Materias = () => {

   const [filtro, setFiltroBusqueda] = useState('')
   const [materias, setMaterias] = useState([])
   const [materia_modificar, setMateriaModificar] = useState({})
   const [mostrar_busqueda, setMostrarBusqueda] = useState(true)
   const [textAlert, setTextAlert] = useState('')
    /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1)
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10)

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina
   const resultados_pagina = materias.slice(indice_primer_resultado, indice_ultimo_resultado)
   /*************************************/

   const handleClickBuscar = async () => {
 
      try{
   
            const resp = await clienteAxios.get('/api/materias/busqueda',{
               params: {
                  filtro,
               }
            })
            setMaterias(resp.data.materias)
            if(resp.data.materias.length > 0){
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
     
     const materia = materias.filter(materia => materia.codigo === codigo)
     if(materia.length > 0){
        setMostrarBusqueda(false)
        setMateriaModificar(materia[0])
     }
   }

   const handleClickEliminarMateria = async codigo => {

      try {
        await clienteAxios.delete(`/api/materias/eliminar/${codigo}`)
        const new_materias = materias.filter(materia => materia.codigo !== codigo)
        setMaterias(new_materias)
        toast.success('MATERIA ELIMINADA', {containerId: 'sys_msg'})
     } catch (e) {
        handleError(e)
     }

   }

   const handleClickVolver = () =>{
      setMostrarBusqueda(true)
      setMaterias([])
      setFiltroBusqueda('')
   }

   const handleSetPaginaActual = numero_pagina => {
      setPaginaActual(numero_pagina)
   }
       
   return ( 
         <Layout>
         <Privado>
            <Container>
            <h5 className="text-center my-4">Administrar Materias</h5>
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
                           placeholder="Busqueda por código ó descripción de materia..."
                           onChange={e => {
                              setFiltroBusqueda(e.target.value.toUpperCase())
                           }}
                        />
                     </Col>
                     <Col className="mb-2 mb-sm-0" xs={12} sm="auto">
                        <Button 
                           variant="outline-info"
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
                              setMateriaModificar(null)
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
                  <MateriaForm
                     materia_modificar={materia_modificar}
                     handleClickVolver={handleClickVolver}
                  />
               </Row>
            }
            </Card.Body>
            </Card>
            </Container>
             
            <Container>
               <Row>
               {materias.length > 0 && mostrar_busqueda
                  ?
                  <Col className="mt-5 d-flex flex-column">
                     <div className="align-self-end">
                        <Paginador
                           resultados_por_pagina = {resultados_por_pagina}
                           total_resultados = {materias.length}
                           handleSetPaginaActual = {handleSetPaginaActual}
                           pagina_activa = {pagina_actual}
                        />
                     </div>
                     <TableMateria
                        materias={resultados_pagina}
                        pagina_actual = {pagina_actual}
                        resultados_por_pagina = {resultados_por_pagina}
                        handleClickModificar = {handleClickModificar}
                        handleClickEliminarMateria = {handleClickEliminarMateria}
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
 
export default Materias