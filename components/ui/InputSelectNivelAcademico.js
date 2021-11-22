import React, {useState, useEffect} from 'react'
import { Form } from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'

const InputSelectNivelAcademico = props => {

    const [niveles_academicos, setNivelesAcademicos] = useState([])

    useEffect(() => {
      
        const listarNivelesAcademicos = async () => {
            try{
                const resp = await clienteAxios.get('/api/nivel-academico/listar')
                setNivelesAcademicos(resp.data.niveles_academicos)
            }catch(e){
                handleError(e)
            }
        }
        listarNivelesAcademicos()

    }, [])

    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE NIVEL ACADEMICO'}</option>
            {niveles_academicos.map(nivel_academico => <option key={nivel_academico.codigo} value={nivel_academico.codigo}>{nivel_academico.descripcion}</option>)}
        </Form.Control>
      )
}
 
export default React.memo(InputSelectNivelAcademico)