import React, { useContext, useState } from 'react';
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import  clienteAxios from '../../config/axios';
import { toast } from 'react-toastify';
import AlertText from '../../components/ui/AlertText';
import {handleError} from '../../helpers';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import MateriaForm from '../../components/forms/MateriaForm';
import TableMateria from '../../components/ui/TableMateria';


const Materias = () => {

    const { autenticado } = useContext(AuthContext);

    const [filtro, setFiltroBusqueda] = useState('');
    const [materias, setMaterias] = useState([]);
    const [materia_modificar, setMateriaModificar] = useState({});
    const [mostrar_busqueda, setMostrarBusqueda] = useState(true);

    const handleClickBuscar = async () => {
      if (filtro.trim() === '' || filtro.length < 3 ){
        toast.warning('DEBE INGRESAR AL MENOS 3 CARACTERES PARA LA BUSQUEDA', {containerId: 'sys_msg'});
        return;
      }
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

   const handleClickVolver = async =>{
      setMostrarBusqueda(true);
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
                  {materias.length > 0 
                     ?
                     <Row>
                        <TableMateria
                           materias={materias}
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