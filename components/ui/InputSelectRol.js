import React, {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';
import  clienteAxios from '../../config/axios';


const InputSelectRol = props => {

    const [roles, setRoles] = useState([]);

    useEffect(  () => {
      
        const listarRoles = async () => {
            const resp = await clienteAxios.get('/api/roles/listar');
            setRoles(resp.data.rol);
        }
        listarRoles();

    }, [])

    return (
        <Form.Control
            {...props}
        >
            <option>SELECCIONE UN ROL</option>
            {roles.map(rol => <option key={rol.codigo} value={rol.codigo}>{rol.descripcion}</option>)}
        </Form.Control>
      );
}
 
export default React.memo(InputSelectRol);