import React, {useState, useEffect} from 'react'
import { Form } from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'


const InputSelectFormSugerencias = props => {

    const [formularios, setFormularios] = useState([])

    useEffect(() => {
       
        const listarFormularios = async () => {
            try{
                const resp = await clienteAxios.get('/api/sugerencia-alternativa-pregunta/formularios',{
                    params: {
                        rut_usuario: props.rut_usuario,
                        codigo_materia: props.codigo_materia,
                        fecha_formulario_desde: props.fecha_formulario_desde,
                        fecha_formulario_hasta: props.fecha_formulario_hasta,
                    }
                })
                setFormularios(resp.data.formularios)
            }catch(e){
                handleError(e)
            }
        }

        listarFormularios()

    }, [props.rut_usuario, props.codigo_materia, props.fecha_formulario_desde, props.fecha_formulario_hasta])

    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE FORMULARIO'}</option>
            {formularios.map(formulario => <option key={formulario.nombre_formulario} value={formulario.nombre_formulario}>{formulario.nombre_formulario}</option>)}
        </Form.Control>
      )
}

export default React.memo(InputSelectFormSugerencias)