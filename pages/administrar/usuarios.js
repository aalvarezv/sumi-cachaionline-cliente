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
import UsuarioForm from '../../components/forms/UsuarioForm';
import TableUsuario from '../../components/ui/TableUsuario';


const Usuarios = () => {

    const { autenticado } = useContext(AuthContext);

    const [filtro, setFiltroBusqueda] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [usuario_modificar, setUsuarioModificar] = useState({});
    const [mostrar_busqueda, setMostrarBusqueda] = useState(true);
    /**** Variables para paginación *****/
   const [pagina_actual, setPaginaActual] = useState(1);
   const [resultados_por_pagina, setResultadosPorPagina] = useState(10);

   const indice_ultimo_resultado = pagina_actual * resultados_por_pagina;
   const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina;
   const resultados_pagina = usuarios.slice(indice_primer_resultado, indice_ultimo_resultado);
   /*************************************/


    const handleClickBuscar = async () => {
      if (filtro.trim() === '' || filtro.length < 3 ){
        toast.warning('DEBE INGRESAR AL MENOS 3 CARACTERES PARA LA BUSQUEDA', {containerId: 'sys_msg'});
        return;
      }
       try{
           const resp = await clienteAxios.get(`/api/usuarios/busqueda/${filtro}`);
           setUsuarios(resp.data.usuarios);
       }catch(e){
           handleError(e);
       }
   }

   const handleClickModificar = async rut => {
     
     const usuario = usuarios.filter(usuario => usuario.rut === rut)
     if(usuario.length > 0){
        setMostrarBusqueda(false);
        setUsuarioModificar(usuario[0]);
     }
   }

   const handleClickEliminarUsuario = async rut => {
      try {
        await clienteAxios.delete(`/api/usuarios/eliminar/${rut}`);
        const new_usuarios = usuarios.filter(usuario => usuario.rut !== rut);
        setUsuarios(new_usuarios);
        toast.success('USUARIO ELIMINADO', {containerId: 'sys_msg'});
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
                    <h5 className="my-4 text-center">Administrar Usuarios</h5>

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
                        placeholder="USUARIO O RUT"
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
                  {usuarios.length > 0 
                     ?
                     <Row>
                        <TableUsuario 
                           usuarios={resultados_pagina}
                           handleClickModificar = {handleClickModificar}
                           handleClickEliminarUsuario = {handleClickEliminarUsuario}
                        />
                        {resultados_pagina.length > 0 &&
                           <Paginador
                              resultados_por_pagina = {resultados_por_pagina}
                              total_resultados = {usuarios.length}
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
                  <UsuarioForm
                     usuario_modificar={usuario_modificar}
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
 
export default Usuarios;