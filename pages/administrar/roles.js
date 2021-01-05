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
import RolForm from '../../components/forms/RolForm';
import TableRol from '../../components/ui/TableRol';


const Roles = () => {

    const { autenticado } = useContext(AuthContext);

    const [filtro, setFiltroBusqueda] = useState('');
    const [roles, setRoles] = useState([]);
    const [rol_modificar, setRolModificar] = useState({});
    const [mostrar_busqueda, setMostrarBusqueda] = useState(true);
     /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1);
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10);

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina;
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina;
   const resultados_pagina = roles.slice(indice_primer_resultado, indice_ultimo_resultado);
   /*************************************/

   
    const handleClickBuscar = async () => {
      /* if (filtro.trim() === '' || filtro.length < 3 ){
        toast.warning('DEBE INGRESAR AL MENOS 3 CARACTERES PARA LA BUSQUEDA', {containerId: 'sys_msg'});
        return;
      } */
       try{
           const resp = await clienteAxios.get(`/api/roles/busqueda/${filtro}`);
           setRoles(resp.data.roles);
       }catch(e){
           handleError(e);
       }
   }

   const handleClickModificar = async codigo => {
      
      const rol = roles.filter(rol => rol.codigo === codigo)
      if(rol.length > 0){
         setMostrarBusqueda(false);
         setRolModificar(roles[0]);
      }
    }

    const handleClickEliminarRol = async codigo => {
      try {
        await clienteAxios.delete(`/api/roles/eliminar/${codigo}`);
        const new_roles = roles.filter(rol => rol.codigo !== codigo);
        setRoles(new_roles);
        toast.success('ROL ELIMINADO', {containerId: 'sys_msg'});
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
                  <h5 className="my-4 text-center">Administrar Roles</h5>
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
                        placeholder="ROL"
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
                  {roles.length > 0 
                     ?
                     <Row>
                        <TableRol 
                           roles={resultados_pagina}
                           handleClickModificar = {handleClickModificar}
                           handleClickEliminarRol = {handleClickEliminarRol}
                        />
                        {resultados_pagina.length > 0 &&
                         <Paginador
                           resultados_por_pagina = {resultados_por_pagina}
                           total_resultados = {roles.length}
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
                     <RolForm
                        rol_modificar={rol_modificar}
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
 
export default Roles;