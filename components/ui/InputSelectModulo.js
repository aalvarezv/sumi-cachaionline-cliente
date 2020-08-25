import React, {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';
import  clienteAxios from '../../config/axios';


const InputSelectModulo = props => {

    const [modulos, setModulos] = useState([]);

    useEffect(  () => {
      
        const listarModulos = async () => {
            const resp = await clienteAxios.get('/api/modulos/listar');
            setModulos(resp.data.modulos);
        }
        listarModulos();

    }, [])

    return (
        <Form.Control
            {...props}
        >
            <option>SELECCIONE UN MODULO</option>
            {modulos.map(modulo => <option key={modulo.codigo} value={modulo.codigo}>{modulo.descripcion}</option>)}
        </Form.Control>
      );
}
 
export default React.memo(InputSelectModulo);