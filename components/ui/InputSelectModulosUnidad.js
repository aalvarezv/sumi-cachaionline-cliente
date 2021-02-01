import React, {useState, useEffect} from 'react'
import { Form } from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'

const InputSelectModulosUnidad = React.forwardRef((props, ref) => {

    const [modulos, setModulos] = useState([])

    const {codigo_unidad} = props

    useEffect(() => {
        
        const listarModulos = async () => {
            try{
                const resp = await clienteAxios.get(`/api/modulos/unidad/${codigo_unidad}`)
                setModulos(resp.data.modulos)
            }catch(e){
                handleError(e)
            }
        }
        if(codigo_unidad.trim() !== ''){
            listarModulos()
        }

    }, [codigo_unidad])

    return (
        <Form.Control
            {...props}
            ref={ref}
        >
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE MÓDULO'}</option>
            {modulos && modulos.map(modulo => <option key={modulo.codigo} value={modulo.codigo}>{modulo.descripcion}</option>)}
        </Form.Control>
      )
})

export default React.memo(InputSelectModulosUnidad)