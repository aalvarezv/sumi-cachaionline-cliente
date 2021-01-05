import React, { useContext, useState } from 'react';
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import  clienteAxios from '../../config/axios';
import { toast } from 'react-toastify';
import AlertText from '../../components/ui/AlertText';
import {handleError} from '../../helpers';
import AuthContext from '../../context/auth/AuthContext';
import Paginador from '../../components/ui/Paginador';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import NivelAcademicoForm from '../../components/forms/NivelAcademicoForm';
import TableNivelAcademico from '../../components/ui/TableNivelAcademico';


const NivelesAcademicos = () => {

    const { autenticado } = useContext(AuthContext);

    const [filtro, setFiltroBusqueda] = useState ('');
    const [niveles_academicos, setNivelesAcademicos] = useState ([]);
    const [nivelacademico_modificar, setNivelAcademicoModificar] = useState({});
    const [mostrar_busqueda, setMostrarBusqueda] = useState(true);
    /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1);
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10);

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina;
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina;
   const resultados_pagina = niveles_academicos.slice(indice_primer_resultado, indice_ultimo_resultado);
   /*************************************/

    const handleClickBuscar = async () => {
      if (filtro.trim() === '' || filtro.length < 3 ){
        toast.warning('DEBE INGRESAR AL MENOS 3 CARACTERES PARA LA BUSQUEDA', {containerId: 'sys_msg'});
        return;
      }
       try{
           const resp = await clienteAxios.get(`/api/nivel-academico/busqueda/${filtro}`);
           setNivelesAcademicos(resp.data.nivelesAcademicos);
       }catch(e){
           handleError(e);
       }
   }

   const handleClickModificar = async codigo => {
      
      const nivel_academico = niveles_academicos.filter(nivel_academico => nivel_academico.codigo === codigo)
      if(nivel_academico.length > 0){
         setMostrarBusqueda(false);
         setNivelAcademicoModificar(nivel_academico[0]);
      }
    }

   const handleClickVolver = async =>{
      setMostrarBusqueda(true);
   }

   const handleSetPaginaActual = numero_pagina => {
      setPaginaActual(numero_pagina);
   }

   const handleClickEliminarNivelAcademico = async codigo => {
      try {
        await clienteAxios.delete(`/api/nivel-academico/eliminar/${codigo}`);
        const new_niveles_academicos = niveles_academicos.filter(nivelAcademico => nivelAcademico.codigo !== codigo);
        setNivelesAcademicos(new_niveles_academicos);
        toast.success('NIVEL ACADEMICO ELIMINADO', {containerId: 'sys_msg'});
     } catch (e) {
        handleError(e);
     }
   }
        
    return ( 
       
        <Layout>
           <Privado>
             {autenticado 
             ?
                <>
                  <h5 className="my-4 text-center">Administrar Niveles Académicos</h5>

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
                        placeholder="NIVEL ACADEMICO"
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
                  {niveles_academicos.length > 0 
                     ?
                     <Row>
                        <TableNivelAcademico 
                           niveles_academicos={resultados_pagina}
                           handleClickModificar = {handleClickModificar}
                           handleClickEliminarNivelAcademico={handleClickEliminarNivelAcademico}
                        />
                        {resultados_pagina.length > 0 &&
                         <Paginador
                           resultados_por_pagina = {resultados_por_pagina}
                           total_resultados = {niveles_academicos.length}
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
                  <NivelAcademicoForm
                     nivelacademico_modificar={nivelacademico_modificar}
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
 
export default NivelesAcademicos;