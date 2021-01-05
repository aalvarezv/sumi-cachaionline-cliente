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
import MateriaForm from '../../components/forms/MateriaForm';
import TableMateria from '../../components/ui/TableMateria';


const Materias = () => {

    const { autenticado } = useContext(AuthContext);

    const [filtro, setFiltroBusqueda] = useState('');
    const [materias, setMaterias] = useState([]);
    const [materia_modificar, setMateriaModificar] = useState({});
    const [mostrar_busqueda, setMostrarBusqueda] = useState(true);
    /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1);
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10);

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina;
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina;
   const resultados_pagina = materias.slice(indice_primer_resultado, indice_ultimo_resultado);
   /*************************************/

    const handleClickBuscar = async () => {
     /*  if (filtro.trim() === '' || filtro.length < 3 ){
        toast.warning('DEBE INGRESAR AL MENOS 3 CARACTERES PARA LA BUSQUEDA', {containerId: 'sys_msg'});
        return;
      } */
       try{
           const resp = await clienteAxios.get(`/api/materias/busqueda/${filtro}`);
           setMaterias(resp.data.materias);
       }catch(e){
           handleError(e);
       }
   }

   const handleClickModificar = async codigo => {
     
     const materia = materias.filter(materia => materia.codigo === codigo)
     if(materia.length > 0){
        setMostrarBusqueda(false);
        setMateriaModificar(materia[0]);
     }
   }

   const handleClickEliminarMateria = async codigo => {
      try {
        await clienteAxios.delete(`/api/materias/eliminar/${codigo}`);
        const new_materias = materias.filter(materia => materia.codigo !== codigo);
        setMaterias(new_materias);
        toast.success('MATERIA ELIMINADA', {containerId: 'sys_msg'});
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
                    <h5 className="my-4 text-center">Administrar Materias</h5>
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
                        placeholder="MATERIA"
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
                  {resultados_pagina.length > 0 
                     ?
                     <Row>
                        <TableMateria
                           materias={materias}
                           handleClickModificar = {handleClickModificar}
                           handleClickEliminarMateria = {handleClickEliminarMateria}
                        />
                        {resultados_pagina.length > 0 &&
                           <Paginador
                           resultados_por_pagina = {resultados_por_pagina}
                           total_resultados = {materias.length}
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
                  <MateriaForm
                     materia_modificar={materia_modificar}
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
 
export default Materias;