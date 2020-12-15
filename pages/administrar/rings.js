import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import TableRing from '../../components/ui/TableRing';
import AlertText from '../../components/ui/AlertText';
import Paginador from '../../components/ui/Paginador';
import RingForm from '../../components/forms/RingForm';
import FiltrosBusquedaRings from '../../components/ui/FiltrosBusquedaRings';
import { handleError } from '../../helpers';
import clienteAxios from '../../config/axios';


const Rings = () => {

   const { autenticado, institucion_select } = useContext(AuthContext);

   const [rings, setRings] = useState([]);
   const [crear_ring, setCrearRing] = useState(false);
   const [modificar_ring, setModificarRing] = useState(false);
   const [ring_modificar, setRingModificar] = useState(null);
   
   const [mensajeAlerta, fnSetMensajeAlerta] = useState('');
   /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1);
   const [resultados_por_pagina, setResultadosPorPagina] = useState(1);

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina;
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina;
   const resultados_pagina = rings.slice(indice_primer_resultado, indice_ultimo_resultado);
   /*************************************/

   useEffect(() => {
      fnSetMensajeAlerta('');
   }, [])

   const listarRings = async filtros =>{

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
         });
         setRings(resp.data.ring);

         if(resp.data.ring.length === 0){
            fnSetMensajeAlerta('No hay resultados');
         } 

      }catch(e){
         handleError(e);
      }
   }

   const handleClickBuscar = async filtros => {
      setPaginaActual(1);
      listarRings(filtros);
   }

   const handleCrearRing = () => {
      setRingModificar(null);
      setCrearRing(true);
   }

   const handleEliminarRing = async codigo => {

      try {
         await clienteAxios.delete(`/api/rings/eliminar/${codigo}`);
         const new_rings = rings.filter(ring => ring.codigo !== codigo);
         setRings(new_rings);
         toast.success('RING ELIMINADO', {containerId: 'sys_msg'});
      } catch (e) {
         handleError(e);
      }

   }

   const handleModificarRing = async codigo => {

      try{
         const resp = await clienteAxios.get(`/api/rings/datos/${codigo}`);
         setModificarRing(true);
         setRingModificar(resp.data.ring);
      }catch(e){
         handleError(e);
      }

   }
 
   const handleMostrarBusquedaRings = () => {
      //Oculta el formulario para crear Rings.
      setRings([]);
      setRingModificar(null);
      setCrearRing(false);
      setModificarRing(false);
      setPaginaActual(1);
   }

   const handleSetPaginaActual = numero_pagina => {
      setPaginaActual(numero_pagina);
   }
        
   return ( 
      <Layout>
         <Privado>
            {autenticado 
            ?
               <>
                  <h5 className="my-4 text-center">Administrar Rings</h5>
                  {!crear_ring && !modificar_ring 
                  ?
                     <Container>
                        <Row className="mx-0 mb-2">
                           <Col className="d-flex justify-content-end">     
                           <Button
                              variant="info"
                              onClick={handleCrearRing}
                           >
                              + Nuevo Ring
                           </Button>
                           </Col>
                        </Row>
                        <Row className="mb-2">
                           <Col>           
                              <FiltrosBusquedaRings
                                 handleClickBuscar={handleClickBuscar}
                              /> 
                           </Col>
                        </Row>
                        {rings.length > 0 &&
                        <Row className="mx-0">
                           <Col className="d-flex justify-content-end">
                              <Badge variant="dark">
                                 Total rings encontrados: {rings.length} 
                              </Badge>
                           </Col>
                        </Row>
                        }
                        <Row className="mx-0">
                           <Col className={`d-flex flex-column align-items-center justify-content-center ${rings.length === 0 ? ' mt-5' : ''}`}>
                           {rings.length === 0
                           ?
                              <AlertText  
                                 text={mensajeAlerta}
                              /> 
                           :
                           <>
                              
                              <TableRing 
                                 rings={resultados_pagina}
                                 handleEliminarRing = {handleEliminarRing}
                                 handleModificarRing = {handleModificarRing}
                              />
                              
                              {resultados_pagina.length > 0 &&
                                 <Paginador
                                       resultados_por_pagina = {resultados_por_pagina}
                                       total_resultados = {rings.length}
                                       handleSetPaginaActual = {handleSetPaginaActual}
                                 />
                              } 
                           </>
                           }   
                           </Col>
                        </Row>
                     </Container> 
                  :
                   <RingForm 
                     ring_modificar = {ring_modificar}
                     handleMostrarBusquedaRings = {handleMostrarBusquedaRings}
                   />              

                  }

               </>
            :
               null
            }
         </Privado>
      </Layout>
     );
}
 
export default Rings;