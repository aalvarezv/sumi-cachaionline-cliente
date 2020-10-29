import React, {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';
import  clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';

const InputSelectPropiedadesModulo = React.forwardRef((props,ref) => {

    const [modulo_propiedades, setPropiedadesModulo] = useState([]);
    const {codigo_modulo} = props
    useEffect(() => {
        
        const listarPropiedadesModulo = async () => {
            try{
                const resp = await clienteAxios.get(`/api/modulo-propiedades/listar/${codigo_modulo}`);
                setPropiedadesModulo(resp.data.modulo_propiedades);
            }catch(e){
                handleError(e);
            }
        }
        if(codigo_modulo.trim() !== ''){
            listarPropiedadesModulo();
        }

    }, [codigo_modulo]);

    return (
        <Form.Control
            {...props}
            ref={ref}
        >
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE UNA PROPIEDAD DEL MÓDULO'}</option>
            {modulo_propiedades && modulo_propiedades.map(modulo_propiedad => <option key={modulo_propiedad.codigo} value={modulo_propiedad.codigo}>{modulo_propiedad.descripcion}</option>)}
        </Form.Control>
      );
});

export default React.memo(InputSelectPropiedadesModulo);