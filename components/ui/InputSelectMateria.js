import React, {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';
import  clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';

const InputSelectMateria = props => {

    const [materias, setMaterias] = useState([]);

    useEffect(() => {
      
        const listarMaterias = async () => {
            try{
                const resp = await clienteAxios.get('/api/materias/listar');
                setMaterias(resp.data.materias);
            }catch(e){
                handleError(e);
            }
        }
        listarMaterias();

    }, [])

    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE UNA MATERIA'}</option>
            {materias.map(materia => <option key={materia.codigo} value={materia.codigo}>{materia.nombre}</option>)}
        </Form.Control>
      );
}

export default React.memo(InputSelectMateria);