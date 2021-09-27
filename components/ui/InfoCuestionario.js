import moment from 'moment'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Badge } from 'react-bootstrap'
import clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'


const InfoCuestionario = ({codigo_cuestionario}) => {

    const [cuestionarioInfo, setCuestionarioInfo] = useState({
        total_alumnos: 0,
        total_preguntas: 0,
        total_respuestas: 0,
        fecha_cuestionario: moment().format('DD-MM-YYYY'),
        link_cuestionario: ''
    })

    const {fecha_cuestionario, link_cuestionario, total_alumnos, total_preguntas, total_respuestas} = cuestionarioInfo

    useEffect(() => {
        if(codigo_cuestionario !== '0'){
            getCuestionarioInfo()
        }
    }, [codigo_cuestionario])

    const getCuestionarioInfo = async () => {
        
        try {
            
            const resp = await clienteAxios.get('/api/cuestionario-estadisticas/info', {
                params: {
                    codigo_cuestionario,
                }
            })
            setCuestionarioInfo(resp.data.cuestionarioInfo)
            
        } catch (e) {
            handleError(e)
        }

    }

    return ( 
        <>
            {link_cuestionario.trim() !== "" &&
                <h6>
                    <a href="#" onClick={() => {
                        window.open(link_cuestionario, '_blank');
                    }}>Ir al cuestionario</a>
                </h6>
            }
            <h6 className="m-0">
                <Badge variant="secondary">Fecha: {moment(fecha_cuestionario).format('DD-MM-YYYY')}</Badge>
            </h6>
            <h5 className="m-0">
                <Badge variant="info">Total Alumnos: {total_alumnos}</Badge>
            </h5>
            <h4 className="m-0">
                <Badge variant="secondary">Total Preguntas: {total_preguntas}</Badge>
            </h4>
            <h4 className="m-0">
                <Badge variant="info">Total Respuestas: {total_respuestas}</Badge>
            </h4>
            
        </>
    )   
}
 
export default InfoCuestionario