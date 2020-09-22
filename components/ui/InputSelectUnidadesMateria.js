import React, {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';
import  clienteAxios from '../../config/axios';


const InputSelectUnidadesMateria = props => {

    const [unidades, setUnidades] = useState([]);
    const {codigo_materia} = props
   

    useEffect(() => {
        
        const listarUnidades = async () => {
            const resp = await clienteAxios.get(`/api/unidades/materia/${codigo_materia}`);
            setUnidades(resp.data.unidades);
        }
        if(codigo_materia.trim() !== ''){
            listarUnidades();
        }

    }, [codigo_materia]);

    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">SELECCIONE UNA UNIDAD</option>
            {unidades && unidades.map(unidad => <option key={unidad.codigo} value={unidad.codigo}>{unidad.descripcion}</option>)}
        </Form.Control>
      );
}

export default React.memo(InputSelectUnidadesMateria);