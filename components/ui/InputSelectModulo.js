import React, {useState, useEffect} from 'react'
import { Form } from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'

const InputSelectModulo = props => {

    const [modulos, setModulos] = useState([])

    useEffect(() => {
      
        const listarModulos = async () => {
            try{
                const resp = await clienteAxios.get('/api/modulos/listar')
                setModulos(resp.data.modulos)
            }catch(e){
                handleError(e)
            }
        }
        listarModulos()

    }, [])

    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE MÓDULO'}</option>
            {modulos.map(modulo => <option key={modulo.codigo} value={modulo.codigo}>{modulo.descripcion}</option>)}
        </Form.Control>
      )
}
 
export default React.memo(InputSelectModulo)