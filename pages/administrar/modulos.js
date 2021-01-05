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
import ModuloForm from '../../components/forms/ModuloForm';
import TableModulo from '../../components/ui/TableModulo';
import InputSelectMateria from '../../components/ui/InputSelectMateria';
import InputSelectUnidadesMateria from '../../components/ui/InputSelectUnidadesMateria';




const Modulos = () => {

    const { autenticado } = useContext(AuthContext);


    const [filtro, setFiltroBusqueda] = useState('');
    const [modulos, setModulos] = useState([]);
    const [modulo_modificar, setModuloModificar] = useState({});
    const [mostrar_busqueda, setMostrarBusqueda] = useState(true);
    const [codigo_materia, setCodigoMateria] = useState('0');
    const [codigo_unidad, setCodigoUnidad] = useState('0');
    /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1);
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10);

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina;
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina;
   const resultados_pagina = modulos.slice(indice_primer_resultado, indice_ultimo_resultado);
   /*************************************/


   const handleClickBuscar = async () => {
      /* if (filtro.trim() === '' || filtro.length < 3 ){
        toast.warning('DEBE INGRESAR AL MENOS 3 CARACTERES PARA LA BUSQUEDA', {containerId: 'sys_msg'});
        return;
      } */
       try{
           const resp = await clienteAxios.get(`/api/modulos/unidad-materia/${codigo_unidad}/${codigo_materia}`);
           setModulos(resp.data.modulos);
       }catch(e){
           handleError(e);
       }
   }

   const handleClickModificarModulo = async codigo => {
      
      const modulo = modulos.filter(modulo => modulo.codigo === codigo)
      if(modulo.length > 0){
         setMostrarBusqueda(false);
         setModuloModificar(modulo[0]);
      }
    }

    const handleClickEliminarModulo = async codigo => {
       try {
         await clienteAxios.delete(`/api/modulos/eliminar/${codigo}`);
         const new_modulos = modulos.filter(modulo => modulo.codigo !== codigo);
         setModulos(new_modulos);
         toast.success('MODULO ELIMINADO', {containerId: 'sys_msg'});
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
                    <h5 className="my-4 text-center">Administrar Módulos</h5>
                    
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
                     {modulos.length > 0 
                        ?
                        <Row>
                           <TableModulo
                              modulos={resultados_pagina}
                              handleClickModificarModulo = {handleClickModificarModulo}
                              handleClickEliminarModulo = {handleClickEliminarModulo}

                           />
                           {resultados_pagina.length > 0 &&
                              <Paginador
                                 resultados_por_pagina = {resultados_por_pagina}
                                 total_resultados = {modulos.length}
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
                     <ModuloForm
                        modulo_modificar = {modulo_modificar}
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
 
export default Modulos;