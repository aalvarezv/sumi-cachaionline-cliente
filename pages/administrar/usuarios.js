import React, { useContext, useState } from 'react';
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import  clienteAxios from '../../config/axios';
import { toast } from 'react-toastify';
import AlertText from '../../components/ui/AlertText';
import {handleError} from '../../helpers';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import UsuarioForm from '../../components/forms/UsuarioForm';
import TableUsuario from '../../components/ui/TableUsuario';


const Usuarios = () => {

    const { autenticado } = useContext(AuthContext);

    const [filtro, setFiltroBusqueda] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [usuario_modificar, setUsuarioModificar] = useState({});
    const [mostrar_busqueda, setMostrarBusqueda] = useState(true);


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

   const handleClickVolver = async =>{
      setMostrarBusqueda(true);
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
                           usuarios={usuarios}
                           handleClickModificar = {handleClickModificar}
                        />
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