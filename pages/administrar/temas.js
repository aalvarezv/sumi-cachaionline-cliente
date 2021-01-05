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
import TemaForm from '../../components/forms/TemaForm';
import TableTema from '../../components/ui/TableTema';
import InputSelectMateria from '../../components/ui/InputSelectMateria';
import InputSelectUnidadesMateria from '../../components/ui/InputSelectUnidadesMateria';
import InputSelectModulosUnidad from '../../components/ui/InputSelectModulosUnidad';
import InputSelectModulosContenido from '../../components/ui/InputSelectModulosContenido';




const Temas = () => {

    const { autenticado } = useContext(AuthContext);


    const [filtro, setFiltroBusqueda] = useState('');
    const [temas, setTemas] = useState([]);
    const [tema_modificar, setTemaModificar] = useState({});
    const [mostrar_busqueda, setMostrarBusqueda] = useState(true);
    const [codigo_materia, setCodigoMateria] = useState('0');
    const [codigo_unidad, setCodigoUnidad] = useState('0');
    const [codigo_modulo, setCodigoModulo] = useState('0');
    const [codigo_modulo_contenido, setCodigoContenido] = useState('0')
    /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1);
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10);

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina;
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina;
   const resultados_pagina = temas.slice(indice_primer_resultado, indice_ultimo_resultado);
   /*************************************/


   const handleClickBuscar = async () => {
      /* if (filtro.trim() === '' || filtro.length < 3 ){
        toast.warning('DEBE INGRESAR AL MENOS 3 CARACTERES PARA LA BUSQUEDA', {containerId: 'sys_msg'});
        return;
      } */
       try{
           const resp = await clienteAxios.get(`/api/modulo-contenido-temas/temas/${codigo_modulo_contenido}/${codigo_modulo}/${codigo_unidad}/${codigo_materia}`);
           setTemas(resp.data.contenido_tema);
       }catch(e){
           handleError(e);
       }
   }

   const handleClickModificarTema = async codigo => {
      
      const tema = temas.filter(tema => tema.codigo === codigo)
      if(tema.length > 0){
         setMostrarBusqueda(false);
         setTemaModificar(tema[0]);
         console.log(tema_modificar);
      }
    }

    const handleClickEliminarTema = async codigo => {
       try {
         await clienteAxios.delete(`/api/modulo-contenido-temas/eliminar/${codigo}`);
         const new_temas = temas.filter(tema => tema.codigo !== codigo);
         setModulos(new_temas);
         toast.success('TEMA ELIMINADO', {containerId: 'sys_msg'});
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
                    <h5 className="my-4 text-center">Administrar Temas</h5>
                    
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
                           setCodigoContenido('0')
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
                           setCodigoContenido('0')
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
                        label="TODOS LOS MODULOS"
                        value={codigo_modulo}
                        onChange={e => {
                           setCodigoModulo(e.target.value)
                           setCodigoContenido('0')
                        }}
                     />
                     </Col>
                     <Col>
                <InputSelectModulosContenido
                    id="codigo_modulo_contenido"
                    name="codigo_modulo_contenido"
                
                    /*codigo modulo se le pasa a las props del componente
                    para filtrar las propiedades del modulo seleccionado.*/
                    codigo_modulo={codigo_modulo}
                    as="select"
                    size="sm"
                    label="TODOS LOS CONTENIDOS"
                    value={codigo_modulo_contenido}
                    onChange={e => setCodigoContenido(e.target.value)}
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
                     {temas.length > 0 
                        ?
                        <Row>
                           <TableTema
                              temas={resultados_pagina}
                              handleClickModificarTema = {handleClickModificarTema}
                              handleClickEliminarTema = {handleClickEliminarTema}

                           />
                           {resultados_pagina.length > 0 &&
                              <Paginador
                                 resultados_por_pagina = {resultados_por_pagina}
                                 total_resultados = {temas.length}
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
                     <TemaForm
                        tema_modificar = {tema_modificar}
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
 
export default Temas;