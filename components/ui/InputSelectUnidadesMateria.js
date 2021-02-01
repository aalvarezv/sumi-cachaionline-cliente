import React, {useState, useEffect} from 'react'
import { Form } from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'

const InputSelectUnidadesMateria = props => {

    const [unidades, setUnidades] = useState([])
    const {codigo_materia} = props
   

    useEffect(() => {
        
        const listarUnidades = async () => {
            try{
                const resp = await clienteAxios.get(`/api/unidades/materia/${codigo_materia}`)
                setUnidades(resp.data.unidades)
            }catch(e){
                handleError(e)
            }
        }
        if(codigo_materia.trim() !== ''){
            listarUnidades()
        }

    }, [codigo_materia])

    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE UNIDAD'}</option>
            {unidades && unidades.map(unidad => <option key={unidad.codigo} value={unidad.codigo}>{unidad.descripcion}</option>)}
        </Form.Control>
      )
}

export default React.memo(InputSelectUnidadesMateria)