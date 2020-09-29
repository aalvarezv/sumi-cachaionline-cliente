import React, {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';
import  clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';

const InputSelectUnidad = props => {

    const [unidades, setUnidades] = useState([]);

    useEffect(() => {
      
        const listarUnidades = async () => {
            try{
                const resp = await clienteAxios.get('/api/unidades/listar');
                setUnidades(resp.data.unidades);
            }catch(e){
                handleError(e);
            }
        }
        listarUnidades();

    }, [])

    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">SELECCIONE UNA UNIDAD</option>
            {unidades && unidades.map(unidad => <option key={unidad.codigo} value={unidad.codigo}>{unidad.descripcion}</option>)}
        </Form.Control>
      );
}

export default React.memo(InputSelectUnidad);