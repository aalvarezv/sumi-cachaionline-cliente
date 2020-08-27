import React, {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';
import  clienteAxios from '../../config/axios';


const InputSelectMateria = props => {

    const [materias, setMaterias] = useState([]);

    useEffect(() => {
      
        const listarMaterias = async () => {
            const resp = await clienteAxios.get('/api/materias/listar');
            setMaterias(resp.data.materias);
        }
        listarMaterias();

    }, [])

    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">SELECCIONE UNA MATERIA</option>
            {materias.map(materia => <option key={materia.codigo} value={materia.codigo}>{materia.nombre}</option>)}
        </Form.Control>
      );
}

export default React.memo(InputSelectMateria);