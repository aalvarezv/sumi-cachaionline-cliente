import React, {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';
import  clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';

const InputSelectModalidad = props => {
      const [modalidades, setModalidades] = useState([]);

        useEffect(() => {
            const listarModalidades = async () => {
                try{
                    const resp = await clienteAxios.get('/api/modalidades/listar');
                    setModalidades(resp.data.modalidades);
                }catch(e){
                    handleError(e);
                }
            }
            listarModalidades();

        }, [])
    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE UNA MODALIDAD'}</option>
            {modalidades.map(modalidad => <option key={modalidad.codigo} value={modalidad.codigo}>{modalidad.descripcion}</option>)}
        </Form.Control>
      );
}

export default React.memo(InputSelectModalidad);