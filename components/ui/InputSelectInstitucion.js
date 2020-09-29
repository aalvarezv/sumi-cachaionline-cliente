import React, {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';
import  clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';


const InputSelectInstitucion = props => {

    const [instituciones, setInstituciones] = useState([]);

    useEffect(() => {
      
        const listarInstituciones = async () => {
            try{
                const resp = await clienteAxios.get('/api/instituciones/listar');
                setInstituciones(resp.data.instituciones);
            }catch(e){
                handleError(e);
            }
        }
        listarInstituciones();

    }, [])

    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">SELECCIONE UNA INSTITUCIÓN</option>
            {instituciones.map(institucion => <option key={institucion.codigo} value={institucion.codigo}>{institucion.descripcion}</option>)}
        </Form.Control>
      );
}

export default React.memo(InputSelectInstitucion);