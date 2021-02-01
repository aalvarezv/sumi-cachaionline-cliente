import React,{useState, useEffect} from 'react'
import {Form} from 'react-bootstrap'
import { handleError } from '../../helpers'


const InputSelectTipoDuracionJuego = props => {
    
    const [tipo_duracion_preguntas, setTipoDuracionPregunta] = useState([
        {
            codigo: '1',
            nombre: 'SIN TIEMPO',
        },
        {
            codigo: '2',
            nombre: 'TIEMPO DEFINIDO',
        },
        {
            codigo: '3',
            nombre: 'TIEMPO PREGUNTA',
        }

    ])
    
    return ( 
        <Form.Control  {...props} >
            <option key="0" value="0">SELECCIONE TIPO DURACION PREGUNTA</option>
            {tipo_duracion_preguntas.map(tipo_duracion_pregunta => 
            <option key={tipo_duracion_pregunta.codigo} value={tipo_duracion_pregunta.codigo}>{tipo_duracion_pregunta.nombre}</option>)}
        </Form.Control>

     )
}
 
export default InputSelectTipoDuracionJuego