import React, {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';
import clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';

const InputSelectModulosContenidoTema = React.forwardRef((props,ref) => {

    const [modulo_contenido_temas, setContenidoModuloTemas] = useState([]);
    const {codigo_modulo_contenido} = props;

    
    useEffect(() => {
        const listarModuloContenidoTemas = async () =>{
            try{
                const resp = await clienteAxios.get(`/api/modulo-contenido-temas/listar/${codigo_modulo_contenido}`);
                setContenidoModuloTemas(resp.data.modulo_contenido_temas);
            }catch(e){
                handleError(e);
            }
            
        }
        if(codigo_modulo_contenido.trim() !==''){
            listarModuloContenidoTemas();
        }
        
        
    }, [codigo_modulo_contenido])

    
    return (
        <Form.Control 
            {...props}
            ref={ref}
        >
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE UN TEMA DEL CONTENIDO'}</option>
            {modulo_contenido_temas && modulo_contenido_temas.map(
            modulo_contenido_temas => <option key={modulo_contenido_temas.codigo} value={modulo_contenido_temas.codigo}>
                {modulo_contenido_temas.descripcion}
            </option>)}
        </Form.Control>
    );
});
 
export default React.memo(InputSelectModulosContenidoTema);
 
 



