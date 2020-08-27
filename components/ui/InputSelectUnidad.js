import React, {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';
import  clienteAxios from '../../config/axios';


const InputSelectUnidad = props => {

    const [unidades, setUnidades] = useState([]);

    useEffect(() => {
      
        const listarUnidades = async () => {
            const resp = await clienteAxios.get('/api/unidades/listar');
            console.log('UNIDADES',resp.data.unidades);
            setUnidades(resp.data.unidades);
        }
        listarUnidades();

    }, [])

    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">SELECCIONE UNA UNIDAD</option>
            {unidades.map(unidad => <option key={unidad.codigo} value={unidad.codigo}>{unidad.descripcion}</option>)}
        </Form.Control>
      );
}

export default React.memo(InputSelectUnidad);