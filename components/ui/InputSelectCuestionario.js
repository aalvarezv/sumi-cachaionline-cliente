import React, {useState, useEffect} from 'react'
import { Form } from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'


const InputSelectCuestionario = props => {

    const [cuestionarios, setCuestionarios] = useState([])

    useEffect(() => {
       
        const listarCuestionarios = async () => {
            try{
                const resp = await clienteAxios.get('/api/cuestionario-sugerencias/cuestionarios',{
                    params: {
                        rut_usuario: props.rut_usuario,
                        codigo_materia: props.codigo_materia,
                        fecha_cuestionario_desde: props.fecha_cuestionario_desde,
                        fecha_cuestionario_hasta: props.fecha_cuestionario_hasta,
                    }
                })
                setCuestionarios(resp.data.cuestionarios)

            }catch(e){
                handleError(e)
            }
        }

        listarCuestionarios()

    }, [props.rut_usuario, props.codigo_materia, props.fecha_cuestionario_desde, props.fecha_cuestionario_hasta])

    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE CUESTIONARIO'}</option>
            {cuestionarios.map(cuestionario => <option key={cuestionario.codigo} value={cuestionario.codigo}>{cuestionario.nombre}</option>)}
        </Form.Control>
      )
}

export default React.memo(InputSelectCuestionario)