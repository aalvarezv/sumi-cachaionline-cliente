import React, {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';
import  clienteAxios from '../../config/axios';


const InputSelectNivelAcademico = props => {

    const [niveles_academicos, setNivelesAcademicos] = useState([]);

    useEffect(() => {
      
        const listarNivelesAcademicos = async () => {
            const resp = await clienteAxios.get('/api/nivel-academico/listar');
            setNivelesAcademicos(resp.data.niveles_academicos);
        }
        listarNivelesAcademicos();

    }, [])

    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">SELECCIONE UN NIVEL ACADEMICO</option>
            {niveles_academicos.map(nivel_academico => <option key={nivel_academico.codigo} value={nivel_academico.codigo}>{nivel_academico.descripcion}</option>)}
        </Form.Control>
      );
}
 
export default React.memo(InputSelectNivelAcademico);