import React, {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';
import  clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';

const InputSelectModulosContenido = React.forwardRef((props,ref) => {

    const [modulo_contenidos, setContenidosModulo] = useState([]);
    const {codigo_modulo} = props
    
    useEffect(() => {
        
        const listarContenidosModulo = async () => {
            try{
                const resp = await clienteAxios.get(`/api/modulo-contenidos/listar/${codigo_modulo}`);
                setContenidosModulo(resp.data.modulo_contenidos);
            }catch(e){
                handleError(e);
            }
        }
        if(codigo_modulo.trim() !== ''){
            listarContenidosModulo();
        }

    }, [codigo_modulo]);

    return (
        <Form.Control
            {...props}
            ref={ref}
        >
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE UN CONTENIDO DEL MÓDULO'}</option>
            {modulo_contenidos && modulo_contenidos.map(modulo_contenido => <option key={modulo_contenido.codigo} value={modulo_contenido.codigo}>{modulo_contenido.descripcion}</option>)}
        </Form.Control>
    );
});

export default React.memo(InputSelectModulosContenido);