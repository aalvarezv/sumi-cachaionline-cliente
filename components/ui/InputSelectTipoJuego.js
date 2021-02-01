import React, {useState, useEffect} from 'react'
import { Form } from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'

const InputSelectTipoJuego = props => {
      const [tipo_juegos, setTipoJuegos] = useState([])

        useEffect(() => {
            const listarTipoJuegos = async () => {
                try{
                    const resp = await clienteAxios.get('/api/tipo-juegos/listar')
                    setTipoJuegos(resp.data.tipo_juegos)
                }catch(e){
                    handleError(e)
                }
            }
            listarTipoJuegos()

        }, [])
    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE TIPO DE JUEGO'}</option>
            {tipo_juegos.map(tipoJuego => <option key={tipoJuego.codigo} value={tipoJuego.codigo}>{tipoJuego.descripcion}</option>)}
        </Form.Control>
      )
}

export default React.memo(InputSelectTipoJuego)