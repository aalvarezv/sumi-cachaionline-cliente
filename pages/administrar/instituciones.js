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
import InstitucionForm from '../../components/forms/InstitucionForm';
import TableInstitucion from '../../components/ui/TableInstitucion';




const Instituciones = () => {

    const { autenticado } = useContext(AuthContext);

    const [filtro, setFiltroBusqueda] = useState('');
    const [instituciones, setInstituciones] = useState([]);
    const [institucion_modificar, setInstitucionModificar] = useState({});
    const [mostrar_busqueda, setMostrarBusqueda] = useState(true);
    /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1);
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10);

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina;
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina;
   const resultados_pagina = instituciones.slice(indice_primer_resultado, indice_ultimo_resultado);
   /*************************************/


    const handleClickBuscar = async () => {
       /* if (filtro.trim() === '' || filtro.length < 3 ){
         toast.warning('DEBE INGRESAR AL MENOS 3 CARACTERES PARA LA BUSQUEDA', {containerId: 'sys_msg'});
         return;
       } */
        try{
            const resp = await clienteAxios.get(`/api/instituciones/busqueda/${filtro}`);
            setInstituciones(resp.data.instituciones);
        }catch(e){
            handleError(e);
        }
    }

    const handleClickModificarInstitucion = async codigo => {
      
      const institucion = instituciones.filter(institucion => institucion.codigo === codigo)
      if(institucion.length > 0){
         setMostrarBusqueda(false);
         setInstitucionModificar(institucion[0]);
      }
    }

    const handleClickEliminarInstitucion = async codigo => {
       try {
         await clienteAxios.delete(`/api/instituciones/eliminar/${codigo}`);
         const new_instituciones = instituciones.filter(institucion => institucion.codigo !== codigo);
         setInstituciones(new_instituciones);
         toast.success('INSTITUCIÓN ELIMINADA', {containerId: 'sys_msg'});
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
               <h5 className="my-4 text-center">Administrar Instituciones</h5>
               
               
               <Container>
               {mostrar_busqueda 
               ?
               <>   
               <Row>
                  <Col>
                     <Form.Control 
                        id="descripcion"
                        name="descripcion"
                        type="text" 
                        placeholder="INSTITUCION"
                        onChange={e => {
                           setFiltroBusqueda(e.target.value.toUpperCase())
                        }}
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
                  {instituciones.length > 0 
                     ?
                     <Row>
                        <TableInstitucion 
                           instituciones={resultados_pagina}
                           handleClickModificarInstitucion = {handleClickModificarInstitucion}
                           handleClickEliminarInstitucion = {handleClickEliminarInstitucion}
                        />
                        {resultados_pagina.length > 0 &&
                           <Paginador
                              resultados_por_pagina = {resultados_por_pagina}
                              total_resultados = {instituciones.length}
                              handleSetPaginaActual = {handleSetPaginaActual}
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
                  <InstitucionForm
                     institucion_modificar={institucion_modificar}
                     handleClickVolver={handleClickVolver}
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
 
export default Instituciones;