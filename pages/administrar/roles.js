import React, { useContext, useState } from 'react';
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import  clienteAxios from '../../config/axios';
import { toast } from 'react-toastify';
import AlertText from '../../components/ui/AlertText';
import {handleError} from '../../helpers';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import RolForm from '../../components/forms/RolForm';
import TableRol from '../../components/ui/TableRol';


const Roles = () => {

    const { autenticado } = useContext(AuthContext);

    const [filtro, setFiltroBusqueda] = useState('');
    const [roles, setRoles] = useState([]);
    const [rol_modificar, setRolModificar] = useState({});
    const [mostrar_busqueda, setMostrarBusqueda] = useState(true);

   
    const handleClickBuscar = async () => {
      if (filtro.trim() === '' || filtro.length < 3 ){
        toast.warning('DEBE INGRESAR AL MENOS 3 CARACTERES PARA LA BUSQUEDA', {containerId: 'sys_msg'});
        return;
      }
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

    const handleClickVolver = async =>{
       setMostrarBusqueda(true);
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
                           roles={roles}
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