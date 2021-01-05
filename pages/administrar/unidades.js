import React, { useContext, useState } from 'react';
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import  clienteAxios from '../../config/axios';
import { toast } from 'react-toastify';
import AlertText from '../../components/ui/AlertText';
import {handleError} from '../../helpers';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import Paginador from '../../components/ui/Paginador';
import InputSelectMateria from '../../components/ui/InputSelectMateria';
import UnidadForm from '../../components/forms/UnidadForm';
import TableUnidad from '../../components/ui/TableUnidad';


const Unidades = () => {

    const { autenticado } = useContext(AuthContext);

    const [unidades, setUnidades] = useState([]);
    const [unidad_modificar, setUnidadModificar] = useState({});
    const [mostrar_busqueda, setMostrarBusqueda] = useState(true);
    const [codigo_materia, setCodigoMateria] = useState('0');
     /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1);
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10);

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina;
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina;
   const resultados_pagina = unidades.slice(indice_primer_resultado, indice_ultimo_resultado);
   /*************************************/


    const handleClickBuscar = async () => {
      /* if (filtro.trim() === '' || filtro.length < 3 ){
        toast.warning('DEBE INGRESAR AL MENOS 3 CARACTERES PARA LA BUSQUEDA', {containerId: 'sys_msg'});
        return;
      } */
       try{
           const resp = await clienteAxios.get(`/api/unidades/materia/${codigo_materia}`);
           setUnidades(resp.data.unidades);
       }catch(e){
           handleError(e);
       }
   }

   const handleClickModificarUnidad = async codigo => {
      
      const unidad = unidades.filter(unidad => unidad.codigo === codigo)
      if(unidad.length > 0){
         setMostrarBusqueda(false);
         setUnidadModificar(unidad[0]);
      }
   }

   const handleClickEliminarUnidad = async codigo => {
      try {
        await clienteAxios.delete(`/api/unidades/eliminar/${codigo}`);
        const new_unidades = unidades.filter(unidad => unidad.codigo !== codigo);
        setInstituciones(new_unidades);
        toast.success('UNIDAD ELIMINADA', {containerId: 'sys_msg'});
     } catch (e) {
        handleError(e);
     }
   }

   const handleClickVolver = async =>{
      setMostrarBusqueda(true);
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
                    <h5 className="my-4 text-center">Administrar Unidades</h5>

               <Container>
               {mostrar_busqueda 
               ?
               <>   
               <Row>
                  <Col>
                  <InputSelectMateria
                    id="codigo_materia"
                    name="codigo_materia"
                    as="select"
                    size="sm"
                    label="TODAS LAS MATERIAS"
                    value={codigo_materia}
                    onChange={e => setCodigoMateria(e.target.value)}
                />
                  </Col>
                  <Col>
                     <Button 
                        variant="info"
                        onClick={e =>{
                           handleClickBuscar()
                        }}>
                        Buscar
                     </Button>
                  </Col>
               </Row>
               <Row>
                  {unidades.length > 0 
                     ?
                     <Row>
                        <TableUnidad
                           unidades={resultados_pagina}
                           handleClickModificarUnidad = {handleClickModificarUnidad}
                           handleClickEliminarUnidad = {handleClickEliminarUnidad}

                        />
                        {resultados_pagina.length > 0 &&
                           <Paginador
                              resultados_por_pagina = {resultados_por_pagina}
                              total_resultados = {unidades.length}
                              handleSetPaginaActual = {handleSetPaginaActual}
                              pagina_activa = {pagina_actual}
                           />

                        }
                     </Row>
                     :
                     <AlertText
                        text="No hay resultados"
                     />
                  }
               </Row>
               </>
               :
               <Row>
                  <UnidadForm
                     unidad_modificar = {unidad_modificar}
                     handleClickVolver = {handleClickVolver}
                  />
               </Row>
               }
               </Container>
                    
                </>
             :
                null
             }
           </Privado>
        </Layout>
     );
}
 
export default Unidades;