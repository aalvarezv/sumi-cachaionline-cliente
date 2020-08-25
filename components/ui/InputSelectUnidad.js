import React, {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';
import  clienteAxios from '../../config/axios';


const InputSelectUnidad = props => {

    const [unidades, setUnidades] = useState([]);

    useEffect(  () => {
      
        const listarUnidades = async () => {
            const resp = await clienteAxios.get('/api/unidades/listar');
            setUnidades(resp.data.unidades);
        }
        listarUnidades();

    }, [])

    return (
        <Form.Control
            {...props}
        >
            <option>SELECCIONE UNA UNIDAD</option>
            {unidades.map(unidad => <option key={unidad.codigo} value={unidad.codigo}>{unidad.descripcion}</option>)}
        </Form.Control>
      );
}

export default React.memo(InputSelectUnidad);