import React,{ useState, useEffect, useRef } from 'react'
import {Form, Overlay, Tooltip} from 'react-bootstrap'


const InputSelectTipoDuracionJuego = props => {
    
    const target = useRef(null)
    const [showTooltip, setShowToolTip] = useState(true)
    const [tipo_duracion_preguntas, setTipoDuracionPregunta] = useState([
        {
            codigo: '1',
            nombre: 'SIN TIEMPO',
            info: 'El ring no tiene tiempo',
        },
        {
            codigo: '2',
            nombre: 'TIEMPO DEFINIDO',
            info: 'Define el total de tiempo que durará el ring',
        },
        {
            codigo: '3',
            nombre: 'TIEMPO PREGUNTA',
            info: 'Usa nuestros tiempos definidos por cada pregunta',
        }

    ])
    
    const [value, setValue] = useState(props.value)

    useEffect(() => {
        if(props.value !== '0'){
            setShowToolTip(true)
        }else{
            setShowToolTip(false)
        }
        setValue(props.value)
    }, [props.value])
    
    return ( 
        <>
            <Form.Control  {...props} ref={target}>
                <option key="0" value="0">SELECCIONE TIPO DURACION PREGUNTA</option>
                {tipo_duracion_preguntas.map(tipo_duracion_pregunta => 
                <option key={tipo_duracion_pregunta.codigo} value={tipo_duracion_pregunta.codigo}>{tipo_duracion_pregunta.nombre}</option>)}
            </Form.Control>
            <Overlay target={target.current} show={showTooltip} placement="top" valor={props.value}>
                {(props) => {
                        let tooltipLabel = ''
                        let tipoDuracionPregunta = tipo_duracion_preguntas.filter(tipoDuracionPregunta => tipoDuracionPregunta.codigo === value)
                        if(tipoDuracionPregunta.length > 0) {
                            tooltipLabel = tipoDuracionPregunta[0].info
                        }  

                        if(tooltipLabel.trim() === ''){
                            setShowToolTip(false)
                        }

                        return <Tooltip id="tooltip-duracion-pregunta" {...props} onClick={() => setShowToolTip(false)}>
                                {tooltipLabel}
                            </Tooltip>
                }}
            </Overlay>
        </>

     )
}
 
export default InputSelectTipoDuracionJuego