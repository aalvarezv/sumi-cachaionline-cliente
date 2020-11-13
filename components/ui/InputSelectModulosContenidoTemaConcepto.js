import React, {useState, useEffect} from 'react';
import {Form} from 'react-bootstrap';
import clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';

const InputSelectModuloContenidoTemaConcepto = React.forwardRef((props, ref) => {
    
    
    const [modulo_contenido_tema_conceptos, setTemaConceptos] = useState([]);
    const {codigo_modulo_contenido_tema} = props;

    useEffect(() => {
        const listarModuloContenidoTemaConceptos = async ()=>{
            try{
                const resp = await clienteAxios.get(`/api/modulo-contenido-tema-conceptos/listar/${codigo_modulo_contenido_tema}`)
                setTemaConceptos(resp.data.modulo_contenido_tema_conceptos)
            }catch(e){
                handleError(e);
            }
            
        }
        if(codigo_modulo_contenido_tema.trim() !== ''){
            listarModuloContenidoTemaConceptos();
        }
        
    }, [codigo_modulo_contenido_tema])


    return (
        <Form.Control 
            {...props}
            ref={ref}
        >
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE UN CONCEPTO DEL TEMA'}</option>
            {modulo_contenido_tema_conceptos && modulo_contenido_tema_conceptos.map(
            modulo_contenido_tema_conceptos => <option key={modulo_contenido_tema_conceptos.codigo} value={modulo_contenido_tema_conceptos.codigo}>
                {modulo_contenido_tema_conceptos.descripcion}
            </option>)}
        </Form.Control>
    )
});

export default React.memo(InputSelectModuloContenidoTemaConcepto);
