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
import ContenidoForm from '../../components/forms/ContenidoForm';
import TableContenido from '../../components/ui/TableContenido';
import InputSelectMateria from '../../components/ui/InputSelectMateria';
import InputSelectUnidadesMateria from '../../components/ui/InputSelectUnidadesMateria';
import InputSelectModulosUnidad from '../../components/ui/InputSelectModulosUnidad';




const Contenidos = () => {

    const { autenticado } = useContext(AuthContext);


    const [filtro, setFiltroBusqueda] = useState('');
    const [contenidos, setContenidos] = useState([]);
    const [contenido_modificar, setContenidoModificar] = useState({});
    const [mostrar_busqueda, setMostrarBusqueda] = useState(true);
    const [codigo_materia, setCodigoMateria] = useState('0');
    const [codigo_unidad, setCodigoUnidad] = useState('0');
    const [codigo_modulo, setCodigoModulo] = useState('0');
    /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1);
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10);

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina;
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina;
   const resultados_pagina = contenidos.slice(indice_primer_resultado, indice_ultimo_resultado);
   /*************************************/


   const handleClickBuscar = async () => {
      /* if (filtro.trim() === '' || filtro.length < 3 ){
        toast.warning('DEBE INGRESAR AL MENOS 3 CARACTERES PARA LA BUSQUEDA', {containerId: 'sys_msg'});
        return;
      } */
       try{

           const resp = await clienteAxios.get(`/api/modulo-contenidos/modulo/${codigo_modulo}/${codigo_unidad}/${codigo_materia}`);
           setContenidos(resp.data.modulo_contenido);
           setPaginaActual(1);
           
       }catch(e){
           handleError(e);
       }
   }

   const handleClickModificarContenido = async codigo => {
      
      const contenido = contenidos.filter(contenido => contenido.codigo === codigo)
      if(contenido.length > 0){
         setMostrarBusqueda(false);
         setContenidoModificar(contenido[0]);
      }
    }

    const handleClickEliminarContenido = async codigo => {
       try {
         await clienteAxios.delete(`/api/modulo-contenidos/eliminar/${codigo}`);
         const new_contenidos = contenidos.filter(contenido => contenido.codigo !== codigo);
         setModulos(new_contenidos);
         toast.success('CONTENIDO ELIMINADO', {containerId: 'sys_msg'});
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
                    <h5 className="my-4 text-center">Administrar Contenidos</h5>
                    
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
                        onChange={e => {
                           setCodigoMateria(e.target.value)
                           setCodigoUnidad('0')
                           setCodigoModulo('0')
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
                        onChange={e => {
                           setCodigoUnidad(e.target.value)
                           setCodigoModulo('0')
                        }}
                     />
                     </Col>
                     <Col>
                     <InputSelectModulosUnidad
                           id="codigo_modulo"
                           name="codigo_modulo"
                           /*codigo unidad se le pasa a las props del componente
                           para filtrar los modulos de la unidad seleccionada.*/
                           codigo_unidad= {codigo_unidad}
                           as="select"
                           size="sm"
                           label="TODOS LOS MÓDULOS"
                           value={codigo_modulo}
                           onChange={e => setCodigoModulo(e.target.value)}
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
                     {contenidos.length > 0 
                        ?
                        <Row>
                           <TableContenido
                              contenidos={resultados_pagina}
                              handleClickModificarContenido = {handleClickModificarContenido}
                              handleClickEliminarContenido = {handleClickEliminarContenido}

                           />
                           {resultados_pagina.length > 0 &&
                              <Paginador
                                 resultados_por_pagina = {resultados_por_pagina}
                                 total_resultados = {contenidos.length}
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
                     <ContenidoForm
                        contenido_modificar = {contenido_modificar}
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
 
export default Contenidos;