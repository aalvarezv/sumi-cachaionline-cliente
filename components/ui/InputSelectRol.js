import React, {useState, useEffect} from 'react'
import { Form } from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'

const InputSelectRol = props => {

    const [roles, setRoles] = useState([])

    useEffect(() => {
      
        const listarRoles = async () => {
            try{
                const resp = await clienteAxios.get('/api/roles/listar')
                setRoles(resp.data.rol)
            }catch(e){
                handleError(e)
            }
            
        }
        listarRoles()

    }, [])

    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE ROL'}</option>
            {roles.map(rol => <option key={rol.codigo} value={rol.codigo}>{rol.descripcion}</option>)}
        </Form.Control>
      )
}
 
export default React.memo(InputSelectRol)