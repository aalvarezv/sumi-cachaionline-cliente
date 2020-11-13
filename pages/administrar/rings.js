import React, { useState, useContext } from 'react';
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import CustomDateInput from '../../components/ui/CustomDateInput';
import AlertText from '../../components/ui/AlertText';
import TableRing from '../../components/ui/TableRing';
import RingForm from '../../components/forms/RingForm';
import { handleError } from '../../helpers';
import clienteAxios from '../../config/axios';




const Rings = () => {

   const { autenticado } = useContext(AuthContext);

   const [rings, setRings] = useState([]);
   const [filtros, setFiltros] = useState({
      fecha_desde: new Date(),
      fecha_hasta: new Date(),
      nombre_usuario_creador: '',
   });

   const { fecha_desde, fecha_hasta, nombre_usuario_creador } = filtros;
   
   const [crear_ring, setCrearRing] = useState(false);
   const [modificar_ring, setModificarRing] = useState(false);
   const [ring_modificar, setRingModificar] = useState(null);
   
   const ref_custom_date_desde = React.createRef();
   const ref_custom_date_hasta = React.createRef();

   const handleClickBuscar = async () => {

      try{
         const resp = await clienteAxios.get('/api/rings/listar', {
            params : { 
               fecha_desde: fecha_desde.toDateString(),
               fecha_hasta: fecha_hasta.toDateString(),
               nombre_usuario_creador,
             }
         });
         setRings(resp.data.ring);
         console.log(resp.data.ring);
      }catch(e){
         handleError(e);
      }
     
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
   }
        
   return ( 
      <Layout>
         <Privado>
            {autenticado 
            ?
               <div>
                  <h5 className="my-4 text-center">Administrar Rings</h5>
                  {!crear_ring && !modificar_ring 
                  ?
                     <Container>
                     <Row>
                        <Col>
                           <Row>
                              <Button
                                 size="sm"
                                 variant="info"
                                 className="align-self-end mb-2"
                                 onClick={handleClickBuscar}
                                 block
                              >
                                 Buscar
                              </Button>  
                           </Row>
                           <Row>
                               <Col className="p-0">
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
                                          label="Creación desde"
                                          ref = {ref_custom_date_desde}
                                       />
                                    }
                                 />
                              </Col>
                              <Col>
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
                                          label="hasta"
                                          ref = {ref_custom_date_hasta}
                                       />
                                    }
                                 /> 
                              </Col>
                           </Row>
                           <Row className="mb-2">
                              <Form.Control
                                 id="nombre_usuario_creador"
                                 name="nombre_usuario_creador"
                                 type="text" 
                                 size="sm"
                                 placeholder="CREADA POR USUARIO..." 
                                 value={nombre_usuario_creador}
                                 onChange={e => {
                                    setFiltros({
                                       ...filtros,
                                       [e.target.name]: e.target.value.toUpperCase()
                                    })
                                 }} 
                              />
                           </Row>
                        </Col>
   
                        <Col xs="9" className="d-flex flex-column">
                          
                              <Row>
                                 <Col
                                    className="d-flex justify-content-end"
                                 >
                                    <Button
                                       variant="outline-success"
                                       size="sm"
                                       onClick={handleCrearRing}
                                    >
                                       + Crear Ring
                                    </Button>                              
                                 </Col>  
                              </Row>
                              <Row className="flex-grow-1 px-3">
   
                                 <Col xs="12" className={`bg-light ${rings.length === 0 ? 'd-flex align-items-center justify-content-center' : 'pt-3'}`}>
                                 {rings.length === 0 
                                 ?
                                    <AlertText  
                                       text="No se encontraron resultados"
                                    />
                                 :
                                    <TableRing 
                                       rings={rings}
                                       handleEliminarRing = {handleEliminarRing}
                                       handleModificarRing = {handleModificarRing}
                                    /> 
                                 }   
                                 </Col>
                              </Row>
                           </Col> 
                     </Row>
                     </Container>
                  
                  :
                   <RingForm 
                     ring_modificar = {ring_modificar}
                     handleMostrarBusquedaRings = {handleMostrarBusquedaRings}
                   />              

                  }

                  
               </div>
            :
               null
            }
         </Privado>
      </Layout>
     );
}
 
export default Rings;